# TripBuddies

Private group web app for trips. Plain ES modules, no build step. Backend: Firebase (Anonymous Auth + Firestore + Storage).

## Modules
| File | Feature |
|---|---|
| `js/modules/groups.js` | Create/join groups, admin role, live sync |
| `js/modules/photos.js` | Group photo sharing |
| `js/modules/location.js` | Admin shares location |
| `js/modules/schedule.js` | Meal times + reminder 10 min before |
| `js/modules/expenses.js` | Split expenses, author-only control |
| `js/modules/explore.js` | Nearby places, restaurants, activities |
| `js/modules/sos.js` | Emergency alerts + SMS to third person |
| `js/app.js` | Integration (tabs, rendering, events) |
| `js/firebase.js`, `js/config.js` | Backend layer and config |

## Setup
1. Create a Firebase project at https://console.firebase.google.com.
2. Authentication > Sign-in method: enable **Anonymous**.
3. Build **Firestore Database** (production mode) and **Storage** (Storage needs the Blaze plan; free quota still applies).
4. Project settings > Your apps > Web app: copy the config into `js/config.js`.
5. Publish rules: paste `firestore.rules` and `storage.rules` in the console, or run `npm i -g firebase-tools && firebase login && firebase use <project-id> && firebase deploy --only firestore:rules,storage`.
6. Push to GitHub, then Settings > Pages > Source: **GitHub Actions**. Live at `https://<user>.github.io/<repo>/`.
7. Firebase Authentication > Settings > Authorized domains: add `<user>.github.io`.

## Limits
- Reminders fire only while the app is open in the browser (true push needs Firebase Cloud Messaging).
- SMS opens the phone's messaging app with the text prepared; the person taps send.
- Anonymous login ties identity to the browser; clearing site data means rejoining with the group code.
