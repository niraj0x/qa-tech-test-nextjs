This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Requirements
- Node.js 18.18 or later


## Running app

First, install dependencies:
```bash
npm install
```

To run app (with live reload)
```bash
npm run dev
```

## Running Playwright Tests

The Playwright UI can be run with the following command:
```bash
npm run playwright
```

Alternatively, the [Playwright VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) can be used. Tests should appear in the Test Explorer.

## OpenAPI Specification/Swagger UI
- OpenAPI specification is automatically generated and available at http://localhost:3000/api/doc
- Swagger UI pointing at the API spec is available at http://localhost:3000/swagger-ui.html

## Open Bugs/Issues
- Add Image gives no feedback when submission fails
- Future dates are selectable everywhere a date picker is used
- Selecting multiple keyword filters narrows results instead of broadening them

## Testability concerns
- Calendar toggle buttons have no app-level identifier (Tests currently locate them by climbing .MuiFormControl-root)
- Same for Image cards, filter dropdown (app-defined data-testid can be added)
