'use client'

import HomeLink from '@/app/lab/home-link'
import { cn } from '@/lib/utils'

import { PGliteProvider, useLiveQuery, usePGlite } from './pg-provider'
import { PGlite } from '@electric-sql/pglite'
import { live, PGliteWithLive } from '@electric-sql/pglite/live'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import DevToolToggle from '@/app/lab/pglite/dev-tools-toggle'
import { Button } from '@/components/ui/button'
import { NotepadTextIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Input from '@/components/ui/input'
import DevTools from '@/app/lab/pglite/dev-tools'

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
  dataDir: 'idb://rkdev-lab',
  extensions: { live },
}) as PGliteWithLive

export default function Page() {
  const [showDevTools, setShowDevTools] = useState(false)

  return (
    <PGliteProvider db={db}>
      <div
        className={cn(
          'grid transition-[grid] ease-in-out h-full duration-300',
          showDevTools
            ? '[grid-template-columns:1fr_50%]'
            : '[grid-template-columns:1fr_36px] delay-200'
        )}
      >
        <div className="pr-2 pl-6 overflow-hidden">
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
        <div className="border-l border-l-mauve-7 dark:border-l-mauve-11 h-full flex flex-col overflow-hidden">
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
  const result = useLiveQuery<Todo>('select * from todo_lists;', [])
  const db = usePGlite()

  const [popoverOpen, setPopoverOpen] = useState(false)

  async function submitAddList(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const value = data.get('list-name')

    if (value === '') return

    await db.query(
      'insert into todo_lists(name, created_at) values ($1, current_timestamp)',
      [value]
    )

    setPopoverOpen(false)
  }

  const todos = result?.rows
  if (!todos) {
    return null
  }

  return (
    <>
      <div className="flex gap-4 items-center mb-4">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.5, duration: 0.3, type: 'spring', bounce: 0.25 }}
          >
            <PopoverTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                New List
              </Button>
            </PopoverTrigger>
          </motion.div>
          <PopoverContent className="w-72 p-0 border-none">
            <form onSubmit={submitAddList}>
              <label htmlFor="list-name" className="sr-only">
                name
              </label>
              <Input id="list-name" type="text" name="list-name" />
            </form>
          </PopoverContent>
        </Popover>
        <motion.p
          className="text-muted-fg font-medium text-sm"
          initial={{ opacity: 0, scale: 0.98, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.15 }}
        >
          Create lists and drag them around.
        </motion.p>
      </div>
      <div className="mt-2 relative">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              drag
              dragSnapToOrigin={false}
              dragMomentum={false}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0.97,
                opacity: 0,
                transition: { type: 'spring', bounce: 0, duration: 0.2 },
              }}
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
              className="absolute left-0"
            >
              <Todo todo={todo} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

function Todo({ todo }: { todo: Todo }) {
  const db = usePGlite()

  const itemsResult = useLiveQuery<TodoItem>(
    'select * from todo_items where list_id = $1 order by 1;',
    [todo.id]
  )

  async function submitAddItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const value = data.get('item-name')

    if (value === '') return

    await db.query(
      'insert into todo_items (list_id, description, created_at) values ($1, $2, current_timestamp);',
      [todo.id, value]
    )

    setPopoverOpen(false)
  }

  const [popoverOpen, setPopoverOpen] = useState(false)

  async function deleteList(id: number) {
    await db.query('delete from todo_lists where id = $1', [id])
  }

  return (
    <div className="text-sm min-w-[240px] w-[420px] overflow-hidden rounded-lg ring dark:ring-1 backdrop-blur-sm dark:ring-white/15 ring-black/5 bg-primary-bg/90 shadow-lg">
      <h2 className="py-2 px-4 font-semibold text-primary-fg dark:bg-mauve-11/10">
        {todo.name}
      </h2>
      <ul className="py-2 px-4">
        <AnimatePresence initial={false}>
          {itemsResult &&
            itemsResult.rows.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
              >
                <TodoItem item={item} />
              </motion.div>
            ))}
        </AnimatePresence>
      </ul>
      <div className="p-1 mt-1 flex justify-end">
        <Button onClick={() => deleteList(todo.id)} variant="destructive" size="sm">
          <TrashIcon className="h-3 w-3 mr-1" />
          Delete
        </Button>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <NotepadTextIcon className="h-3 w-3 mr-1" />
              Add Item
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0 border-none">
            <form onSubmit={submitAddItem}>
              <label htmlFor="item-name" className="sr-only">
                name
              </label>
              <Input id="item-name" type="text" name="item-name" />
            </form>
          </PopoverContent>
        </Popover>
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
