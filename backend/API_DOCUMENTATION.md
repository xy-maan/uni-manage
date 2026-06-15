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
- [3. Project Management System](#3-project-management-system)
  - [Implementation Gaps / Missing Features](#31-implementation-gaps--missing-features)
  - [Project Types, Methodologies, and Statuses](#32-project-types-methodologies-and-statuses)
  - [Complete User Flow](#33-complete-user-flow)
  - [Screen-Based API Documentation](#34-screen-based-api-documentation)
  - [Notification Websocket Behavior](#35-notification-websocket-behavior)
  - [Permissions Matrix](#36-permissions-matrix)
  - [Common Error Patterns](#37-common-error-patterns)
  - [Quick Endpoint Reference](#38-quick-endpoint-reference)

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

**Last Updated:** June 15, 2026

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

# 3. Project Management System

**Base URLs:**

- Projects app: `/api/projects`
- Tasks app: `/api/tasks`
- Notifications app: `/api/notifications`

All endpoints in this section require Bearer Token Authentication unless noted otherwise.

The backend uses normal integer primary keys for project-management records. API enum values are lowercase, even when the UI displays uppercase labels.

**Pagination:** List endpoints currently return unpaginated results.

**Router behavior:** These apps use DRF `ModelViewSet` with `DefaultRouter`, so each registered resource exposes list, create, retrieve, full update, partial update, and delete routes unless the endpoint table says otherwise:

- `GET /resource/` returns a list.
- `POST /resource/` creates a record and returns `201 Created`.
- `GET /resource/{id}/` returns one record.
- `PUT /resource/{id}/` fully updates one record and returns `200 OK`.
- `PATCH /resource/{id}/` partially updates one record and returns `200 OK`.
- `DELETE /resource/{id}/` deletes or soft-deletes one record and returns `204 No Content`.

**Common status codes:** Authenticated successful reads and custom actions return `200 OK`; creates return `201 Created`; deletes return `204 No Content`; validation failures return `400 Bad Request`; missing or invalid JWT returns `401 Unauthorized`; service-level permission failures return `403 Forbidden`; records outside the authenticated user's queryset return `404 Not Found`.

**Filtering:** Task lists support only `project`, `assignee`, and `status` query parameters. Search, ordering query parameters, generic filtering, and DRF `filter_backends` are not implemented for the project-management viewsets.

**Response detail objects:** User summary fields returned in `*_detail` objects are `id`, `username`, `full_name`, `email`, `role`, and `avatar_url`.

## 3.1 Implementation Gaps / Missing Features

This section reflects the implementation currently present in `projects`, `tasks`, and `notifications`.

| Feature | Status | Notes for Frontend |
| ------- | ------ | ------------------ |
| Project CRUD | Implemented | DRF CRUD exists at `/api/projects/`. Create automatically adds the creator as `leader`. |
| Project marketplace | Partially Implemented | `GET /api/projects/` returns public projects plus projects connected to the current user. Category, semester, academic_year, technologies are taxonomy models. Archive tags are stored. There is no search or explicit marketplace filter. |
| Project fields from product flow | Implemented | Project records now include creation wizard fields: `name`, `description`, `category` (FK), `semester` (FK), `academic_year` (FK), `technologies` (M2M), `project_type`, `methodology`, `min_members`, `max_members`, `is_public`, proposal fields, repository/docs URLs, and archive metadata. |
| Project status transitions | Implemented | `activate`, `submit`, `approve-submission`, and `archive` actions exist. `submit` moves an active project to `under_review`; `approve-submission` moves it to `submitted`. Status is read-only on normal create/update. |
| Membership management | Partially Implemented | Leaders can create/update/delete memberships with `leader`, `co_leader`, and `member` roles. Leader membership cannot be deleted. There is no self-service "leave team" endpoint. |
| Leadership transfer | Missing | There is no atomic transfer-leadership endpoint. Do not build a frontend flow that relies on this yet. |
| Invitations | Implemented | Leaders create invitations; invitees can accept/reject. Notifications are generated. |
| Join requests | Implemented | Students create join requests; leaders accept/reject. Notifications are generated. |
| Supervisor search | Missing | No endpoint in these apps lists/searches doctors or TAs. Frontend needs another source before sending `supervisor` IDs. |
| Supervisor requests | Implemented | Leaders send proposal-backed requests; requested supervisor can accept, reject, or request modification. Accept creates `ProjectSupervisor`. |
| Assign TA | Partially Implemented | Use a supervisor request with `role: "secondary"` to a TA. There is no separate "assign TA" endpoint. |
| Task CRUD and movement | Partially Implemented | Tasks can be CRUDed and moved by `PATCH`ing `status`, `position`, and/or `board_column`. There is no dedicated move/reorder endpoint. |
| Comments | Implemented | CRUD exists. Only the author may update/delete their comment. |
| Attachments | Implemented | Upload/list/delete exists through multipart CRUD. There is no custom upload action. |
| Sprint records | Implemented | CRUD exists only for sprint-methodology projects. `status` can be patched and `/api/tasks/sprints/{id}/dashboard/` returns sprint summary metrics. |
| Sprint task assignment | Implemented | Create/delete records in `/api/tasks/sprint-tasks/`. Each task can belong to one sprint. |
| Milestone records | Implemented | CRUD exists only for milestone-methodology projects. `status` can be patched and `/api/tasks/milestones/{id}/dashboard/` returns progress. |
| Milestone task assignment | Implemented | Create/delete records in `/api/tasks/milestone-tasks/`. Each task can belong to one milestone. |
| Kanban columns | Implemented | CRUD exists only for kanban-methodology projects. Reordering uses `PATCH position`; moving tasks uses `PATCH task.board_column`; `/api/tasks/board-columns/dashboard/?project={id}` returns columns, tasks, and flow summary. |
| Task checklist/activity | Implemented | Tasks support checklists, checklist items, and read-only activity records. |
| Deliverables | Implemented | CRUD, submit, approve, reject, request revision, and file upload/list/delete exist. Review is supervisor-only. |
| Meetings | Implemented | CRUD exists with attendee IDs plus meeting attendance records and meeting notes. This is not a video-conferencing system. |
| Supervisor feedback | Implemented | `/api/projects/feedback/` supports feedback attached to exactly one project, task, deliverable, or meeting. |
| Notification REST APIs | Implemented | List, unread count, mark one read, and mark all read exist. |
| Notification websocket | Partially Implemented | `ws/notifications/` pushes newly created notifications to the authenticated recipient. Mark-read and mark-all-read REST updates do not emit websocket read/unread events. |
| Fine-grained DRF permission classes | Partially Implemented | All viewsets use `IsAuthenticated`; object/business permissions are enforced inside queryset filters and service methods. One project permission class exists but is not wired into the viewsets. |

## 3.2 Project Types, Methodologies, and Statuses

### Project Types

| UI Label | API Value | Meaning |
| -------- | --------- | ------- |
| Course Project | `course` | A course team project. It can be activated by the leader without supervisor approval. |
| Graduation Project | `graduation` | A graduation project. It requires an accepted primary doctor supervisor before activation. |

### Methodologies

| UI Label | API Value | Meaning |
| -------- | --------- | ------- |
| Sprint Based | `sprint` | Enables sprint records and sprint-task assignment. |
| Milestone Based | `milestone` | Enables milestone records and milestone-task assignment. |
| Kanban Based | `kanban` | Enables kanban board columns and task movement between columns. |

### Project Statuses

| UI Label | API Value | Meaning |
| -------- | --------- | ------- |
| FORMING | `forming` | Default status after creation while members and supervision are being arranged. |
| UNDER_REVIEW | `under_review` | Set when a graduation project sends a supervisor request, or when an active project is submitted for final review. |
| ACTIVE | `active` | The team can work normally. Course projects can be activated by the leader; graduation projects require an approved primary supervisor first. |
| SUBMITTED | `submitted` | Set when a supervisor or leader approves a project that is under final review. |
| ARCHIVED | `archived` | Set when the leader archives the project. |

### Serializer Fields Returned by This Section

These field lists reflect the active serializers in `projects`, `tasks`, and `notifications`.

| Serializer | Returned Fields |
| ---------- | --------------- |
| `Project` | `id`, `creator_detail`, `memberships`, `supervisors`, `name`, `description`, `category` (nested `{id, name}`), `semester` (nested `{id, name}`), `academic_year` (nested `{id, name}`), `technologies` (array of `{id, name, is_official}`), `project_type`, `methodology`, `status`, `min_members`, `max_members`, `is_public`, `proposal`, `abstract`, `expected_scope`, `repository_url`, `documentation_url`, `archive_year`, `archive_tags`, `deleted_at`, `created_at`, `updated_at`, `creator` |
| `ProjectMembership` | `id`, `user_detail`, `project`, `user`, `role`, `joined_at`, `created_at`, `updated_at` |
| `SupervisorRequest` | `id`, `requested_by_detail`, `supervisor_detail`, `project`, `requested_by`, `supervisor`, `role`, `message`, `proposal`, `abstract`, `technology_stack` (array of `{id, name, is_official}`), `expected_scope`, `modification_note`, `status`, `responded_at`, `created_at`, `updated_at` |
| `ProjectSupervisor` | `id`, `supervisor_detail`, `project`, `supervisor`, `role`, `created_at`, `updated_at` |
| `Task` | `id`, `creator_detail`, `assignee_detail`, `comments`, `attachments`, `checklists`, `activity`, `project`, `title`, `description`, `status`, `priority`, `creator`, `assignee`, `labels`, `board_column`, `due_at`, `estimated_hours`, `actual_hours`, `story_points`, `completed_at`, `position`, `deleted_at`, `created_at`, `updated_at` |
| `TaskLabel` | `id`, `project`, `name`, `color`, `created_at`, `updated_at` |
| `DeliverableFile` | `id`, `deliverable`, `file`, `uploaded_by`, `created_at`, `updated_at` |
| `TaskAttachment` | `id`, `task`, `file`, `uploaded_by`, `created_at`, `updated_at` |
| `TaskChecklist` | `id`, `task`, `title`, `position`, `items`, `created_at`, `updated_at` |
| `TaskChecklistItem` | `id`, `checklist`, `content`, `is_completed`, `completed_by`, `completed_by_detail`, `completed_at`, `position`, `created_at`, `updated_at` |
| `TaskActivity` | `id`, `task`, `actor`, `actor_detail`, `action`, `message`, `data`, `created_at`, `updated_at` |
| `SprintTask` | `id`, `sprint`, `task`, `created_at`, `updated_at` |
| `MilestoneTask` | `id`, `milestone`, `task`, `created_at`, `updated_at` |
| `MeetingAttendance` | `id`, `meeting`, `user`, `user_detail`, `status`, `note`, `created_at`, `updated_at` |
| `MeetingNote` | `id`, `meeting`, `author`, `author_detail`, `content`, `created_at`, `updated_at` |
| `Feedback` | `id`, `author`, `author_detail`, `project`, `task`, `deliverable`, `meeting`, `content`, `created_at`, `updated_at` |
| `Notification` | `id`, `actor_detail`, `is_read`, `recipient`, `actor`, `notification_type`, `title`, `message`, `data`, `read_at`, `created_at` |

`DeliverableFile` and `TaskAttachment` use `uploaded_by`; there is no separate `uploader` response field.

## 3.3 Complete User Flow

```text
Student opens Create Project
  -> selects project type: course or graduation
  -> selects methodology: sprint, milestone, or kanban
  -> enters implemented project fields
       name, description, category_id, semester_id, academic_year_id,
       technology_names, min_members, max_members, is_public, proposal,
       abstract, expected_scope
  -> project is created with status "forming"
  -> creator becomes the project leader

Team formation
  -> leader sends invitations
  -> OR students send join requests from the marketplace/details screen
  -> invitee accepts invitation OR leader accepts join request
  -> accepted users become project members

Graduation supervision
  -> leader sends primary supervisor request to a doctor
  -> project status becomes "under_review"
  -> doctor accepts, rejects, or requests modification
  -> accepted request creates a project supervisor record
  -> leader activates the project after minimum team size is reached

Course activation
  -> leader activates the project after minimum team size is reached

Work management
  -> create labels, tasks, checklists, comments, attachments, and feedback
  -> for sprint projects: create sprints and assign tasks to sprints
  -> for milestone projects: create milestones and assign tasks to milestones
  -> for kanban projects: create columns and PATCH tasks between columns

Delivery
  -> create deliverables
  -> upload deliverable files
  -> project member submits deliverable
  -> supervisor approves, rejects, or requests revision

Meetings
  -> participants create meeting records, attendance records, and notes

Project close
  -> leader submits project for review
  -> supervisor or leader marks project submitted
  -> leader archives project
```

Frontend routing should treat `GET /api/projects/` as the source for both public projects and projects connected to the current user. Use the current user's membership role in each project to decide which actions to show.

## 3.4 Screen-Based API Documentation

### Project Marketplace

**Purpose:** Students browse public projects and request to join.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List visible projects | GET | `/api/projects/` | Authenticated user; returns public projects plus member/supervisor projects |
| View project details | GET | `/api/projects/{project_id}/` | Authenticated user; project must be public or connected to the user |
| Send join request | POST | `/api/projects/join-requests/` | Authenticated non-member |

**Response Example:**

```json
[
	{
		"id": 101,
		"name": "Smart Attendance",
		"description": "Face recognition attendance system.",
		"project_type": "course",
		"methodology": "kanban",
		"status": "forming",
		"category": {"id": 1, "name": "Computer Vision"},
		"semester": {"id": 1, "name": "Fall"},
		"academic_year": {"id": 1, "name": "2026/2027"},
		"technologies": [
			{"id": 1, "name": "Python", "is_official": true},
			{"id": 2, "name": "Django", "is_official": true},
			{"id": 3, "name": "OpenCV", "is_official": true}
		],
		"min_members": 3,
		"max_members": 5,
		"is_public": true,
		"deleted_at": null,
		"created_at": "2026-06-15T08:00:00Z",
		"updated_at": "2026-06-15T08:00:00Z",
		"creator": 12,
		"creator_detail": {
			"id": 12,
			"username": "mona",
			"full_name": "Mona Hassan",
			"email": "mona@uni.edu.eg",
			"role": "STUDENT",
			"avatar_url": null
		},
		"memberships": [],
		"supervisors": []
	}
]
```

**Common Errors:**

- `401 Unauthorized`: Missing or expired JWT.
- `400 Bad Request`: Duplicate pending join request.
- `404 Not Found`: Project is private or outside the authenticated user's visible queryset.

### Project Taxonomy / Dropdown Endpoints

These endpoints provide data for dropdown selectors on the project creation/edit forms.

**Get Categories**

**Endpoint:** `GET /api/projects/categories/`
**Authentication:** None Required
**Success Response:**
```json
[
	{ "id": 1, "name": "Computer Vision" },
	{ "id": 2, "name": "Web Development" }
]
```

**Get Semesters**

**Endpoint:** `GET /api/projects/semesters/`
**Authentication:** None Required
**Success Response:**
```json
[
	{ "id": 1, "name": "Fall" },
	{ "id": 2, "name": "Spring" }
]
```

**Get Academic Years**

**Endpoint:** `GET /api/projects/academic-years/`
**Authentication:** None Required
**Success Response:**
```json
[
	{ "id": 1, "name": "2025/2026" },
	{ "id": 2, "name": "2026/2027" }
]
```

**Search Technologies**

**Endpoint:** `GET /api/projects/technologies/search/?q=<query>`
**Authentication:** None Required
**Description:** Use with an Async Creatable Autocomplete component. It checks aliases (e.g. typing "Py" returns "Python").
**Success Response:**
```json
[
	{ "id": 1, "name": "Python", "is_official": true },
	{ "id": 2, "name": "PyTorch", "is_official": false }
]
```

_Frontend Behavior:_ When the user selects an existing technology, extract the `id` and add it to the `technology_names` array. If the user types a brand new technology that returns empty results, add their raw string (e.g., "SvelteKit") to the array. The backend will create it automatically and attach it to the project.

### Create Project Screen

**Purpose:** Create a course or graduation project and choose the task methodology.

**Endpoint:** `POST /api/projects/`
**Authentication:** Required
**Permissions:** Any authenticated user. The backend does not currently restrict creation to students only.

**Request Body:**

```json
{
	"name": "Smart Attendance",
	"description": "Face recognition attendance system for course rooms.",
	"category_id": 1,
	"semester_id": 1,
	"academic_year_id": 1,
	"technology_names": [1, "PyTorch", "OpenCV"],
	"project_type": "course",
	"methodology": "kanban",
	"min_members": 3,
	"max_members": 5,
	"is_public": true,
	"proposal": "Build a camera-assisted attendance workflow.",
	"abstract": "A system that detects students and exports attendance reports.",
	"expected_scope": "Authentication, face matching, attendance exports, and dashboard."
}
```

**Response Example:**

```json
{
	"id": 101,
	"name": "Smart Attendance",
	"description": "Face recognition attendance system for course rooms.",
	"category": {"id": 1, "name": "Computer Vision"},
	"semester": {"id": 1, "name": "Fall"},
	"academic_year": {"id": 1, "name": "2026/2027"},
	"technologies": [
		{"id": 1, "name": "Python", "is_official": true},
		{"id": 4, "name": "PyTorch", "is_official": false},
		{"id": 3, "name": "OpenCV", "is_official": true}
	],
	"project_type": "course",
	"methodology": "kanban",
	"status": "forming",
	"creator": 12,
	"min_members": 3,
	"max_members": 5,
	"is_public": true,
	"proposal": "Build a camera-assisted attendance workflow.",
	"abstract": "A system that detects students and exports attendance reports.",
	"expected_scope": "Authentication, face matching, attendance exports, and dashboard.",
	"repository_url": "",
	"documentation_url": "",
	"archive_year": null,
	"archive_tags": [],
	"deleted_at": null,
	"created_at": "2026-06-15T08:00:00Z",
	"updated_at": "2026-06-15T08:00:00Z",
	"creator_detail": {
		"id": 12,
		"username": "mona",
		"full_name": "Mona Hassan",
		"email": "mona@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null
	},
	"memberships": [
		{
			"id": 501,
			"project": 101,
			"user": 12,
			"user_detail": {
				"id": 12,
				"username": "mona",
				"full_name": "Mona Hassan",
				"email": "mona@uni.edu.eg",
				"role": "STUDENT",
				"avatar_url": null
			},
			"role": "leader",
			"joined_at": "2026-06-15T08:00:00Z",
			"created_at": "2026-06-15T08:00:00Z",
			"updated_at": "2026-06-15T08:00:00Z"
		}
	],
	"supervisors": []
}
```

**Common Errors:**

- `400 Bad Request`: Invalid `project_type` or `methodology`.
- `401 Unauthorized`: Missing JWT.

### Project Details Screen

**Purpose:** Display project metadata, members, supervisors, and leader-only status actions.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| Get project | GET | `/api/projects/{project_id}/` | Visible if public, member, or supervisor |
| Replace project | PUT | `/api/projects/{project_id}/` | Leader only |
| Edit project | PATCH | `/api/projects/{project_id}/` | Leader only |
| Delete project | DELETE | `/api/projects/{project_id}/` | Leader only; soft delete |
| Activate | POST | `/api/projects/{project_id}/activate/` | Leader only |
| Submit project for review | POST | `/api/projects/{project_id}/submit/` | Leader only; project must be active |
| Approve final submission | POST | `/api/projects/{project_id}/approve-submission/` | Project supervisor or leader; project must be under review |
| Archive project | POST | `/api/projects/{project_id}/archive/` | Leader only |

**PATCH Request Example:**

```json
{
	"name": "Smart Attendance v2",
	"description": "Updated project description.",
	"min_members": 3,
	"max_members": 6,
	"is_public": false,
	"repository_url": "https://github.com/team/smart-attendance",
	"archive_tags": ["vision", "attendance"]
}
```

**Common Errors:**

- `401 Unauthorized`: Missing or expired JWT.
- `403 Forbidden`: Only the leader can edit, delete, activate, submit, or archive; only supervisors/leaders can approve final submission.
- `404 Not Found`: Project is deleted, nonexistent, or outside the authenticated user's visible queryset.
- `400 Bad Request`: Graduation project activation without an accepted primary supervisor, activation before `min_members` is reached, final submission before `active`, or approval before `under_review`.

### Team Members Screen

**Purpose:** Manage members, invitations, and join requests.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List memberships visible to user | GET | `/api/projects/memberships/` | Project member or supervisor on related projects |
| Get membership | GET | `/api/projects/memberships/{membership_id}/` | Project member or supervisor on related project |
| Add member directly | POST | `/api/projects/memberships/` | Project leader |
| Replace membership | PUT | `/api/projects/memberships/{membership_id}/` | Project leader |
| Update member role | PATCH | `/api/projects/memberships/{membership_id}/` | Project leader |
| Remove member | DELETE | `/api/projects/memberships/{membership_id}/` | Project leader; leader membership cannot be deleted |
| Create invitation | POST | `/api/projects/invitations/` | Project leader |
| List invitations | GET | `/api/projects/invitations/` | Invitee, inviter, or project member |
| Get invitation | GET | `/api/projects/invitations/{invitation_id}/` | Invitee, inviter, or project member |
| Replace invitation | PUT | `/api/projects/invitations/{invitation_id}/` | Project leader |
| Update invitation | PATCH | `/api/projects/invitations/{invitation_id}/` | Project leader |
| Delete invitation | DELETE | `/api/projects/invitations/{invitation_id}/` | Project leader |
| Accept invitation | POST | `/api/projects/invitations/{invitation_id}/accept/` | Invitee only |
| Reject invitation | POST | `/api/projects/invitations/{invitation_id}/reject/` | Invitee only |
| Create join request | POST | `/api/projects/join-requests/` | Authenticated non-member |
| List join requests | GET | `/api/projects/join-requests/` | Requester or project leader |
| Get join request | GET | `/api/projects/join-requests/{join_request_id}/` | Requester or project leader |
| Replace join request | PUT | `/api/projects/join-requests/{join_request_id}/` | Project leader |
| Update join request | PATCH | `/api/projects/join-requests/{join_request_id}/` | Project leader |
| Delete join request | DELETE | `/api/projects/join-requests/{join_request_id}/` | Requester or project leader if visible in queryset |
| Accept join request | POST | `/api/projects/join-requests/{join_request_id}/accept/` | Project leader |
| Reject join request | POST | `/api/projects/join-requests/{join_request_id}/reject/` | Project leader |

**Create Invitation Request:**

```json
{
	"project": 101,
	"invitee": 34,
	"message": "Join us for the backend module?"
}
```

**Create Join Request:**

```json
{
	"project": 101,
	"message": "I can help with React and testing."
}
```

**ProjectMembership Response Example:**

```json
{
	"id": 501,
	"project": 101,
	"user": 34,
	"user_detail": {
		"id": 34,
		"username": "omar",
		"full_name": "Omar Ali",
		"email": "omar@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null
	},
	"role": "member",
	"joined_at": "2026-06-15T08:05:00Z",
	"created_at": "2026-06-15T08:05:00Z",
	"updated_at": "2026-06-15T08:05:00Z"
}
```

**Permissions and Rules:**

- Only leaders can create direct memberships, invite users, update memberships, remove members, and accept/reject join requests.
- Invitees are the only users who can accept/reject their invitation.
- Membership role values are `leader`, `co_leader`, and `member`.
- The backend enforces `min_members` during activation and `max_members` during direct add, invitation accept, and join-request accept.
- The leader membership cannot be deleted.
- Successful create responses return `201 Created`; accept/reject/update responses return `200 OK`; delete responses return `204 No Content`.

### Supervision Screen

**Purpose:** Graduation leaders request doctors/TAs, and supervisors review incoming requests.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| Send supervisor request | POST | `/api/projects/supervisor-requests/` | Project leader |
| View relevant supervisor requests | GET | `/api/projects/supervisor-requests/` | Requested supervisor, requester, or project member |
| Get supervisor request | GET | `/api/projects/supervisor-requests/{request_id}/` | Requested supervisor, requester, or project member |
| Replace supervisor request | PUT | `/api/projects/supervisor-requests/{request_id}/` | Project leader |
| Update supervisor request | PATCH | `/api/projects/supervisor-requests/{request_id}/` | Project leader |
| Delete supervisor request | DELETE | `/api/projects/supervisor-requests/{request_id}/` | Authenticated user if visible in queryset |
| Doctor/TA accept request | POST | `/api/projects/supervisor-requests/{request_id}/accept/` | Requested doctor/TA only |
| Doctor/TA reject request | POST | `/api/projects/supervisor-requests/{request_id}/reject/` | Requested doctor/TA only |
| Doctor/TA request modification | POST | `/api/projects/supervisor-requests/{request_id}/request-modification/` | Requested doctor/TA only |
| View current supervisors | GET | `/api/projects/supervisors/` | Project member or assigned supervisor |
| Get project supervisor | GET | `/api/projects/supervisors/{supervisor_record_id}/` | Project member or assigned supervisor |
| Create project supervisor | POST | `/api/projects/supervisors/` | Project leader; requires matching accepted supervisor request |
| Replace project supervisor | PUT | `/api/projects/supervisors/{supervisor_record_id}/` | Project leader |
| Update project supervisor | PATCH | `/api/projects/supervisors/{supervisor_record_id}/` | Project leader |
| Delete project supervisor | DELETE | `/api/projects/supervisors/{supervisor_record_id}/` | Project leader |

**Send Primary Doctor Request:**

```json
{
	"project": 101,
	"supervisor": 8,
	"role": "primary",
	"message": "Would you supervise our graduation project?",
	"proposal": "Full project proposal text.",
	"abstract": "Short project abstract.",
	"technology_names": [1, "React", "SQL Server"],
	"expected_scope": "Authentication, project workspace, reports, and demo."
}
```

**Send Secondary TA Request:**

```json
{
	"project": 101,
	"supervisor": 15,
	"role": "secondary",
	"message": "Can you support the weekly implementation follow-up?"
}
```

_Note:_ If `technology_names` is omitted on a supervisor request, the backend defaults to the project's currently set technologies.

**Response Example:**

```json
{
	"id": 701,
	"project": 101,
	"requested_by": 12,
	"supervisor": 8,
	"requested_by_detail": {
		"id": 12,
		"username": "mona",
		"full_name": "Mona Hassan",
		"email": "mona@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null
	},
	"supervisor_detail": {
		"id": 8,
		"username": "dr.samir",
		"full_name": "Samir Nabil",
		"email": "samir@uni.edu.eg",
		"role": "SUPERVISOR",
		"avatar_url": null
	},
	"role": "primary",
	"message": "Would you supervise our graduation project?",
	"proposal": "Full project proposal text.",
	"abstract": "Short project abstract.",
	"technology_stack": [
		{"id": 1, "name": "Django", "is_official": true},
		{"id": 5, "name": "React", "is_official": true},
		{"id": 6, "name": "SQL Server", "is_official": true}
	],
	"expected_scope": "Authentication, project workspace, reports, and demo.",
	"modification_note": "",
	"status": "pending",
	"responded_at": null,
	"created_at": "2026-06-15T08:10:00Z",
	"updated_at": "2026-06-15T08:10:00Z"
}
```

**Create ProjectSupervisor Request:**

```json
{
	"project": 101,
	"supervisor": 8,
	"role": "primary"
}
```

**ProjectSupervisor Response Example:**

```json
{
	"id": 711,
	"project": 101,
	"supervisor": 8,
	"supervisor_detail": {
		"id": 8,
		"username": "dr.samir",
		"full_name": "Samir Nabil",
		"email": "samir@uni.edu.eg",
		"role": "SUPERVISOR",
		"avatar_url": null
	},
	"role": "primary",
	"created_at": "2026-06-15T08:12:00Z",
	"updated_at": "2026-06-15T08:12:00Z"
}
```

**Permissions and Rules:**

- Only project leaders can send supervisor requests.
- `primary` requires a supervisor profile with title `DOCTOR`.
- `secondary` requires a supervisor profile with title `TA`.
- Sending a request for a graduation project sets project status to `under_review`.
- Accepting a request creates a `ProjectSupervisor` record.
- Requesting modification sets supervisor request status to `needs_modification`, stores `modification_note`, and sends a feedback notification to the requester.
- Manually creating a `ProjectSupervisor` requires a matching accepted supervisor request with the same `project`, `supervisor`, and `role`.
- `technology_names` accepts a mixed array of integer IDs and raw strings, identical to the `technology_names` field on Project. If omitted, the project's current technologies are used.
- There is no supervisor search endpoint in these apps.
- Successful supervisor-request and supervisor-record creates return `201 Created`; accept/reject/update responses return `200 OK`; delete responses return `204 No Content`.

### Task Board / Task List Screen

**Purpose:** Show tasks for a project, create/edit tasks, and support drag-and-drop through PATCH updates.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List tasks | GET | `/api/tasks/?project={project_id}` | Project participant |
| Filter by assignee | GET | `/api/tasks/?project={project_id}&assignee={user_id}` | Project participant |
| Filter by status | GET | `/api/tasks/?project={project_id}&status=todo` | Project participant |
| Create task | POST | `/api/tasks/` | Project participant |
| Task details | GET | `/api/tasks/{task_id}/` | Project participant |
| Replace task | PUT | `/api/tasks/{task_id}/` | Project participant |
| Update or move task | PATCH | `/api/tasks/{task_id}/` | Project participant |
| Delete task | DELETE | `/api/tasks/{task_id}/` | Project participant; soft delete |
| List labels | GET | `/api/tasks/labels/` | Project participant |
| Create label | POST | `/api/tasks/labels/` | Project participant |
| Get label | GET | `/api/tasks/labels/{label_id}/` | Project participant |
| Replace label | PUT | `/api/tasks/labels/{label_id}/` | Project participant |
| Update label | PATCH | `/api/tasks/labels/{label_id}/` | Project participant |
| Delete label | DELETE | `/api/tasks/labels/{label_id}/` | Project participant |
| List task activity | GET | `/api/tasks/activity/` | Project participant |

**Create Task Request:**

```json
{
	"project": 101,
	"title": "Build attendance API",
	"description": "Create endpoints for session check-in.",
	"status": "todo",
	"priority": "high",
	"assignee": 34,
	"labels": [901],
	"board_column": 301,
	"due_at": "2026-06-30T18:00:00Z",
	"estimated_hours": "12.50",
	"actual_hours": null,
	"story_points": 5,
	"position": 10
}
```

**Move Task Request:**

```json
{
	"status": "in_progress",
	"board_column": 302,
	"position": 20
}
```

**Response Example:**

```json
{
	"id": 401,
	"project": 101,
	"title": "Build attendance API",
	"description": "Create endpoints for session check-in.",
	"status": "in_progress",
	"priority": "high",
	"creator": 12,
	"assignee": 34,
	"creator_detail": {
		"id": 12,
		"username": "mona",
		"full_name": "Mona Hassan",
		"email": "mona@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null
	},
	"assignee_detail": {
		"id": 34,
		"username": "omar",
		"full_name": "Omar Ali",
		"email": "omar@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null
	},
	"labels": [901],
	"board_column": 302,
	"due_at": "2026-06-30T18:00:00Z",
	"estimated_hours": "12.50",
	"actual_hours": null,
	"story_points": 5,
	"completed_at": null,
	"position": 20,
	"deleted_at": null,
	"created_at": "2026-06-15T08:20:00Z",
	"updated_at": "2026-06-15T08:25:00Z",
	"comments": [],
	"attachments": [],
	"checklists": [],
	"activity": []
}
```

**Create TaskLabel Request:**

```json
{
	"project": 101,
	"name": "Backend",
	"color": "#2563eb"
}
```

**TaskLabel Response Example:**

```json
{
	"id": 901,
	"project": 101,
	"name": "Backend",
	"color": "#2563eb",
	"created_at": "2026-06-15T08:18:00Z",
	"updated_at": "2026-06-15T08:18:00Z"
}
```

**Permissions and Rules:**

- Any project participant, member or supervisor, can create/update/delete tasks.
- Assignee must be a project member.
- Labels and board column must belong to the same project.
- Setting status to `done` automatically sets `completed_at`.
- Moving back from `done` clears `completed_at`.
- Creating or updating through the task serializer writes a read-only `TaskActivity` record and emits `task_update` notifications to other participants.
- Supported task query parameters are only `project`, `assignee`, and `status`.
- Search, ordering query parameters, generic filtering, and filter backends are unsupported.
- Successful task and label creates return `201 Created`; updates return `200 OK`; deletes return `204 No Content`.

### Task Comments and Attachments Panel

**Purpose:** Allow task discussion and file sharing.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List comments | GET | `/api/tasks/comments/` | Project participant |
| Create comment | POST | `/api/tasks/comments/` | Project participant |
| Get comment | GET | `/api/tasks/comments/{comment_id}/` | Project participant |
| Replace comment | PUT | `/api/tasks/comments/{comment_id}/` | Comment author |
| Update comment | PATCH | `/api/tasks/comments/{comment_id}/` | Comment author |
| Delete comment | DELETE | `/api/tasks/comments/{comment_id}/` | Comment author |
| List attachments | GET | `/api/tasks/attachments/` | Project participant |
| Upload attachment | POST | `/api/tasks/attachments/` | Project participant |
| Get attachment | GET | `/api/tasks/attachments/{attachment_id}/` | Project participant |
| Replace attachment | PUT | `/api/tasks/attachments/{attachment_id}/` | Project participant if visible in queryset |
| Update attachment | PATCH | `/api/tasks/attachments/{attachment_id}/` | Project participant if visible in queryset |
| Delete attachment | DELETE | `/api/tasks/attachments/{attachment_id}/` | Project participant if visible in queryset |

**Create Comment Request:**

```json
{
	"task": 401,
	"content": "API routes are ready for frontend integration."
}
```

**Upload Attachment Request:** multipart form-data

- `task`: task ID
- `file`: selected file

**TaskAttachment Upload Response:**

```json
{
	"id": 1201,
	"task": 401,
	"file": "/media/tasks/attachments/spec.pdf",
	"uploaded_by": 34,
	"created_at": "2026-06-15T08:35:00Z",
	"updated_at": "2026-06-15T08:35:00Z"
}
```

**Rules:**

- Any participant can comment or upload attachments.
- Only the comment author can edit/delete that comment.
- Attachment upload uses multipart form-data.
- Attachment upload returns `201 Created`; comment/attachment updates return `200 OK`; deletes return `204 No Content`.

### Task Checklists and Activity

**Purpose:** Track per-task checklist groups, checklist items, completion state, and task activity.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List checklists | GET | `/api/tasks/checklists/` | Project participant |
| Create checklist | POST | `/api/tasks/checklists/` | Project participant |
| Get checklist | GET | `/api/tasks/checklists/{checklist_id}/` | Project participant |
| Update checklist | PATCH | `/api/tasks/checklists/{checklist_id}/` | Project participant |
| Delete checklist | DELETE | `/api/tasks/checklists/{checklist_id}/` | Project participant |
| List checklist items | GET | `/api/tasks/checklist-items/` | Project participant |
| Create checklist item | POST | `/api/tasks/checklist-items/` | Project participant |
| Update checklist item | PATCH | `/api/tasks/checklist-items/{item_id}/` | Project participant |
| Delete checklist item | DELETE | `/api/tasks/checklist-items/{item_id}/` | Project participant |
| List activity | GET | `/api/tasks/activity/` | Project participant; read-only |
| Get activity record | GET | `/api/tasks/activity/{activity_id}/` | Project participant; read-only |

**Create Checklist Request:**

```json
{
	"task": 401,
	"title": "API acceptance checklist",
	"position": 1
}
```

**Create Checklist Item Request:**

```json
{
	"checklist": 1701,
	"content": "Document response schema",
	"is_completed": false,
	"position": 1
}
```

**Complete Checklist Item Request:**

```json
{
	"is_completed": true
}
```

**Rules:**

- Checklist and item records must belong to tasks visible to the authenticated participant.
- Setting `is_completed` to `true` stores `completed_by` and `completed_at`.
- Setting `is_completed` back to `false` clears completion fields.
- Task activity is generated by task create/update behavior and is read-only through the API.

### Sprint Planning Screen

**Purpose:** Manage sprint-methodology projects.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List sprints | GET | `/api/tasks/sprints/` | Project participant |
| Create sprint | POST | `/api/tasks/sprints/` | Project participant |
| Get sprint | GET | `/api/tasks/sprints/{sprint_id}/` | Project participant |
| Sprint dashboard | GET | `/api/tasks/sprints/{sprint_id}/dashboard/` | Project participant |
| Replace sprint | PUT | `/api/tasks/sprints/{sprint_id}/` | Project participant |
| Update sprint | PATCH | `/api/tasks/sprints/{sprint_id}/` | Project participant |
| Delete sprint | DELETE | `/api/tasks/sprints/{sprint_id}/` | Project participant; soft delete |
| List sprint task assignments | GET | `/api/tasks/sprint-tasks/` | Project participant |
| Assign task to sprint | POST | `/api/tasks/sprint-tasks/` | Project participant |
| Get sprint task assignment | GET | `/api/tasks/sprint-tasks/{sprint_task_id}/` | Project participant |
| Replace sprint task assignment | PUT | `/api/tasks/sprint-tasks/{sprint_task_id}/` | Project participant if visible in queryset |
| Update sprint task assignment | PATCH | `/api/tasks/sprint-tasks/{sprint_task_id}/` | Project participant if visible in queryset |
| Remove task from sprint | DELETE | `/api/tasks/sprint-tasks/{sprint_task_id}/` | Project participant if visible in queryset |

**Create Sprint Request:**

```json
{
	"project": 101,
	"name": "Sprint 1",
	"goal": "Deliver task CRUD and kanban UI.",
	"starts_at": "2026-07-01T09:00:00Z",
	"ends_at": "2026-07-14T17:00:00Z",
	"status": "planned"
}
```

**Start/Complete Sprint:**

```json
{
	"status": "active"
}
```

```json
{
	"status": "completed"
}
```

**Assign Task Request:**

```json
{
	"sprint": 601,
	"task": 401
}
```

**SprintTask Assignment Response:**

```json
{
	"id": 1301,
	"sprint": 601,
	"task": 401,
	"created_at": "2026-06-15T08:40:00Z",
	"updated_at": "2026-06-15T08:40:00Z"
}
```

**Rules:**

- Sprint records are valid only when `project.methodology == "sprint"`.
- `ends_at` must be after `starts_at`.
- A sprint task and task must belong to the same project.
- The sprint dashboard returns `current_sprint`, `backlog_count`, task counts, `story_points`, `velocity`, and serialized `sprint_tasks`.
- Creates return `201 Created`; sprint and sprint-task updates return `200 OK`; deletes return `204 No Content`.

### Milestone Timeline Screen

**Purpose:** Manage milestone-methodology projects.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List milestones | GET | `/api/tasks/milestones/` | Project participant |
| Create milestone | POST | `/api/tasks/milestones/` | Project participant |
| Get milestone | GET | `/api/tasks/milestones/{milestone_id}/` | Project participant |
| Milestone dashboard | GET | `/api/tasks/milestones/{milestone_id}/dashboard/` | Project participant |
| Replace milestone | PUT | `/api/tasks/milestones/{milestone_id}/` | Project participant |
| Update milestone | PATCH | `/api/tasks/milestones/{milestone_id}/` | Project participant |
| Delete milestone | DELETE | `/api/tasks/milestones/{milestone_id}/` | Project participant; soft delete |
| List milestone task assignments | GET | `/api/tasks/milestone-tasks/` | Project participant |
| Assign task to milestone | POST | `/api/tasks/milestone-tasks/` | Project participant |
| Get milestone task assignment | GET | `/api/tasks/milestone-tasks/{milestone_task_id}/` | Project participant |
| Replace milestone task assignment | PUT | `/api/tasks/milestone-tasks/{milestone_task_id}/` | Project participant if visible in queryset |
| Update milestone task assignment | PATCH | `/api/tasks/milestone-tasks/{milestone_task_id}/` | Project participant if visible in queryset |
| Remove task from milestone | DELETE | `/api/tasks/milestone-tasks/{milestone_task_id}/` | Project participant if visible in queryset |

**Create Milestone Request:**

```json
{
	"project": 101,
	"name": "Prototype Review",
	"description": "Demo the first working prototype.",
	"due_at": "2026-08-01T12:00:00Z",
	"status": "planned",
	"position": 1
}
```

**Complete Milestone:**

```json
{
	"status": "completed"
}
```

**Assign Task Request:**

```json
{
	"milestone": 701,
	"task": 401
}
```

**MilestoneTask Assignment Response:**

```json
{
	"id": 1401,
	"milestone": 701,
	"task": 401,
	"created_at": "2026-06-15T08:45:00Z",
	"updated_at": "2026-06-15T08:45:00Z"
}
```

**Rules:**

- Milestone records are valid only when `project.methodology == "milestone"`.
- A milestone task and task must belong to the same project.
- The milestone dashboard returns `milestone`, task counts, `progress_percent`, and serialized `tasks`.
- Creates return `201 Created`; milestone and milestone-task updates return `200 OK`; deletes return `204 No Content`.

### Kanban Board Screen

**Purpose:** Manage kanban-methodology columns and drag tasks between columns.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List columns | GET | `/api/tasks/board-columns/` | Project participant |
| Create column | POST | `/api/tasks/board-columns/` | Project participant |
| Get column | GET | `/api/tasks/board-columns/{column_id}/` | Project participant |
| Replace column | PUT | `/api/tasks/board-columns/{column_id}/` | Project participant |
| Update column | PATCH | `/api/tasks/board-columns/{column_id}/` | Project participant |
| Delete column | DELETE | `/api/tasks/board-columns/{column_id}/` | Project participant; soft delete |
| Kanban dashboard | GET | `/api/tasks/board-columns/dashboard/?project={project_id}` | Project participant |
| Reorder column | PATCH | `/api/tasks/board-columns/{column_id}/` | Project participant |
| Move task between columns | PATCH | `/api/tasks/{task_id}/` | Project participant |

**Create Column Request:**

```json
{
	"project": 101,
	"name": "In Review",
	"position": 30,
	"wip_limit": 4
}
```

**Drag-and-Drop Task Move:**

```json
{
	"board_column": 302,
	"status": "review",
	"position": 30
}
```

**Rules:**

- Board columns are valid only when `project.methodology == "kanban"`.
- The kanban dashboard returns serialized `columns`, serialized `tasks`, `throughput`, `blocked_tasks`, and `cycle_time_hours` (`null` until cycle-time tracking is added).
- Column creates return `201 Created`; updates return `200 OK`; deletes return `204 No Content`.

### Deliverables Screen

**Purpose:** Track required outputs, file submissions, and supervisor review.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List deliverables | GET | `/api/projects/deliverables/` | Project participant |
| Create deliverable | POST | `/api/projects/deliverables/` | Project participant |
| Get deliverable | GET | `/api/projects/deliverables/{deliverable_id}/` | Project participant |
| Replace deliverable | PUT | `/api/projects/deliverables/{deliverable_id}/` | Project participant if visible in queryset |
| Update deliverable | PATCH | `/api/projects/deliverables/{deliverable_id}/` | Project participant if visible in queryset |
| Delete deliverable | DELETE | `/api/projects/deliverables/{deliverable_id}/` | Project participant if visible in queryset; soft delete |
| Submit deliverable | POST | `/api/projects/deliverables/{deliverable_id}/submit/` | Project member only |
| Approve deliverable | POST | `/api/projects/deliverables/{deliverable_id}/approve/` | Project supervisor only |
| Reject deliverable | POST | `/api/projects/deliverables/{deliverable_id}/reject/` | Project supervisor only |
| Request deliverable revision | POST | `/api/projects/deliverables/{deliverable_id}/request-revision/` | Project supervisor only |
| List files | GET | `/api/projects/deliverable-files/` | Project participant |
| Upload file | POST | `/api/projects/deliverable-files/` | Project participant |
| Get file | GET | `/api/projects/deliverable-files/{file_id}/` | Project participant |
| Replace file | PUT | `/api/projects/deliverable-files/{file_id}/` | Project participant if visible in queryset |
| Update file | PATCH | `/api/projects/deliverable-files/{file_id}/` | Project participant if visible in queryset |
| Delete file | DELETE | `/api/projects/deliverable-files/{file_id}/` | Project participant if visible in queryset |

**Create Deliverable Request:**

```json
{
	"project": 101,
	"title": "Final Report",
	"description": "PDF report and source-code archive.",
	"due_at": "2026-09-10T23:59:00Z"
}
```

**Reject or Request Revision Body:**

```json
{
	"note": "Please add the evaluation results section."
}
```

**Deliverable Response Example:**

```json
{
	"id": 1501,
	"project": 101,
	"title": "Final Report",
	"description": "PDF report and source-code archive.",
	"due_at": "2026-09-10T23:59:00Z",
	"status": "draft",
	"created_by": 12,
	"submitted_at": null,
	"reviewed_by": null,
	"reviewed_at": null,
	"review_note": "",
	"deleted_at": null,
	"created_at": "2026-06-15T08:50:00Z",
	"updated_at": "2026-06-15T08:50:00Z",
	"files": []
}
```

**Upload Deliverable File Request:** multipart form-data

- `deliverable`: deliverable ID
- `file`: selected file

**DeliverableFile Upload Response:**

```json
{
	"id": 1601,
	"deliverable": 1501,
	"file": "/media/projects/deliverables/final-report.pdf",
	"uploaded_by": 34,
	"created_at": "2026-06-15T09:00:00Z",
	"updated_at": "2026-06-15T09:00:00Z"
}
```

**Rules:**

- Any project participant can create deliverables.
- Only project members can submit deliverables.
- Submitting a deliverable sets status to `pending` and stores `submitted_at`.
- Review status values are `pending`, `approved`, `rejected`, and `needs_revision`; legacy `submitted` is still accepted for existing records.
- Only project supervisors can approve, reject, or request revision for pending deliverables.
- Upload uses multipart form-data with `deliverable` and `file`.
- Deliverable and file creates return `201 Created`; submit/approve/reject/request-revision/update responses return `200 OK`; deletes return `204 No Content`.

### Meetings Screen

**Purpose:** Record meeting schedule/details for a project.

Meetings are records/notes only. This is not a video-conferencing system.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List meetings | GET | `/api/projects/meetings/` | Project participant |
| Create meeting | POST | `/api/projects/meetings/` | Project participant |
| Get meeting | GET | `/api/projects/meetings/{meeting_id}/` | Project participant |
| Replace meeting | PUT | `/api/projects/meetings/{meeting_id}/` | Project participant |
| Update meeting | PATCH | `/api/projects/meetings/{meeting_id}/` | Project participant |
| Delete meeting | DELETE | `/api/projects/meetings/{meeting_id}/` | Project participant; soft delete |
| List attendance records | GET | `/api/projects/meeting-attendance/` | Project participant |
| Create attendance record | POST | `/api/projects/meeting-attendance/` | Project participant |
| Update attendance record | PATCH | `/api/projects/meeting-attendance/{attendance_id}/` | Project participant |
| Delete attendance record | DELETE | `/api/projects/meeting-attendance/{attendance_id}/` | Project participant |
| List meeting notes | GET | `/api/projects/meeting-notes/` | Project participant |
| Create meeting note | POST | `/api/projects/meeting-notes/` | Project participant |
| Update meeting note | PATCH | `/api/projects/meeting-notes/{note_id}/` | Note author |
| Delete meeting note | DELETE | `/api/projects/meeting-notes/{note_id}/` | Note author |

**Create Meeting Request:**

```json
{
	"project": 101,
	"title": "Weekly supervisor sync",
	"description": "Discuss prototype progress.",
	"starts_at": "2026-07-05T10:00:00Z",
	"ends_at": "2026-07-05T10:30:00Z",
	"location": "Room 302",
	"attendees": [12, 34, 8]
}
```

**Create Attendance Record:**

```json
{
	"meeting": 1801,
	"user": 34,
	"status": "present",
	"note": "Joined online."
}
```

**Create Meeting Note:**

```json
{
	"meeting": 1801,
	"content": "Supervisor approved the revised milestone plan."
}
```

**Rules:**

- Any participant can create a meeting.
- `ends_at` must be after `starts_at`.
- Attendance status values are `invited`, `present`, `absent`, and `excused`.
- Meeting note `author` is set from the authenticated user.
- Creates return `201 Created`; updates return `200 OK`; deletes return `204 No Content`.

### Feedback Screen

**Purpose:** Show supervisor feedback in one place without burying it in notifications.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List feedback | GET | `/api/projects/feedback/` | Project participant |
| Create feedback | POST | `/api/projects/feedback/` | Project supervisor only |
| Get feedback | GET | `/api/projects/feedback/{feedback_id}/` | Project participant |
| Update feedback | PATCH | `/api/projects/feedback/{feedback_id}/` | Feedback author |
| Delete feedback | DELETE | `/api/projects/feedback/{feedback_id}/` | Feedback author |

**Create Project Feedback Request:**

```json
{
	"project": 101,
	"content": "The scope is acceptable; focus on measurable evaluation."
}
```

**Create Task Feedback Request:**

```json
{
	"task": 401,
	"content": "Add error handling tests before closing this task."
}
```

**Rules:**

- Feedback must belong to exactly one target: `project`, `task`, `deliverable`, or `meeting`.
- Only assigned project supervisors can create feedback.
- Feedback creation sends `feedback` notifications to project members.

### Notifications Center

**Purpose:** Show system, invitation, request, task, comment, feedback, meeting, deliverable review, and approval notifications.

**Used APIs:**

| Action | Method | URL | Permission |
| ------ | ------ | --- | ---------- |
| List notifications | GET | `/api/notifications/` | Authenticated recipient; returns only own notifications |
| Create notification | POST | `/api/notifications/` | Authenticated user; `recipient` and `actor` are saved as current user |
| List unread only | GET | `/api/notifications/?unread=true` | Authenticated recipient; returns only own unread notifications |
| Get notification | GET | `/api/notifications/{notification_id}/` | Notification recipient only |
| Replace notification | PUT | `/api/notifications/{notification_id}/` | Notification recipient only |
| Update notification | PATCH | `/api/notifications/{notification_id}/` | Notification recipient only |
| Delete notification | DELETE | `/api/notifications/{notification_id}/` | Notification recipient only |
| Unread count | GET | `/api/notifications/unread-count/` | Authenticated recipient |
| Mark one read | POST | `/api/notifications/{notification_id}/mark-read/` | Notification recipient only |
| Mark all read | POST | `/api/notifications/mark-all-read/` | Authenticated recipient |

**Notification Response Example:**

```json
{
	"id": 1001,
	"recipient": 34,
	"actor": 12,
	"actor_detail": {
		"id": 12,
		"username": "mona",
		"full_name": "Mona Hassan",
		"email": "mona@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null
	},
	"notification_type": "invitation",
	"title": "Project invitation",
	"message": "You were invited to join Smart Attendance.",
	"data": {
		"project_id": 101,
		"invitation_id": 801
	},
	"read_at": null,
	"is_read": false,
	"created_at": "2026-06-15T08:30:00Z"
}
```

**Notification Query Parameters:**

- `unread=true`, `unread=1`, and `unread=yes` filter the list to notifications where `read_at` is `null`.
- Other `unread` values are ignored by the implementation and return the same result as an unfiltered list.
- No search, ordering, pagination, or generic notification filters are implemented.

**Mark All Read Response:**

```json
{
	"updated": 3
}
```

**Unread Count Response:**

```json
{
	"count": 3
}
```

**Status Codes:**

- `200 OK`: List, retrieve, update, mark read, mark all read, unread count.
- `201 Created`: Create notification.
- `204 No Content`: Delete notification.
- `401 Unauthorized`: Missing or invalid JWT.
- `404 Not Found`: Notification does not exist or does not belong to the authenticated user.

## 3.5 Notification Websocket Behavior

**Connection URL:**

```text
ws://localhost:8000/ws/notifications/?token=<access_token>
```

The middleware also supports an `Authorization: Bearer <access_token>` header when the websocket client can send custom headers.

**Authentication:** Required JWT. Unauthenticated connections close with code `4401`.

**Event Type:** `notification`

**Payload Example:**

```json
{
	"type": "notification",
	"notification": {
		"id": 1001,
		"notification_type": "task_assignment",
		"title": "Task assigned",
		"message": "You were assigned: Build attendance API",
		"data": {
			"project_id": 101,
			"task_id": 401
		},
		"actor_id": 12,
		"read_at": null,
		"created_at": "2026-06-15T08:30:00Z"
	}
}
```

Notifications are currently generated for project invitations, join requests, supervisor requests, invitation/join/supervisor responses, supervisor modification requests, task assignment, task updates, task comments, deliverable reviews, meeting changes, and supervisor feedback.

Read-state changes from `mark-read` and `mark-all-read` do not emit websocket events in the current implementation. Refresh notification state through the REST endpoints after marking notifications read.

## 3.6 Permissions Matrix

| Action | Student | Leader | Doctor | TA |
| ------ | ------- | ------ | ------ | -- |
| Create Project | Yes | Yes | Yes in code | Yes in code |
| Edit Project | No | Yes | No | No |
| Delete Project | No | Yes | No | No |
| Activate Project | No | Yes | No | No |
| Submit Project | No | Yes | No | No |
| Approve Final Submission | No | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Archive Project | No | Yes | No | No |
| Send Invitation | No | Yes | No | No |
| Accept Own Invitation | Yes | Yes | Yes | Yes |
| Send Join Request | Yes | Yes if not already member | Yes in code | Yes in code |
| Accept Join Request | No | Yes | No | No |
| Transfer Leadership | Missing | Missing | Missing | Missing |
| Leave Team | Missing | Missing | Missing | Missing |
| Send Supervisor Request | No | Yes | No | No |
| Accept/Reject/Request Modification on Supervisor Request | No | No | Yes when requested | Yes when requested |
| Create/Update ProjectSupervisor Record | No | Yes with accepted request | No | No |
| Assign TA | No | Partially via secondary supervisor request | No | Accepts request |
| Create Task | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Edit Task | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Delete Task | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Manage Task Labels | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Manage Task Checklists | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Upload Task Attachment | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Start Sprint | Participant can PATCH status | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Complete Sprint | Participant can PATCH status | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Assign Sprint Task | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Assign Milestone Task | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Upload Deliverable File | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Approve Deliverable | No | No | Yes if supervisor on project | Yes if supervisor on project |
| Reject Deliverable | No | No | Yes if supervisor on project | Yes if supervisor on project |
| Request Deliverable Revision | No | No | Yes if supervisor on project | Yes if supervisor on project |
| Create Meeting | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Manage Meeting Attendance/Notes | Participant only | Yes | Yes if supervisor on project | Yes if supervisor on project |
| Create Feedback | No | No | Yes if supervisor on project | Yes if supervisor on project |
| Read/Update Own Notifications | Own notifications only | Own notifications only | Own notifications only | Own notifications only |

## 3.7 Common Error Patterns

| Error | Typical Cause |
| ----- | ------------- |
| `401 Unauthorized` | Missing, expired, or invalid JWT. |
| `403 Forbidden` | User is not the leader, invitee, requested supervisor, comment author, or project participant required for the action. |
| `400 Bad Request` with capacity message | Project has reached `max_members`. |
| `400 Bad Request` with minimum team message | Project has not reached `min_members` during activation. |
| `400 Bad Request` with methodology message | Creating sprint data for a non-sprint project, milestone data for a non-milestone project, or board columns for a non-kanban project. |
| `400 Bad Request` with supervisor title message | Primary supervisor must be a doctor; secondary supervisor must be a TA. |
| `400 Bad Request` with feedback target message | Feedback did not include exactly one of `project`, `task`, `deliverable`, or `meeting`. |
| `400 Bad Request` with duplicate/unique constraint | Duplicate pending invitation, join request, supervisor role request, label name, board column name, or one-to-one sprint/milestone task assignment. |

## 3.8 Quick Endpoint Reference

### Projects

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/` |
| GET/PATCH/PUT/DELETE | `/api/projects/{id}/` |
| POST | `/api/projects/{id}/activate/` |
| POST | `/api/projects/{id}/submit/` |
| POST | `/api/projects/{id}/approve-submission/` |
| POST | `/api/projects/{id}/archive/` |

### Memberships

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/memberships/` |
| GET/PATCH/PUT/DELETE | `/api/projects/memberships/{id}/` |

### Invitations

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/invitations/` |
| GET/PATCH/PUT/DELETE | `/api/projects/invitations/{id}/` |
| POST | `/api/projects/invitations/{id}/accept/` |
| POST | `/api/projects/invitations/{id}/reject/` |

### Join Requests

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/join-requests/` |
| GET/PATCH/PUT/DELETE | `/api/projects/join-requests/{id}/` |
| POST | `/api/projects/join-requests/{id}/accept/` |
| POST | `/api/projects/join-requests/{id}/reject/` |

### Supervision

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/supervisor-requests/` |
| GET/PATCH/PUT/DELETE | `/api/projects/supervisor-requests/{id}/` |
| POST | `/api/projects/supervisor-requests/{id}/accept/` |
| POST | `/api/projects/supervisor-requests/{id}/reject/` |
| POST | `/api/projects/supervisor-requests/{id}/request-modification/` |
| GET/POST | `/api/projects/supervisors/` |
| GET/PATCH/PUT/DELETE | `/api/projects/supervisors/{id}/` |

### Tasks

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/{id}/` |
| GET | `/api/tasks/?project={project_id}` |
| GET | `/api/tasks/?assignee={user_id}` |
| GET | `/api/tasks/?status={status}` |

### Comments

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/comments/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/comments/{id}/` |

### Attachments

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/attachments/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/attachments/{id}/` |

### Checklists and Activity

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/checklists/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/checklists/{id}/` |
| GET/POST | `/api/tasks/checklist-items/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/checklist-items/{id}/` |
| GET | `/api/tasks/activity/` |
| GET | `/api/tasks/activity/{id}/` |

### Labels

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/labels/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/labels/{id}/` |

### Sprint

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/sprints/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/sprints/{id}/` |
| GET | `/api/tasks/sprints/{id}/dashboard/` |
| GET/POST | `/api/tasks/sprint-tasks/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/sprint-tasks/{id}/` |

### Milestone

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/milestones/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/milestones/{id}/` |
| GET | `/api/tasks/milestones/{id}/dashboard/` |
| GET/POST | `/api/tasks/milestone-tasks/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/milestone-tasks/{id}/` |

### Kanban

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/tasks/board-columns/` |
| GET/PATCH/PUT/DELETE | `/api/tasks/board-columns/{id}/` |
| GET | `/api/tasks/board-columns/dashboard/?project={project_id}` |
| PATCH | `/api/tasks/{task_id}/` |

### Deliverables

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/deliverables/` |
| GET/PATCH/PUT/DELETE | `/api/projects/deliverables/{id}/` |
| POST | `/api/projects/deliverables/{id}/submit/` |
| POST | `/api/projects/deliverables/{id}/approve/` |
| POST | `/api/projects/deliverables/{id}/reject/` |
| POST | `/api/projects/deliverables/{id}/request-revision/` |
| GET/POST | `/api/projects/deliverable-files/` |
| GET/PATCH/PUT/DELETE | `/api/projects/deliverable-files/{id}/` |

### Meetings

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/meetings/` |
| GET/PATCH/PUT/DELETE | `/api/projects/meetings/{id}/` |
| GET/POST | `/api/projects/meeting-attendance/` |
| GET/PATCH/PUT/DELETE | `/api/projects/meeting-attendance/{id}/` |
| GET/POST | `/api/projects/meeting-notes/` |
| GET/PATCH/PUT/DELETE | `/api/projects/meeting-notes/{id}/` |

### Project Taxonomy / Selectors

| Method | Endpoint |
| ------ | -------- |
| GET | `/api/projects/categories/` |
| GET | `/api/projects/semesters/` |
| GET | `/api/projects/academic-years/` |
| GET | `/api/projects/technologies/search/?q={query}` |

### Feedback

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/projects/feedback/` |
| GET/PATCH/PUT/DELETE | `/api/projects/feedback/{id}/` |

### Notifications

| Method | Endpoint |
| ------ | -------- |
| GET/POST | `/api/notifications/` |
| GET/PATCH/PUT/DELETE | `/api/notifications/{id}/` |
| GET | `/api/notifications/unread-count/` |
| POST | `/api/notifications/{id}/mark-read/` |
| POST | `/api/notifications/mark-all-read/` |
| WS | `/ws/notifications/?token={access_token}` |
