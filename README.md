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

## Running RestSharp API Tests
The `api-restsharp-tests` folder contains a standalone .NET (xUnit + RestSharp) project that exercises the `/api/images` endpoints directly.

### Requirements
- [.NET 10 SDK](https://dotnet.microsoft.com/download) or later
- The app running locally (these tests hit a live server, they don't mock the API)

### Setup
First, start the app from the repo root:
```bash
npm run dev
```

Then, in another terminal, install dependencies and run the tests:
```bash
cd api-restsharp-tests
dotnet restore
dotnet test
```

### Configuration
- Default settings live in [Config/appsettings.json](api-restsharp-tests/ApiRestSharpTests.Tests/Config/appsettings.json) (timeout) and [Config/appsettings.test.json](api-restsharp-tests/ApiRestSharpTests.Tests/Config/appsettings.test.json) (base URL, defaults to `http://localhost:3000`).
- To point at a different environment, set `TEST_ENVIRONMENT` and add a matching `Config/appsettings.<environment>.json` file.
- Any setting can be overridden with environment variables, e.g. `ApiSettings__BaseUrl=http://localhost:3000 dotnet test`.


### CI Pipeline
Implemented at [.github/workflows/restsharp-api-tests.yml](.github/workflows/restsharp-api-tests.yml). To run the same steps manually:
```bash
npm ci
npm run build
npm run start &
APP_PID=$!

npx wait-on --timeout 60000 --verbose http-get://localhost:3000/api/images

cd api-restsharp-tests
dotnet restore
dotnet test --logger "trx;LogFileName=restsharp-test-results.trx"
TEST_EXIT_CODE=$?
cd ..

kill $APP_PID
exit $TEST_EXIT_CODE
```
- Requires .NET SDK `10.0.x` (`actions/setup-dotnet`).
- Override the base URL in CI with `ApiSettings__BaseUrl=<url>`.
- Test results are published as the `restsharp-test-results` artifact.

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
