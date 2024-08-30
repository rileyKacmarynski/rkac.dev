import env from '@next/env'
import activitiesJson from '../../activities.json' with { type: 'json' }
import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql as dSql } from 'drizzle-orm'

env.loadEnvConfig(process.cwd())

export const db = drizzle(sql)

/** @type {import('./types.d.ts').Activities} */
const activities = activitiesJson

function getPoint(latlng) {
   if(!latlng.length) {
    return null
   }

   const [lat, lng] = latlng

   return `point(${lat}, ${lng})`
}

const go = async () => {
  const valuesSql = activities.reduce((values, activity) => {
    const startPoint = getPoint(activity.start_latlng)
    const endPoint = getPoint(activity.end_latlng)

    const value = `('${activity.id}', '${activity.name}', ${activity.distance}, ${activity.moving_time}, ${activity.elapsed_time}, '${activity?.map?.summary_polyline ?? null}', '${activity.start_date}', ${startPoint}, ${endPoint}, ${activity.average_speed}, ${activity.max_speed})`

    if(values === '') {
      return value
    }

    return `${values},${value}`
  }, '')
  const query = `
    insert into runs (strava_activity_id, name, distance, moving_time, total_time, map_polyline, start_time, start_point, end_point, average_speed, max_speed)
    values ${valuesSql}
  `

  await db.execute(dSql.raw(query))
  
}


go()
