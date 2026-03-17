# MiniX — Supabase & Project Documentation

## Overview

**MiniX** is a social media-style web application built with **React 19**, **Vite 7**, **Tailwind CSS 4**, and **Supabase** as the backend. It allows users to sign up, log in, and create/view posts in a feed — similar to X (formerly Twitter).

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| Vite | 7.2.4 | Build tool / dev server |
| Tailwind CSS | 4.1.18 | Utility-first CSS |
| Supabase JS | 2.90.0 | Backend-as-a-service (database, auth, realtime) |
| React Router DOM | 7.12.0 | Client-side routing |
| bcryptjs | 3.0.3 | Password hashing |

---

## Supabase Configuration

**File:** `supabaseServer/supabase.jsx`

The Supabase client is initialized using environment variables:

```
VITE_SUPABASE_URL          — Supabase project URL
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY  — Supabase anon/public key
```

> **Note:** You need a `.env` file in the project root (`miniX/.env`) with these values for the app to work.

---

## Supabase Database Schema (Verified from Supabase MCP)

**Project URL:** `https://kfktmomcdwghdweweelf.supabase.co`

### Table: `userInfo`

Stores user account data. **RLS: Disabled** | **Rows: 0**

| Column | Type | Options | Description |
|---|---|---|---|
| `id` | bigint (int8) | PK, identity (BY DEFAULT) | Auto-generated primary key |
| `firstName` | varchar | updatable | User's first name |
| `lastName` | varchar | updatable | User's last name |
| `userName` | varchar | updatable, **unique** | Username (used for login) |
| `emailAddress` | varchar | updatable | Email address |
| `password` | varchar | updatable | Bcrypt-hashed password |

**Used in:**
- `signup.jsx` — insert new user, check for duplicate email/username
- `login.jsx` — query by `userName`, verify password with bcrypt
- `Homepage.jsx` — fetch all users to map `id → userName` for post display

---

### Table: `indivPost`

Stores individual user posts. **RLS: Disabled** | **Rows: 0**

| Column | Type | Options | Description |
|---|---|---|---|
| `id` | bigint (int8) | PK, identity (BY DEFAULT) | Auto-generated primary key |
| `user_id` | bigint (int8) | updatable | References `userInfo.id` |
| `post` | text | updatable | The post content |
| `postLike` | smallint (int2) | nullable, updatable, default `0` | Like count (not yet used in code) |
| `date` | timestamp | nullable, updatable, default `now()` | Post creation timestamp |

**Used in:**
- `post.jsx` — insert new post with `user_id` and `post` content
- `Homepage.jsx` — fetch all posts, join with userInfo for display

---

### Table: `user` (Unused)

This table exists in the database but is **not referenced anywhere in the codebase**. It may be leftover from early development.

| Column | Type | Options | Description |
|---|---|---|---|
| `id` | bigint (int8) | PK, identity (BY DEFAULT) | Auto-generated primary key |
| `name` | varchar | updatable | Name field |
| `surname` | varchar | updatable | Surname field |

**RLS: Disabled** | **Rows: 0**

---

## Supabase Features Used

### 1. Database Queries (PostgREST)
- **SELECT** — fetching users and posts
- **INSERT** — creating new users and posts
- **Filtering** — `.eq()` for matching by username/email
- **Limiting** — `.limit(1)` for existence checks

### 2. Realtime Subscriptions
Used in `Homepage.jsx` to listen for live changes:

```js
supabase.channel('indivPost-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'indivPost' }, callback)
  .subscribe()

supabase.channel('userInfo-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'userInfo' }, callback)
  .subscribe()
```

This enables **live feed updates** — when any user creates a post, all connected clients see it without refreshing.

> **Requirement:** Realtime must be enabled on the `indivPost` and `userInfo` tables in the Supabase Dashboard (Database → Replication).

### 3. Polling Fallback
In addition to realtime, the Homepage polls every **5 seconds** via `setInterval(fetchPosts, 5000)` as a fallback.

---

## Authentication Flow

MiniX uses a **custom authentication system** (not Supabase Auth):

1. **Signup** (`signup.jsx`):
   - Validates all fields (name, username, email format, password length ≥ 6)
   - Checks for duplicate email and username via Supabase queries
   - Hashes password with `bcrypt.hash(password, 10)`
   - Inserts new row into `userInfo`

2. **Login** (`login.jsx`):
   - Queries `userInfo` by `userName`
   - Compares entered password against stored hash via `bcrypt.compare()`
   - On success, stores full user object in `localStorage` as `userData`
   - Navigates to `/homepage`

3. **Session persistence**:
   - User data is stored in `localStorage` (`userData` key)
   - Components like `post.jsx` read from `localStorage` to get `user.id` and `user.firstName`

> **⚠️ Security Note:** Passwords are hashed client-side with bcrypt, but the hashed passwords are stored in a table accessible via the Supabase public/anon key. Row-Level Security (RLS) policies should be configured to restrict access to the `password` column.

---

## Application Routes

| Path | Page Component | Description |
|---|---|---|
| `/` | `LandingPage` → `Login` | Login screen (default landing) |
| `/signup` | `SignupPage` → `Signup` | Account creation |
| `/homepage` | `Homepage` | Main feed with posts, navigation, create post |
| `/settings` | `Settings` | Settings page (currently empty) |

---

## Component Architecture

```
App.jsx
└── AppRoutes.jsx
    ├── LandingPage.jsx
    │   └── Login (login.jsx)
    │       └── loginInputs.jsx
    ├── SignupPage.jsx
    │   └── Signup (signup.jsx)
    │       └── signupInputs.jsx
    ├── Homepage.jsx
    │   ├── Navigation (navigation.jsx)
    │   │   └── navigationButton.jsx
    │   ├── UserPost (userpost.jsx)  ← renders each post
    │   └── PostContainer (postContainer.jsx)
    │       └── Post (post.jsx)  ← create new post form
    └── Settings.jsx (empty)
```

---

## Environment Setup (for new device)

1. Clone the repository
2. `cd miniX`
3. `npm install`
4. Create a `.env` file in the `miniX/` root:

```env
VITE_SUPABASE_URL=https://kfktmomcdwghdweweelf.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key_here
```

5. `npm run dev` to start the development server

---

## Security Audit (from Supabase Advisors)

### Errors (Critical)

| Issue | Table | Detail |
|---|---|---|
| **RLS Disabled** | `userInfo` | Public table without Row-Level Security |
| **RLS Disabled** | `indivPost` | Public table without Row-Level Security |
| **RLS Disabled** | `user` | Public table without Row-Level Security |
| **Sensitive Column Exposed** | `userInfo.password` | Password hashes accessible via public API |

### Warnings

| Issue | Detail |
|---|---|
| **Leaked Password Protection Disabled** | Supabase Auth's HaveIBeenPwned check is off |

> **⚠️ Action Required:** Enable RLS on all tables and create appropriate policies. Without RLS, anyone with the anon key can read all data including password hashes.

---

## Supabase Dashboard Checklist

- [x] `userInfo` table exists with columns: `id`, `firstName`, `lastName`, `userName`, `emailAddress`, `password`
- [x] `indivPost` table exists with columns: `id`, `post`, `user_id`, `postLike`, `date`
- [x] `indivPost.date` has a default value of `now()`
- [x] `indivPost.postLike` has a default value of `0`
- [ ] `indivPost.user_id` should have a foreign key to `userInfo.id`
- [ ] Realtime should be enabled for both `userInfo` and `indivPost` tables
- [ ] **RLS must be enabled** on all three tables with proper policies
- [ ] Consider removing unused `user` table
- [ ] `postLike` column exists in DB but is not yet used in the frontend code
