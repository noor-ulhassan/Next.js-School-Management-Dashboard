# 13 - Roadmap: What Next

Ordered so each step unblocks the next. Check items off and move them into
`02-build-timeline.md` as you finish them.

## Phase 1 - Make the database real

1. **Write the true schema** in `src/prisma/contract.prisma`. Replace `User`/`Post` with:
   - `Admin`, `Teacher`, `Student`, `Parent`
   - `Class`, `Subject`, `Lesson`
   - `Exam`, `Assignment`, `Result`
   - `Attendance`, `Event`, `Announcement`, `Message`
   - enums: `UserSex { MALE FEMALE }`, `Day { MONDAY ... FRIDAY }`
   - relations: Class has many Students, one supervisor (Teacher), many Lessons;
     Lesson belongs to Subject + Class + Teacher; Subject has many Teachers and Lessons;
     Result belongs to Student and (Exam or Assignment); Attendance belongs to Student +
     Lesson; Parent has many Students; Event/Announcement optionally belong to a Class.
2. `npm run contract:emit` (regenerates `contract.json` + `contract.d.ts`).
3. **Stand up Postgres 15+** - local install, Docker (`postgres:16`), or hosted
   (Neon / Supabase / Railway). Put the real connection string in `.env`.
4. `npx prisma db init` to create the tables. `npx prisma migration status` to verify.
5. **Seed script** `src/prisma/seed.ts` - insert the arrays from `src/lib/data.ts` once
   so the UI has data. Fix the mock-data bugs first (file 10): duplicate `classesData`
   id, shared parent emails, 2024 calendar dates.

## Phase 2 - Read from the database

6. Convert each list page to an `async` Server Component:
   `const data = await db.orm.public.Teacher.<query>()` instead of
   `import { teachersData }`. The `<Table>` usage does not change.
7. **Real pagination** - read `?page=` from `searchParams`, use `limit` / `offset` in the
   query, compute total pages from a `count()`, and make `Pagination` render real links.
8. **Real search** - `TableSearch` writes `?search=` to the URL; the page filters the
   query by it.
9. **Filter / sort** - wire the two icon buttons on every list page.
10. `[id]` detail pages - actually read `params.id`, fetch that one record + its
    relations, render real data instead of "Leonard Snyder". Wire the "Shortcuts" links
    to real routes.
11. Dashboards - build chart `data` from `db` aggregates (`count()` grouped by day /
    month / category), pass it in as props. Real calendar events.

## Phase 3 - Authentication and authorization

12. Add an auth provider. The tutorial uses **Clerk**; NextAuth is the alternative.
13. Build `/sign-In` for real (and rename the folder to `sign-in`).
14. `middleware.ts` at the project root - redirect unauthenticated users to `/sign-In`,
    and send `/` to the signed-in user's role home.
15. Replace `export let role` in `src/lib/data.ts` with the role from the session
    (Clerk `sessionClaims` / a `publicMetadata.role`). Delete the `role` export.
16. Enforce `Menu.tsx`'s `visible` arrays - filter nav items by the real role.
17. Per-page guards - a student cannot open `/list/teachers`, etc.

## Phase 4 - Mutations (create / update / delete)

18. **Server Actions** - a `src/lib/actions.ts` with `"use server"` functions:
    `createTeacher(prevState, formData)`, `updateTeacher`, `deleteTeacher`, and the same
    for every entity.
19. Wire `TeacherForm` / `StudentForm` `onSubmit` to call the action (via
    `useActionState` / `useFormState` + `useFormStatus` for pending UI).
20. Re-validate input on the server with the same zod schema before writing.
21. `revalidatePath("/list/teachers")` after a write so the list refreshes.
22. Success / error feedback with **react-toastify** (installed since `04148ae`, still
    unused). Mount `<ToastContainer/>` once in a layout.
23. Make `FormModal`'s delete actually call the delete action (today `action=""`).
24. Build the nine missing entity forms (parent, subject, class, lesson, exam,
    assignment, result, attendance, event, announcement).
25. **File upload** for the `img` field - Cloudinary (tutorial) or UploadThing / S3.

## Phase 5 - Polish and ship

26. Add `loading.tsx`, `error.tsx`, and `not-found.tsx` per route segment. Empty states
    for lists with no rows.
27. Delete the empty `Community` file. Delete `src/lib/data.ts` once nothing imports it.
28. Fix `/sign-In` casing. Add a `(dashboard)/page.tsx` or a `/` redirect.
29. `next build` with zero type errors and zero lint errors.
30. Deploy to Vercel + a hosted Postgres. Set env vars in the Vercel dashboard.

## Concepts to study as you hit them

| When you reach | Learn |
|----------------|-------|
| Phase 2 step 6 | async Server Components, `searchParams`, the App Router fetch cache |
| Phase 2 step 7-9 | driving UI state through the URL instead of `useState` |
| Phase 3 | `middleware.ts`, Clerk (or NextAuth), route protection |
| Phase 4 | Server Actions, `"use server"`, `revalidatePath` / `revalidateTag`, `useActionState`, `useFormStatus`, optimistic updates with `useOptimistic` |
| Phase 5 | streaming with `<Suspense>`, `loading.tsx`, error boundaries, Vercel deploy + env management |

## The order in one line

schema -> Postgres -> seed -> read in pages -> pagination/search -> auth -> Server
Actions for writes -> polish -> deploy.
