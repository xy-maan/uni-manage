# UniManage API Documentation

## Navigation

- [1. Authentication & Users](#1-authentication--users)
  - [Base URL](#base-url)
  - [Authentication](#authentication)
  - [Google OAuth Complete Flow](#google-oauth-complete-flow)
  - [Endpoints](#endpoints)
  - [Token Management](#token-management)
  - [Quick Reference](#quick-reference)
  - [Environment Setup](#environment-setup)
  - [Common Errors](#common-errors)
- [2. Community APIs](#2-community-apis)
  - [Posts & Feed](#posts--feed)
  - [Interactions](#interactions)
  - [Metadata Selectors](#metadata-selectors)
- [3. Projects APIs](#3-projects-apis)
  - [Teams CRUD](#31-teams-crud)
  - [Membership Actions](#32-membership-actions)
  - [Supervisor Requests](#33-supervisor-requests)
  - [Availability Lookups](#34-availability-lookups)
  - [My Inbox](#35-my-inbox)
  - [Methodology Switch](#36-methodology-switch)
  - [Team Membership Management](#37-team-membership-management)
  - [Tasks](#38-tasks)
  - [Deliverables](#39-deliverables)
  - [Sprints](#310-sprints)
  - [Phases](#311-phases)
  - [Feedback](#312-feedback)
  - [Submission & Grading](#313-submission--grading)
  - [Team Dashboard](#314-team-dashboard)
  - [Team Completion & Restore](#315-team-completion--restore)
  - [Quick Reference](#projects-quick-reference)
  - [Common Errors](#projects-common-errors)
- [4. Notifications APIs](#4-notifications-apis)
  - [Inbox](#inbox)
  - [Read Tracking](#read-tracking)
  - [Quick Reference](#notifications-quick-reference)
  - [Common Errors](#notifications-common-errors)

---

# 1. Authentication & Users

This section governs the user onboarding process. Because the app heavily relies on Google OAuth, the concept of "registration" and "login" are identical.

## Base URL

```
http://localhost:8000/api/users
```

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. After a successful Google OAuth login, you will receive:

- `access`: Valid for 1 day
- `refresh`: Valid for 7 days

Include the access token in the `Authorization` header for all protected endpoints:

```
Authorization: Bearer <access_token>
```

---

## 1.1 The User Story & Frontend Flow

### Overview

When a user visits the site for the very first time, the backend handles the Google OAuth handshake. However, Google only gives us their name and email. We do not know if they are a Student or a Supervisor (Professor/TA).

Therefore, immediately after OAuth, the frontend must check their `status`. If their profile is incomplete, the frontend must force them onto a "Complete Profile" wizard.

### Step-by-Step Frontend Implementation

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │    Google    │     │   Frontend   │
│  (Next.js)   │     │   (Django)   │     │    OAuth     │     │   Callback   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │  1. User clicks    │                    │                    │
       │  "Login with       │                    │                    │
       │   Google" link     │                    │                    │
       │ ─────────────────► │                    │                    │
       │                    │  2. Redirect to    │                    │
       │                    │  Google OAuth      │                    │
       │                    │ ─────────────────► │                    │
       │                    │                    │  3. User logs in   │
       │                    │                    │  with Google       │
       │                    │  4. Google sends   │                    │
       │                    │  auth code back    │                    │
       │                    │ ◄───────────────── │                    │
       │                    │  5. Backend        │                    │
       │                    │  exchanges code    │                    │
       │                    │  for JWT tokens    │                    │
       │                    │  6. Redirect to    │                    │
       │                    │  frontend with     │                    │
       │                    │  JWT tokens        │                    │
       │                    │ ───────────────────────────────────────►│
       │                    │                    │                    │
       │                    │                    │    7. Frontend     │
       │                    │                    │    extracts tokens │
       │                    │                    │    & checks Status │
       │                    │                    │                    │
       │                    │                    │    8. If incomplete│
       │                    │                    │    redirect to     │
       │                    │                    │    wizard          │
```

---

## 1.2 Auth Initiation

### Google Auth Redirect

**Endpoint:** `GET /auth/google/`
**Description:** Initiates Google OAuth flow.
**Usage:** Create a standard anchor link `<a href="http://localhost:8000/api/users/auth/google/">` or a simple `window.location.href`.

### Google Auth Callback

**Endpoint:** `GET /auth/google/callback/`
**Description:** DO NOT CALL THIS MANUALLY! Google calls this. The backend will parse it, create the Base User, and redirect the user back to your Next.js frontend at:
`http://localhost:3000/auth/success?access_token=<jwt>&refresh_token=<jwt>`

### Direct Google Login (Alternative)

**Endpoint:** `POST /login/google/`
**Description:** If the frontend is using a custom React Google OAuth popup library.
**Request Body:**

```json
{
	"access_token": "google_oauth_access_token",
	"id_token": "google_id_token"
}
```

---

## 1.3 Profile Completion Routing

Once the frontend stores the JWT tokens from the URL params, it must immediately determine where to send the user.

### Get User Status

**Endpoint:** `GET /status/`
**Authentication:** Required (Bearer Token)
**Success Response (200 OK):**

```json
{
	"is_complete": false,
	"role": "STUDENT", // Will be empty "" if they haven't completed their profile yet
	"email": "student@university.edu.eg",
	"full_name": "John Doe"
}
```

**Frontend Routing Logic:**

- If `is_complete == true && role == 'STUDENT'`: Redirect to `/student/dashboard`
- If `is_complete == true && role == 'SUPERVISOR'`: Redirect to `/supervisor/dashboard`
- If `is_complete == false`: Redirect to `/complete-profile` wizard.

---

## 1.4 The Profile Wizard & Schemas

The Complete Profile wizard determines all the user's specific attributes and assigns their role securely.

### Taxonomy Data Types

Our API manages standardized data objects (Departments, Academic Levels, Skills).

When creating or updating profiles, you **must submit integer IDs** for `department` and `academic_level` mapping to these predefined items.

When you query profile details via `GET /profile/student/` or `GET /profile/supervisor/`, these fields will be returned as full JSON objects:

```json
"department": {
    "id": 1,
    "name": "Computer Science"
}
```

### Complete Profile

**Endpoint:** `POST /profile/complete/`
**Authentication:** Required (Bearer Token)

#### Option A: The User is a Student

If the user selects "Student" in the frontend wizard, submit the following payload:

```json
{
	"username": "johndoe", // REQUIRED
	"first_name": "John", // REQUIRED
	"last_name": "Doe", // REQUIRED
	"bio": "I am a computer science student passionate about ML.", // Optional
	"role": "STUDENT",
	"student_id": "20241029", // Optional
	"department": 1, // Optional (Must be integer ID representing standard department)
	"academic_level": 4, // Optional (Must be integer ID representing standard academic level)
	"gpa": 3.8, // Optional
	"looking_for_course_project_team": true, // Defaults to true
	"looking_for_grad_project_team": true, // Defaults to true
	"skills": [1, 5, "GraphQL", "Docker"], // Optional: Array of Integer IDs OR Custom Strings!
	"github_url": "https://github.com/johndoe", // Optional
	"linkedin_url": "https://linkedin.com/..." // Optional
}
```

#### Option B: The User is a Supervisor

If the user selects "Supervisor" in the frontend wizard, the frontend MUST ask them for their secret Registration Code. If they are an actual Professor or an actual TA, they will have been given a code by the admins.

_Note: The frontend does not ask if they are a Professor or a TA. The code they type determines that securely on the backend!_

```json
{
	"username": "janedoe_prof", // REQUIRED
	"first_name": "Jane", // REQUIRED
	"last_name": "Doe", // REQUIRED
	"bio": "AI and Machine Learning Professor with 10 years of experience.", // Optional
	"role": "SUPERVISOR",
	"registration_code": "PROF-1234", // REQUIRED! Unlocks the role securely.
	"department": 1, // Optional (Integer ID)
	"max_team_capacity": 5, // Optional, defaults to 5
	"expertise": [2, 10, "Machine Learning"], // Optional: Array of Integer IDs OR Custom Strings!
	"scholar_url": "https://scholar.google.com/", // Optional
	"linkedin_url": "https://linkedin.com/..." // Optional
}
```

**Success Response (201 Created):**

```json
{
	"message": "Student profile created successfully"
}
```

**Error Responses:**

- `400 Bad Request`: `{ "error": "Invalid registration code." }`
- `400 Bad Request`: `{ "error": "Profile already completed" }`

---

## 1.5 Taxonomy / Dropdown Endpoints

On the Profile Wizard, you may want to prompt the user to select from a list of predefined departments or academic levels (or skills).

### Get Departments

**Endpoint:** `GET /departments/`
**Authentication:** None Required
**Success Response:**

```json
[
	{ "id": 1, "name": "Computer Science" },
	{ "id": 2, "name": "Information Systems" }
]
```

### Get Academic Levels

**Endpoint:** `GET /academic-levels/`
**Authentication:** None Required
**Success Response:**

```json
[
	{ "id": 1, "name": "Freshman (Level 1)" },
	{ "id": 4, "name": "Senior (Level 4)" }
]
```

### Search Skills

**Endpoint:** `GET /skills/search/?q=<query>`
**Authentication:** None Required
**Description:** Use this with an Async Creatable Autocomplete component (like `react-select`). It checks aliases (e.g. typing "JS" returns "JavaScript").
**Success Response:**

```json
[
	{ "id": 1, "name": "Python", "is_official": true },
	{ "id": 5, "name": "JavaScript", "is_official": true }
]
```

_Frontend Behavior:_ When the user selects "Python", extract the `id` (1) and add it to the submission array. If the user types a brand new framework that returns empty, add their raw string (e.g., "SvelteKit") to the array. The backend will parse it, create it automatically, and attach it to their profile.

---

## 1.6 Fetching and Updating Profiles (Post-Wizard)

### Get/Update Student Profile

**Endpoint:** `GET` / `PATCH /profile/student/`
**Authentication:** Required (Bearer Token)
**Success Response (GET):**

```json
{
	"user": {
		"id": 1,
		"email": "student@university.edu.eg",
		"first_name": "John",
		"last_name": "Doe",
		"role": "STUDENT"
	},
	"student_id": "20241029",
	"department": { "id": 1, "name": "Computer Science" },
	"academic_level": { "id": 4, "name": "Senior (Level 4)" },
	"gpa": 3.8,
	"looking_for_course_project_team": true,
	"looking_for_grad_project_team": true,
	"github_url": "https://github.com/...",
	"linkedin_url": "https://linkedin.com/...",
	"skills": [{ "id": 1, "name": "Python", "is_official": true }]
}
```

### Get/Update Supervisor Profile

**Endpoint:** `GET` / `PATCH /profile/supervisor/`
**Authentication:** Required (Bearer Token)
**Success Response (GET):**

```json
{
	"user": {
		"id": 2,
		"email": "prof@university.edu.eg",
		"first_name": "Jane",
		"last_name": "Doe",
		"role": "SUPERVISOR"
	},
	"title": "DOCTOR",
	"title_display": "Primary Supervisor (Professor)", // Look at this field for UI rendering
	"department": { "id": 1, "name": "Computer Science" },
	"max_team_capacity": 5,
	"scholar_url": "https://scholar.google.com/...",
	"linkedin_url": "https://linkedin.com/...",
	"expertise": [
		{ "id": 2, "name": "Artificial Intelligence", "is_official": true }
	]
}
```

## Token Management

### Storing Tokens

```typescript
// utils/auth.ts
export const setTokens = (access: string, refresh: string) => {
	localStorage.setItem('access_token', access);
	localStorage.setItem('refresh_token', refresh);
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const clearTokens = () => {
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
};
```

### Auto-Refresh with Fetch Wrapper

```typescript
// utils/api.ts
const API_BASE = 'http://localhost:8000/api/users';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
	let accessToken = getAccessToken();

	const makeRequest = async (token: string | null) => {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return fetch(`${API_BASE}${endpoint}`, {
			...options,
			headers,
		});
	};

	let response = await makeRequest(accessToken);

	if (response.status === 401) {
		const refreshToken = getRefreshToken();
		if (refreshToken) {
			const refreshResponse = await fetch(`${API_BASE}/token/refresh/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh: refreshToken }),
			});

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				setTokens(data.access, data.refresh);
				response = await makeRequest(data.access);
			} else {
				clearTokens();
				window.location.href = '/login';
			}
		}
	}

	return response;
}
```

### Logout

```typescript
// utils/auth.ts
export const logout = async () => {
	const accessToken = getAccessToken();
	const refreshToken = getRefreshToken();

	if (accessToken && refreshToken) {
		try {
			await fetch('http://localhost:8000/api/users/logout/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ refresh: refreshToken }),
			});
		} catch (e) {
			// Ignore errors, still clear tokens
		}
	}

	clearTokens();
	window.location.href = '/login';
};
```

---

## Quick Reference

| Action                    | Method | Endpoint                 | Auth |
| ------------------------- | ------ | ------------------------ | ---- |
| Start Google Login        | GET    | `/auth/google/`          | No   |
| Google Callback           | GET    | `/auth/google/callback/` | No   |
| Direct Google Login       | POST   | `/login/google/`         | No   |
| Logout                    | POST   | `/logout/`               | Yes  |
| Refresh Token             | POST   | `/token/refresh/`        | No   |
| Get User Status           | GET    | `/status/`               | Yes  |
| Complete Profile          | POST   | `/profile/complete/`     | Yes  |
| Get Student Profile       | GET    | `/profile/student/`      | Yes  |
| Update Student Profile    | PATCH  | `/profile/student/`      | Yes  |
| Get Supervisor Profile    | GET    | `/profile/supervisor/`   | Yes  |
| Update Supervisor Profile | PATCH  | `/profile/supervisor/`   | Yes  |
| Get Departments           | GET    | `/departments/`          | No   |
| Get Academic Levels       | GET    | `/academic-levels/`      | No   |

---

## Environment Setup

### Backend (.env)

```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/users/auth/google/callback/
```

### Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:8000/api/users/auth/google/callback/`
6. Copy Client ID and Client Secret to your `.env`

---

## Common Errors

| Error                       | Cause                           | Solution                                  |
| --------------------------- | ------------------------------- | ----------------------------------------- |
| `Use your .edu.eg email.`   | Non-university email            | User must login with `.edu.eg` email      |
| `access_denied`             | User cancelled Google login     | Prompt user to try again                  |
| `Profile already completed` | Calling complete endpoint twice | Check status first, redirect to dashboard |
| `401 Unauthorized`          | Expired/invalid token           | Refresh token or re-login                 |

---

**Last Updated:** April 7, 2026

---

# 2. Community APIs

**Base URL:** `/api/community`  
_(All endpoints require Bearer Token Authentication)_

## 2.1 Posts & Feed

### Get Feed

**Endpoint:** `GET /posts/`
**Authentication:** Required (Bearer Token)
**Description:** Retrieves the community feed. Automatically filters to return public posts and private posts matching the current user's email domain.
**Success Response:** List of posts including author details (`author_name`, `author_username`, `author_role`), tags, attachments, poll options, and interaction metrics (`views_count`, `upvotes_count`, `downvotes_count`, `comments_count`, `has_upvoted`, `has_downvoted`).

### Create Post

**Endpoint:** `POST /posts/`
**Authentication:** Required (Bearer Token)
**Description:** Creates a new post or poll.

**Payload (Text Post):**

```json
{
	"title": "Best practices in React?", // REQUIRED: String
	"content": "Looking for advice...", // REQUIRED when post_type is TEXT
	"post_type": "TEXT", // REQUIRED: "TEXT" or "POLL"
	"category": 1, // REQUIRED: Integer ID representing the category
	"tag_names": [1, 5, "Frontend"] // REQUIRED (min 1): Array of Integer IDs OR Custom Strings
}
```

**Payload (Poll):**

```json
{
	"title": "Which framework is better?", // REQUIRED: String
	"content": "I'm starting a new project and need advice", // Optional for polls
	"post_type": "POLL", // REQUIRED: "TEXT" or "POLL"
	"category": 2, // REQUIRED: Integer ID representing the category
	"tag_names": [3, "Next.js"], // REQUIRED (min 1): Array of Integer IDs OR Custom Strings
	"poll_option_texts": ["Next.js", "Vue.js", "Angular"] // REQUIRED for POLL: Array of strings (Minimum 2)
}
```

### Get Single Post

**Endpoint:** `GET /posts/{id}/`
**Authentication:** Required (Bearer Token)
**Description:** Retrieves the details of a single post.
**Note:** Successfully calling this endpoint automatically increments the `views_count` for that post (with a 24-hour Redis/cache-based anti-abuse limit).

### Upload Attachment

**Endpoint:** `POST /posts/{id}/upload_attachment/`
**Authentication:** Required (Bearer Token)
**Description:** Attaches a file to an existing post. Supports Drag and Drop uploads.
**Payload (Form-Data):**

- `file`: `File Object` (REQUIRED: Image or PDF file)

**Success Response:**
Returns the file URL (e.g. `/media/community/attachments/diagram.png`). Prepend the base URL (`http://localhost:8000`) before the string to view or display the file on the frontend.

---

## 2.2 Interactions

### Upvote a Post

**Endpoint:** `POST /posts/{id}/upvote/`
**Authentication:** Required (Bearer Token)
**Description:** Toggles an upvote for the current user. Removes existing downvote if present.
**Success Response:**

```json
{
	"upvotes_count": 25,
	"downvotes_count": 2,
	"has_upvoted": true,
	"has_downvoted": false
}
```

### Downvote a Post

**Endpoint:** `POST /posts/{id}/downvote/`
**Authentication:** Required (Bearer Token)
**Description:** Toggles a downvote for the current user. Removes existing upvote if present.
**Success Response:** Same structure as Upvote.

### Get Comments

**Endpoint:** `GET /posts/{id}/comments/`
**Authentication:** Required (Bearer Token)
**Description:** Retrieves all comments for a post, ordered newest first. Includes author name, username, and role in response.

### Add Comment

**Endpoint:** `POST /posts/{id}/comments/`
**Authentication:** Required (Bearer Token)
**Description:** Adds a new comment to a post.
**Payload:**

```json
{
	"content": "Here is my answer..." // REQUIRED: String
}
```

### Vote on a Poll

**Endpoint:** `POST /posts/{id}/vote-poll/`
**Authentication:** Required (Bearer Token)
**Description:** Records a user's vote on a poll. Returns an error if the user has already voted on this specific poll.
**Payload:**

```json
{
	"option_id": 5 // REQUIRED: Integer ID of the desired PollOption
}
```

---

## 2.3 Metadata Selectors

### Get Tags

**Endpoint:** `GET /tags/` or `GET /tags/?q=<query>`
**Authentication:** Required (Bearer Token)
**Description:** Returns all community tags for multi-select dropdowns. You can search tags using `?q=`. Deduplicates based on lowercase parsing backend logic. Tags returned contain `is_official` and `generated_by`.
**Usage:** Similar to skills, you can submit either existing Tag integer IDs or new raw strings when creating a post.

### Get Categories

**Endpoint:** `GET /categories/`
**Authentication:** Required (Bearer Token)
**Description:** Returns a list of available categories and their slugs for the category creation dropdown.

---

# 3. Projects APIs

**Base URL:** `/api`  
_(All endpoints require Bearer Token Authentication)_

This module covers the **team formation and supervision** flow:

- `AcademicTerm` and `Subject` taxonomy are managed via Django admin.
- `Team` is the core aggregate. It supports **soft delete** (`is_deleted=True` rows are hidden from all read endpoints).
- A database-level `UniqueConstraint` on `TeamMember` ensures a student can only ever belong to **one active GRADUATION team per academic term**.
- `django-simple-history` writes a `HistoricalTeam` row on every Team change for audit purposes.

## 3.1 Teams CRUD

### List Active Teams

**Endpoint:** `GET /teams/`
**Authentication:** Required (Bearer Token)
**Description:** Returns a paginated list (20 per page) of active (non-soft-deleted) teams. Supports the following query params via `django-filter`:

| Param           | Type    | Match      | Notes                                       |
| --------------- | ------- | ---------- | ------------------------------------------- |
| `project_type`  | String  | exact      | `COURSE` or `GRADUATION`                    |
| `status`        | String  | exact      | `FORMING`, `PENDING_SUPERVISORS`, `ACTIVE`, `COMPLETED` |
| `is_recruiting` | Boolean | exact      | `true` / `false`                            |
| `name`          | String  | icontains  | Partial, case-insensitive match             |
| `subject`       | Integer | exact      | FK id of the subject                        |
| `term`          | Integer | exact      | FK id of the academic term                  |
| `page`          | Integer | exact      | Pagination cursor (default 1)               |

**Success Response (200 OK):**

```json
{
	"count": 42,
	"next": "http://localhost:8000/api/teams/?page=3",
	"previous": "http://localhost:8000/api/teams/?page=1",
	"results": [
		{
			"id": 12,
			"name": "Code Crusaders",
			"project_type": "GRADUATION",
			"philosophy": "SPRINT",
			"status": "PENDING_SUPERVISORS",
			"description": "AI-powered plagiarism detector.",
			"board_config": { "columns": ["Todo", "Doing", "Done"] },
			"is_locked": false,
			"is_recruiting": true,
			"max_capacity": 4,
			"term": 1,
			"subject": null,
			"is_deleted": false,
			"deleted_at": null,
			"members": [
				{
					"id": 8,
					"team": 12,
					"student": 4,
					"student_username": "leader_ahmed",
					"student_full_name": "Ahmed Hassan",
					"student_avatar": "https://...",
					"role": "LEADER",
					"status": "ACCEPTED",
					"is_invite": false,
					"joined_at": "2026-06-01T10:00:00Z",
					"created_at": "2026-06-01T10:00:00Z",
					"updated_at": "2026-06-01T10:00:00Z"
				}
			],
			"supervisors": [],
			"member_count": 1,
			"has_capacity": true,
			"current_user_role": "LEADER",
			"created_at": "2026-06-01T10:00:00Z",
			"updated_at": "2026-06-01T10:00:00Z"
		}
	]
}
```

> `current_user_role` is `null` when the requester is not an accepted member of that team. Use it to drive the UI (show "Join" vs "Manage" buttons).

### Create a Team

**Endpoint:** `POST /teams/`
**Authentication:** Required (Bearer Token)
**Description:** Creates a new team. The authenticated user is **automatically inserted as `LEADER / ACCEPTED / is_invite=False`** in the same transaction.
**Payload:**

```json
{
	"name": "Code Crusaders",         // REQUIRED: String, unique
	"project_type": "GRADUATION",      // REQUIRED: "COURSE" or "GRADUATION"
	"philosophy": "SPRINT",            // OPTIONAL: "KANBAN" | "SPRINT" | "MILESTONE" (default KANBAN)
	"description": "AI plagiarism ...", // OPTIONAL
	"board_config": {},                // OPTIONAL: JSON object
	"is_recruiting": true,             // OPTIONAL (default true)
	"max_capacity": 4,                 // OPTIONAL (default 5)
	"term": 1,                         // REQUIRED: Integer ID of an AcademicTerm
	"subject": null                    // REQUIRED: must be set for COURSE, must be null for GRADUATION
}
```

**Validation Rules:**

- `COURSE` projects **must** include a non-null `subject`.
- `GRADUATION` projects **must** include a `subject` value of `null`.

**Success Response (201 Created):** Returns the full team object with `status="FORMING"` and the creator listed as the leader.

**Error Responses:**

- `400 Bad Request`: `{ "subject": ["A subject is required for COURSE projects."] }`
- `400 Bad Request`: `{ "subject": ["Subject must be null for GRADUATION projects."] }`
- `400 Bad Request`: `{ "name": ["Team with this name already exists."] }` (unique constraint)

### Retrieve a Team

**Endpoint:** `GET /teams/{id}/`
**Authentication:** Required (Bearer Token)
**Description:** Returns one team in the same shape as list items. Soft-deleted teams return `404`.

### Update a Team

**Endpoint:** `PATCH /teams/{id}/` (also `PUT`)
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Updates editable fields. If the team is currently `is_locked=True` and the requester edits `name` or `description`, the server will:

1. Apply the new values.
2. Call `team.unlock_and_require_reapproval()`:
   - `is_locked` → `false`
   - If `project_type == GRADUATION`, `status` → `PENDING_SUPERVISORS` and every supervisor's `status` is reset to `PENDING`.

**Payload:** Any subset of writable fields from the create payload. Note: `status`, `is_deleted`, `deleted_at`, `created_at`, `updated_at` are read-only.

**Error Responses:**

- `403 Forbidden`: `{ "detail": "Only the team leader can perform this action." }`
- `400 Bad Request`: `{ "detail": "Only the team leader can modify a team." }`

### Delete (Soft Delete) a Team

**Endpoint:** `DELETE /teams/{id}/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Marks the team as soft-deleted (`is_deleted=True`, `deleted_at=now`). Returns `204 No Content`.

---

## 3.2 Membership Actions

All three endpoints are nested under `/api/teams/{id}/` and share the same `Team` lookup / permission path.

### Invite a Student

**Endpoint:** `POST /teams/{id}/invite/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Leader sends a pending invite to a student. Validates against `max_capacity` and refuses if the team is locked.
**Payload:**

```json
{ "student_id": 17 }
```

**Success Response (201 Created):** Returns the new `TeamMemberSerializer` (status `PENDING`, `is_invite=true`).

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Team has reached its max capacity." }`
- `423 Locked`: `{ "detail": "Team is locked. Unlock before inviting new members." }`
- `409 Conflict`: `{ "detail": "Student already has a membership record on this team." }`

### Join a Team

**Endpoint:** `POST /teams/{id}/join/`
**Authentication:** Required (Bearer Token)
**Description:** Authenticated student creates a `PENDING` membership on the team. Refused if the team is closed to recruitment, locked, full, or the user is already a member.
**Payload:** `{}` (no body required)
**Success Response (201 Created):** Returns the new `TeamMemberSerializer`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Team is not currently recruiting." }`
- `423 Locked`: `{ "detail": "Team is locked." }`
- `400 Bad Request`: `{ "detail": "Team has reached its max capacity." }`
- `409 Conflict`: `{ "detail": "You already have a membership record on this team." }`

### Request a Supervisor

**Endpoint:** `POST /teams/{id}/request-supervisor/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Leader requests a Doctor/TA to supervise the team. For `COURSE` projects, the request is auto-accepted. For `GRADUATION` projects, the supervisor's `SupervisorProfile.max_team_capacity` is checked against their current active team count.
**Payload:**

```json
{
	"supervisor_id": 9,
	"role": "DOCTOR"
}
```

- `supervisor_id`: Integer ID of the supervisor (must have a `SupervisorProfile`).
- `role`: `"DOCTOR"` or `"TA"`.

**Success Response (201 Created):** Returns the new `TeamSupervisorSerializer`. For COURSE projects `status` is `ACCEPTED`; for GRADUATION it is `PENDING`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Supervisor has reached max team capacity (5/5)." }`
- `400 Bad Request`: `{ "detail": "User is not registered as a supervisor." }`
- `409 Conflict`: `{ "detail": "Supervisor already linked to this team." }`

---

## 3.3 Availability Lookups

Used to populate the "Invite Student" and "Request Supervisor" pickers in the UI.

### Available Students

**Endpoint:** `GET /teams/available-students/`
**Authentication:** Required (Bearer Token)
**Description:** Paginated list of `role=STUDENT` users **excluding** any student who is already an `ACCEPTED` member of an active (`is_deleted=False`) `GRADUATION` team in the **current academic term**. Optional `?q=<text>` performs an icontains search on `username`, `first_name`, `last_name`, `email`.
**Success Response (200 OK):** Standard DRF page envelope wrapping `AvailableStudentSerializer` objects.

```json
{
	"count": 120,
	"next": "...",
	"previous": null,
	"results": [
		{
			"id": 17,
			"username": "ahmed_2024",
			"full_name": "Ahmed Hassan",
			"email": "ahmed@uni.edu.eg",
			"avatar_url": "https://...",
			"student_id": "20241029",
			"department": "Computer Science",
			"academic_level": "Senior (Level 4)"
		}
	]
}
```

### Available Supervisors

**Endpoint:** `GET /teams/available-supervisors/`
**Authentication:** Required (Bearer Token)
**Query Params:**

| Param           | Type    | Default  | Notes                                                                    |
| --------------- | ------- | -------- | ------------------------------------------------------------------------ |
| `project_type`  | String  | —        | If `GRADUATION`, supervisors at `max_team_capacity` are hidden.          |
| `include_full`  | Boolean | `false`  | Set `true` to also return supervisors that have hit their capacity.      |
| `q`             | String  | —        | Free-text search across `username`, `first_name`, `last_name`, `email`.  |
| `page`          | Integer | `1`      | Pagination cursor.                                                        |

**Success Response (200 OK):**

```json
{
	"count": 18,
	"next": null,
	"previous": null,
	"results": [
		{
			"id": 9,
			"username": "dr_noha",
			"full_name": "Dr. Noha Salem",
			"email": "noha@uni.edu.eg",
			"avatar_url": "https://...",
			"title": "DOCTOR",
			"department": "Computer Science",
			"max_team_capacity": 5,
			"active_team_count": 2,
			"has_capacity": true
		}
	]
}
```

---

## 3.4 My Inbox

### List My Pending Invitations

**Endpoint:** `GET /me/invitations/`
**Authentication:** Required (Bearer Token)
**Description:** Returns a flat object containing every pending team invite addressed to the requester **and** every pending supervisor request they have received. The shape intentionally skips DRF pagination to make it a single round-trip for the inbox view.
**Success Response (200 OK):**

```json
{
	"team_invitations": [
		{
			"id": 22,
			"team": 12,
			"student": 4,
			"student_username": "leader_ahmed",
			"student_full_name": "Ahmed Hassan",
			"student_avatar": "https://...",
			"role": "MEMBER",
			"status": "PENDING",
			"is_invite": true,
			"joined_at": null,
			"created_at": "2026-06-04T09:00:00Z",
			"updated_at": "2026-06-04T09:00:00Z"
		}
	],
	"supervisor_requests": [
		{
			"id": 7,
			"team": 31,
			"supervisor": 9,
			"supervisor_username": "dr_noha",
			"supervisor_full_name": "Dr. Noha Salem",
			"supervisor_title": "DOCTOR",
			"role": "DOCTOR",
			"status": "PENDING",
			"responded_at": null,
			"created_at": "2026-06-04T08:00:00Z",
			"updated_at": "2026-06-04T08:00:00Z"
		}
	]
}
```

> The `id` field here is the `pk` of the `TeamMember` row (for `team_invitations`) or the `TeamSupervisor` row (for `supervisor_requests`). Pass the same `id` to the respond endpoint.

### Respond to an Invitation

**Endpoint:** `POST /me/invitations/{id}/respond/`
**Authentication:** Required (Bearer Token)
**Description:** Accepts or rejects one of the rows returned by `/me/invitations/`. The endpoint auto-detects whether `{id}` refers to a `TeamMember` or `TeamSupervisor` row, then enforces the capacity rules before flipping to `ACCEPTED`.
**Payload:**

```json
{ "action": "ACCEPT" }
```

- `action`: `"ACCEPT"` or `"REJECT"`.

**Success Response (200 OK):** Returns the updated `TeamMemberSerializer` or `TeamSupervisorSerializer` (status now `ACCEPTED` or `REJECTED`).

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Team has reached its max capacity." }`
- `400 Bad Request`: `{ "detail": "Supervisor has reached max team capacity." }`
- `423 Locked`: `{ "detail": "Team is locked." }`
- `404 Not Found`: `{ "detail": "No pending invitation found with the given id." }`

---

<a id="projects-quick-reference"></a>

## 3.6 Methodology Switch

Every team picks a **work methodology** (`KANBAN`, `SPRINT`, or `MILESTONE`) that drives its dashboard layout. The methodology is set at create time and switched via this dedicated endpoint — direct PATCH of `philosophy` on the team object returns `400`.

### Select Methodology

**Endpoint:** `POST /teams/{id}/select-methodology/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Switches the team's work methodology. Resets `board_config` to the new methodology's default columns in the same transaction.
**Throttle:** 5 / hour / user.
**Payload:**

```json
{ "philosophy": "MILESTONE" }
```

- `philosophy`: `"KANBAN" | "SPRINT" | "MILESTONE"`.

**Behaviour — incompatible work items:**

Switching is refused with `409 Conflict` if any work-item kind incompatible with the new methodology exists on the team:

| Switching to | Refuses if team has |
| ------------ | ------------------- |
| `KANBAN`     | any Sprints or Phases |
| `SPRINT`     | any Phases |
| `MILESTONE`  | any Sprints |

When blocked, the response body enumerates what is blocking the switch:

```json
{
  "detail": "Cannot switch methodology with active incompatible work items.",
  "blocked_by": [
    { "kind": "phases", "count": 3 }
  ]
}
```

On success, all `Task.sprint` / `Task.phase` / `Deliverable.sprint` / `Deliverable.phase` FKs are cleared and `board_config` is replaced with the new methodology's default columns.

**Success Response (200 OK):** Returns the full updated `TeamSerializer`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Team is already using this methodology." }`
- `409 Conflict`: see body above.
- `403 Forbidden`: requester is not the team leader.
- `429 Too Many Requests`: throttle exceeded.

---

## 3.7 Team Membership Management

Three leader-only actions for changing team composition outside the initial invite / join flow. All wrap `@transaction.atomic` + `select_for_update` and emit notifications.

### Transfer Leadership

**Endpoint:** `POST /teams/{id}/transfer-leadership/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Promotes an accepted member to leader and demotes the current leader to regular member.
**Throttle:** 30 / hour / user (shared with kick / leave).
**Payload:**

```json
{ "new_leader_membership_id": 47 }
```

- `new_leader_membership_id`: integer `pk` of an `ACCEPTED` `TeamMember` row on the same team.

**Success Response (200 OK):**

```json
{
  "detail": "Leadership transferred.",
  "leader": { "id": 47, "team": 12, "student": 9, "role": "LEADER", "status": "ACCEPTED", "...": "..." }
}
```

**Error Responses:**

- `400 Bad Request`: target membership not found, or is already the leader.
- `403 Forbidden`: requester is not the team leader.

### Kick a Member

**Endpoint:** `DELETE /teams/{id}/members/{member_id}/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Marks an accepted member's `TeamMember` row as `REJECTED`. The leader cannot kick themselves; transfer leadership first.
**Throttle:** 30 / hour / user.
**URL Params:** `member_id` is the `TeamMember.pk`.
**Success Response (200 OK):** `{ "detail": "Member removed from team." }`

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Cannot kick the team leader. Transfer leadership first." }`
- `404 Not Found`: no accepted membership with that id on this team.

### Leave a Team

**Endpoint:** `POST /teams/{id}/leave/`
**Authentication:** Required (Bearer Token)
**Description:** Removes the requester from the team. If the requester is the current leader, they **must** provide `new_leader_membership_id` in the same request to transfer leadership before leaving.
**Throttle:** 30 / hour / user.
**Payload (leader):**

```json
{ "new_leader_membership_id": 47 }
```

**Payload (regular member):** `{}` (no body required).

**Success Response (200 OK):** `{ "detail": "You have left the team." }`

**Error Responses:**

- `400 Bad Request`: not an accepted member of the team.
- `400 Bad Request`: leader must transfer leadership first.
- `400 Bad Request`: successor membership not found.

---

## 3.8 Tasks

The primary work-item on the team board. A `Task` belongs to one team, optionally to a `Sprint` (SPRINT philosophy) or `Phase` (MILESTONE philosophy). KANBAN philosophy requires neither.

### List Tasks for a Team

**Endpoint:** `GET /tasks/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Description:** Returns all tasks for a team. The team is resolved from `?team=` (top-level router) **or** from a nested `/teams/{id}/tasks/` URL — both forms are supported.
**Query Params:**

| Param    | Type    | Notes                                                                 |
| -------- | ------- | --------------------------------------------------------------------- |
| `team`   | Integer | Required when using the top-level router.                              |
| `status` | String  | `TODO` / `IN_PROGRESS` / `IN_REVIEW` / `BLOCKED` / `DONE`              |
| `sprint` | Integer | Filter by sprint id.                                                   |
| `phase`  | Integer | Filter by phase id.                                                    |
| `assignee` | Integer | Filter by assignee user id.                                          |
| `page`   | Integer | Pagination cursor.                                                    |

**Success Response (200 OK):** Standard DRF page envelope wrapping `TaskSerializer` objects.

### Create a Task

**Endpoint:** `POST /tasks/?team={id}` (or `POST /teams/{id}/tasks/`)
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Payload:**

```json
{
  "title": "Update API documentation",       // REQUIRED
  "description": "Cover all new endpoints",  // OPTIONAL
  "status": "TODO",                          // OPTIONAL, default TODO
  "priority": "MEDIUM",                      // OPTIONAL, default MEDIUM
  "labels": ["docs", "backend"],             // OPTIONAL, list of strings
  "due_date": "2026-07-15",                  // OPTIONAL
  "estimate": 4,                             // OPTIONAL, story points / hours
  "order": 0,                                // OPTIONAL, position in column
  "sprint": 3,                              // OPTIONAL, SPRINT philosophy only
  "phase": null,                             // OPTIONAL, MILESTONE philosophy only
  "assignee_ids": [4, 7, 11],                // OPTIONAL, list of user ids
  "parent_task": null                        // OPTIONAL, self-FK for sub-tasks
}
```

**Validation Rules:**

- `KANBAN` teams → `sprint` and `phase` MUST be null.
- `SPRINT` teams → `phase` MUST be null; `sprint` SHOULD be set.
- `MILESTONE` teams → `sprint` MUST be null; `phase` SHOULD be set.
- `parent_task` (if set) must belong to the same team.

**Success Response (201 Created):** Returns the new `TaskSerializer`.

### Retrieve / Update / Delete a Task

**Endpoint:** `GET / PATCH / DELETE /tasks/{id}/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the owning team. Update / delete are **member-only** (supervisors are read-only on tasks).
**Success Response:** Returns the `TaskSerializer`.

### Transition a Task (status change with WIP limits)

**Endpoint:** `POST /tasks/{id}/transition/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Description:** Changes the task's `status`. Enforces WIP limits configured in the team's `board_config.columns[].wip_limit` (only kanban / sprint columns have limits; moving into a full column returns 409).
**Payload:**

```json
{ "status": "IN_PROGRESS" }
```

**Success Response (200 OK):** Returns the updated `TaskSerializer`. The `completed_at` field is auto-stamped when status becomes `DONE`, and cleared otherwise.

**Error Responses:**

- `409 Conflict`: `{ "detail": "WIP limit reached for column 'In Progress' (4/4)." }`

### Reorder Tasks

**Endpoint:** `POST /tasks/reorder/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Description:** Reorder tasks within or across columns. The payload is the ordered list of task ids.
**Payload:**

```json
{ "order": [101, 88, 92, 75] }
```

**Success Response (200 OK):** `{ "updated": 4 }`

### Task Object Shape

```json
{
  "id": 101,
  "team": 12,
  "title": "Update API documentation",
  "description": "Cover all new endpoints",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "assignees": [
    { "id": 4, "username": "ahmed_2024", "full_name": "Ahmed Hassan", "avatar_url": "..." }
  ],
  "labels": ["docs", "backend"],
  "due_date": "2026-07-15",
  "estimate": 4,
  "order": 2,
  "parent_task": null,
  "sprint": null,
  "phase": null,
  "created_by": 4,
  "created_by_username": "ahmed_2024",
  "completed_at": null,
  "column_id": "in_progress",
  "is_overdue": false,
  "created_at": "2026-06-13T08:00:00Z",
  "updated_at": "2026-06-13T08:30:00Z"
}
```

- `column_id` is derived from `status` and is a stable id used by the kanban / sprint dashboards to look up the matching `board_config.columns[]` entry. Mapping: `TODO→todo`, `IN_PROGRESS→in_progress`, `IN_REVIEW→review`, `BLOCKED→in_progress`, `DONE→done`.
- `is_overdue` is `true` when `due_date` is in the past and `status != DONE`.

---

## 3.9 Deliverables

Universal across all methodologies. A concrete output a team must produce — shown in every dashboard's "Deliverables" panel. On MILESTONE philosophy, deliverables are nested under Phases; on SPRINT they are linked to a Sprint; on KANBAN they are a flat list.

### List Deliverables for a Team

**Endpoint:** `GET /deliverables/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Query Params:** `team` (required at top level), `status`, `sprint`, `phase`, `page`.

### Create a Deliverable

**Endpoint:** `POST /deliverables/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Payload:**

```json
{
  "title": "System Architecture Document",   // REQUIRED
  "description": "High-level architecture",   // OPTIONAL
  "status": "PENDING",                       // OPTIONAL, default PENDING
  "due_date": "2026-08-30",                  // OPTIONAL
  "order": 0,                                // OPTIONAL
  "sprint": null,                            // OPTIONAL, SPRINT only
  "phase": 2                                 // OPTIONAL, MILESTONE only
}
```

The same philosophy invariants as Tasks apply (KANBAN forbids `sprint`/`phase`, etc.).

### Retrieve / Update / Delete a Deliverable

**Endpoint:** `GET / PATCH / DELETE /deliverables/{id}/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team. Update / delete are member-only.

### Mark a Deliverable Complete

**Endpoint:** `POST /deliverables/{id}/complete/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Description:** Flips status from `PENDING` / `IN_PROGRESS` to `COMPLETED`. Stamps `completed_at` and `completed_by`.
**Success Response (200 OK):** Returns the updated `DeliverableSerializer`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Deliverable is already completed/approved." }`

### Approve a Deliverable (Supervisor)

**Endpoint:** `POST /deliverables/{id}/approve/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted **supervisor** of the team.
**Description:** One-way transition from `COMPLETED` to `APPROVED`. Stamps `approved_at` and `approved_by`. To reject, the supervisor uses the Feedback API with `kind=REJECTION` instead.
**Success Response (200 OK):** Returns the updated `DeliverableSerializer`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Only completed deliverables can be approved." }`

### Deliverable Object Shape

```json
{
  "id": 5,
  "team": 12,
  "title": "System Architecture Document",
  "description": "High-level architecture",
  "status": "APPROVED",
  "due_date": "2026-08-30",
  "order": 0,
  "sprint": null,
  "phase": 2,
  "completed_at": "2026-08-15T10:00:00Z",
  "completed_by": 4,
  "completed_by_username": "ahmed_2024",
  "approved_at": "2026-08-16T14:00:00Z",
  "approved_by": 9,
  "approved_by_username": "dr_noha",
  "created_at": "2026-06-13T08:00:00Z",
  "updated_at": "2026-08-16T14:00:00Z"
}
```

---

## 3.10 Sprints

A time-boxed iteration. Only meaningful for teams with `philosophy=SPRINT`. The DB-level `UniqueConstraint` enforces that only one `Sprint.status=ACTIVE` exists per team at a time.

### List Sprints

**Endpoint:** `GET /sprints/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Query Params:** `team`, `status` (`UPCOMING` / `ACTIVE` / `COMPLETED`), `page`.

### Create a Sprint

**Endpoint:** `POST /sprints/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Description:** Server refuses to create on a team whose philosophy is not `SPRINT`.
**Payload:**

```json
{
  "name": "Sprint 4: Advanced Features",       // REQUIRED
  "goal": "Implement OAuth and rate limiting",// OPTIONAL
  "start_date": "2026-07-01",                 // REQUIRED
  "end_date": "2026-07-14",                   // REQUIRED
  "status": "UPCOMING",                       // OPTIONAL, default UPCOMING
  "order": 0                                  // OPTIONAL
}
```

**Success Response (201 Created):** Returns the new `SprintSerializer`. `end_date` must be on or after `start_date`.

### Retrieve / Update / Delete a Sprint

**Endpoint:** `GET / PATCH / DELETE /sprints/{id}/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team. Update / delete are **leader-only**.

### Start a Sprint

**Endpoint:** `POST /sprints/{id}/start/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Atomic flip — any current ACTIVE sprint on the team becomes `COMPLETED`; this sprint becomes `ACTIVE`.
**Success Response (200 OK):** Returns the updated `SprintSerializer`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Only UPCOMING sprints can be started." }`

### Complete a Sprint

**Endpoint:** `POST /sprints/{id}/complete/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor.
**Success Response (200 OK):** Returns the updated `SprintSerializer`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Only ACTIVE sprints can be completed." }`

### Sprint Object Shape

```json
{
  "id": 7,
  "team": 12,
  "name": "Sprint 3: Core Features",
  "goal": "Land the kanban board + auth",
  "start_date": "2026-06-15",
  "end_date": "2026-06-29",
  "status": "ACTIVE",
  "order": 2,
  "days_remaining": 11,
  "completion_pct": 60.0,
  "task_count": 25,
  "completed_task_count": 15,
  "created_at": "2026-06-13T08:00:00Z",
  "updated_at": "2026-06-15T10:00:00Z"
}
```

- `days_remaining` is non-zero only while `status=ACTIVE`; it is `end_date - today` in days.
- `completion_pct` is `completed_task_count / task_count * 100`, rounded to 1 decimal.

---

## 3.11 Phases

A milestone-style phase. Only meaningful for teams with `philosophy=MILESTONE`. Phases are ordered, status-tracked, and contain Deliverables that drive the phase's progress.

### List Phases

**Endpoint:** `GET /phases/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Query Params:** `team`, `status` (`UPCOMING` / `IN_PROGRESS` / `COMPLETED`), `page`.

### Create a Phase

**Endpoint:** `POST /phases/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Description:** Server refuses to create on a team whose philosophy is not `MILESTONE`.
**Payload:**

```json
{
  "name": "System Design & Architecture",      // REQUIRED
  "description": "Document the architecture",  // OPTIONAL
  "order": 2,                                  // OPTIONAL, default 0
  "start_date": "2026-07-01",                  // OPTIONAL
  "due_date": "2026-08-15",                    // OPTIONAL
  "status": "UPCOMING"                         // OPTIONAL, default UPCOMING
}
```

### Retrieve / Update / Delete a Phase

**Endpoint:** `GET / PATCH / DELETE /phases/{id}/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team. Update / delete are **leader-only**.

### Reorder Phases

**Endpoint:** `POST /phases/reorder/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Payload:**

```json
{ "order": [phase_id_3, phase_id_1, phase_id_2] }
```

**Success Response (200 OK):** `{ "updated": 3 }`

### Phase Object Shape

```json
{
  "id": 2,
  "team": 12,
  "name": "System Design & Architecture",
  "description": "Document the architecture",
  "order": 2,
  "start_date": "2026-07-01",
  "due_date": "2026-08-15",
  "status": "IN_PROGRESS",
  "completed_at": null,
  "progress_pct": 50.0,
  "deliverable_count": 4,
  "completed_deliverable_count": 2,
  "created_at": "2026-06-13T08:00:00Z",
  "updated_at": "2026-07-20T10:00:00Z"
}
```

- `progress_pct` is derived from the count of deliverables in `COMPLETED` or `APPROVED` status over the total.

---

## 3.12 Feedback

Supervisor (or member) comments, approvals, rejections, and change-requests on a team resource. The target is a `GenericForeignKey` — the same `Feedback` row can hang off a Team, Task, Deliverable, or Phase.

### List Feedback for a Team

**Endpoint:** `GET /feedback/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Query Params:**

| Param         | Type   | Notes                                                                  |
| ------------- | ------ | ---------------------------------------------------------------------- |
| `team`        | Integer | Required at top level.                                                |
| `kind`        | String  | `COMMENT` / `APPROVAL` / `REJECTION` / `REQUEST_CHANGES`                |
| `target_type` | String  | `projects.team` / `projects.task` / `projects.deliverable` / `projects.phase` |
| `page`        | Integer | Pagination cursor.                                                    |

### Post Feedback

**Endpoint:** `POST /feedback/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Payload:**

```json
{
  "kind": "COMMENT",                          // OPTIONAL, default COMMENT
  "body": "Please add more detail to the ER diagram.", // REQUIRED
  "target_content_type": 18,                  // REQUIRED: ContentType.id
  "target_object_id": 101                      // REQUIRED: id of the target
}
```

- The `target_content_type` id is a `django.contrib.contenttypes.ContentType` row — the standard `app_label.model` form (e.g. `projects.task`) is also accepted via the convenience serializer field.
- The target must belong to the same team, or BE the team.

**Success Response (201 Created):** Returns the new `FeedbackSerializer`. Notifications are dispatched to the team leader(s) and supervisors.

### Edit / Delete Feedback

**Endpoint:** `PATCH /feedback/{id}/` or `DELETE /feedback/{id}/`
**Authentication:** Required (Bearer Token) **AND** the requester is the **author** of the feedback or the team leader.

### Feedback Object Shape

```json
{
  "id": 23,
  "team": 12,
  "author": 9,
  "author_username": "dr_noha",
  "author_full_name": "Dr. Noha Salem",
  "kind": "REQUEST_CHANGES",
  "body": "Please add more detail to the ER diagram.",
  "target_content_type": 18,
  "target_object_id": 101,
  "target_type": "projects.task",
  "target_repr": "[Code Crusaders] Update API documentation",
  "created_at": "2026-07-20T10:00:00Z",
  "updated_at": "2026-07-20T10:00:00Z"
}
```

- `target_repr` is a truncated `str(target)` and is purely for display.

---

## 3.13 Submission & Grading

Each team has at most one `Submission` (one-to-one with Team). It carries the final grade, the defense date, and the supervisor's feedback summary.

### Get the Team's Submission

**Endpoint:** `GET /submissions/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Description:** Returns the submission row, creating an empty one on first access.

### Create or Update the Submission

**Endpoint:** `POST /submissions/?team={id}` (or `PATCH /submissions/{id}/`)
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member of the team.
**Description:** Leader-side submit. Stamps `submitted_at` to `now()` on create.
**Payload (any subset):**

```json
{
  "final_grade": 92.5,
  "defense_date": "2026-09-15T10:00:00Z",
  "feedback_summary": "Strong technical work; presentation needs polish."
}
```

### Grade the Submission (Supervisor)

**Endpoint:** `POST /submissions/grade/?team={id}`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted **supervisor** of the team.
**Description:** Sets `final_grade`, `feedback_summary`, `graded_at`, `graded_by` in one atomic operation.
**Payload:**

```json
{
  "final_grade": 92.5,                        // REQUIRED
  "feedback_summary": "Strong technical work." // OPTIONAL
}
```

**Success Response (200 OK):** Returns the updated `SubmissionSerializer`. Triggers a `submission_graded` notification to all accepted members.

### Submission Object Shape

```json
{
  "id": 1,
  "team": 12,
  "final_grade": 92.5,
  "defense_date": "2026-09-15T10:00:00Z",
  "feedback_summary": "Strong technical work.",
  "submitted_at": "2026-09-01T12:00:00Z",
  "graded_at": "2026-09-16T18:00:00Z",
  "graded_by": 9,
  "graded_by_username": "dr_noha",
  "created_at": "2026-09-01T12:00:00Z",
  "updated_at": "2026-09-16T18:00:00Z"
}
```

---

## 3.14 Team Dashboard

A single round-trip payload powering the project dashboard. Returns data shaped by the team's philosophy so the frontend does not have to switch on methodology client-side.

### Get Dashboard

**Endpoint:** `GET /teams/{id}/dashboard/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member, accepted supervisor, or staff of the team.
**Description:** Composes prefetched task / deliverable / sprint / phase / feedback / membership data and a methodology-aware `next_steps` block.

**Success Response (200 OK):**

```json
{
  "team": { "id": 12, "name": "Code Crusaders", "...": "..." },
  "philosophy": "MILESTONE",
  "counts": {
    "tasks": 28,
    "tasks_done": 12,
    "deliverables": 8,
    "deliverables_completed": 3,
    "sprints": 0,
    "sprints_active": 0,
    "phases": 5,
    "phases_completed": 1
  },
  "tasks": [ { "id": 101, "...": "..." } ],
  "deliverables": [ { "id": 5, "...": "..." } ],
  "sprints": [],
  "phases": [ { "id": 2, "...": "..." } ],
  "feedback": [ { "id": 23, "...": "..." } ],
  "next_steps": {
    "phase": { "id": 2, "name": "System Design & Architecture", "...": "..." },
    "deliverables": [ { "id": 5, "title": "System Architecture Document", "...": "..." } ]
  }
}
```

**`next_steps` shape per philosophy:**

- `MILESTONE` → `{ phase, deliverables: [...] }`: the first non-completed phase, and the first 3 incomplete deliverables inside it.
- `SPRINT` → `{ sprint, tasks: [...] }`: the team's active sprint, and its not-done tasks. Empty when no active sprint.
- `KANBAN` → `{ in_progress: [...], in_review: [...] }`: tasks currently in those columns.

**Error Responses:**

- `403 Forbidden`: requester is not a member, supervisor, or staff of the team.
- `404 Not Found`: team does not exist (or is soft-deleted).

---

## 3.15 Team Completion & Restore

### Complete a Team

**Endpoint:** `POST /teams/{id}/complete/`
**Authentication:** Required (Bearer Token) **AND** requester must be an accepted member or supervisor of the team.
**Description:** Flips `team.status` to `COMPLETED`. For `MILESTONE` philosophy, the server refuses if any phase is not `COMPLETED` or any deliverable is not `COMPLETED` / `APPROVED`.
**Success Response (200 OK):** Returns the updated `TeamSerializer`. Triggers a `team_completed` notification to all accepted members and supervisors.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Team is already completed." }`
- `400 Bad Request`: `{ "detail": "3 phase(s) still incomplete." }` (MILESTONE)
- `400 Bad Request`: `{ "detail": "2 deliverable(s) still pending." }` (MILESTONE)

### Restore a Soft-Deleted Team

**Endpoint:** `POST /teams/{id}/restore/`
**Authentication:** Required (Bearer Token) **AND** requester must be the team `LEADER`.
**Description:** Reverses a soft-delete (`is_deleted=False`, `deleted_at=null`).
**Success Response (200 OK):** Returns the restored `TeamSerializer`.

**Error Responses:**

- `400 Bad Request`: `{ "detail": "Team is not soft-deleted." }`

---

## Projects Quick Reference

| Action                              | Method | Endpoint                                       | Auth                  |
| ----------------------------------- | ------ | ---------------------------------------------- | --------------------- |
| List visible teams                  | GET    | `/api/teams/`                                  | Yes                   |
| Create team                         | POST   | `/api/teams/`                                  | Yes                   |
| Retrieve team                       | GET    | `/api/teams/{id}/`                             | Yes                   |
| Update team                         | PATCH  | `/api/teams/{id}/`                             | Yes (Leader)          |
| Soft-delete team                    | DELETE | `/api/teams/{id}/`                             | Yes (Leader)          |
| Restore team                        | POST   | `/api/teams/{id}/restore/`                     | Yes (Leader)          |
| Complete team                       | POST   | `/api/teams/{id}/complete/`                    | Yes (Member/Supervisor) |
| Invite a student                    | POST   | `/api/teams/{id}/invite/`                      | Yes (Leader)          |
| Request to join team                | POST   | `/api/teams/{id}/join/`                        | Yes                   |
| Request a supervisor                | POST   | `/api/teams/{id}/request-supervisor/`          | Yes (Leader)          |
| List available students             | GET    | `/api/teams/available-students/`               | Yes                   |
| List available supervisors          | GET    | `/api/teams/available-supervisors/`            | Yes                   |
| Select methodology                  | POST   | `/api/teams/{id}/select-methodology/`          | Yes (Leader)          |
| Transfer leadership                 | POST   | `/api/teams/{id}/transfer-leadership/`         | Yes (Leader)          |
| Kick a member                       | DELETE | `/api/teams/{id}/members/{member_id}/`         | Yes (Leader)          |
| Leave a team                        | POST   | `/api/teams/{id}/leave/`                       | Yes                   |
| Team dashboard                      | GET    | `/api/teams/{id}/dashboard/`                   | Yes (Member/Supervisor) |
| List my pending invitations         | GET    | `/api/me/invitations/`                         | Yes                   |
| Accept / reject an invitation       | POST   | `/api/me/invitations/{id}/respond/`            | Yes                   |
| List tasks                          | GET    | `/api/tasks/?team={id}`                        | Yes (Member/Supervisor) |
| Create task                         | POST   | `/api/tasks/?team={id}`                        | Yes (Member)          |
| Retrieve / update / delete task     | GET/PATCH/DELETE | `/api/tasks/{id}/`                | Yes (Member)          |
| Transition task                     | POST   | `/api/tasks/{id}/transition/`                  | Yes (Member)          |
| Reorder tasks                       | POST   | `/api/tasks/reorder/`                          | Yes (Member)          |
| List deliverables                   | GET    | `/api/deliverables/?team={id}`                 | Yes (Member/Supervisor) |
| Create deliverable                  | POST   | `/api/deliverables/?team={id}`                 | Yes (Member)          |
| Retrieve / update / delete          | GET/PATCH/DELETE | `/api/deliverables/{id}/`         | Yes (Member)          |
| Mark deliverable complete           | POST   | `/api/deliverables/{id}/complete/`             | Yes (Member)          |
| Approve deliverable (supervisor)    | POST   | `/api/deliverables/{id}/approve/`              | Yes (Supervisor)      |
| List sprints                        | GET    | `/api/sprints/?team={id}`                      | Yes (Member/Supervisor) |
| Create sprint                       | POST   | `/api/sprints/?team={id}`                      | Yes (Member)          |
| Retrieve / update / delete          | GET/PATCH/DELETE | `/api/sprints/{id}/`              | Yes (Member)          |
| Start sprint                        | POST   | `/api/sprints/{id}/start/`                     | Yes (Leader)          |
| Complete sprint                     | POST   | `/api/sprints/{id}/complete/`                  | Yes (Member/Supervisor) |
| List phases                         | GET    | `/api/phases/?team={id}`                       | Yes (Member/Supervisor) |
| Create phase                        | POST   | `/api/phases/?team={id}`                       | Yes (Member)          |
| Retrieve / update / delete          | GET/PATCH/DELETE | `/api/phases/{id}/`               | Yes (Member)          |
| Reorder phases                      | POST   | `/api/phases/reorder/`                         | Yes (Leader)          |
| List feedback                       | GET    | `/api/feedback/?team={id}`                     | Yes (Member/Supervisor) |
| Post feedback                       | POST   | `/api/feedback/?team={id}`                     | Yes (Member/Supervisor) |
| Edit / delete feedback              | PATCH/DELETE | `/api/feedback/{id}/`                  | Yes (Author/Leader)   |
| Get submission                      | GET    | `/api/submissions/?team={id}`                  | Yes (Member/Supervisor) |
| Update submission                   | POST/PATCH | `/api/submissions/?team={id}`             | Yes (Member)          |
| Grade submission (supervisor)       | POST   | `/api/submissions/grade/?team={id}`            | Yes (Supervisor)      |

---

## Projects Common Errors

| HTTP | Cause                                                                 | Resolution                                                              |
| ---- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 400  | `subject` missing on a `COURSE` team / set on a `GRADUATION` team     | Re-submit with a valid subject value for the project type               |
| 400  | `Team has reached its max capacity`                                   | Increase `max_capacity` (leader) or pick another team                   |
| 423  | `Team is locked` / `Team is locked. Unlock before inviting...`        | Leader must re-apply edits to `name` / `description` to unlock         |
| 403  | `Only the team leader can perform this action`                       | Switch the active user to a user holding an `ACCEPTED` `LEADER` row     |
| 409  | `Student/Supervisor already linked to this team`                     | The relationship already exists; fetch it instead of creating a new one |
| 404  | `No pending invitation found with the given id`                       | The invitation may have been withdrawn or already responded to          |
| 409  | `Cannot switch methodology with active incompatible work items.`     | Clear Sprints / Phases first (per `blocked_by` in response body)        |
| 409  | `WIP limit reached for column ...`                                   | Move a task out of the column, or raise the WIP limit in `board_config` |
| 400  | `Leader must transfer leadership before leaving.`                     | POST `/leave/` with `new_leader_membership_id`                          |
| 400  | `Cannot kick the team leader.`                                       | Transfer leadership first                                               |
| 400  | `Only ACTIVE sprints can be completed.` / `Only UPCOMING sprints...`  | Use the right transition action for the current sprint status           |
| 400  | `Only completed deliverables can be approved.`                        | Member must POST `/complete/` first                                     |
| 400  | `3 phase(s) still incomplete.` / `2 deliverable(s) still pending.`    | Mark remaining work items complete before completing the team           |
| 429  | Throttle exceeded (methodology switch: 5/hr; kick/transfer/leave: 30/hr) | Wait and retry                                                       |

---

# 4. Notifications APIs

**Base URL:** `/api/notifications`  
_(All endpoints require Bearer Token Authentication)_

A minimal in-app notification system. Every status change in the projects app dispatches a notification through Django signals — supervisors, leaders, and students get a single inbox of events to react to. Each notification carries a `target` GenericForeignKey so the inbox can deep-link back to the originating object (Team, Task, Deliverable, Phase, etc.).

## Inbox

### List My Notifications

**Endpoint:** `GET /notifications/`
**Authentication:** Required (Bearer Token)
**Description:** Returns the requester's notifications, newest first. Skips DRF pagination so the bell-icon inbox is a single round-trip. The default queryset excludes archived notifications.
**Query Params:**

| Param         | Type   | Notes                                                                  |
| ------------- | ------ | ---------------------------------------------------------------------- |
| `unread`      | Boolean | `1` / `true` returns only unread notifications.                       |
| `verb`        | String  | Filter by event verb (e.g. `task_assigned`, `supervisor_accepted`).     |
| `target_type` | String  | `app_label.model` form (e.g. `projects.task`, `projects.deliverable`). |

**Success Response (200 OK):**

```json
[
  {
    "id": 88,
    "recipient": 4,
    "recipient_username": "ahmed_2024",
    "actor": 9,
    "actor_username": "dr_noha",
    "verb": "supervisor_accepted",
    "description": "dr_noha accepted supervision of Code Crusaders.",
    "target_content_type": 14,
    "target_object_id": 12,
    "target_type": "projects.team",
    "target_repr": "Code Crusaders",
    "read_at": null,
    "is_read": false,
    "is_archived": false,
    "created_at": "2026-06-13T08:00:00Z"
  }
]
```

### Unread Count

**Endpoint:** `GET /notifications/unread-count/`
**Authentication:** Required (Bearer Token)
**Description:** Lightweight endpoint powering the bell-icon badge.
**Success Response (200 OK):** `{ "unread": 5 }`

## Read Tracking

### Mark One Notification Read

**Endpoint:** `POST /notifications/{id}/read/`
**Authentication:** Required (Bearer Token) **AND** requester is the recipient.
**Description:** Stamps `read_at` if it is currently null. Idempotent.
**Success Response (200 OK):** Returns the updated `NotificationSerializer`.

### Mark All Read

**Endpoint:** `POST /notifications/mark-all-read/`
**Authentication:** Required (Bearer Token)
**Description:** Stamps `read_at` to `now()` for every unread notification belonging to the requester.
**Success Response (200 OK):** `{ "updated": 12 }`

## Notification Object Shape

| Field                | Type                | Notes                                                                |
| -------------------- | ------------------- | -------------------------------------------------------------------- |
| `id`                 | Integer             | Primary key.                                                         |
| `recipient`          | Integer             | The user this notification is addressed to.                          |
| `recipient_username` | String              | Read-only convenience field.                                         |
| `actor`              | Integer (nullable)  | The user who triggered the event. `null` for system events.           |
| `actor_username`     | String (nullable)   | Read-only convenience field.                                         |
| `verb`               | String              | Short event identifier. See the table below.                         |
| `description`        | String              | Optional human-readable body.                                        |
| `target_content_type` | Integer            | FK to `django.contrib.contenttypes.ContentType`.                      |
| `target_object_id`   | Integer             | The `pk` of the target object.                                       |
| `target_type`        | String              | `app_label.model` form (e.g. `projects.task`). Read-only.            |
| `target_repr`        | String              | Truncated `str(target)`. Read-only.                                  |
| `read_at`            | DateTime (nullable) | When the recipient marked it read.                                   |
| `is_read`            | Boolean             | Read-only; `true` when `read_at` is set.                             |
| `is_archived`        | Boolean             | Soft-hide from the inbox (power-user feature, not yet in API surface). |
| `created_at`         | DateTime            | Server-stamped.                                                      |

## Event Verbs (Projects Domain)

The following `verb` values are dispatched by the `projects` app's signal handlers. The frontend should map each to a localized icon + copy.

| Verb                          | Trigger                                                  | Typical Recipient       |
| ----------------------------- | -------------------------------------------------------- | ----------------------- |
| `supervisor_accepted`         | A `TeamSupervisor.status` flipped to `ACCEPTED`          | Team leader(s)          |
| `supervisor_rejected`         | A `TeamSupervisor.status` flipped to `REJECTED`          | Team leader(s)          |
| `member_invited`              | Leader invited a student (new `PENDING` membership)      | Invited student         |
| `member_requested_to_join`    | Student created a `PENDING` join request                 | Team leader(s)          |
| `member_joined`               | A `TeamMember.status` flipped to `ACCEPTED`              | Team leader(s) + supervisors |
| `member_rejected`             | A `TeamMember.status` flipped to `REJECTED`              | The student             |
| `team_status_changed`         | `Team.status` (FORMING → PENDING_SUPERVISORS / ACTIVE / COMPLETED) | All accepted members + supervisors |
| `team_locked`                 | `Team.is_locked` flipped `False → True`                  | All accepted members + supervisors |
| `team_unlocked`               | `Team.is_locked` flipped `True → False`                  | All accepted members + supervisors |
| `team_methodology_changed`    | `Team.philosophy` changed via `select-methodology/`      | All accepted members + supervisors |
| `role_changed`                | Leadership transferred (Step 8)                          | Old + new leader        |
| `member_removed`              | Leader kicked a member                                   | The removed student     |
| `member_left`                 | A member left the team                                   | Team leader(s) + supervisors |
| `task_assigned`               | A user was added to a Task's assignees M2M               | Newly assigned user     |
| `task_completed`              | A Task transitioned to `DONE`                            | Team leader(s) + supervisors |
| `deliverable_completed`       | A Deliverable was marked COMPLETED                       | Team leader(s) + supervisors |
| `deliverable_approved`        | A Deliverable was approved by a supervisor               | Team leader(s)          |
| `feedback_posted`             | A new Feedback row was created                           | Team leader(s) + supervisors |
| `submission_graded`           | A Submission's grade was set via `/submissions/grade/`   | All accepted members    |
| `team_completed`              | `Team.status` flipped to `COMPLETED`                     | All accepted members + supervisors |

## Notifications Quick Reference

| Action                       | Method | Endpoint                              | Auth |
| ---------------------------- | ------ | ------------------------------------- | ---- |
| List my notifications        | GET    | `/api/notifications/`                 | Yes  |
| Unread count                 | GET    | `/api/notifications/unread-count/`    | Yes  |
| Mark one read                | POST   | `/api/notifications/{id}/read/`       | Yes  |
| Mark all read                | POST   | `/api/notifications/mark-all-read/`   | Yes  |

## Notifications Common Errors

| HTTP | Cause                                                  | Resolution                                        |
| ---- | ------------------------------------------------------ | ------------------------------------------------- |
| 404  | Notification id not found or not addressed to requester | The recipient is always the requester; check auth |
| 401  | Missing or expired JWT                                 | Refresh token and retry                           |

---

**Last Updated:** June 13, 2026
