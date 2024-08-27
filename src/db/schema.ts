import { numeric, pgTable, point, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const runsTable = pgTable('runs', {
  id: serial('id').primaryKey(),
  // this is actually bigint, but maybe just storing text is easier?
  stravaActivityId: text('strava_activity_id').notNull(),
  name: text('name'),
  distance: numeric('distance').notNull(),
  movingTime: numeric('moving_time').notNull(),
  totalTime: numeric('total_time').notNull(),
  mapPolyline: text('map_polyline'),
  startTime: timestamp('start_time').notNull(),
  startPoint: point('start_point', { mode: 'tuple' }).notNull(),
  endPoint: point('end_point', { mode: 'tuple' }).notNull(),
  averageSpeed: numeric('average_speed').notNull(),
  maxSpeed: numeric('max_speed').notNull(),
})
