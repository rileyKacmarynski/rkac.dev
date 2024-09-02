import { sql } from '@vercel/postgres'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from './schema'

import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

export const db = drizzle(sql, { schema })
