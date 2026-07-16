# Rest Client App

A responsive web application for building, sending, and inspecting REST API requests. The app
combines a request editor, response viewer, reusable variables, generated code snippets, and a
per-user request history in one interface.

The project was created as the final team assignment for the
[RS School React course](https://rs.school/courses/reactjs).

## Features

- Email and password authentication powered by Supabase.
- REST requests using `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`.
- Custom request headers and text or JSON request bodies.
- JSON validation and formatting.
- Response body and HTTP status display.
- Request state encoded in the URL so a configured request can be restored.
- Reusable `{{variable}}` interpolation in URLs, headers, and request bodies.
- Code generation for cURL, JavaScript Fetch, JavaScript XHR, Node.js, Python, Java, C#, and Go.
- Per-user request history with request metrics and analytics.
- English and Russian localization.
- Responsive layouts and keyboard-accessible interactive controls.

## Technology stack

| Area                 | Technologies                                         |
| -------------------- | ---------------------------------------------------- |
| Application          | React 19, TypeScript, React Router 7, SSR            |
| State and data       | Zustand, Axios                                       |
| Backend services     | Supabase Auth, Supabase Database, Supabase SSR       |
| Styling              | SCSS, shared design tokens, responsive media queries |
| Localization         | i18next, react-i18next                               |
| Code generation      | httpsnippet-lite, fetch-to-curl                      |
| Testing              | Vitest, React Testing Library, jsdom                 |
| Quality tools        | ESLint, Prettier, Husky, lint-staged                 |
| Build and deployment | Vite, React Router, Vercel preset                    |

## Prerequisites

- [Node.js](https://nodejs.org/) `20.19.0` (the version is defined in `.nvmrc`).
- npm (included with Node.js).
- A Supabase project with email/password authentication and the `history` table configured.

The expected database shape is documented by the generated types in
[`src/types/database.types.ts`](src/types/database.types.ts). Database migrations are not included
in this repository.

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/Ryhus/rest-client-app.git
   cd rest-client-app
   ```

2. Select the project Node.js version if you use nvm:

   ```bash
   nvm use
   ```

3. Install the exact dependency versions from the lockfile:

   ```bash
   npm ci
   ```

4. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

5. Add the public credentials from your Supabase project settings:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   Only use the public anonymous key in this file. Never expose a Supabase service-role key in a
   client-facing environment variable.

6. Start the development server:

   ```bash
   npm run dev
   ```

The terminal will print the local URL after the server starts.

## Available commands

| Command                 | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `npm run dev`           | Start the React Router development server with hot reload. |
| `npm run build`         | Create production client and SSR bundles.                  |
| `npm run preview`       | Preview the production build locally.                      |
| `npm run lint`          | Run ESLint across the project.                             |
| `npm run format:fix`    | Format supported files with Prettier.                      |
| `npm test`              | Start Vitest in watch mode.                                |
| `npm test -- --run`     | Run the test suite once.                                   |
| `npm run test:coverage` | Run tests with text and HTML coverage reports.             |

Coverage thresholds are set to 80% for statements, branches, functions, and lines.

## Application routes

| Route                                              | Access              | Purpose                                              |
| -------------------------------------------------- | ------------------- | ---------------------------------------------------- |
| `/`                                                | Public              | Landing page and project information.                |
| `/signup`                                          | Guests              | Create an account.                                   |
| `/login`                                           | Guests              | Sign in with email and password.                     |
| `/rest-client/:method?/:encodedUrl?/:encodedBody?` | Authenticated users | Configure and send REST requests.                    |
| `/history`                                         | Authenticated users | Review requests grouped by date and inspect metrics. |
| `/variables`                                       | Authenticated users | Manage reusable request variables.                   |
| `/logout`                                          | Authenticated users | End the current session.                             |

## Project structure

```text
src/
├── assets/       # Images and SVG icons
├── components/   # Shared UI components
├── layouts/      # Route layouts
├── locales/      # English and Russian translation resources
├── pages/        # Route modules and page-specific components
├── services/     # REST and Supabase integrations
├── stores/       # Zustand stores
├── styles/       # Global styles, reset, and design variables
├── types/        # Application and generated database types
├── utils/        # Validation, encoding, metrics, and shared helpers
├── root.tsx      # Root loader and document shell
└── routes.ts     # Route configuration
```

## Data and state

- Authentication is handled on the server through Supabase SSR and cookie-based sessions.
- Request history and request metrics are stored in Supabase and scoped to the authenticated user.
- Reusable variables and the selected interface language are stored in browser `localStorage`.
- The active request is managed with Zustand. Its method, URL, body, and headers can be restored
  from route and query parameters.

## Testing

Unit and component tests are colocated with the source files as `*.test.ts` and `*.test.tsx`.
React Testing Library is used for user-facing behavior, while Vitest provides the runner, mocks,
and coverage reports.

Run the complete suite once before opening a pull request:

```bash
npm test -- --run
npm run lint
npm run build
```

## Deployment

The application builds as an SSR React Router project and uses the official Vercel preset. Add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the deployment environment, then use the
standard production build command:

```bash
npm run build
```

## Contributors

- [Yevhen Ryhus](https://github.com/ryhus) — Team Lead
- [Maria Parinova](https://github.com/mariaparinova) — Frontend Developer
- [Anastasia Kudrevich](https://github.com/silvermockingjay) — Frontend Developer
