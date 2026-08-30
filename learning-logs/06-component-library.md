# 06 - Component Library

Every file in `src/components/`. For each: server or client, its props, its state, what
it draws, why it exists, and what is fake or unfinished.

Legend: **S** = Server Component, **C** = Client Component (`"use client"` at top).

---

## `Menu.tsx` - **S**

**Props:** none. **State:** none.

A module-level array `menuItems` with two groups (`MENU`, `OTHER`). Each item is
`{ icon, label, href, visible: string[] }`. The component maps over it and renders a
`<Link>` with an `<Image>` icon and a label. Labels are `hidden lg:block` (icon-only on
narrow screens).

**Why:** one config array drives the whole sidebar; adding a nav item is a one-line edit.

**Unfinished:** the `visible` arrays (`["admin","teacher"]` etc.) describe which roles
should see each link, but nothing filters on them yet - every link renders for everyone.
Wiring this needs the real logged-in role (file 13). The `href`s `/profile`, `/settings`,
`/logout` exist; `/logout` has no route.

---

## `Navbar.tsx` - **S**

**Props:** none. **State:** none.

Top bar: a search box (visual only), a message icon, an announcement icon with a
hardcoded "1" badge, the text "John Doe / Admin", and the avatar image. Pure
presentation.

**Unfinished:** search does nothing; user name/role are hardcoded strings.

---

## `UserCard.tsx` - **S**

**Props:** `{ type: string }` (e.g. `"student"`, `"teacher"`). **State:** none.

A coloured stat card: a year pill, a "more" icon, a big number, and `{type}s` as the
label. `odd:bg-lamaPurple even:bg-lamaYellow` makes the four cards on the admin page
alternate colour.

**Unfinished:** the count `1,123` is hardcoded. Real version fetches
`db.orm.public.<Type>...count()`.

---

## `Table.tsx` - **S**

**Props:**
```ts
columns: { header: string; accessor: string; className?: string }[]
renderRow: (item: any) => React.ReactNode
data: any[]
```
**State:** none.

Renders `<thead>` from `columns` (using `accessor` as the key and `className` to hide
columns responsively) and `<tbody>` by mapping `data` through `renderRow`. It knows
nothing about the domain.

**Why:** the reuse backbone - one table for all 13 list screens. See file 04's
render-prop section.

**Unfinished:** typed as `any`. A generic `Table<T>` would be safer (file 12).

---

## `TableSearch.tsx` - **S**

**Props:** none. **State:** none.

A styled search input inside a `ring-[1.5px]` pill with a magnifier icon.

**Unfinished:** not connected to anything. Real version writes the query to the URL
(`?search=`) and the page re-fetches.

---

## `Pagination.tsx` - **S**

**Props:** none. **State:** none.

Static "Prev / 1 2 3 ... 10 / Next" bar. "Prev" is `disabled`.

**Unfinished:** entirely fake. Real version reads `?page=`, computes total pages from a
row count, and links each button.

---

## `FormModal.tsx` - **C**

**Props:**
```ts
table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam"
     | "assignment" | "result" | "attendance" | "event" | "announcement"
type: "create" | "update" | "delete"
data?: any
id?: number
```
**State:** `const [open, setOpen] = useState(false)`.

Renders a small circular button (icon + colour chosen from `type`). Clicking it sets
`open` true, which shows a full-screen dimmed overlay with a white panel. Inside the
panel:

- `type === "delete"` -> an inline "are you sure" `<form>` with a red Delete button.
- `type === "create" | "update"` -> looks up `forms[table]` and calls it with
  `(type, data)`. `forms` only has `teacher` and `student`; any other table shows
  "Form for ... not implemented yet."

The two form components are pulled in with `next/dynamic` so their code only loads when a
modal opens.

**Unfinished:** the delete form's `action=""` and its button do nothing - no deletion
happens. Nine of the eleven `table` values have no form. No toast, no server call.

---

## `InputField.tsx` - **S** (rendered inside client forms)

**Props:** `label`, `type = "text"`, `register`, `name`, `defaultValue?`, `error?:
FieldError`, `inputProps?`.

A labelled `<input>` in a `w-full md:w-1/4` column. It spreads `{...register(name)}` to
hook the input into react-hook-form, applies `defaultValue`, and renders
`error.message` in red text when present.

**Why:** keeps the form JSX short - one `<InputField .../>` per field instead of
label + input + error markup each time.

---

## `forms/TeacherForm.tsx` and `forms/StudentForm.tsx` - **C**

Nearly identical. Each defines a zod `schema` (`z.object({...})`), derives
`type Inputs = z.infer<typeof schema>`, and calls
`useForm<Inputs>({ resolver: zodResolver(schema) })`. Fields: username, email, password,
firstName, lastName, phone, address, bloodType, birthday, a `sex` `<select>`, and an
`img` file input. `StudentForm` adds `grade` and `class`.

`onSubmit` currently just `console.log(formData)`. `defaultValue={data?.field}` lets the
same component do both create (no `data`) and update (prefilled). See file 08.

**Unfinished:** no persistence; file upload not handled; the other 9 entity forms don't
exist.

---

## `CountChart.tsx` - **C**

recharts `RadialBarChart` + `RadialBar` (concentric rings) for Total / Girls / Boys, with
a `maleFemale.png` icon absolutely centred over it, and hardcoded legend numbers below.
`data` is a local const. Parent gives it height via `h-[450px]` on the admin page.

---

## `AttendanceChart.tsx` - **C**

recharts `BarChart` with two `<Bar>` series (`present`, `absent`), a light
`CartesianGrid`, axes with no lines and grey ticks, a `Tooltip`, and a top `Legend` with
circular markers. Bars have rounded tops via `radius={[10,10,0,0]}`. Local `data`.

---

## `FinanceChart.tsx` - **C**

recharts `LineChart` with two `<Line type="monotone">` series (`income`, `expense`),
`strokeWidth={5}`, styled axes, `Tooltip`, top `Legend`. Local `data` = 12 months.

---

## `Performance.tsx` - **C**

recharts half-donut: `PieChart` + `Pie` with `startAngle={180} endAngle={0}`,
`innerRadius={70}` for the hole, one `<Cell>` per slice for individual colours, and an
absolutely-positioned "9.2 / of 10 max LTS" label in the centre. Used on the `[id]`
detail pages.

---

## `EventCalendar.tsx` - **C**

Thin wrapper over `react-calendar`. `const [value, onChange] = useState<Value>(new
Date())`; returns `<Calendar onChange={onChange} value={value} />`. Imports the library's
CSS (`react-calendar/dist/Calendar.css`); the look is then overridden in `globals.css`.
`Value` is a local type alias covering single date or range.

---

## `BigCalendar.tsx` - **C**

**Not** a calendar library. A hand-built weekly timetable. A `schedule` record keyed by
weekday (`Monday`..`Friday`), each an array of `{ subject, time, teacher, color }`.
`const [activeDay, setActiveDay] = useState(days[0])`. Renders a row of day-tab buttons
(active one highlighted) and the lesson cards for the active day. Named "Big" because it
stands in for `react-big-calendar` from the tutorial without the dependency.

**Unfinished:** the schedule is hardcoded and identical for every teacher/student/parent.

---

## `Announcements.tsx` - **S**

Local `announcements` array of 3 items, each mapped to a coloured card
(`bg-lamaSkyLight` / `PurpleLight` / `YellowLight`). "View All" link does nothing.

---

## `EventList.tsx` - **S**

Local `events` array of 3 items, each a card with a coloured top border
(`odd:border-t-lamaSky even:border-t-lamaPurple`). Placeholder text content.

---

## Quick "is it real?" table

| Component | Data source | Interactive |
|-----------|-------------|-------------|
| Menu, Navbar, UserCard, Table, TableSearch, Pagination | fake / none | no |
| FormModal | - | opens/closes; submit is a console.log |
| TeacherForm, StudentForm | - | validates; submit is a console.log |
| all 4 charts | local const arrays | tooltips only |
| EventCalendar | today's date | month navigation |
| BigCalendar | hardcoded schedule | day tabs |
| Announcements, EventList | hardcoded arrays | no |

Nothing in `src/components/` reads from a database. That is the whole point of file 11
and file 13.
