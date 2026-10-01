<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Coding Rules

- Use the App Router and the installed Next.js documentation in `node_modules/next/dist/docs/` for Next.js APIs. Preserve the managed block above.
- Keep interactive state in client components; load server data through `lib/` query modules and share typed records through `lib/` types.
- Use the `@/` import alias and follow the existing TypeScript, Tailwind, and component conventions.
- Reuse the installed shadcn/ReUI components for UI primitives. Read their local APIs before using them; do not hand-roll replacements or edit generated component files without a specific need.
- Before creating a UI component, check for an existing shadcn or ReUI component and reuse it; create a new component only when neither provides one. Make small theme adjustments with Tailwind classes instead of custom components.
- Keep navbar action buttons aligned in height and use consistent compact spacing (`gap-3`).
- Match compact popover control text to the existing UI type scale; use `text-xs` for labels alongside navbar-sized actions.
- Treat `generated/prisma/` as generated output. Make schema changes in `prisma/schema.prisma` and regenerate through the project's Prisma workflow.
- Keep changes focused and preserve existing user edits. Do not commit unless explicitly asked.
- Before finishing, run `bun run lint` and `bunx tsc --noEmit`. For UI changes, verify the affected route and interaction in the browser when available.
