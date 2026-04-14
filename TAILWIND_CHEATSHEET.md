# Tailwind CSS Cheat Sheet

## Table of Contents

1. [Layout](#layout)
2. [Spacing](#spacing)
3. [Typography](#typography)
4. [Colors](#colors)
5. [Backgrounds](#backgrounds)
6. [Borders](#borders)
7. [Sizing](#sizing)
8. [Flexbox](#flexbox)
9. [Grid](#grid)
10. [Positioning](#positioning)
11. [Display & Visibility](#display--visibility)
12. [Effects](#effects)
13. [Transforms](#transforms)
14. [Transitions & Animations](#transitions--animations)
15. [Filters](#filters)
16. [Interactivity](#interactivity)
17. [SVG](#svg)
18. [Responsive Design](#responsive-design)
19. [Dark Mode](#dark-mode)
20. [Arbitrary Values](#arbitrary-values)

---

## Layout

### Container

```html
<!-- Fixed max-width container -->
<div class="container mx-auto">Content</div>

<!-- Responsive container with padding -->
<div class="container mx-auto px-4">Content</div>
```

### Box Model

```html
<!-- Display types -->
<div class="block">Block</div>
<div class="inline">Inline</div>
<div class="inline-block">Inline Block</div>
<div class="flex">Flexbox</div>
<div class="grid">Grid</div>
<div class="hidden">Hidden</div>
```

---

## Spacing

### Margin

```html
<!-- All sides -->
<div class="m-4">Margin 16px</div>

<!-- Specific sides -->
<div class="mt-4">Margin top</div>
<div class="mb-4">Margin bottom</div>
<div class="ml-4">Margin left</div>
<div class="mr-4">Margin right</div>

<!-- Horizontal/Vertical -->
<div class="mx-4">Margin horizontal</div>
<div class="my-4">Margin vertical</div>

<!-- Auto margin -->
<div class="mx-auto">Center horizontally</div>
<div class="m-auto">Center both ways</div>

<!-- Negative margin -->
<div class="-m-4">Negative margin</div>
```

### Padding

```html
<!-- All sides -->
<div class="p-4">Padding 16px</div>

<!-- Specific sides -->
<div class="pt-4">Padding top</div>
<div class="pb-4">Padding bottom</div>
<div class="pl-4">Padding left</div>
<div class="pr-4">Padding right</div>

<!-- Horizontal/Vertical -->
<div class="px-4">Padding horizontal</div>
<div class="py-4">Padding vertical</div>
```

### Gap (Flexbox/Grid)

```html
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Specific gap -->
<div class="gap-x-4">Column gap</div>
<div class="gap-y-4">Row gap</div>
```

---

## Typography

### Font Size

```html
<p class="text-xs">Extra small (12px)</p>
<p class="text-sm">Small (14px)</p>
<p class="text-base">Base (16px)</p>
<p class="text-lg">Large (18px)</p>
<p class="text-xl">Extra large (20px)</p>
<p class="text-2xl">2XL (24px)</p>
<p class="text-3xl">3XL (30px)</p>
<p class="text-4xl">4XL (36px)</p>
<p class="text-5xl">5XL (48px)</p>
```

### Font Weight

```html
<p class="font-thin">Thin (100)</p>
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>
<p class="font-extrabold">Extra bold (800)</p>
<p class="font-black">Black (900)</p>
```

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified</p>
```

### Text Decoration

```html
<p class="underline">Underlined</p>
<p class="overline">Overlined</p>
<p class="line-through">Strikethrough</p>
<p class="no-underline">No decoration</p>

<!-- Underline offset -->
<p class="underline underline-offset-4">Custom offset</p>
```

### Line Height

```html
<p class="leading-3">Line height 0.75rem</p>
<p class="leading-4">Line height 1rem</p>
<p class="leading-5">Line height 1.25rem</p>
<p class="leading-6">Line height 1.5rem</p>
<p class="leading-tight">Line height 1.25</p>
<p class="leading-normal">Line height 1.5</p>
<p class="leading-relaxed">Line height 1.625</p>
<p class="leading-loose">Line height 2</p>
```

### Letter Spacing

```html
<p class="tracking-tighter">Tighter</p>
<p class="tracking-tight">Tight</p>
<p class="tracking-normal">Normal</p>
<p class="tracking-wide">Wide</p>
<p class="tracking-wider">Wider</p>
<p class="tracking-widest">Widest</p>
```

### Text Transform

```html
<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">Capitalize</p>
<p class="normal-case">Normal case</p>
```

---

## Colors

### Text Color

```html
<p class="text-slate-50">Lightest slate</p>
<p class="text-slate-500">Medium slate</p>
<p class="text-slate-900">Darkest slate</p>

<!-- Common colors -->
<p class="text-red-500">Red</p>
<p class="text-blue-500">Blue</p>
<p class="text-green-500">Green</p>
```

### Background Color

```html
<div class="bg-red-500">Red background</div>
<div class="bg-blue-50">Light blue</div>
<div class="bg-gray-900">Dark gray</div>

<!-- With opacity -->
<div class="bg-red-500/50">50% opacity</div>
<div class="bg-blue-500/75">75% opacity</div>
```

### Color Scale

```
50, 100, 200, 300, 400, 500 (base), 600, 700, 800, 900, 950
```

---

## Borders

### Border Width

```html
<div class="border">1px border</div>
<div class="border-0">No border</div>
<div class="border-2">2px border</div>
<div class="border-4">4px border</div>
<div class="border-8">8px border</div>
```

### Border Color

```html
<div class="border border-red-500">Red border</div>
<div class="border border-slate-200">Light border</div>
```

### Border Radius

```html
<div class="rounded">Border radius 0.25rem</div>
<div class="rounded-lg">0.5rem</div>
<div class="rounded-xl">0.75rem</div>
<div class="rounded-2xl">1rem</div>
<div class="rounded-full">50% (circle)</div>

<!-- Specific corners -->
<div class="rounded-t-lg">Top corners</div>
<div class="rounded-b-lg">Bottom corners</div>
```

---

## Sizing

### Width

```html
<div class="w-0">0</div>
<div class="w-4">1rem</div>
<div class="w-8">2rem</div>
<div class="w-16">4rem</div>
<div class="w-32">8rem</div>

<!-- Full/Auto/Screen -->
<div class="w-full">100%</div>
<div class="w-auto">Auto</div>
<div class="w-screen">100vw</div>

<!-- Min/Max width -->
<div class="min-w-0">Min width 0</div>
<div class="max-w-sm">Max width small</div>
<div class="max-w-md">Max width medium</div>
<div class="max-w-lg">Max width large</div>
```

### Height

```html
<div class="h-0">0</div>
<div class="h-4">1rem</div>
<div class="h-8">2rem</div>
<div class="h-16">4rem</div>
<div class="h-32">8rem</div>

<!-- Full/Auto/Screen -->
<div class="h-full">100%</div>
<div class="h-auto">Auto</div>
<div class="h-screen">100vh</div>

<!-- Min/Max height -->
<div class="min-h-screen">Min height 100vh</div>
<div class="max-h-32">Max height</div>
```

---

## Flexbox

### Display Flex

```html
<div class="flex">Flex container</div>
<div class="flex-row">Row direction (default)</div>
<div class="flex-col">Column direction</div>
```

### Justify Content

```html
<div class="flex justify-start">Left aligned</div>
<div class="flex justify-center">Center aligned</div>
<div class="flex justify-end">Right aligned</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>
<div class="flex justify-evenly">Space evenly</div>
```

### Align Items

```html
<div class="flex items-start">Top aligned</div>
<div class="flex items-center">Center aligned</div>
<div class="flex items-end">Bottom aligned</div>
<div class="flex items-stretch">Stretch to fill</div>
```

### Flex Wrap

```html
<div class="flex flex-wrap">Wrap items</div>
<div class="flex flex-nowrap">Don't wrap</div>
```

### Flex Grow/Shrink

```html
<div class="flex-1">Grow equal</div>
<div class="flex-grow">Grow to fill</div>
<div class="flex-shrink">Shrink if needed</div>
<div class="flex-shrink-0">Don't shrink</div>
```

---

## Grid

### Display Grid

```html
<div class="grid">Grid container</div>
```

### Grid Columns

```html
<div class="grid grid-cols-1">1 column</div>
<div class="grid grid-cols-2">2 columns</div>
<div class="grid grid-cols-3">3 columns</div>
<div class="grid grid-cols-4">4 columns</div>
<div class="grid grid-cols-6">6 columns</div>
<div class="grid grid-cols-12">12 columns</div>
```

### Column Span

```html
<div class="col-span-1">Span 1 column</div>
<div class="col-span-2">Span 2 columns</div>
<div class="col-span-full">Span all columns</div>
```

---

## Positioning

### Position

```html
<div class="static">Static (default)</div>
<div class="fixed">Fixed positioning</div>
<div class="absolute">Absolute positioning</div>
<div class="relative">Relative positioning</div>
<div class="sticky">Sticky positioning</div>
```

### Inset (Top/Right/Bottom/Left)

```html
<!-- All sides -->
<div class="inset-0">All 0</div>

<!-- Specific sides -->
<div class="top-0">Top 0</div>
<div class="right-0">Right 0</div>
<div class="bottom-0">Bottom 0</div>
<div class="left-0">Left 0</div>
```

### Z-Index

```html
<div class="z-0">Z-index 0</div>
<div class="z-10">Z-index 10</div>
<div class="z-20">Z-index 20</div>
<div class="z-30">Z-index 30</div>
<div class="z-40">Z-index 40</div>
<div class="z-50">Z-index 50</div>
```

---

## Display & Visibility

### Display

```html
<div class="block">Block display</div>
<div class="inline">Inline display</div>
<div class="inline-block">Inline-block display</div>
<div class="flex">Flex display</div>
<div class="grid">Grid display</div>
<div class="hidden">Hidden/Display none</div>
```

### Visibility

```html
<div class="visible">Visible</div>
<div class="invisible">Invisible (takes space)</div>
```

### Overflow

```html
<div class="overflow-auto">Auto overflow</div>
<div class="overflow-hidden">Hidden overflow</div>
<div class="overflow-scroll">Always scrollable</div>

<!-- Specific axis -->
<div class="overflow-x-auto">Horizontal scroll</div>
<div class="overflow-y-auto">Vertical scroll</div>
```

---

## Effects

### Opacity

```html
<div class="opacity-0">Fully transparent</div>
<div class="opacity-25">25% opacity</div>
<div class="opacity-50">50% opacity</div>
<div class="opacity-75">75% opacity</div>
<div class="opacity-100">Fully opaque</div>
```

### Box Shadow

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
<div class="shadow-2xl">2XL shadow</div>
```

---

## Transforms

### Translate

```html
<div class="translate-x-1">0.25rem X</div>
<div class="translate-y-1">0.25rem Y</div>
<div class="-translate-x-1">-0.25rem X</div>
<div class="-translate-y-1">-0.25rem Y</div>
```

### Rotate

```html
<div class="rotate-0">0 degrees</div>
<div class="rotate-45">45 degrees</div>
<div class="rotate-90">90 degrees</div>
<div class="rotate-180">180 degrees</div>
```

### Scale

```html
<div class="scale-50">50% scale</div>
<div class="scale-75">75% scale</div>
<div class="scale-100">100% scale</div>
<div class="scale-125">125% scale</div>
<div class="scale-150">150% scale</div>
```

---

## Transitions & Animations

### Transition

```html
<div class="transition">All properties</div>
<div class="transition-colors">Colors only</div>
<div class="transition-opacity">Opacity only</div>
<div class="transition-transform">Transform only</div>

<!-- Duration -->
<div class="duration-75">75ms</div>
<div class="duration-100">100ms</div>
<div class="duration-200">200ms</div>
<div class="duration-300">300ms</div>
<div class="duration-500">500ms</div>

<!-- Timing Function -->
<div class="ease-linear">Linear</div>
<div class="ease-in">Ease in</div>
<div class="ease-out">Ease out</div>
<div class="ease-in-out">Ease in-out</div>
```

### Animation

```html
<div class="animate-bounce">Bounce</div>
<div class="animate-pulse">Pulse</div>
<div class="animate-ping">Ping</div>
<div class="animate-spin">Spin</div>
```

---

## Filters

### Blur

```html
<div class="blur-none">No blur</div>
<div class="blur-sm">Small blur</div>
<div class="blur">Default blur</div>
<div class="blur-md">Medium blur</div>
<div class="blur-lg">Large blur</div>
```

### Brightness & Contrast

```html
<div class="brightness-50">50%</div>
<div class="brightness-100">100% (normal)</div>
<div class="brightness-150">150%</div>

<div class="contrast-50">50%</div>
<div class="contrast-100">100% (normal)</div>
<div class="contrast-150">150%</div>
```

---

## Interactivity

### Cursor

```html
<div class="cursor-auto">Auto cursor</div>
<div class="cursor-default">Default cursor</div>
<div class="cursor-pointer">Pointer cursor</div>
<div class="cursor-not-allowed">Not allowed cursor</div>
```

### Pointer Events

```html
<div class="pointer-events-none">No pointer events</div>
<div class="pointer-events-auto">Pointer events enabled</div>
```

### User Select

```html
<div class="select-none">No selection</div>
<div class="select-text">Select text</div>
<div class="select-auto">Auto selection</div>
```

---

## Responsive Design

### Breakpoints

```
sm:   640px   (small)
md:   768px   (medium)
lg:   1024px  (large)
xl:   1280px  (extra large)
2xl:  1536px  (2x extra large)
```

### Usage

```html
<!-- Mobile first -->
<div class="text-sm md:text-base lg:text-lg">Responsive text size</div>

<div class="flex flex-col md:flex-row lg:flex-row">Responsive layout</div>

<div class="w-full md:w-1/2 lg:w-1/3">Responsive width</div>

<div class="hidden md:block lg:hidden">Visible on medium screens only</div>
```

---

## Dark Mode

### Dark Mode Classes

```html
<!-- Enable dark mode -->
<html class="dark">
  <body class="dark:bg-slate-900 dark:text-white">
    Dark mode content
  </body>
</html>

<!-- Specific elements -->
<div class="bg-white dark:bg-slate-900">Adaptive background</div>

<p class="text-black dark:text-white">Adaptive text</p>
```

---

## Arbitrary Values

### Using Arbitrary Values

```html
<!-- Custom sizing -->
<div class="w-[600px]">Custom width</div>
<div class="h-[400px]">Custom height</div>

<!-- Custom colors -->
<div class="bg-[#1F2937]">Custom background</div>
<div class="text-[#374151]">Custom text color</div>

<!-- Custom spacing -->
<div class="m-[60px]">Custom margin</div>
<div class="p-[45px]">Custom padding</div>

<!-- Complex selectors -->
<div class="[&>div]:mb-6">Child margin</div>
<div class="[&_label]:mb-2.5">Descendant margin</div>
```

---

## Common Patterns

### Center Content

```html
<!-- Using flexbox -->
<div class="flex items-center justify-center h-screen">Centered content</div>

<!-- Using grid -->
<div class="grid place-items-center h-screen">Centered content</div>
```

### Card

```html
<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-lg font-bold mb-2">Card Title</h2>
  <p class="text-gray-600">Card content</p>
</div>
```

### Button States

```html
<button
  class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200"
>
  Click me
</button>
```

### Responsive Container

```html
<div class="container mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    Grid content
  </div>
</div>
```

### Gradient

```html
<div class="bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient background
</div>
```

---

## Tips & Tricks

1. **Mobile First**: Design for mobile first, then use `md:`, `lg:` for larger screens
2. **Arbitrary Values**: Use `[]` for custom values not in Tailwind
3. **Combine Classes**: `className="p-4 md:p-6 lg:p-8"` for responsive spacing
4. **Group Hover**: `group` + `group-hover:` for parent-child interactions
5. **Performance**: Tailwind automatically removes unused styles in production

---

Last Updated: March 29, 2026
