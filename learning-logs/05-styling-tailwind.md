# 05 - Styling with Tailwind

## What Tailwind is

Instead of writing CSS in a separate file, you compose tiny single-purpose classes in
`className`. `p-4` = `padding: 1rem`. `flex` = `display: flex`. `text-sm` =
`font-size: 0.875rem`. The build tool scans your files, finds the classes you actually
used, and emits only that CSS.

## Where it is configured

### `tailwind.config.ts`

```ts
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lamaSky: "#C3EBFA",  lamaSkyLight: "#EDF9FD",
        lamaPurple: "#CFCEFF", lamaPurpleLight: "#F1F0FF",
        lamaYellow: "#FAE27C", lamaYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
```

- **`content`** - the globs Tailwind scans for class names. If a file is not covered
  here, any Tailwind class in it gets purged from the output and silently does nothing.
  All source is under `src/`, so this is fine.
- **`theme.extend`** - `extend` adds to the defaults. If you put `colors` directly under
  `theme` (no `extend`) you would wipe out every built-in colour. Always `extend` unless
  you mean to replace.
- **The `lama*` palette** - the brand colours, now usable anywhere a colour class works:
  `bg-lamaSky`, `text-lamaPurple`, `ring-lamaYellow`, `border-t-lamaSky`, etc. These same
  hex values appear as string literals inside the recharts components (`fill="#C3EBFA"`)
  because recharts takes colours as props, not classes.

### `postcss.config.mjs`

Runs Tailwind and Autoprefixer over the CSS. You rarely touch it.

### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* hand-written overrides for the react-calendar widget */
.react-calendar__tile--active { background: #5c7cfa !important; ... }
```

The three `@tailwind` lines inject Tailwind's generated CSS. Everything after them is
plain CSS you wrote by hand - here, restyling `react-calendar`. That library ships its
own stylesheet with its own class names (`.react-calendar__tile--active`,
`.react-calendar__navigation button`) that you cannot reach through `className` on a
component you don't control, so you target them globally and use `!important` to win
against the library's stylesheet. **This is the standard escape hatch for styling
third-party components.**

`globals.css` is imported exactly once, in `src/app/layout.tsx`.

## Responsive design - breakpoint prefixes

Tailwind is mobile-first. An unprefixed class applies at every width. A prefix applies
at that breakpoint **and up**.

| Prefix | Min width |
|--------|-----------|
| (none) | 0 |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

Patterns in this repo:

```tsx
// (dashboard)/layout.tsx - sidebar width changes at each breakpoint
className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]"

// list pages - hide table columns on small screens
className="hidden md:table-cell"     // invisible below 768px, table cell above
className="hidden lg:table-cell"

// admin/page.tsx - stack on mobile, row on desktop
className="flex gap-4 flex-col md:flex-row"

// Menu.tsx - icon only on mobile, icon + label from lg up
<span className="hidden lg:block">{items.label}</span>
```

The "hide on mobile" trick (`hidden md:block`, `hidden md:table-cell`) is used
everywhere to keep dense screens usable on a phone.

## Arbitrary values

Square brackets = an exact value Tailwind has no named class for:

```
w-[14%]  h-[450px]  h-[800px]  ring-[1.5px]  w-[200px]  max-h-[90vh]
```

## State and structural variants

Prefixes that apply a class only in a certain state or position:

```
hover:bg-lamaPurpleLight        on mouse-over
hover:text-gray-800
focus:outline-none
disabled:opacity-50 disabled:cursor-not-allowed   (Pagination "Prev" button)
even:bg-slate-50                 every even sibling  (zebra table rows)
odd:bg-lamaPurple even:bg-lamaYellow               (alternating UserCard colours)
border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple   (EventList cards)
```

`even:` / `odd:` need the elements to be siblings; React `.map` output qualifies.

## Recurring class combos (the repo's visual vocabulary)

| Combo | Meaning |
|-------|---------|
| `flex items-center justify-between` | row, vertically centred, pushed to the edges |
| `flex flex-col gap-4` | column stack with even spacing |
| `p-4 rounded-md bg-white` | the standard "card" |
| `rounded-full` | pills and circular icon buttons |
| `ring-[1.5px] ring-gray-300` | used instead of `border` for inputs and the search box |
| `w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky` | circular icon button |
| `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` | dead-centre an element |

## The font

Not set in CSS. `src/app/layout.tsx` does
`<body className={inter.className}>` where `inter` comes from `next/font/google`.

## Mental model

- Layout and spacing: `flex`, `grid`, `gap-*`, `p-*`, `m-*`, `w-*`, `h-*`.
- Colour: `bg-*`, `text-*`, `ring-*`, `border-*` - including the custom `lama*` names.
- Responsive: add `md:` / `lg:` / `xl:` prefixes; design for mobile first.
- Can't reach a third-party component's internals? Write real CSS in `globals.css`.
