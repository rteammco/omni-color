<!-- demo/AGENTS.md -->

# omni-color Demo - Agent Guide

These instructions apply when editing files under `demo/`. Also follow the root [AGENTS.md](../AGENTS.md).

## Demo Workflow

- The demo is a Vite React app that demonstrates the built library from `../dist`.
- Build the library before verifying demo behavior when source changes affect the demo:

```sh
npm run build
npm run dev --prefix demo
```

- The dev server prints the local URL, usually `http://localhost:5173/omni-color/`.
- Use whatever browser automation or inspection tool is available to verify user-facing demo behavior after demo-relevant changes.
- Include visual proof in the final response for browser-verified demo changes, usually a screenshot that shows the implemented behavior.
- Check the page for console errors and failed requests, not just successful rendering.

## React Rules

- Remove props, state, callbacks, imports, and helper code that become unused after a change.
- Do not make unrelated stylistic improvements in React files.
- Sort component props consistently with the local code: stable data/config props first and callback props last. If this convention needs broader coverage, prefer a lint rule over relying on this instruction alone.
- Avoid React anti-patterns. Do not use `useEffect` to synchronize state that can be derived during render or handled directly in an event.
- Keep component APIs small and intentional. Prefer local composition over broad prop surfaces.
- Keep memoization purposeful. Use `useMemo` and `useCallback` for real stability or expensive work, not by default.
- Preserve accessibility semantics for interactive controls: labels, disabled state, keyboard behavior, focus visibility, and useful button text or ARIA labels.

## Demo Styling

- Follow existing Tailwind utility patterns and component primitives in `demo/src/components/`.
- Reuse existing components such as `SectionContainer`, `Card`, input controls, `Icon`, and toast utilities before creating new ones.
- Keep the demo polished but utilitarian. It should help users inspect color behavior quickly.
- Avoid broad visual redesigns unless the user asks for design work.
- Ensure responsive layouts work on mobile and desktop and that text does not overflow controls.

## Browser Verification Guardrails

- Never return full page HTML, full tables, full JSON traces, or screenshots by default.
- Prefer boolean assertions or small parsed values over raw DOM blobs.
- When reading DOM, return only the specific node needed and cap output.
- Console checks should focus on the last 30 `error` or `warn` messages.
- Network checks should focus on failed requests only.
