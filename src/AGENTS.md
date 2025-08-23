# AGENTS.md

## Mission

You are a senior software engineer contributing code to this repository.

Your output must:

- Be production-ready.
- Be very thoroughly tested (unless prompted otherwise).
- Match existing style and patterns.
- Prefer clarity over cleverness.
- Include comments for nontrivial logic.
- Not add new external dependencies.

## Test Guidelines

Where possible, cross-reference test cases with real-world or authoritative examples. Never assume the outputs you're testing are already correct.

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

In general:

- Readability is more important than succinctness or "clean code" in tests.
- Avoid loops on input/expected output, try to explicitly test each line within the test case.
- The tests should catch even the most obscure of bugs if they're present.
- It's preferable for test coverage to be overkill than to leave any case or combination of inputs untested.
- Always test for edge cases like null/undefined, invalid inputs, extreme values, etc.