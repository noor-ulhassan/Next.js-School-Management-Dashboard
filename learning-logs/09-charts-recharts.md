# 09 - Charts with recharts

Files: `src/components/CountChart.tsx`, `AttendanceChart.tsx`, `FinanceChart.tsx`,
`Performance.tsx`. All four are `"use client"`.

## Why recharts, and why client-only

recharts is a React wrapper around D3. It builds SVG and measures the DOM to size itself,
which only works in a browser. So every chart file starts with `"use client"`. If you
forget it, Next tries to render the chart on the server and it breaks.

## The one rule that causes 90% of "my chart is invisible"

`<ResponsiveContainer>` makes a chart fill its parent. **The parent must have an explicit
height.** recharts cannot fill a box that is `height: auto`.

How each chart gets its height in this repo:

- `admin/page.tsx` wraps `CountChart` / `AttendanceChart` in `h-[450px]` and
  `FinanceChart` in `h-[500px]`.
- inside the chart files, `<ResponsiveContainer width="100%" height="90%">` (or the chart
  card is `h-80` / `h-full p-4`).

## `CountChart.tsx` - radial bar (Students: Boys / Girls)

```tsx
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const data = [
  { name: "Total", count: 2368, fill: "white" },
  { name: "Girls", count: 1134, fill: "#FAE27C" },   // = lamaYellow
  { name: "Boys",  count: 1234, fill: "#C3EBFA" },   // = lamaSky
];

<ResponsiveContainer>
  <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
    <RadialBar background dataKey="count" />
  </RadialBarChart>
</ResponsiveContainer>
```

- Each row is one ring. `fill` on the row sets its colour.
- `dataKey="count"` tells the bar which field is the value.
- `background` draws the faint track behind each ring.
- A `maleFemale.png` is layered on top with `absolute ... -translate-x-1/2 -translate-y-1/2`.
- The "1,234 Boys (55%)" text under the chart is **hardcoded**, not derived from `data`.

## `AttendanceChart.tsx` - grouped bar (present vs absent per weekday)

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [ { name: "Mon", present: 60, absent: 47 }, ... ];

<BarChart data={data} barSize={20}>
  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#d1d5db" }} />
  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#d1d5db" }} />
  <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
  <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: 20, paddingBottom: 40 }} />
  <Bar dataKey="present" fill="#FAE27C" legendType="circle" radius={[10, 10, 0, 0]} />
  <Bar dataKey="absent"  fill="#C3EBFA" legendType="circle" radius={[10, 10, 0, 0]} />
</BarChart>
```

Recurring recharts idioms here:

- `dataKey` on `XAxis` picks the label field; `dataKey` on `<Bar>` picks a value series.
- Two `<Bar>` with the same chart = grouped bars.
- `axisLine={false} tickLine={false}` + grey `tick` fill = the clean, lineless look used
  across all charts.
- `radius={[10,10,0,0]}` rounds only the top corners of each bar.
- `legendType="circle"` makes the legend swatch a dot.
- `CartesianGrid vertical={false}` = horizontal grid lines only.

## `FinanceChart.tsx` - line (income vs expense over 12 months)

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

<LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
  <XAxis dataKey="name" .../>
  <YAxis .../>
  <Tooltip />
  <Legend align="center" verticalAlign="top" .../>
  <Line type="monotone" dataKey="income"  stroke="#FAE27C" strokeWidth={5} />
  <Line type="monotone" dataKey="expense" stroke="#C3EBFA" strokeWidth={5} />
</LineChart>
```

- `type="monotone"` = smooth curve through the points.
- `stroke` is the line colour (line charts use `stroke`; bar/pie use `fill`).

## `Performance.tsx` - half donut with a centre label

```tsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [ { name: "Group A", value: 92, fill: "#C3EBFA" },
               { name: "Group B", value: 8,  fill: "#FAE27C" } ];

<PieChart>
  <Pie dataKey="value" data={data} cx="50%" cy="50%"
       startAngle={180} endAngle={0}   // 180 -> 0 = top half only
       innerRadius={70}>               // the hole -> donut, not pie
    {data.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.fill} />)}
  </Pie>
</PieChart>
// then an absolutely-centred <div> with "9.2 / of 10 max LTS"
```

- `startAngle`/`endAngle` carve out the half-donut gauge shape.
- `innerRadius` turns a pie into a donut.
- `<Cell>` per slice lets each slice have its own colour (a `<Pie>` alone would colour
  them from a default sequence).
- recharts does not centre text for you - the score is a normal absolutely-positioned
  `<div>` on top.

## Colours

All the hex values (`#C3EBFA`, `#FAE27C`, ...) are the same as the `lama*` colours in
`tailwind.config.ts`. recharts takes colours as props (`fill`, `stroke`), not Tailwind
classes, so they're written out as literals. If you change the theme, change these too.

## When the backend lands

Every `data` array is a local constant. To make a chart real: pass `data` in as a prop
from a Server Component that built it from `db` queries (often with `count()` aggregates
grouped by day / month / category). The chart components themselves barely change.
