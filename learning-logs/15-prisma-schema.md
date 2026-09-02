# 15 - The Prisma Schema (`src/prisma/schema.prisma`)

Added 2026-08-30, commit `3bbdb0f` "Prisma Schema File". This is the real data model for
the school - 15 models and 2 enums. Read file 11 first for the Prisma background, then
this for what the models actually say.

## Heads-up: this file changed styles

Commit `6e2a7f8` scaffolded **Prisma ORM for Postgres ("Prisma Next")** with a
`contract.prisma`. Commit `3bbdb0f` **deleted `contract.prisma`** and added
`schema.prisma` written in **classic Prisma** syntax (the style the Lama Dev tutorial
uses):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- `generator client { provider = "prisma-client-js" }` - generates the classic
  `@prisma/client` (run `npx prisma generate`). This is **not** the contract/`db.ts`
  setup that's currently in the repo.
- `datasource db` - Postgres, connection string from `.env`'s `DATABASE_URL` (same var as
  before).

**What this means:** the project is mid-pivot from Prisma Next back to classic Prisma.
The two halves don't line up yet - see "Reconciliation needed" at the bottom. The model
definitions below are correct and final regardless of which client wraps them.

---

## The shape of the model in one paragraph

People are `Admin`, `Student`, `Teacher`, `Parent`. Structure is `Grade` -> `Class` ->
students. Teaching happens in a `Lesson` (one `Subject`, taught to one `Class`, by one
`Teacher`, on one `Day` at a time). Everything gradebook-related - `Exam`, `Assignment`,
`Attendance` - hangs off a `Lesson`, not off `Class` or `Subject` directly. A `Result`
is a score linked to a `Student` and to **either** an `Exam` or an `Assignment`. `Event`
and `Announcement` optionally belong to a `Class` (null = school-wide).

---

## ID strategy (the important design decision)

| Models | ID |
|--------|-----|
| `Admin`, `Student`, `Teacher`, `Parent` | `id String @id` - **no `@default`**. The app must supply it. |
| `Grade`, `Class`, `Subject`, `Lesson`, `Exam`, `Assignment`, `Result`, `Attendance`, `Event`, `Announcement` | `id Int @id @default(autoincrement())` - the database assigns it. |

Why the people models take a `String` id with no default: in the Lama Dev design the id
**is the auth provider's user id** (Clerk). The flow to create a teacher is: create the
Clerk user, take the id Clerk returns, and pass that same string as `Teacher.id`. One
identity across auth and database, no mapping table. Until auth is wired (file 13,
Phase 3), a seed script has to make up these string ids itself.

---

## Model-by-model

### `Admin`
```prisma
id       String @id
username String @unique
```
Just an account. No name, no profile, no relations. Admins exist only to log in and
manage everything.

### `Student`
Profile fields: `username @unique`, `name`, `surname`, `email String? @unique`,
`phone String? @unique`, `address`, `img String?`, `bloodType`, `sex UserSex`,
`createdAt DateTime @default(now())`.

Relations (all **required** except the back-references):
- `parentId String` -> `parent Parent` - every student has exactly one parent (N:1).
- `classId Int` -> `class Class` - exactly one class (N:1).
- `gradeId Int` -> `grade Grade` - exactly one grade (N:1).
- `attendances Attendance[]`, `results Result[]` - 1:N back-references.

A student is therefore always attached to a parent, a class, and a grade - you can't
create one without all three.

### `Teacher`
Same profile block as `Student` (including `img`), no `parentId`/`classId`/`gradeId`.

Relations:
- `subjects Subject[]` - **many-to-many** with `Subject` (see "Implicit M:N" below).
- `lessons Lesson[]` - 1:N. A teacher teaches many lessons.
- `classes Class[]` - 1:N back-reference to `Class.supervisor`. A teacher can supervise
  many classes (homeroom-style), separate from the lessons they teach.

### `Parent`
Profile block **without** `img`, `bloodType`, or `sex`. Note `phone String @unique` here
is **required** (on `Student`/`Teacher` it's optional). `email String? @unique` stays
optional.
- `students Student[]` - 1:N. A parent has one or more students.

### `Grade`
```prisma
id    Int @id @default(autoincrement())
level Int @unique          // e.g. 1..12
students Student[]
classes  Class[]
```
A year level. Owns many students and many classes.

### `Class`
```prisma
id       Int    @id @default(autoincrement())
name     String @unique    // e.g. "1A"
capacity Int
```
Relations:
- `supervisorId String?` -> `supervisor Teacher?` - **optional** N:1. A class may have a
  supervising teacher.
- `gradeId Int` -> `grade Grade` - **required** N:1.
- `lessons Lesson[]`, `students Student[]`, `events Event[]`, `announcements Announcement[]`
  - 1:N.

### `Subject`
```prisma
id       Int       @id @default(autoincrement())
name     String    @unique
teachers Teacher[]   // many-to-many
lessons  Lesson[]    // 1:N
```

### `Lesson` - the pivot of the whole model
```prisma
id        Int      @id @default(autoincrement())
name      String
day       Day                // enum MONDAY..FRIDAY
startTime DateTime
endTime   DateTime
```
Required N:1 relations:
- `subjectId Int` -> `subject Subject`
- `classId Int` -> `class Class`
- `teacherId String` -> `teacher Teacher`

1:N children: `exams Exam[]`, `assignments Assignment[]`, `attendances Attendance[]`.

A `Lesson` is one concrete slot: "Algebra, taught to class 1A, by teacher X, on Monday
08:00-08:45." To answer "all exams for class 1A" you go `Class` -> `lessons` -> `exams`.

### `Exam`
```prisma
id        Int      @id @default(autoincrement())
title     String
startTime DateTime
endTime   DateTime
lessonId  Int      // required -> lesson
results   Result[]
```

### `Assignment`
Same as `Exam` but with `startDate` / `dueDate` instead of `startTime` / `endTime`.
Required `lessonId` -> `lesson`. Has `results Result[]`.

### `Result`
```prisma
id           Int  @id @default(autoincrement())
score        Int
examId       Int?        // -> exam Exam?        (nullable)
assignmentId Int?        // -> assignment Assignment?  (nullable)
studentId    String      // -> student Student   (required)
```
A result belongs to a student and to **either** an exam or an assignment. **The schema
does not enforce "exactly one of examId/assignmentId".** Both are just nullable columns.
Keeping exactly one set is an application rule you have to uphold in the create/update
code (and ideally a DB check constraint later).

### `Attendance`
```prisma
id      Int      @id @default(autoincrement())
date    DateTime
present Boolean
studentId String  // required -> student
lessonId  Int     // required -> lesson
```
One row per student per lesson occurrence.

### `Event` and `Announcement`
```prisma
// Event:        title, description, startTime, endTime
// Announcement: title, description, date
classId Int?          // -> class Class?   (optional)
```
`classId` null = applies to the whole school; set = scoped to that class.

---

## Enums

```prisma
enum UserSex { MALE FEMALE }
enum Day { MONDAY TUESDAY WEDNESDAY THURSDAY FRIDAY }
```

`sex UserSex` is used on `Student` and `Teacher` (not `Parent`). `day Day` is used on
`Lesson`. Enum values are stored as their names in Postgres.

---

## Relationship cheat sheet

| From | To | Kind | Required? | Notes |
|------|----|------|-----------|-------|
| Student | Parent | N:1 | yes | `parentId` |
| Student | Class | N:1 | yes | `classId` |
| Student | Grade | N:1 | yes | `gradeId` |
| Class | Grade | N:1 | yes | `gradeId` |
| Class | Teacher (supervisor) | N:1 | **no** | `supervisorId String?` |
| Teacher | Subject | **M:N** | - | implicit join table |
| Teacher | Lesson | 1:N | (lesson side required) | `teacherId` |
| Subject | Lesson | 1:N | (lesson side required) | `subjectId` |
| Class | Lesson | 1:N | (lesson side required) | `classId` |
| Lesson | Exam / Assignment / Attendance | 1:N | (child side required) | `lessonId` |
| Exam / Assignment | Result | 1:N | **no** | `examId? / assignmentId?` |
| Student | Result / Attendance | 1:N | (child side required) | `studentId` |
| Class | Event / Announcement | 1:N | **no** | `classId Int?` |

### Implicit many-to-many

`Teacher.subjects Teacher[]` <-> `Subject.teachers Teacher[]`: both sides list an array
and neither side has a relation scalar field, so Prisma **auto-creates a hidden join
table** (`_SubjectToTeacher`). You never see it in the schema; you just do
`teacher.subjects` / `subject.teachers`. If you later need extra columns on that link
(e.g. "since when"), you must convert it to an explicit join model.

---

## Things to remember / gotchas

1. **`Result` has no "one of exam/assignment" guarantee.** Enforce it in code.
2. **Deletes will be blocked by required relations.** Prisma's default `onDelete` is
   `Restrict` for required relations - you cannot delete a `Parent` who still has
   `Student`s, a `Lesson` that still has `Attendance`, etc. Decide on `Cascade` /
   `SetNull` per relation when you write the mutation code.
3. **No `updatedAt` anywhere.** Only the four people models have `createdAt`. Add
   `updatedAt DateTime @updatedAt` where you need change tracking.
4. **String ids on people models have no default** - nothing generates them. Seed data
   and any "create user" flow must supply the id (later: from Clerk).
5. **`Parent.phone` is required and unique**; `Student.phone` / `Teacher.phone` are
   optional and unique. A blank teacher phone is fine; a duplicate one is not.
6. **`Class.name` and `Subject.name` and `Grade.level` are `@unique`** - good for
   upserts in the seed script (match on the natural key).
7. Mapping from the old mock data (`src/lib/data.ts`, file 10): `teachersData.subjects`
   (array of strings) becomes the `Teacher.subjects` M:N; `studentsData.class` /
   `.grade` become `classId` / `gradeId`; `resultsData.type` ("exam") decides whether
   `examId` or `assignmentId` is set.

---

## Reconciliation needed (this repo is inconsistent right now)

The new `schema.prisma` is classic Prisma, but the earlier Prisma Next scaffolding is
still in place and stale:

| File | Current state | Problem |
|------|---------------|---------|
| `src/prisma/schema.prisma` | classic Prisma, real models | fine |
| `src/prisma/db.ts` | `postgres<Contract>({ contractJson, url })` from `@prisma/orm-postgres/runtime` | wrong client for this schema; also imports stale `contract.json` |
| `src/prisma/contract.json` / `contract.d.ts` | still describe `User` / `Post` | stale, unused by the new schema |
| `prisma.config.ts` | points at `./src/prisma/contract.prisma` | that file was deleted |
| `package.json` | `@prisma/orm-postgres`, `@prisma/cli-engine`, `contract:emit` script | belongs to the old approach |

**To go all-in on classic Prisma** (matches the tutorial): `npm i @prisma/client` +
`npm i -D prisma`, delete `prisma.config.ts` and the `contract.*` files, rewrite
`db.ts` to
```ts
import { PrismaClient } from "@prisma/client";
export const db = globalThis.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
```
then `npx prisma generate` and `npx prisma migrate dev --name init`.

**To stay on Prisma Next instead**, this schema would need rewriting back into
`contract.prisma` form (no `generator`/`datasource` blocks, contract types) and
`prisma contract emit`.

Pick one before writing any query code. File 11 assumes Prisma Next; update it once the
decision is made.
