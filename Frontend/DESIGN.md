# FoodLoop Frontend Design Language

## Product Feeling
FoodLoop is a clean SaaS dashboard for food business operators who need to move quickly from surplus intake to rescue coordination. The UI should feel modern, calm, and operationally clear.

## Stack Alignment
- React + Vite + TypeScript for fast hackathon iteration.
- Tailwind CSS for layout, spacing, color, and responsive behavior.
- shadcn-style primitives in `src/components/ui/` for reusable `Button`, `Card`, and `Badge` foundations.
- React Router for the five main product routes: `/dashboard`, `/surplus`, `/matching`, `/rescue`, and `/impact`.

## Visual Principles
- Fresh and trustworthy: primary green communicates food, sustainability, and action.
- Warm urgency: amber and red tones communicate cutoff pressure without overwhelming the operator.
- Card-first scanning: surplus items, metrics, recipients, and rescue details all use rounded cards with subtle borders.
- One clear next action: each page should make its main task obvious.
- API-ready boundaries: pages consume typed data and pass it into components, making future service integration straightforward.

## Color System
Tailwind theme variables are defined in `src/index.css`.

- `primary`: FoodLoop green for actions, highlights, and route emphasis.
- `secondary`: soft mint for selected states and positive surfaces.
- `background`: warm cream page canvas.
- `muted`: slate-gray supporting surfaces and secondary text.
- `accent`: warm amber for value recovery and caution.
- `destructive`: coral/red for urgent expiration states.

## Component Rules
- `Button`: use `default` for primary next-step actions, `secondary` for supportive actions, `outline` for utility controls, and `ghost` for low-emphasis navigation.
- `Card`: use for every self-contained operational object.
- `Badge`: use for statuses, urgency, and top-match labels.
- Feature components should live by domain: `dashboard`, `surplus`, `matching`, `rescue`, or `impact`.
- Shared app chrome belongs in `components/layout`.

## Layout Rules
- Desktop uses a persistent sidebar with FoodLoop branding and active navigation.
- Mobile uses a compact header with a toggleable nav panel.
- Page content uses generous spacing and responsive grids.
- Keep pages thin: pages assemble components and data, while reusable rendering logic lives in components.

## Accessibility Notes
- Keep visible focus rings on interactive elements.
- Pair color with text for status and urgency.
- Use readable label text for navigation and form controls.
- Preserve high contrast between text and card surfaces.
