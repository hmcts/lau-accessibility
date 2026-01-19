# Playwright Project

This project is set up for automated UI accessibility testing of LAU pages using Playwright (tests written in JavaScript) as well as Axe-core for testing against WCAG 2.2 guidelines.

## Running Tests

**Run Checklist Tests**
>This is to run tests and view results using Allure Reporting.
First run the following
```sh
npm run test-allure:checklist
```
Once tests have completed, run the following to open the Allure report
```sh
npm run allure-generate
```
**Run all tests on all browsers:**
```sh
npm run test-allure:all
```

**Run tests in headed mode (For test purpose):**
Uncomment lines 116-125 in the `playwright.config.js` file.
```sh
npm run test:lau-head-test
```

## Structure
- `tests/lau`: Test folders for each website
- `page-objects/`: Page Object Model files
- `utils/`: Shared utilities (e.g., accessibility helpers)
- `data/`: Test data files

## Best Practices
- Use tags (e.g., `@checklist`, `@smoke`) for filtering

