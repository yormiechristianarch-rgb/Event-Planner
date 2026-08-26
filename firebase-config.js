// ============================================================
// MY EVENT PLANNER — Firebase Configuration
// Replace the placeholder values below with your actual Firebase
// project credentials from https://console.firebase.google.com
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyAa4vr_eQzT_Pm7wNBqSf8_wX4MIFleCIo",
  authDomain: "event-planner-86414.firebaseapp.com",
  projectId: "event-planner-86414",
  storageBucket: "event-planner-86414.firebasestorage.app",
  messagingSenderId: "1049519966319",
  appId: "1:1049519966319:web:39e34c2b1073cbee6de59a",
  measurementId: "G-ZLDSX8D49S"
};

// ---- Initialize Firebase ----
firebase.initializeApp(firebaseConfig);

// ---- Firebase service references (globals used by all modules) ----
const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence (best-effort; silent on unsupported browsers)
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  if (err.code !== 'failed-precondition' && err.code !== 'unimplemented') {
    console.warn('Firestore persistence error:', err.code);
  }
});

// ============================================================
// Collection name constants — used throughout every module
// ============================================================
const COLLECTIONS = {
  USERS:       'users',
  EVENTS:      'events',
  CLIENTS:     'clients',
  GUESTS:      'guests',
  VENDORS:     'vendors',
  VENUES:      'venues',
  TASKS:       'tasks',
  EXPENSES:    'expenses',
  PAYMENTS:    'payments',
  INVITATIONS: 'invitations',
  RSVPS:       'rsvps',
  NOTIFICATIONS:'notifications',
  SETTINGS:    'settings',
  EVENT_MEDIA: 'eventMedia',
  DOCUMENTS:   'documents',
  TIMELINE:    'timeline'
};

// ============================================================
// User role constants
// ============================================================
const ROLES = {
  ADMIN:   'administrator',
  PLANNER: 'event_planner',
  STAFF:   'staff',
  CLIENT:  'client'
};

// ============================================================
// Global auth state — set by onAuthStateChanged below.
// Every module reads these globals directly.
// ============================================================
let currentUser        = null;
let currentUserProfile = null;

// ============================================================
// Role-check helpers (client-side mirrors of Firestore rules)
// ============================================================
function hasRole(...roles) {
  return !!(currentUserProfile && roles.includes(currentUserProfile.role));
}
function isAdmin()   { return hasRole(ROLES.ADMIN); }
function isPlanner() { return hasRole(ROLES.ADMIN, ROLES.PLANNER); }
function isStaff()   { return hasRole(ROLES.ADMIN, ROLES.PLANNER, ROLES.STAFF); }

// ============================================================
// Global currency — read from Firestore settings on load.
// formatCurrency() in utils.js reads this value.
// ============================================================
let APP_CURRENCY = 'USD';

// ============================================================
// Auth state listener
// Runs once on every page load. Sets globals, then calls
// window.onAuthReady(user, profile) so each page can react.
// ============================================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    try {
      const doc = await db.collection(COLLECTIONS.USERS).doc(user.uid).get();
      if (doc.exists) {
        currentUserProfile = { id: doc.id, ...doc.data() };
      } else {
        // Profile missing — create a minimal one so the app doesn't crash
        currentUserProfile = {
          id:          user.uid,
          uid:         user.uid,
          displayName: user.displayName || user.email,
          email:       user.email,
          role:        ROLES.CLIENT,
          status:      'active'
        };
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
      currentUserProfile = {
        id:          user.uid,
        uid:         user.uid,
        displayName: user.displayName || user.email,
        email:       user.email,
        role:        ROLES.CLIENT,
        status:      'active'
      };
    }

    // Load app-wide settings (currency, brand colours, etc.)
    try {
      const settingsDoc = await db.collection(COLLECTIONS.SETTINGS).doc('app').get();
      if (settingsDoc.exists) {
        const s = settingsDoc.data();
        if (s.currency)        APP_CURRENCY = s.currency;
        if (s.primaryColor)    document.documentElement.style.setProperty('--primary',   s.primaryColor);
        if (s.secondaryColor)  document.documentElement.style.setProperty('--secondary', s.secondaryColor);
      }
    } catch (_) { /* non-fatal — settings may not exist yet */ }

  } else {
    currentUser        = null;
    currentUserProfile = null;
  }

  // Notify the page that auth is ready
  if (typeof window.onAuthReady === 'function') {
    window.onAuthReady(currentUser, currentUserProfile);
  }
});
