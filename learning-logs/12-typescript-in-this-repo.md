# 12 - TypeScript in This Repo

You do not need advanced TypeScript to work here. These are the patterns that actually
appear.

## `tsconfig.json` - the settings that matter

```jsonc
{
  "compilerOptions": {
    "strict": true,                   // no implicit any, null checks on, etc.
    "noEmit": true,                   // tsc only type-checks; Next/SWC does the building
    "jsx": "preserve",               // leave JSX for Next to transform
    "module": "preserve",
    "moduleResolution": "bundler",    // resolve imports the way a bundler does
    "resolveJsonModule": true,        // allows `import contractJson from "./contract.json"`
    "plugins": [{ "name": "next" }],  // Next's TS plugin (route types, etc.)
    "paths": { "@/*": ["./src/*"] }   // the import alias
  }
}
```

The **path alias** is why imports look like `@/components/Table` and `@/lib/data`
instead of `../../../components/Table`. `@/` = `src/`.

`resolveJsonModule` was turned on in the Prisma Setup commit specifically so
`src/prisma/db.ts` can import `contract.json`.

## Inline prop types

The most common pattern - type the props right in the parameter list:

```tsx
const UserCard = ({ type }: { type: string }) => { ... }

const FormModal = ({ table, type, data, id }: {
  table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam"
       | "assignment" | "result" | "attendance" | "event" | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => { ... }
```

`"create" | "update" | "delete"` is a **union of string literals** - the value must be
exactly one of those. `data?` and `id?` are optional.

## Named type aliases

```ts
// src/components/InputField.tsx
type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;                                   // imported from react-hook-form
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};
```

`React.InputHTMLAttributes<HTMLInputElement>` = "every prop a real `<input>` accepts" -
so callers can pass through `min`, `max`, `placeholder`, etc.

## Types derived from a zod schema

```ts
const schema = z.object({ username: z.string().min(3), sex: z.enum(["male","female"]), ... });
type Inputs = z.infer<typeof schema>;
```

`z.infer<typeof schema>` reads the schema and produces the matching TypeScript type. One
definition, both runtime validation and compile-time types. Used in both form files.

## The list-page row types

Each list page hand-writes a `type` for its row:

```ts
type Teacher = {
  id: number; teacherId: string; name: string; email?: string; photo: string;
  phone: string; subjects: string[]; classes: string[]; address: string;
};
```

These are maintained by hand and can drift from the real object shape in
`src/lib/data.ts`. When the DB lands, these get replaced by types coming out of
`contract.d.ts`.

## Generics

- `Table` is typed with `any` today (`renderRow: (item: any) => React.ReactNode`,
  `data: any[]`). The type-safe version is a generic:

  ```tsx
  const Table = <T,>({ columns, renderRow, data }: {
    columns: { header: string; accessor: string; className?: string }[];
    renderRow: (item: T) => React.ReactNode;
    data: T[];
  }) => { ... }
  ```

  Then `<Table<Teacher> ... />` checks that `renderRow` and `data` agree.

- `postgres<Contract>(...)` in `db.ts` - `Contract` (the whole DB schema as a type) is
  the generic argument that makes every query typed.

## Small things you will see

- `Readonly<{ children: React.ReactNode }>` - layout props; `Readonly` just marks them
  immutable.
- `React.ReactNode` (anything renderable) vs `JSX.Element` (one element).
- Non-null assertion `!`: `process.env['DATABASE_URL']!` - "trust me, it's defined."
- `data?.username` - optional chaining; `undefined` if `data` is missing rather than a
  crash.
- `error.message.toString()` in the forms - defensive, because a zod message can be typed
  loosely.

## Rules of thumb for this codebase

- Prefer inline types for one-off props; a named `type X = {...}` when it's reused or
  long.
- Avoid adding more `any`. The existing ones (`Table`, `register`, `data?`) are debt to
  pay down, not a pattern to copy.
- Let zod (`z.infer`) and Prisma (`contract.d.ts`) generate types instead of writing
  them twice.
