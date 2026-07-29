# Bundle Suite — Frontend

A React (Vite) frontend rebuilt to align with the `bundle-api` Spring Boot backend
(chat + edutech modules, JWT auth, and the per-service access-request/approval flow).

## Stack
- React 18 + React Router 6 (HashRouter, same routing style as the previous app)
- Axios with an access/refresh token interceptor (auto-refreshes on 401, single-flight)
- Plain CSS with light/dark theme via CSS variables (no UI kit dependency)

## How access control works here
`bundle-api` gates two bundled services behind `ServiceAccessRequest` / `ServiceGrant`:

- `CHAT` — READ to receive messages, WRITE to send (WRITE implies READ)
- `EDUTECH` — READ to browse; uploads/edits are ADMIN-only regardless of grants

**On registration**, the frontend automatically submits two PENDING access requests
for the new user: `CHAT` (WRITE) and `EDUTECH` (READ). The user lands on `/dashboard`,
which shows each service as "Awaiting admin approval…" until an admin acts on it from
`/admin/access-requests`. Once approved, the corresponding nav link (Chat / Edutech)
appears and the route becomes reachable — `ProtectedRoute` checks the live grant list
(admins bypass this check entirely, matching the backend's `hasRole('ADMIN')` bypass).

If a request is rejected, or the user needs a different level later, the dashboard
card also offers a "Request access" / "Request again" button that calls
`POST /api/user/access-requests` directly.

## Setup
```bash
cp .env.example .env      # set VITE_API_BASE_URL to your bundle-api origin + /api
npm install
npm run dev               # http://localhost:3000
```

`VITE_API_BASE_URL` defaults to `http://localhost:8080/api` if unset.

Note: `SecurityConfig` on the backend currently allows CORS from `http://localhost:*`
only — fine for local dev. Update `CorsConfig`/`SecurityConfig`'s allowed origins
before deploying the frontend anywhere else.

## Structure
```
src/
  api/            one file per backend controller group (authApi, userApi, adminApi, chatApi, edutechApi)
  lib/            axios client + token storage helpers
  context/        AuthContext (session + grants/requests state), ThemeContext
  components/     Layout (sidebar/topbar), ProtectedRoute, Spinner, StatusPill
  pages/
    auth/         Login, Register
    admin/        AccessRequestsPage (approve/reject), UsersPage (role/enabled)
    chat/         ChatPage (individuals list + conversation + composer)
    edutech/      CoursesPage, CourseDetailPage, PastQuestionsPage, AdminCourseFormPage
```

## Known gaps / next steps
- Chat and the individuals list poll on an interval rather than using a websocket —
  the backend doesn't currently expose one. Swap `ChatPage`'s `setInterval` calls
  for a socket subscription if one gets added later.
- File-attachment sending (`chatApi.sendWithFile`) is implemented but not wired into
  the composer UI yet — text-only send is live.
- `AdminController.updateUser` only accepts `role` + `enabled`; there's no user
  detail/edit screen beyond the inline table controls in `UsersPage`.
- No pagination controls yet for `/admin/users` and `/admin/access-requests` beyond
  a single page of 50 — bump `size` or wire up `Page`'s `totalPages` if lists grow.
