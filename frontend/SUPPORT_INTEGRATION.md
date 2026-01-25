Integration notes

- Files added:
  - src/api/support.ts  -> API helpers for support endpoints
  - src/components/SupportWidget.tsx  -> Floating widget for users to start chat
  - src/components/SupportChatWindow.tsx -> Chat window that loads history and connects socket

- How to use:
  1. Ensure the user is authenticated and `accessToken` and `id` are available in `localStorage`.
  2. Import and mount the widget somewhere global (e.g. in `App.tsx`):

     import SupportWidget from "@/components/SupportWidget";
     ...
     <SupportWidget />

  3. Start the frontend and backend servers. Socket.IO client connects to backend at `http://localhost:5000/support` (same as existing admin socket setup).

- Dependencies:
  - `socket.io-client` is required (frontend). Install if missing:

    npm install socket.io-client

- Backend notes:
  - Fixed several bugs in `backend/controllers/support_chat.controller.js`:
    - Imported `SupportChatMessage` model for message fetching
    - Scoped locking to a single chat during takeover
    - Fixed transaction usage in `acceptChat`

- Next steps / optional improvements:
  - Add nicer UI and handle offline/error UX.
  - Add presence/typing indicators.
  - Ensure CORS/base URL config if backend runs on a different host.

If you want, I can open a PR, wire the widget into `App.tsx`, or add tests.
