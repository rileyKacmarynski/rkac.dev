import { db } from '@/db'
import { RunInsert, runs, sessions, SessionSelect } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { Activity } from './types'

export async function POST(request: Request) {
  console.log('starting webhook...')
  let activity = null
  try {
    const req = await request.json()
    console.log('event', req)

    if (req.object_type !== 'activity') {
      return new Response('EVENT_RECEIVED', { status: 200 })
    }
    const session = await db.query.sessions.findFirst()
    if (!session) {
      return new Response('', { status: 500 })
    }

    console.log('using session', session)
    const activityId = req.object_id

    // delete from our database if I delete something from strava
    if (req.aspect_type === 'delete') {
      await db.delete(runs).where(eq(runs.stravaActivityId, req.object_id))

      return new Response('EVENT_RECEIVED', { status: 200 })
    }

    const initialRes = await fetchActivity(activityId, session.accessToken)

    if (initialRes.status === 401) {
      console.log('session expired, renewing with refresh token', {
        status: initialRes.status,
        session,
      })
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
        .update(sessions)
        .set({
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token,
        })
        .where(eq(sessions.id, session.id))

      const retryRes = await fetchActivity(activityId, newTokens.access_token)
      if (!retryRes.ok) {
        console.error('error fetching activity with new creds', {
          status: retryRes.status,
        })
        return new Response('Error', { status: 500 })
      }

      activity = await initialRes.json()
    }

    activity = (await initialRes.json()) as Activity
    console.log('activity', {
      name: activity.name,
      id: activity.id,
    })

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
      startPoint: [activity.start_latlng[0], activity.start_latlng[1]],
      endPoint: [activity.end_latlng[0], activity.end_latlng[1]],
    }
    console.log('values', values)
    await db.insert(runs).values(values).onConflictDoUpdate({
      target: runs.stravaActivityId,
      set: values,
    })

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
