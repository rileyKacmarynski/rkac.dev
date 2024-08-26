import { Repl } from '@electric-sql/pglite-repl'
import { duotoneDark, duotoneLight } from '@uiw/codemirror-theme-duotone'
import { useLiveQuery, usePGlite } from './pg-provider'
import { useEffect, useState } from 'react'
import { PGlite, Results } from '@electric-sql/pglite'
import { unsubscribe } from 'diagnostics_channel'

export default function DevTools() {
  const db = usePGlite()

  if (!db) return null

  return (
    <>
      {/* <div className="grow p-4">
        <Schema />
      </div> */}
      <div className="h-full">
        <Repl pg={db} border={true} lightTheme={duotoneLight} darkTheme={duotoneDark} />
      </div>
    </>
  )
}

// Not sure how to detect changes, giving up for now
function Schema() {
  const pg = usePGlite()

  const [schema, setSchema] = useState<any | null>()
  // useEffect(() => {
  //   let cancelled = false
  //   const result = pg.live.changes(schemaSql(), [], 'key', (res) => {
  //     console.log('changes', res)
  //     if (cancelled) return
  //     setSchema(res)
  //   })

  //   return () => {
  //     cancelled = true
  //     result.then(({ unsubscribe }) => unsubscribe())
  //   }
  // }, [])

  useEffect(() => {
    pg.query(schemaSql()).then((r) => setSchema)
  }, [])

  console.log(schema)

  return <div>This is the schema</div>
}

// alter table todo_lists add column modified_by varchar(255)

function schemaSql() {
  return `
    WITH columns AS (
        SELECT
            table_name,
            column_name,
            data_type,
            is_nullable
        FROM
            information_schema.columns
        WHERE
            table_schema = 'public'
    ),
    foreign_keys AS (
        SELECT
            tc.table_name AS source_table,
            kcu.column_name AS source_column,
            ccu.table_name AS target_table,
            ccu.column_name AS target_column
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
        WHERE 
            constraint_type = 'FOREIGN KEY' 
            AND tc.table_schema = 'public'
    )
    SELECT 
        c.table_name,
        c.column_name,
        c.data_type,
        c.is_nullable,
        fk.target_table,
        fk.target_column,
        -- Concatenate all relevant values and hash them
        MD5(
            c.table_name || 
            c.column_name || 
            c.data_type || 
            c.is_nullable || 
            COALESCE(fk.target_table, '') || 
            COALESCE(fk.target_column, '')
        ) AS key
    FROM 
        columns c
        LEFT JOIN foreign_keys fk
            ON c.table_name = fk.source_table
            AND c.column_name = fk.source_column
    ORDER BY 
        c.table_name, c.column_name;
  `
}
