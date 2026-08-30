# 01 - Project Overview

## What the product is

A school management dashboard. One web app used by four kinds of people:

- **admin** - runs the school. Sees totals, charts, the calendar, announcements, and can
  create/edit/delete every kind of record.
- **teacher** - sees their schedule, their classes, exams, assignments, results.
- **student** - sees their own schedule, exams, results, attendance.
- **parent** - sees their child's schedule and announcements.

The screens are: role home pages (`/admin`, `/teacher`, `/student`, `/parent`), list
pages for every entity (`/list/teachers`, `/list/students`, ...), detail pages
(`/list/teachers/[id]`), plus `/profile` and `/settings`.

## The domain (the "nouns" of the system)

teacher, student, parent, subject, class, lesson, exam, assignment, result, attendance,
event, message, announcement.

These relate to each other: a lesson belongs to a subject and a class and a teacher; a
result belongs to a student and an exam or assignment; a class has one supervisor
(teacher) and many students; a parent has many students. Right now none of that is
enforced anywhere - the fake data in `src/lib/data.ts` just has loose string fields.
The real relationships get defined when the Prisma schema is written (file 11, file 13).

## Tech stack (versions from `package.json`)

| Layer | Choice | Version | Notes |
|-------|--------|---------|-------|
| Framework | Next.js | ^14.2.35 | App Router (`src/app/`), not the older Pages Router. |
| UI library | React | ^18 | Server Components + Client Components. |
| Language | TypeScript | ^5 | `strict: true`. |
| Styling | Tailwind CSS | ^3.4.1 | Utility classes + a custom colour theme. |
| Charts | recharts | ^3.10.1 | RadialBar, Bar, Line, Pie. |
| Forms | react-hook-form | ^7.85.0 | Uncontrolled inputs, low re-render cost. |
| Validation | zod | ^4.4.3 | Schema-first; types derived with `z.infer`. |
| Form glue | @hookform/resolvers | ^5.9.0 | `zodResolver` connects zod to react-hook-form. |
| Small calendar | react-calendar | ^6.0.1 | Month picker on dashboards. |
| Toasts | react-toastify | ^11.1.0 | Installed, not used yet. |
| Database | Prisma ORM for Postgres ("Prisma Next") | prisma ^8.0.0-rc, @prisma/orm-postgres ^8.0.0-rc | Scaffolded, not wired in. |
| Env loading | dotenv | ^17.4.2 | Loads `.env` in `prisma.config.ts` and `db.ts`. |

`"type": "module"` in `package.json` means every config file is ES modules
(`export default`, not `module.exports`).

## Folder map

```
src/
  app/                         the router - folders become URLs
    layout.tsx                 root HTML shell, global CSS, font, <title>
    page.tsx                   "/" - placeholder text only
    globals.css                Tailwind directives + react-calendar overrides
    sign-In/page.tsx           "/sign-In" - placeholder text only
    (dashboard)/               route group: shares a layout, adds NO path segment
      layout.tsx               sidebar (<Menu/>) + <Navbar/> + page content
      admin/page.tsx           "/admin"
      teacher|student|parent/page.tsx
      profile/page.tsx  settings/page.tsx
      list/
        teachers/page.tsx      "/list/teachers"
        teachers/[id]/page.tsx "/list/teachers/1"  (dynamic segment)
        students/... + [id]
        parents|subjects|classes|lessons|exams|assignments|results|attendance|events|messages|announcements/page.tsx
  components/                   reusable UI, imported by pages
    forms/StudentForm.tsx  forms/TeacherForm.tsx
  lib/data.ts                   ALL the fake data + `export let role = "admin"`
  prisma/
    contract.prisma            your data models (currently the starter sample)
    contract.json              compiled contract (generated, committed)
    contract.d.ts              generated types for autocomplete (do not edit)
    db.ts                      the database client: `import { db } from "@/prisma/db"`
public/                         static PNG icons, served from "/"
prisma.config.ts                tells the Prisma CLI where the contract + DB are
next.config.mjs                 allowlists images.pexels.com for <Image>
tailwind.config.ts              the custom colour theme
tsconfig.json                   strict TS, path alias @/* -> ./src/*
```

## The mental model to keep in your head

1. **Folders are URLs.** A folder with a `page.tsx` is a page. A `layout.tsx` wraps every
   page below it. Parentheses like `(dashboard)` group folders without changing the URL.
2. **Server by default.** Every component renders on the server unless its file starts
   with `"use client"`. Server components can be `async` and read data directly. Client
   components run in the browser and can use `useState`, `onClick`, and browser-only
   libraries (recharts, react-calendar).
3. **Styling lives in `className`.** Tailwind utility classes. No CSS files per component.
4. **Data flow today:** every page imports arrays from `src/lib/data.ts`. Authorisation
   is the single line `export let role = "admin"`.
5. **Data flow tomorrow:** pages become `async`, call `db.orm.public.<Model>...`, and read
   from Postgres. `role` comes from a real logged-in user.

Everything in the other log files is a detail of one of those five points.
