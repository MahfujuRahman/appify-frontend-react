# AppifyLab

Decoupled full-stack social feed built with a Laravel API backend and a React SPA frontend.

## Architecture Overview

The project uses a separated frontend/backend architecture so each layer can scale independently.

- `backend/` exposes a stateless JSON API with Sanctum token auth.
- `frontend/frontend/` renders the React SPA and talks to the API through a shared Axios-style client.
- The feed is designed around read-heavy traffic:
  - posts are sorted newest-first
  - public/private visibility is resolved at query time
  - comments use self-referencing parent/child rows for recursive threads
  - likes use a polymorphic relationship so posts, comments, and replies share the same reusable pattern

This structure keeps the app ready for large feeds, high read concurrency, and isolated writes without forcing full-page reloads.

## Frontend

### Stack

- React
- Vite
- Bootstrap-based assignment styles

### Key Pieces

- `src/api/axios.js`
  - base URL points to `http://127.0.0.1:8000/api`
  - request interceptor injects `Bearer <token>` from `localStorage`

- `src/context/AuthContext.jsx`
  - stores authenticated user state globally
  - restores session from `localStorage`
  - provides route guard helpers for protected and guest-only screens

- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/Feed.jsx`
  - recursive comment renderer
  - local optimistic updates for likes and nested replies
  - state reconciliation from normalized backend responses

### Setup Commands

From `frontend/frontend/`:

```bash
npm install
npm run dev
```

### Frontend Flow

- Register or log in through the API
- Store the Sanctum token in `localStorage`
- Load the protected feed
- Create posts with text, image, and visibility
- Like/unlike posts, comments, and replies
- Render nested reply trees recursively without a full refresh

## Notes

- The project is structured for a large social feed workload where reads are far more frequent than writes.
- API responses are normalized so the frontend can update one post or comment thread immediately after a mutation.
- Uploaded images are exposed through the Laravel storage symlink at `public/storage`.
