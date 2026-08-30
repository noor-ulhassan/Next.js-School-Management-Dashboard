# Learning Logs

This folder is your memory of this project. Every file explains one topic: what was
built, why it was built that way, what it does, and what is still missing. The goal is
that months from now you can open one file, read for ten minutes, and be fully back in
context, and that along the way you actually understand Next.js, React, and full-stack
backend rather than just recognising the code.

## How to read these

Read in order the first time. After that, jump to whichever file matches the thing you
forgot.

| # | File | What it gives you |
|---|------|-------------------|
| 01 | `01-project-overview.md` | The product, the domain, the stack, the mental model. Start here. |
| 02 | `02-build-timeline.md` | Commit-by-commit history with dates. What happened when and why. |
| 03 | `03-nextjs-app-router.md` | How the Next.js App Router works, taught through this repo's folders. |
| 04 | `04-react-core-concepts.md` | React: components, props, state, composition, the patterns used here. |
| 05 | `05-styling-tailwind.md` | Tailwind utility classes, the custom theme, responsive design, `globals.css`. |
| 06 | `06-component-library.md` | Every component in `src/components`, one by one. |
| 07 | `07-pages-and-routes.md` | Every URL the app serves and what renders it. |
| 08 | `08-forms-rhf-zod.md` | react-hook-form + zod + the modal system. |
| 09 | `09-charts-recharts.md` | The four recharts components and how recharts works. |
| 10 | `10-mock-data-and-roles.md` | `src/lib/data.ts`, the fake data, and the `role` variable. |
| 11 | `11-backend-prisma-next.md` | The Prisma Next database layer: contract, client, workflow, what to do next. |
| 12 | `12-typescript-in-this-repo.md` | The TypeScript patterns and `tsconfig.json` choices. |
| 13 | `13-roadmap-what-next.md` | The ordered list of everything left to build. |
| 14 | `14-glossary.md` | One-line definitions of every term used in these logs. |
| 15 | `15-prisma-schema.md` | The real `schema.prisma`: every model, field, relation, and enum, plus the ID strategy and the classic-vs-Next inconsistency to resolve. |

## The one rule

**After every working session, add an entry to `02-build-timeline.md`.** Date it, say
what you changed, say why. If you introduced a new concept, add or update the file that
covers that concept. The logs are only useful if they stay current.

## Where this project came from

This is built along Lama Dev's "Next.js School Management Dashboard" tutorial (the
`package.json` name is still `lama-dev-next-dashboard`, and `README.md` at the repo root
says so). If a log file leaves you stuck, the original video series is the reference
material. The backend half (Prisma Next) is newer than the tutorial and is being done
solo, so file 11 and file 13 are the parts with no external guide.

## Current state in one paragraph

The entire frontend is built and styled with fake data. Thirteen list screens, four
role dashboards, detail pages, forms, and charts all work visually. The database layer
(`src/prisma/`) was scaffolded on 2026-08-30 on the `backend` branch. The real
`schema.prisma` (15 models, 2 enums) now exists (file 15) but is written in classic
Prisma style while the client (`db.ts`) is still the Prisma Next scaffold - that
mismatch needs resolving first. Nothing is connected to a screen and there is no auth.
Next real work: pick one Prisma approach, generate the client, connect Postgres, then
start replacing `src/lib/data.ts` reads with database queries.
