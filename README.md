# omni-color

A modern color manipulation and color scheme generation library for TypeScript/JavaScript projects.

[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](./LICENSE) ![CI](https://github.com/rteammco/omni-color/actions/workflows/ci.yml/badge.svg?branch=main) ![Demo Deployed](https://github.com/rteammco/omni-color/actions/workflows/pages.yml/badge.svg?branch=main)
 



> ⚠️ This is a work-in-progress library. API and structure may change before 1.0.0.

---

## 📦 Installation

```bash
npm install omni-color
```

## 🛠 Dev

### Scripts

These scripts are available in the `package.json`:

| Script              | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `npm run test`      | Runs the test suite once using Jest.                                        |
| `npm run test:watch`| Runs the test suite in watch mode — re-runs on file changes.                |
| `npm run dev`       | Starts the TypeScript compiler in watch mode for continuous rebuilding.     |
| `npm run build`     | Compiles TypeScript source from `./src` to JavaScript in `./dist`.          |
| `prepare` _(auto)_  | Automatically runs `npm run build` before `npm publish` or `npm install`.   |

### Run Tests

* `npm run test` - run all tests.
* `npm run test -- src/color/__test__/validations.test.ts` - run a specific test file.

### Pre-Commit Hooks

To automatically run pre-commit checks, run `npx simple-git-hooks` once to "install" the pre-commit checks.