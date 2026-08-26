# MY EVENT PLANNER — Setup Guide

## Quick Start

### 1. Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it (e.g. `my-event-planner`)
3. Enable Google Analytics (optional) → Create project

### 2. Enable Firebase Services
In your Firebase project console:

**Authentication**
- Sidebar → Authentication → Get started
- Sign-in method → Email/Password → Enable → Save

**Firestore Database**
- Sidebar → Firestore Database → Create database
- Choose **Start in test mode** (then deploy proper rules later)
- Select your region → Done

**Storage**
- Sidebar → Storage → Get started
- Accept default rules → Choose region → Done

### 3. Get Your Firebase Config
1. Project Settings (gear icon) → Your apps → Web app (`</>`)
2. Register app name (e.g. `MY EVENT PLANNER`)
3. Copy the `firebaseConfig` object

### 4. Update `firebase-config.js`
Open `firebase-config.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5. Deploy Security Rules
Install Firebase CLI if not already installed:
```bash
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore + Storage + Hosting
firebase deploy --only firestore:rules,storage
```

### 6. Create the First Admin User
1. Open `login.html` → click "Create one" → register with your email
2. In Firebase Console → Firestore → `users` collection
3. Find your user document → Edit the `role` field to `administrator`
4. Refresh the app — you now have admin access

### 7. Open the Application
Simply open `login.html` in a browser, or deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

---

## File Structure

```
Event Planner/
├── index.html              # Main app shell
├── login.html              # Login page
├── register.html           # Registration page
├── forgot-password.html    # Password reset
├── event-public.html       # Public event page
├── rsvp-public.html        # Public RSVP page
├── invitation-public.html  # Public invitation page
├── firebase-config.js      # Firebase initialization
├── firebase.json           # Firebase project config
├── firestore.rules         # Firestore security rules
├── storage.rules           # Firebase Storage rules
├── css/
│   └── style.css           # All styles
└── js/
    ├── utils.js             # Shared utilities
    ├── app.js               # App controller / router
    └── modules/
        ├── dashboard.js
        ├── events.js
        ├── calendar.js
        ├── clients.js
        ├── guests.js
        ├── vendors.js
        ├── venues.js
        ├── tasks.js
        ├── timeline.js
        ├── budget.js
        ├── rsvp.js
        ├── invitations.js
        ├── gallery.js
        ├── documents.js
        ├── notifications.js
        ├── reports.js
        ├── admin.js
        ├── settings.js
        └── profile.js
```

## User Roles

| Role | Permissions |
|------|-------------|
| **Administrator** | Full access — manage users, all data, settings |
| **Event Planner** | Create/manage events, clients, vendors, budgets, etc. |
| **Staff** | Read access + update task status |
| **Client** | Limited — can view their own events (via public pages) |

## Firestore Collections

| Collection | Description |
|------------|-------------|
| `users` | User profiles and roles |
| `events` | Event records |
| `clients` | Client profiles |
| `guests` | Guest lists and RSVPs |
| `vendors` | Vendor directory |
| `venues` | Venue records |
| `tasks` | Event tasks and checklists |
| `timeline` | Event timeline milestones |
| `expenses` | Expense records |
| `payments` | Payment records |
| `invitations` | Digital invitation designs |
| `rsvps` | RSVP submissions |
| `notifications` | System notifications |
| `settings` | Application settings |
| `eventMedia` | Media file metadata |
| `documents` | Document file metadata |
