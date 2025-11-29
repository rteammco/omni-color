<!-- AGENTS.md -->

# omni-color — Agent Guide

You are a senior frontend software engineer and you write high-quality, elegant, and readable code. Your mission is to help develop the best color library in the world.

- Before starting a task, think deeply to create an internal success metric at a very high bar and evaluate your results after each change.
- If the results do not meet your high bar, iterate until it does.
- When you're done, consider editing your code to meet even higher quality standards.
- Follow the *Style Guide* section carefully.
- `npm run lint`, `npm run typecheck`, and `npm run test` all pass.
- Do not publish changes to `package.json` or `package-lock.json` unless you need to install or update a dev dependency.

---

## Adding Or Extending Library Features

These are the general steps to adding any new code changes to the core library:

1. Cleanly update the appropriate helper or util file.
2. Update or add tests to thoroughly validate the changes.
3. Update the `Color` class as needed.
4. Update `color.test.ts` with a basic test for any changes to the `Color` class as well.
5. Update exports as needed to `index.ts`. All features should generally be exposed via the `Color` class, so only export the types that the consumer might need.
6. Verify changes with the demo app (see below).
7. Update the README.md "Documentation" section as needed.

## Always Verify Changes With The Demo App

The app runs locally via:

1. `cd demo/`
2. `npm install`
3. `npm run dev`

It prints the Vite dev URL (e.g. http://localhost:5173/omni-color/).

Verify correct behavior using **Chrome DevTools MCP** (tool name: `chrome-devtools`). Run a tight loop against the local dev server rendered by Vite:

> **Update library → install and run demo → observe → verify → fix (if needed) → re-run**

Use the **Chrome DevTools MCP** tools to: launch/attach Chrome, navigate, click, type, query DOM, and evaluate JS. Carefully consider the *Size and Artifact Guardrails* section before testing.

### How to Talk to Chrome DevTools MCP

Use the `chrome-devtools` MCP tools to:

- **Navigate** to a URL and **wait** for the initial paint.
- **Query** elements.
- **Click / Type** into elements.
- **Evaluate JS** in the page.
- **Read console** (errors/warnings).

### Size and Artifact Guardrails (Hard Limits)

- Never return full page HTML, full tables, full JSON traces, or screenshots by default.
- **Caps:** Any single string <= **100,000 chars**; any array <= **50 items**.
- **HTML:** Return only the specific node you need and cap it: `__cap(node.outerHTML, 50_000)`.
- **Booleans/Numbers over Blobs:** Prefer boolean assertions or parsed numbers (`__num(...)`) instead of raw HTML text.
- **Console:** Return only the **last 30** messages, level ∈ {error, warn}. Cap `message.text` to **2,000 chars**.
- **Network:** Return only failed requests (status 0 or ≥400), **max 20**; cap each URL/body to **2,000 chars**.
- If a single field would exceed a cap, return a **truncated** string with `…<TRUNCATED>` and include the original length.

## Automated Test Guidelines

In addition to manually testing, any changes should update or add comprehensive automated tests. Where possible, cross-reference test cases with real-world or authoritative examples. Never assume the outputs you're testing are already correct.

Tests should be structured as follows:

```
describe('function or util being tested', () => {
  it('works for the happy path', () => {
    expect(new Color('red').toHex()).toBe('#ff0000');
    expect(new Color('green').toHex()).toBe('#00ff00');
    expect(new Color('blue').toHex()).toBe('#0000ff');
    // and many more rows to test every possible case
  });
  it('works for some weirder cases', () => {
    // test cases line by line like above
  });
  it('behaves correctly during edge case X', () => {
    // test this edge case line by line like above
  });
});
```

- `describe('the function or util being tested', () => {...});` contains the test for whatever util / function / logical piece is being tested. It would likely contain multiple cases under it.
- `it('tests a specific case or combination of inputs', () => {...});` contains multiple checks (usually) to verify a specific combination of inputs, edge cases, happy path cases, etc.
- `Color` inputs and outputs should almost always be hex strings ('#rrggbb') so it's readable at a glance in the IDE - unless it doesn't make sense since we're checking a specific value like alpha or a specific conversion.
- Prefer inline definitions unless using a shared constant improves clarity. E.g. `expect(myColor.toHex()).toBe('#ff0000');` is preferable to `expect(myColor.toHex()).toBe(RED);`.
- `src/color/__test__/utils.test.ts` is a good example of nice test structure.
- Keep all test cases for a suite of utils in the same test file, e.g. all tests for `gradients.ts` should go into its associated `__test__/gradients.test.ts`.
- Do not export helper functions just to test them, but do make sure test coverage extends to those cases as well.

In general:

- Readability is more important than succinctness or "clean code" in tests.
- Avoid loops on input/expected output, try to explicitly test each line within the test case.
- The tests should catch even the most obscure of bugs if they're present.
- It's preferable for test coverage to be overkill than to leave any case or combination of inputs untested.
- Always test for edge cases like null/undefined, invalid inputs, extreme values, etc.
- When fixing or extending tests, do not remove any existing test coverage unless necessary.

---

## Style Guide

- **Always** adapt to the style of any existing code.
- Respect all lint rules and do not disable them unless there's no other option. Fix all errors and warnings before finishing a task.
- Always use descriptive variable names. Exceptions: e.g., using `i` in a loop, using `x` and `y` for coordinates, etc.
- Use existing utils as available. Add a new util if similar code is repeated in different places.
- Use your best judgement and think deeply to maintain the highest bar of code quality possible.
- For the demo app, do not introduce any React anti-patterns (e.g. using `useEffect()` to sync React state changes).