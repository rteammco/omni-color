# TEST GUIDELINES

Tests should be structured as follows:
```
describe('function or util being tested', () => {
  it('works for the happy path', () => {
    expect(new Color('red').toHex()).toBe('#ff0000');
    expect(new Color('green').toHex()).toBe('#00ff00');
    expect(new Color('blue').toHex()).toBe('#0000ff');
    // and many more rows to test every possible calse
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
- `it('tests a specific case or combination of inputs', () => {...});` contains MULTIPLE checks (usually) to verify a specific combination of inputs, edge cases, happy path cases, etc.
- `Color` inputs and outputs should almost always be hex strings ('#rrggbb') so it's readable at a glance in the IDE - unless it doesn't make sense since we're checking a specific value like alpha or a specific conversion.
- Prefer to explicitly define colors and objects in each test case, or each row you're testing. E.g. `expect(myColor.toHex()).toBe('#ff0000');` is preferable to defining a const `RED` and using it like so: `expect(myColor.toHex()).toBe(RED);`.
- `src/color/__test__/utils.test.ts` is a good example of nice test structure.

In general:
- Readability is more important than succinctness or "clean code" in tests.
- Avoid loops on input/expected output, try to explicitly test each line within the test case.
- The tests should catch even the most obscure of bugs if they're present. Don't assume the code already works perfectly.
- It's preferable for test coverage to be overkill than to leave any case or combination of inputs untested.