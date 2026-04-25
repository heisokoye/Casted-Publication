# Maincasted Web App

Marketing site and admin surface for Maincasted, built with React 18 + Vite. The project ships as a Progressive Web App (PWA) and now supports Web Push notifications delivered through Firebase Cloud Messaging (FCM).

## Requirements

- Node.js 18+
- npm 9+
- Firebase project with Web configuration (apiKey, etc.)
- Firebase Cloud Messaging enabled with a generated VAPID key pair
- HTTPS origin (or `localhost`) for push to work

## Getting Started

```bash
npm install
npm run dev
```

The site is served at `http://localhost:5173` by default.

## Background Notifications Overview

1. **Client-side Service Workers**
   - `service-worker.js` (registered in `src/main.jsx`) handles offline caching/PWA features.
   - `firebase-messaging-sw.js` (registered in `src/App.jsx`) is dedicated to background push delivery. It receives payloads from FCM and turns them into Notifications, even when the app tab is closed.

2. **Permission + Token Flow**
   - When the React app boots, it registers the messaging service worker, requests Notification permission (only once), and calls `getToken` with your VAPID key plus the SW registration.
   - The generated token is POSTed to the FCM helper server (`/store-token`). Tokens are re-used until permission is revoked.
   - Foreground messages are surfaced using the Notification API as well.

3. **Backend Push API**
   - The `fcm-server` folder ships a lightweight Express + `firebase-admin` service that stores tokens in-memory and exposes `/send-to-all` for broadcasting notifications.
   - Deploy it to a host of your choice (Railway, Render, etc.) and expose the base URL via `VITE_FCM_SERVER_URL` in your front-end environment.
   - For instructions tailored to common hosts, see `fcm-server/README.md`.

## Configuring Notifications

| Step | Description |
| ---- | ----------- |
| 1 | Create / configure a Firebase project. Enable Cloud Messaging and copy the Web credentials into `src/Firebase.jsx` (already wired for `castedwebsite`). |
| 2 | In Firebase console, generate a Web Push certificate and replace `VAPID_KEY` in `src/App.jsx` if you rotate keys. |
| 3 | Deploy the `fcm-server` microservice and note its URL. |
| 4 | Set `VITE_FCM_SERVER_URL` in your `.env` or hosting provider (Vercel) so the client posts tokens to the correct backend. |
| 5 | Build/deploy the React app over HTTPS. Users are prompted to allow notifications; background pushes will then appear via the OS tray. |

## Testing Push Locally

1. Start the Express helper: `cd fcm-server && npm install && npm start`.
2. In another terminal run `npm run dev` for the React app (served on HTTPS via `vite --host --https` if you need to mimic production).
3. Load the site, accept the notification permission prompt, and check the FCM server logs for `Token stored`.
4. Call `POST /send-to-all` with `{ "title": "Hello", "body": "Sent from local server" }` using curl or VS Code REST client.

## Deployment

- **Frontend**: Vercel (recommended). Ensure `VITE_FCM_SERVER_URL` is configured, and that the Firebase config matches the production project.
- **Push Server**: follow the provider-specific steps documented in `fcm-server/README.md`. The only required env var is `FIREBASE_SERVICE_ACCOUNT` (JSON string) or a path to the credential file.

## Troubleshooting

- Permission denied: Users must manually re-enable notifications in the browser site settings.
- Token missing: Ensure the messaging service worker is reachable at `/firebase-messaging-sw.js` and that the site is served via HTTPS.
- Background notifications not appearing: Check browser console for `Firebase Messaging service worker registration failed` or look at the server response from `/send-to-all`.

Refer to the Firebase docs for deeper debugging: [Web Push with FCM](https://firebase.google.com/docs/cloud-messaging/js/client).
