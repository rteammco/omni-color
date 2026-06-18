<!-- AGENTS.md -->

# omni-color - Agent Guide

You are helping build a high-quality TypeScript color library. Favor clear, boring, well-tested code over clever shortcuts.

## Working Rules

- Think through a high-bar success metric before changing code, then evaluate the result before finishing.
- Keep edits scoped to the user's request. Do not make unrelated stylistic cleanups, drive-by refactors, or formatting churn.
- Push back before following a request that looks technically wrong, brittle, wasteful, unsafe, or misaligned with the library's goals. Explain the concern, suggest a better path, and ask for confirmation before proceeding with the risky approach.
- Do not touch git state unless the user explicitly asks. This includes commits, branches, staging, rebasing, resetting, pushing, and restoring files.
- Check the worktree before editing. If files already contain user changes, preserve them and work around them.
- Do not edit generated output by hand, including `dist/`, `demo/dist/`, coverage output, or dependency folders. Change source files and regenerate artifacts only when the task calls for it.
- Do not change `package.json`, `package-lock.json`, or `demo/package-lock.json` unless a dependency change is truly required.
- Prefer automated enforcement over agent instructions. If a lint rule, formatter, typecheck option, or test can enforce the same rule, use that instead of adding prose-only guidance; ask before adding dependencies for new enforcement.
- When updating AGENTS.md files, audit new instructions for rules that should be lint, formatter, typecheck, or test coverage instead.
- Use existing code as the reference for structure, naming, style, and testing patterns.

## Project Shape

- Core library source lives in `src/`.
- Color utilities and the `Color` class live in `src/color/`.
- Palette code lives in `src/palette/`.
- Tests live next to their domain in `__test__/` directories.
- The demo app lives in `demo/` and has its own [demo/AGENTS.md](demo/AGENTS.md) instructions.
- `dist/` is build output from `npm run build`; consumers import from it, but agents should not edit it manually.

## Core Library Changes

omni-color is in beta. For feature work, prioritize the best long-term API and implementation. Do not preserve backwards compatibility with existing released versions unless the user explicitly asks.

When adding or extending library behavior:

1. Update the appropriate helper, util, or domain file cleanly.
2. Update or add comprehensive tests for the changed behavior.
3. Update the `Color` class when the behavior should be exposed there.
4. Add a basic `Color` class test in `src/color/__test__/color.test.ts` for new `Color` APIs.
5. Update `src/index.ts` exports only for public APIs and consumer-facing types.
6. Update the README "Documentation" section when public behavior changes.
7. Build before demo verification when demo code imports from `dist`.

## Color Correctness

- Treat color math as specification-sensitive. Cross-check new conversion, contrast, parsing, or formatting behavior against authoritative specs or established libraries where practical.
- Be explicit about rounding, clamping, hue wrapping, alpha handling, gamut limits, and invalid input behavior.
- Keep public API inputs and outputs predictable. Prefer throwing clear errors for invalid inputs over silent surprising behavior unless the surrounding code establishes a different pattern.
- Avoid widening exported types or adding new top-level exports unless they are part of the intended consumer API.

## Automated Tests

Any behavior change should include automated tests. Prefer tests that are readable at a glance over compact table loops.

Use this structure:

```ts
describe('function or util being tested', () => {
  it('works for the happy path', () => {
    expect(new Color('red').toHex()).toBe('#ff0000');
    expect(new Color('green').toHex()).toBe('#00ff00');
    expect(new Color('blue').toHex()).toBe('#0000ff');
  });

  it('handles edge case X', () => {
    expect(new Color('#000000').toHex()).toBe('#000000');
  });
});
```

- `src/color/__test__/utils.test.ts` is a good local example.
- Keep tests for a domain file in its matching test file, for example `gradients.ts` coverage belongs in `src/color/__test__/gradients.test.ts`.
- When testing an exported function, import and call it by its exported name. Do not alias it to describe internals.
- Do not export private helpers only to test them.
- Prefer explicit expectations line by line. Use shared constants only when they improve clarity.
- Use hex strings like `#rrggbb` for `Color` inputs and outputs whenever that keeps expected behavior easy to inspect.
- Cover edge cases: nullish inputs, invalid inputs, boundary channel values, alpha extremes, hue wrapping, rounding boundaries, and out-of-gamut values where relevant.
- Do not remove existing test coverage unless the behavior is intentionally removed.

## Verification

Run the narrowest useful checks while iterating, then run the relevant final checks before finishing.

For core library changes, the expected final checks are:

```sh
npm run lint
npm run typecheck
npm run test
npm run format:check
```

If a command cannot be run, say exactly why and what risk remains.

## Style Guide

- Adapt to the style of the files you touch.
- Keep code elegant, clean, and professional. Do not over-engineer or invent creative abstractions when a simple local approach works.
- Use descriptive variable names. Short names like `i`, `x`, and `y` are fine when their domain is obvious.
- Use existing utilities before adding new ones.
- Add a new utility only when it removes real duplication or clarifies shared behavior.
- Respect lint rules. Do not disable them unless there is no reasonable alternative.
- Avoid `any`, non-null assertions, nested ternaries, and broad parameter lists unless the existing code clearly requires them.
