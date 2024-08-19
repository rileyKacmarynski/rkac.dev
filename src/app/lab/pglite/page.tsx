'use client'

import HomeLink from '@/app/lab/home-link'
import { cn } from '@/lib/utils'

import { PGliteProvider, useLiveQuery, usePGlite } from './pg-provider'
import { PGlite } from '@electric-sql/pglite'
import { live, PGliteWithLive } from '@electric-sql/pglite/live'
import { Repl } from '@electric-sql/pglite-repl'
import { duotoneDark, duotoneLight } from '@uiw/codemirror-theme-duotone'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import DevToolToggle from '@/app/lab/pglite/dev-tools-toggle'
import { Button } from '@/components/ui/button'
import { NotepadTextIcon, PlusIcon, TrashIcon } from 'lucide-react'

export type TodoItem = {
  id: number
  list_id: number
  description: string
  is_completed: boolean
  created_at: Date
}

export type Todo = {
  id: number
  name: string
  createdAt: Date
}

// @ts-ignore
const db = new PGlite({
  extensions: { live },
}) as PGliteWithLive

export default function Page() {
  const [showDevTools, setShowDevTools] = useState(false)

  return (
    <PGliteProvider db={db}>
      <div
        className={cn(
          'pl-6 grid transition-[grid] ease-in-out h-full duration-300',
          showDevTools
            ? '[grid-template-columns:1fr_50%]'
            : '[grid-template-columns:1fr_36px] delay-200'
        )}
      >
        <div className="px-2">
          <nav className="whitespace-nowrap top-20 pt-20 pb-10">
            <HomeLink />
          </nav>
          <section data-prose="true">
            <h1>PGLite</h1>
            <p className="text-balance max-w-[400px]">
              PGLite is a WASM Postgres build packaged into a Typescript library. Let's
              see what we can do with it.
            </p>
          </section>
          <TodoApp />
        </div>
        <div className="border-l dark:border-l-mauve-11 h-full flex flex-col overflow-hidden">
          <DevToolToggle onClick={() => setShowDevTools(!showDevTools)} />
          <div
            className={cn(
              'transition flex flex-col h-full',
              showDevTools ? 'opacity-100 delay-300' : 'opacity-0'
            )}
          >
            <DevTools />
          </div>
        </div>
      </div>
    </PGliteProvider>
  )
}

function TodoApp() {
  const result = useLiveQuery<Todo>('select * from todo_lists limit 1;', [])

  const todo = result?.rows[0]
  if (!todo) {
    return null
  }

  return (
    <div className="relative">
      <Todo todo={todo} />
    </div>
  )
}

function DevTools() {
  const db = usePGlite()

  return (
    <>
      <div className="grow p-4">diagram here</div>
      <div className="basis-[400px] max-h-[400px]">
        <Repl pg={db} border={true} lightTheme={duotoneLight} darkTheme={duotoneDark} />
      </div>
    </>
  )
}

function Todo({ todo }: { todo: Todo }) {
  const formRef = useRef<HTMLFormElement>(null)

  const itemsResult = useLiveQuery<TodoItem>(
    'select * from todo_items where list_id = $1 order by 1;',
    [todo.id]
  )
  return (
    <div className="absolute text-sm min-h-[100px] max-w-[460px] overflow-hidden rounded-lg ring ring-1 backdrop-blur-sm dark:ring-white/15  dark:bg-white/5 shadow">
      <h2 className="py-2 px-4 font-semibold text-primary-fg dark:bg-black/15">
        {todo.name}
      </h2>
      <ul className="py-2 px-4">
        {itemsResult?.rows.map((item) => (
          <TodoItem key={item.id} item={item} />
        ))}
      </ul>
      <div className="p-1 mt-1 flex justify-end">
        <Button variant="destructive" size="sm">
          <TrashIcon className="h-3 w-3 mr-1" />
          Delete
        </Button>
        <Button size="sm">
          <NotepadTextIcon className="h-3 w-3 mr-1" />
          Add Item
        </Button>
      </div>
    </div>
  )
}

function TodoItem({ item }: { item: TodoItem }) {
  const db = usePGlite()

  async function toggleComplete(id: number, value: boolean) {
    await db.query('update todo_items set is_completed = $1 where id = $2', [value, id])
  }

  async function remove(id: number) {
    console.log('removing...', item.id)
    await db.query('delete from todo_items where id = $1', [id])
  }

  return (
    <li className="flex group/row items-center justify-between rounded-md px-0 py-1">
      <div className="flex items-center grow text-primary-fg has-[:checked]:text-muted-fg transition">
        <input
          id={`${item.id}-checkbox`}
          name={`${item.id}-checkbox`}
          className="peer sr-only"
          type="checkbox"
          onChange={() => toggleComplete(item.id, !item.is_completed)}
          checked={item.is_completed}
        />
        <label
          htmlFor={`${item.id}-checkbox`}
          className="pr-2 grow-1 shrink-1 basis-0 select-none font-medium"
        >
          {item.description}
        </label>
        <CheckIcon className="opacity-0 peer-[:checked]:opacity-100 scale-75 peer-[:checked]:scale-100 transition duration-100 stroke-gray-400 h-5 w-5" />
        <button
          onClick={() => remove(item.id)}
          className="opacity-0 group-hover/row:opacity-100 text-muted-fg hover:text-rose-700 dark:hover:text-rose-300 group/trash focus:outline-none transition duration-100"
        >
          <CustomTrashIcon className="h-6 w-5 ml-2" />
        </button>
      </div>
    </li>
  )
}

function CustomTrashIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="group-hover/trash:-translate-y-[3px] transition ease-in-out">
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </g>
      <g className="group-hover:translate-y-[3px] transition ease-in-out">
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      </g>
    </svg>
  )
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

const initializeSql = `
-- Create todo_lists table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'todo_lists') THEN
        CREATE TABLE todo_lists (
            id serial primary key,
            name text not null,
            created_at timestamp with time zone default now() not null
        );
    END IF;
END $$;

-- Create todo_items table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'todo_items') THEN
        CREATE TABLE todo_items (
            id serial primary key,
            list_id int references todo_lists(id) on delete cascade,
            description text not null,
            is_completed boolean default false not null,
            created_at timestamp with time zone default now() not null
        );
    END IF;
END $$;

-- Insert initial data if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM todo_lists WHERE name = 'Improve PGlite Skills') THEN
        INSERT INTO todo_lists (name) VALUES ('Improve PGlite Skills');
    END IF;
END $$;

-- Get the id of the 'Improve PGlite Skills' list
DO $$
DECLARE
    todo_list_id int;
BEGIN
    SELECT id INTO todo_list_id FROM todo_lists WHERE name = 'Improve PGlite Skills';

    -- Insert todo items if they don't exist
    IF NOT EXISTS (SELECT 1 FROM todo_items WHERE list_id = todo_list_id) THEN
        INSERT INTO todo_items (list_id, description) VALUES (todo_list_id, 'Read the PGlite documentation');
        INSERT INTO todo_items (list_id, description) VALUES (todo_list_id, 'Experiment with creating tables and inserting data');
        INSERT INTO todo_items (list_id, description) VALUES (todo_list_id, 'Learn about pgvector extension for vector embeddings');
        INSERT INTO todo_items (list_id, description) VALUES (todo_list_id, 'Practice writing SQL queries');
        INSERT INTO todo_items (list_id, description) VALUES (todo_list_id, 'Explore advanced features like FTS and RAG');
    END IF;
END $$;
`

// we're just going to pretend this is ok until something blows up in my face
db.exec(initializeSql)
