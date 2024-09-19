import { db } from '@/db'
import { RunInsert, runsTable, sessionsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { Activity } from './types'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  let activity: Activity | null = null
  try {
    const req = await request.json()
    console.log('strava event', req)

    if (req.object_type !== 'activity') {
      return new Response('EVENT_RECEIVED', { status: 200 })
    }
    const session = await db.query.sessionsTable.findFirst()
    if (!session) {
      return new Response('', { status: 500 })
    }

    const activityId = req.object_id

    // delete from our database if I delete something from strava
    if (req.aspect_type === 'delete') {
      await db.delete(runsTable).where(eq(runsTable.stravaActivityId, req.object_id))

      return new Response('EVENT_RECEIVED', { status: 200 })
    }

    const initialRes = await fetchActivity(activityId, session.accessToken)

    if (initialRes.status === 401) {
      console.log('session expired, renewing with refresh token')
      const bodyContent = new FormData()
      bodyContent.append('client_id', process.env.STRAVA_CLIENT_ID!)
      bodyContent.append('client_secret', process.env.STRAVA_SECRET!)
      bodyContent.append('refresh_token', session.refreshToken)
      bodyContent.append('grant_type', 'refresh_token')

      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        body: bodyContent,
      })

      if (!response.ok) {
        console.error('error fetching refresh token', {
          status: response.status,
        })
        return new Response('Error', { status: 500 })
      }

      const newTokens = await response.json()

      await db
        .update(sessionsTable)
        .set({
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
        })
        .where(eq(sessionsTable.id, session.id))

      const retryRes = await fetchActivity(activityId, newTokens.access_token)
      if (!retryRes.ok) {
        console.error('error fetching activity with new creds', {
          status: retryRes.status,
        })
        return new Response('Error', { status: 500 })
      }

      activity = await retryRes.json()
    } else {
      activity = (await initialRes.json()) as Activity
    }

    if (!activity) {
      return new Response('EVENT_RECEIVED', { status: 200 })
    }

    const values: RunInsert = {
      stravaActivityId: activity.id.toString(),
      name: activity.name,
      averageSpeed: activity.average_speed.toString(),
      maxSpeed: activity.max_speed.toString(),
      distance: activity.distance.toString(),
      movingTime: activity.moving_time.toString(),
      startTime: new Date(activity.start_date),
      totalTime: activity.elapsed_time.toString(),
      mapPolyline: activity.map.summary_polyline,
      startPoint: activity.start_latlng.length
        ? [activity.start_latlng[0], activity.start_latlng[1]]
        : null,
      endPoint: activity.end_latlng.length
        ? [activity.end_latlng[0], activity.end_latlng[1]]
        : null,
    }

    await db.insert(runsTable).values(values).onConflictDoUpdate({
      target: runsTable.stravaActivityId,
      set: values,
    })

    revalidatePath('/lab/runs')

    return new Response('EVENT_RECEIVED', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}

async function fetchActivity(activityId: number, accessToken: string) {
  return await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode !== 'subscribe' || token !== process.env.STRAVA_VERIFY_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  return NextResponse.json({ 'hub.challenge': challenge })
}
