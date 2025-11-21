# omni-color

> ⚠️ This is a work-in-progress library. API and structure may change before 1.0.0.

A modern color manipulation and color scheme generation library for TypeScript/JavaScript projects.

[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](./LICENSE) [![CI](https://github.com/rteammco/omni-color/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rteammco/omni-color/actions/workflows/ci.yml) [![Demo Deployed](https://github.com/rteammco/omni-color/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/rteammco/omni-color/actions/workflows/pages.yml)

**Live demo:** https://rteammco.github.io/omni-color/


## 📦 Install

```bash
npm install omni-color
```


## ℹ️ Documentation

TODO


---


## 🛠 Dev

### First-Time Setup

From the project's root directory:

1. `npx simple-git-hooks` - run once to initiate the pre-commit checks that will run automatically.

### Run Demo

From the `demo/` directory:

* `npm install` - install the omni-color library from the project's root directory.
* `npm run dev` - run the demo locally.

*GitHub actions will automatically update the live demo on merges to the `main` branch.*

### Run Tests and Checks

From the project's root directory:

* `npm run test` - run all tests.
* `npm run test:watch` - run all tests in watch mode.
* `npm run test -- src/color/__test__/validations.test.ts` - run a specific test file.
* `npm run lint` - run linter.