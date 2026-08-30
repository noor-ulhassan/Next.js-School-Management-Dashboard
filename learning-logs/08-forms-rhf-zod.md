# 08 - Forms: react-hook-form + zod

Files: `src/components/forms/TeacherForm.tsx`, `src/components/forms/StudentForm.tsx`,
`src/components/InputField.tsx`, `src/components/FormModal.tsx`.

## The three libraries and what each does

| Library | Job |
|---------|-----|
| `react-hook-form` (RHF) | Holds form state without re-rendering on every keystroke. Uses uncontrolled inputs. Gives you `register`, `handleSubmit`, `formState.errors`. |
| `zod` | Declares the validation rules as a schema object. Also produces the TypeScript type for free. |
| `@hookform/resolvers/zod` | The `zodResolver` adapter that lets RHF run a zod schema as its validator. |

## The full flow, using TeacherForm

### 1. Declare the schema

```ts
const schema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long!" })
                      .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  // ...
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  img: z.any().optional(),
});
```

zod rules seen in this repo: `.min` / `.max` with a custom `{ message }`, `.email()`,
`z.enum([...])`, `.optional()`, `z.any()`.

### 2. Get the type for free

```ts
type Inputs = z.infer<typeof schema>;
```

`z.infer` reads the schema and produces
`{ username: string; email: string; password: string; ...; sex: "male" | "female"; img?: any }`.
One source of truth: change the schema, the type follows.

### 3. Wire up the form

```ts
const { register, handleSubmit, formState: { errors } } =
  useForm<Inputs>({ resolver: zodResolver(schema) });
```

- `register("username")` returns the props (`name`, `onChange`, `onBlur`, `ref`) that
  connect a plain `<input>` to RHF. You spread it: `<input {...register("username")} />`.
- `handleSubmit(onSubmit)` wraps your submit handler. On submit it runs the zod schema;
  if valid it calls `onSubmit(data)`; if not it fills `errors` and does not call it.
- `errors.username?.message` is the string from the schema's `{ message }`.

### 4. The submit handler

```ts
const onSubmit = handleSubmit((formData) => {
  console.log(formData);
});
// ...
<form onSubmit={onSubmit}> ... </form>
```

**Right now it only logs.** This is the seam where the backend plugs in: `onSubmit`
should call a Server Action that writes via `db`, then show a toast and refresh the list.
See file 13.

## `InputField` - the reusable field

```tsx
<InputField
  label="Username" name="username"
  defaultValue={data?.username}
  register={register} error={errors.username}
/>
```

Inside it does `<input {...register(name)} defaultValue={defaultValue} {...inputProps} />`
and renders `{error?.message}` in red below. It turns four lines of label/input/error
markup into one tag. `register` is passed down as a prop (typed loosely as `any`).

## Create vs update in one component

The form takes `type: "create" | "update"` and `data?: any`:

- `defaultValue={data?.username}` - empty on create, prefilled on update.
- heading: `{type === "create" ? "Create a new teacher" : "Update the teacher"}`.
- button: `{type === "create" ? "Create" : "Update"}`.

The inputs are **uncontrolled** (`defaultValue`, not `value`), which is why RHF can
prefill them once and then leave the DOM to track edits - no re-render per character.

## Fields that are not plain InputFields

- `sex` - a `<select>` registered manually: `{...register("sex")}` with
  `<option value="male">` / `<option value="female">`, and its error rendered by hand.
- `img` - `<input type="file" id="img" {...register("img")} className="hidden" />` with a
  styled `<label htmlFor="img">` acting as the visible button. The file is captured into
  form state but nothing uploads it yet.

## `FormModal` - how a form gets on screen

`FormModal.tsx` (`"use client"`):

```tsx
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), { loading: () => <h1>Loading...</h1> });
const StudentForm = dynamic(() => import("./forms/StudentForm"), { loading: () => <h1>Loading...</h1> });

const forms: { [key: string]: (type: "create" | "update", data?: any) => JSX.Element } = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};
```

- `useState(open)` toggles a full-screen overlay.
- Button icon and colour are chosen from `type` (`create` -> yellow `/plus.png`,
  `update` -> sky `/edit.png`, `delete` -> purple `/delete.png`).
- `delete` renders its own inline confirm `<form>` (currently inert - `action=""`, the
  Delete button has no handler).
- `create`/`update` call `forms[table](type, data)`; unknown tables show a "not
  implemented yet" message. Only `teacher` and `student` are in the map.
- `next/dynamic` means each form is a separate JS chunk, downloaded only when its modal
  opens - list pages don't pay for forms they never show.

## What is missing (file 13 covers the order)

- `onSubmit` does not persist anything.
- Nine of eleven entity forms don't exist.
- File upload is not handled.
- No success/error feedback (`react-toastify` is installed but unused).
- Delete does not delete.
- No server-side re-validation of input (zod runs only in the browser today).
