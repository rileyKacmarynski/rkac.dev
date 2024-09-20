'use client'

import { Results } from '@electric-sql/pglite'
import { PGliteWithLive } from '@electric-sql/pglite/live'
import { useContext, createContext, useState, useEffect } from 'react'

/**
 * For some reason importing the react package was breaking things
 * https://github.com/electric-sql/pglite/blob/main/packages/pglite-react/src
 */

interface Props<T extends PGliteWithLive> {
  children?: React.ReactNode
  db?: T
}

type PGliteProvider<T extends PGliteWithLive> = (props: Props<T>) => JSX.Element
type UsePGlite<T extends PGliteWithLive> = () => T

interface PGliteProviderSet<T extends PGliteWithLive> {
  PGliteProvider: PGliteProvider<T>
  usePGlite: UsePGlite<T>
}

/**
 * Create a typed set of {@link PGliteProvider} and {@link usePGlite}.
 */
function makePGliteProvider<T extends PGliteWithLive>(): PGliteProviderSet<T> {
  const ctx = createContext<T | undefined>(undefined)
  return {
    usePGlite: (db?: T) => {
      const dbProvided = useContext(ctx)

      // allow providing a db explicitly
      if (db) return db

      if (!dbProvided)
        throw new Error('No PGlite instance found, use PGliteProvider to provide one')

      return dbProvided
    },
    PGliteProvider: ({ children, db }: Props<T>) => {
      return <ctx.Provider value={db}>{children}</ctx.Provider>
    },
  }
}

const { PGliteProvider, usePGlite } = makePGliteProvider<PGliteWithLive>()

function useLiveQueryImpl<T = { [key: string]: unknown }>(
  query: string,
  params: unknown[] | undefined | null,
  key?: string
): Omit<Results<T>, 'affectedRows'> | undefined {
  const db = usePGlite()
  const [results, setResults] = useState<Results<T>>()
  useEffect(() => {
    let cancelled = false
    const cb = (results: Results<T>) => {
      if (cancelled) return
      setResults(results)
    }
    const ret =
      key !== undefined
        ? db.live.incrementalQuery<T>(query, params, key, cb)
        : db.live.query<T>(query, params, cb)

    return () => {
      cancelled = true
      ret.then(({ unsubscribe }) => unsubscribe())
    }

    // Using spread operator for params to avoid serializing it to JSON
    // or performing more complicated array equality checks
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, key, query, ...(params ?? [])])
  return (
    results && {
      rows: results.rows,
      fields: results.fields,
    }
  )
}

export function useLiveQuery<T = { [key: string]: unknown }>(
  query: string,
  params: unknown[] | undefined | null
): Results<T> | undefined {
  return useLiveQueryImpl<T>(query, params)
}

export function useLiveIncrementalQuery<T = { [key: string]: unknown }>(
  query: string,
  params: unknown[] | undefined | null,
  key: string
): Results<T> | undefined {
  return useLiveQueryImpl<T>(query, params, key)
}

export { PGliteProvider, usePGlite }
