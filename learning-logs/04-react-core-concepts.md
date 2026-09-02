# 04 - React Core Concepts

Every concept below is shown with a real file from this repo. If you understand all of
these, you can read every component in `src/`.

## A component is a function that returns JSX

Two spellings are used in this codebase, they mean the same thing:

```tsx
// implicit return - src/components/Navbar.tsx
const Navbar = () => (
  <div className="flex ...">...</div>
);

// block body with return - src/components/UserCard.tsx
const UserCard = ({ type }: { type: string }) => {
  return <div className="...">...</div>;
};

export default UserCard;
```

One component per file, `export default`. That is the convention here, not a rule.

## JSX

JSX is HTML-shaped syntax that compiles to function calls. Rules you see in the repo:

- `className` not `class` (`class` is a JS keyword).
- `{ ... }` drops a JS expression into markup: `{item.name}`, `{item.subjects.join(", ")}`.
- Attributes take expressions in braces: `width={40}`, `href={`/list/teachers/${item.id}`}`.
- A component must return one root node. Use a Fragment `<>...</>` to group siblings
  without a wrapper `<div>` - see `FormModal.tsx` and the subject row actions.
- Self-close tags with no children: `<Image ... />`, `<br />`.

## Props

Data passed into a component. Destructured in the parameter list, typed inline:

```tsx
// src/components/UserCard.tsx
const UserCard = ({ type }: { type: string }) => { ... }

// src/components/Table.tsx
const Table = ({ columns, renderRow, data }: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => { ... }
```

Props are read-only. A child never mutates its props.

## Composition and the render-prop pattern

`Table.tsx` is the best lesson in the repo. It does not know what a teacher row or a
subject row looks like. The caller passes a function that builds a row:

```tsx
// src/app/(dashboard)/list/teachers/page.tsx
const renderRow = (item: Teacher) => (
  <tr key={item.id} className="...">
    <td>...</td>
  </tr>
);

<Table columns={columns} renderRow={renderRow} data={teachersData} />
```

Inside `Table`:

```tsx
<tbody>{data.map((item) => renderRow(item))}</tbody>
```

One `Table` component, thirteen list screens. This "pass behaviour as a prop" idea is
how you avoid copy-pasting components.

## Rendering lists + `key`

```tsx
{menuItems.map(i => ( <div key={i.title}>...</div> ))}
{data.map((item) => renderRow(item))}   // renderRow attaches key={item.id}
```

`key` must be **stable and unique among siblings**. React uses it to tell which items
changed. Using the array index is a bug magnet; this repo uses `item.id`. Note: the fake
`classesData` in `src/lib/data.ts` has two rows with `id: 5` - that will cause a React
key warning once that list renders with both.

## State - `useState`

State is data that, when it changes, re-renders the component. Client components only.

```tsx
// src/components/FormModal.tsx
const [open, setOpen] = useState(false);
// ...
<button onClick={() => setOpen(true)}>...</button>
{open && <div className="modal">...</div>}
```

- `useState(initial)` returns `[value, setter]`.
- Calling the setter with a new value re-renders with that value.
- Never mutate state in place; replace it.

Other uses in the repo:
- `BigCalendar.tsx` - `const [activeDay, setActiveDay] = useState(days[0])` for the tab.
- `EventCalendar.tsx` - `const [value, onChange] = useState<Value>(new Date())`.

## Event handlers

```tsx
onClick={() => setOpen(true)}      // arrow: run later, on click
onClick={setOpen(true)}            // BUG: runs immediately during render
```

Always pass a function, not the result of calling one.

## Conditional rendering

- `&&` - render or nothing:
  `{role === "admin" && <FormModal table="teacher" type="create" />}`
  `{open && <div>...</div>}`
- ternary - one or the other:
  `{type === "create" ? "Create a new teacher" : "Update the teacher"}`
- Fallback map lookup (`FormModal.tsx`):
  `forms[table] ? forms[table](type, data) : <span>not implemented</span>`

## `children`

A special prop: whatever you nest inside a component's tags.

```tsx
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div>... <Navbar /> {children} ...</div>;
}
```

Next passes the active page in as `children`. `React.ReactNode` = "anything renderable".

## Controlled vs uncontrolled inputs

- **Controlled**: React state is the source of truth. `EventCalendar` -
  `value={value} onChange={onChange}`.
- **Uncontrolled**: the DOM holds the value; you read it on submit. The forms use this
  via react-hook-form's `register` + `defaultValue`. `settings/page.tsx` checkboxes use
  `defaultChecked` (uncontrolled).

react-hook-form deliberately uses uncontrolled inputs so typing a character doesn't
re-render the whole form. More in file 08.

## Lazy loading with `next/dynamic`

```tsx
// src/components/FormModal.tsx
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
```

This is React's `lazy` + `Suspense` wrapped by Next. `TeacherForm`'s code is a separate
JS chunk that only downloads when a modal actually needs it. Without this, every list
page would ship every form.

## Return-type names you will see

- `JSX.Element` - a single rendered element (used in the `forms` map type in `FormModal`).
- `React.ReactNode` - anything renderable (elements, strings, arrays, null).
- `React.InputHTMLAttributes<HTMLInputElement>` - the props a real `<input>` accepts
  (`InputField.tsx` spreads extra ones through `inputProps`).

## What React concepts are NOT in this repo yet (learn them for file 13)

`useEffect`, `useRef`, `useContext`, `useReducer`, custom hooks, `Suspense` boundaries
you write yourself, `useFormStatus` / `useActionState` (for Server Actions), optimistic
updates. None are needed until the backend is wired.
