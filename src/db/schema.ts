import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  bigint,
  numeric,
  pgTable,
  point,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const runsTable = pgTable(
  'runs',
  {
    id: serial('id').primaryKey(),
    // this is actually bigint, but maybe just storing text is easier?
    stravaActivityId: text('strava_activity_id').notNull().unique(),
    name: text('name'),
    distance: numeric('distance').notNull(),
    movingTime: numeric('moving_time').notNull(),
    totalTime: numeric('total_time').notNull(),
    mapPolyline: text('map_polyline'),
    startTime: timestamp('start_time').notNull(),
    startPoint: point('start_point', { mode: 'tuple' }),
    endPoint: point('end_point', { mode: 'tuple' }),
    averageSpeed: numeric('average_speed').notNull(),
    maxSpeed: numeric('max_speed').notNull(),
  },
  (table) => ({
    activityIdUniqueIndex: uniqueIndex('activityIdUniqueIndex').on(
      table.stravaActivityId
    ),
  })
)

export type RunSelect = InferSelectModel<typeof runsTable>
export type RunInsert = InferInsertModel<typeof runsTable>

export const sessionsTable = pgTable('sessions', {
  id: bigint('id', { mode: 'bigint' }).primaryKey(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
})

export type SessionSelect = InferSelectModel<typeof sessionsTable>
export type SessionInsert = InferInsertModel<typeof sessionsTable>
