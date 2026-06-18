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
  - [Supervision](#supervision)
  - [Tasks](#tasks)
  - [Task Labels](#task-labels)
  - [Task Comments](#task-comments)
  - [Task Attachments](#task-attachments)
  - [Task Checklists](#task-checklists)
  - [Checklist Items](#checklist-items)
  - [Task Activity](#task-activity)
  - [Sprints](#sprints)
  - [Sprint-Task Assignments](#sprint-task-assignments)
  - [Milestones](#milestones)
  - [Milestone-Task Assignments](#milestone-task-assignments)
  - [Kanban Board Columns](#kanban-board-columns)
  - [Deliverables](#deliverables)
  - [Deliverable Files](#deliverable-files)
  - [Meetings](#meetings)
  - [Meeting Attendance](#meeting-attendance)
  - [Meeting Notes](#meeting-notes)
  - [Feedback](#feedback)
  - [Notifications](#notifications-1)
  - [Notification Websocket](#notification-websocket)
  - [Common Status Codes](#common-status-codes)
  - [Permissions Summary](#permissions-summary)

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

### Get Students (for invitations)

**Endpoint:** `GET /students/`
**Authentication:** Required (Bearer Token)
**Description:** Returns a list of users with `role = STUDENT`. Use this to populate the invitee selector when sending project invitations.
**Success Response:**

```json
[
	{
		"id": 34,
		"username": "omar",
		"full_name": "Omar Ali",
		"email": "omar@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null,
		"department": { "id": 1, "name": "Computer Science" },
		"academic_level": { "id": 4, "name": "Senior (Level 4)" },
		"gpa": 3.8,
		"tags": [
			{ "id": 1, "name": "Python", "is_official": true },
			{ "id": 5, "name": "JavaScript", "is_official": true }
		],
		"description": "Passionate about ML and full-stack development."
	},
	{
		"id": 12,
		"username": "mona",
		"full_name": "Mona Hassan",
		"email": "mona@uni.edu.eg",
		"role": "STUDENT",
		"avatar_url": null,
		"department": { "id": 2, "name": "Information Systems" },
		"academic_level": { "id": 2, "name": "Sophomore (Level 2)" },
		"gpa": 3.5,
		"tags": [
			{ "id": 2, "name": "Django", "is_official": true }
		],
		"description": "Interested in backend development and databases."
	}
]
```

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
| Get Students              | GET    | `/students/`             | Yes  |

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
| `Subject` | `id`, `name`, `code`, `credit_hours`, `description` |
| `Project` | `id`, `creator_detail`, `memberships`, `supervisors`, `name`, `description`, `category` (nested `{id, name}`), `semester` (nested `{id, name}`), `academic_year` (nested `{id, name}`), `technologies` (array of `{id, name, is_official}`), `project_type`, `methodology`, `status`, `min_members`, `max_members`, `is_public`, `proposal`, `abstract`, `expected_scope`, `repository_url`, `documentation_url`, `archive_year`, `archive_tags` (response: array of `{id, name, is_official}`; write: mixed array of integer IDs or raw strings), `deleted_at`, `created_at`, `updated_at`, `creator` |
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

**Get Subjects**

**Endpoint:** `GET /api/projects/subjects/`
**Authentication:** None Required
**Description:** Returns a list of all academic subjects. Ordered by `code`.
**Success Response:**
```json
[
	{ "id": 1, "name": "Data Structures", "code": "CS201", "credit_hours": 3, "description": "Fundamental data structures and algorithms." },
	{ "id": 2, "name": "Database Systems", "code": "CS301", "credit_hours": 3, "description": "Relational databases and SQL." }
]
```

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
	"expected_scope": "Authentication, face matching, attendance exports, and dashboard.",
	"archive_tags": [1, "Machine Learning"]                                // Optional: Mixed array of integer IDs and raw strings
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
	"archive_tags": [1, "Machine Learning"]
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

**Note on invitee selection:** Populate the invitee dropdown by calling `GET /api/users/students/` which returns all users with `role = STUDENT`.

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

---

### Supervision Screen

**Base URL:** `/api/projects`

**Purpose:** Graduation leaders request doctors/TAs, and supervisors review incoming requests.

---

#### Send Supervisor Request

**Endpoint:** `POST /api/projects/supervisor-requests/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **project leader** to send a supervision request to a doctor (`role: "primary"`) or TA (`role: "secondary"`). If the project is a graduation project, its status is automatically set to `under_review`.

**Request Body:**

```json
{
    "project": 101,                                              // REQUIRED: Integer ID of the project
    "supervisor": 8,                                             // REQUIRED: Integer ID of the doctor/TA
    "role": "primary",                                           // Optional, defaults to "primary". Values: "primary" | "secondary"
    "message": "Would you supervise our graduation project?",    // Optional: Custom message to the supervisor
    "proposal": "Full project proposal text.",                   // Optional: Detailed proposal
    "abstract": "Short project abstract.",                       // Optional: Brief project summary
    "technology_names": [1, "React", "SQL Server"],              // Optional: Mixed array of integer IDs and raw strings. Defaults to project's current technologies
    "expected_scope": "Authentication, project workspace..."     // Optional: Expected project scope
}
```

**Success Response (201 Created):**

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

**Common Errors:**
- `400 Bad Request`: Invalid `project`, `supervisor`, or `role` value.
- `400 Bad Request`: Primary supervisor must be a DOCTOR; secondary must be a TA.
- `403 Forbidden`: Only the project leader can send supervisor requests.

---

#### List Supervisor Requests

**Endpoint:** `GET /api/projects/supervisor-requests/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **requested supervisor**, **requester**, or **project member** to view all supervisor requests they have access to. Ordered newest first.

**Success Response (200 OK):**

```json
[
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
            {"id": 1, "name": "Django", "is_official": true}
        ],
        "expected_scope": "Authentication, project workspace, reports, and demo.",
        "modification_note": "",
        "status": "pending",
        "responded_at": null,
        "created_at": "2026-06-15T08:10:00Z",
        "updated_at": "2026-06-15T08:10:00Z"
    }
]
```

---

#### Get Supervisor Request

**Endpoint:** `GET /api/projects/supervisor-requests/{request_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **requested supervisor**, **requester**, or **project member** to view a single supervisor request's details.

**Success Response (200 OK):** Same shape as a single object in the List response above.

---

#### Replace Supervisor Request

**Endpoint:** `PUT /api/projects/supervisor-requests/{request_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **project leader** to fully replace a supervisor request. All required fields must be provided.

**Request Body:** Same shape as the Send Supervisor Request body.

**Success Response (200 OK):** Same shape as the Send Supervisor Request response (with updated values).

---

#### Update Supervisor Request

**Endpoint:** `PATCH /api/projects/supervisor-requests/{request_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **project leader** to partially update a supervisor request. Only provided fields are changed.

**Request Body:** Any subset of the Send Supervisor Request fields.

**Success Response (200 OK):** Same shape as the Send Supervisor Request response (with updated values).

---

#### Delete Supervisor Request

**Endpoint:** `DELETE /api/projects/supervisor-requests/{request_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by any **authenticated user** who has visibility of the request to delete it.

**Request Body:** None

**Success Response:** `204 No Content`

---

#### Accept Supervisor Request

**Endpoint:** `POST /api/projects/supervisor-requests/{request_id}/accept/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **requested doctor/TA** to accept the supervision request. Automatically creates a `ProjectSupervisor` record linking them to the project.

**Request Body:** None

**Success Response (200 OK):** Same shape as the Send Supervisor Request response with `status: "accepted"`.

---

#### Reject Supervisor Request

**Endpoint:** `POST /api/projects/supervisor-requests/{request_id}/reject/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **requested doctor/TA** to reject the supervision request. No `ProjectSupervisor` record is created.

**Request Body:** None

**Success Response (200 OK):** Same shape as the Send Supervisor Request response with `status: "rejected"`.

---

#### Request Modification

**Endpoint:** `POST /api/projects/supervisor-requests/{request_id}/request-modification/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **requested doctor/TA** to request changes to the supervision request. Sets `status` to `needs_modification` and stores the modification note. Sends a feedback notification to the requester.

**Request Body:**

```json
{
    "note": "Please update the proposal with more technical details."    // REQUIRED: Explanation of what needs to change
}
```

**Success Response (200 OK):** Same shape as the Send Supervisor Request response with `status: "needs_modification"` and `modification_note` populated.

---

#### List Project Supervisors

**Endpoint:** `GET /api/projects/supervisors/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project members** or **assigned supervisors** to view all supervisor assignment records for their projects.

**Success Response (200 OK):**

```json
[
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
]
```

---

#### Get Project Supervisor

**Endpoint:** `GET /api/projects/supervisors/{supervisor_record_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project members** or **assigned supervisors** to view a single supervisor assignment record.

**Success Response (200 OK):** Same shape as a single object in the List response above.

---

#### Create Project Supervisor

**Endpoint:** `POST /api/projects/supervisors/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **project leader** to manually create a supervisor assignment record. Requires a matching accepted `SupervisorRequest` with the same `project`, `supervisor`, and `role`. The normal flow creates this automatically when a supervisor accepts a request; this endpoint is a fallback.

**Request Body:**

```json
{
    "project": 101,              // REQUIRED: Integer ID of the project
    "supervisor": 8,             // REQUIRED: Integer ID of the doctor/TA
    "role": "primary"            // REQUIRED: "primary" | "secondary"
}
```

**Success Response (201 Created):**

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

**Common Errors:**
- `400 Bad Request`: "A matching accepted supervisor request is required."
- `400 Bad Request`: Primary supervisor must be a DOCTOR; secondary must be a TA.
- `403 Forbidden`: Only the project leader can perform this action.

---

#### Replace Project Supervisor

**Endpoint:** `PUT /api/projects/supervisors/{supervisor_record_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **project leader** to fully replace a supervisor assignment record.

**Request Body:** Same shape as the Create Project Supervisor body.

**Success Response (200 OK):** Same shape as the Create Project Supervisor response (with updated values).

---

#### Update Project Supervisor

**Endpoint:** `PATCH /api/projects/supervisors/{supervisor_record_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **project leader** to partially update a supervisor assignment record.

**Request Body:** Any subset of the Create Project Supervisor fields.

**Success Response (200 OK):** Same shape as the Create Project Supervisor response (with updated values).

---

#### Delete Project Supervisor

**Endpoint:** `DELETE /api/projects/supervisors/{supervisor_record_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **project leader** to remove a supervisor assignment from the project.

**Request Body:** None

**Success Response:** `204 No Content`

---

#### Supervision Rules

- `primary` role requires a supervisor profile with title `DOCTOR`.
- `secondary` role requires a supervisor profile with title `TA`.
- Only project leaders can send supervisor requests or create/update/delete supervisor records.
- Sending a request for a graduation project sets the project status to `under_review`.
- Accepting a request automatically creates a `ProjectSupervisor` record and sets the request status to `accepted`.
- Requesting modification sets the request status to `needs_modification`.
- There is no supervisor search endpoint. Use `GET /api/users/students/` to find supervisors.

---

### Base URL: `/api/tasks`

---

## Tasks

### List Tasks

**Endpoint:** `GET /api/tasks/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** (members or supervisors) to list tasks. Supports filtering by `project`, `assignee`, and `status` via query parameters.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | Integer | Optional | Filter by project ID |
| `assignee` | Integer | Optional | Filter by assignee user ID |
| `status` | String | Optional | Filter by status (`todo`, `in_progress`, `review`, `done`) |

**Success Response (200 OK):**

```json
[
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
]
```

---

### Create Task

**Endpoint:** `POST /api/tasks/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a new task.

**Request Body:**

```json
{
    "project": 101,                                                           // REQUIRED: Integer ID of the project
    "title": "Build attendance API",                                          // REQUIRED: Max 255 characters
    "description": "Create endpoints for session check-in.",                  // Optional
    "status": "todo",                                                         // Optional, defaults to "todo". Values: "todo" | "in_progress" | "review" | "done"
    "priority": "high",                                                       // Optional, defaults to "medium". Values: "low" | "medium" | "high" | "urgent"
    "assignee": 34,                                                           // Optional: Integer ID of a project member
    "labels": [901],                                                          // Optional: Array of label IDs that belong to the same project
    "board_column": 301,                                                      // Optional: Integer ID of a board column in the same project
    "due_at": "2026-06-30T18:00:00Z",                                         // Optional: ISO 8601 datetime
    "estimated_hours": "12.50",                                               // Optional: Decimal up to 9999.99
    "actual_hours": null,                                                     // Optional: Decimal up to 9999.99
    "story_points": 5,                                                        // Optional: Positive integer
    "position": 10                                                            // Optional: Positive integer for ordering, defaults to 0
}
```

**Success Response (201 Created):** Same shape as a single object in List Tasks.

---

### Get Task

**Endpoint:** `GET /api/tasks/{task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single task's details, including comments, attachments, checklists, and activity.

**Success Response (200 OK):** Same shape as a single object in List Tasks.

---

### Replace Task

**Endpoint:** `PUT /api/tasks/{task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace a task. All required fields must be provided.

**Request Body:** Same shape as Create Task.

**Success Response (200 OK):** The updated Task object.

---

### Update Task / Move Task

**Endpoint:** `PATCH /api/tasks/{task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a task. Use this endpoint for drag-and-drop moves (changing `board_column`, `status`, and `position`).

**Request Body (partial update):**

```json
{
    "status": "in_progress",         // Optional: Change status
    "board_column": 302,             // Optional: Move to a different column
    "position": 20                   // Optional: Reorder within column
}
```

**Success Response (200 OK):** The updated Task object.

**Auto-behaviors:**
- Setting `status` to `"done"` automatically sets `completed_at`.
- Changing `status` away from `"done"` clears `completed_at`.
- Creating or updating a task generates a `TaskActivity` record and emits `task_update` notifications to other participants.

---

### Delete Task

**Endpoint:** `DELETE /api/tasks/{task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to soft-delete a task.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Task Labels

### List Labels

**Endpoint:** `GET /api/tasks/labels/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all task labels.

**Success Response (200 OK):**

```json
[
    {
        "id": 901,
        "project": 101,
        "name": "Backend",
        "color": "#2563eb",
        "created_at": "2026-06-15T08:18:00Z",
        "updated_at": "2026-06-15T08:18:00Z"
    }
]
```

---

### Create Label

**Endpoint:** `POST /api/tasks/labels/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a new task label.

**Request Body:**

```json
{
    "project": 101,              // REQUIRED: Integer ID of the project
    "name": "Backend",           // REQUIRED: Max 100 characters
    "color": "#2563eb"           // REQUIRED: Hex color code
}
```

**Success Response (201 Created):** Same shape as a single object in List Labels.

---

### Get Label

**Endpoint:** `GET /api/tasks/labels/{label_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single label.

**Success Response (200 OK):** Same shape as a single object in List Labels.

---

### Replace Label

**Endpoint:** `PUT /api/tasks/labels/{label_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace a label.

**Request Body:** Same shape as Create Label.

**Success Response (200 OK):** The updated Label object.

---

### Update Label

**Endpoint:** `PATCH /api/tasks/labels/{label_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a label.

**Request Body:** Any subset of Create Label fields.

**Success Response (200 OK):** The updated Label object.

---

### Delete Label

**Endpoint:** `DELETE /api/tasks/labels/{label_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to delete a label.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Task Comments

### List Comments

**Endpoint:** `GET /api/tasks/comments/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all task comments.

**Success Response (200 OK):**

```json
[
    {
        "id": 1101,
        "task": 401,
        "author": 34,
        "author_detail": {
            "id": 34,
            "username": "omar",
            "full_name": "Omar Ali",
            "email": "omar@uni.edu.eg",
            "role": "STUDENT",
            "avatar_url": null
        },
        "content": "API routes are ready for frontend integration.",
        "created_at": "2026-06-15T08:30:00Z",
        "updated_at": "2026-06-15T08:30:00Z"
    }
]
```

---

### Create Comment

**Endpoint:** `POST /api/tasks/comments/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to add a comment to a task.

**Request Body:**

```json
{
    "task": 401,                  // REQUIRED: Integer ID of the task
    "content": "API routes are ready for frontend integration."    // REQUIRED: Comment text
}
```

**Success Response (201 Created):** Same shape as a single object in List Comments.

---

### Get Comment

**Endpoint:** `GET /api/tasks/comments/{comment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single comment.

**Success Response (200 OK):** Same shape as a single object in List Comments.

---

### Replace Comment

**Endpoint:** `PUT /api/tasks/comments/{comment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **comment author** only to fully replace a comment.

**Request Body:** Same shape as Create Comment.

**Success Response (200 OK):** The updated Comment object.

---

### Update Comment

**Endpoint:** `PATCH /api/tasks/comments/{comment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **comment author** only to partially update a comment.

**Request Body:** Any subset of Create Comment fields.

**Success Response (200 OK):** The updated Comment object.

---

### Delete Comment

**Endpoint:** `DELETE /api/tasks/comments/{comment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **comment author** only to delete a comment.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Task Attachments

### List Attachments

**Endpoint:** `GET /api/tasks/attachments/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all task attachments.

**Success Response (200 OK):**

```json
[
    {
        "id": 1201,
        "task": 401,
        "file": "/media/tasks/attachments/spec.pdf",
        "uploaded_by": 34,
        "created_at": "2026-06-15T08:35:00Z",
        "updated_at": "2026-06-15T08:35:00Z"
    }
]
```

---

### Upload Attachment

**Endpoint:** `POST /api/tasks/attachments/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to upload a file attachment to a task. Uses multipart form-data.

**Request Body (multipart/form-data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task` | Integer | REQUIRED | ID of the task to attach to |
| `file` | File | REQUIRED | The file to upload |

**Success Response (201 Created):** Same shape as a single object in List Attachments.

---

### Get Attachment

**Endpoint:** `GET /api/tasks/attachments/{attachment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single attachment record.

**Success Response (200 OK):** Same shape as a single object in List Attachments.

---

### Replace Attachment

**Endpoint:** `PUT /api/tasks/attachments/{attachment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace an attachment.

**Request Body:** Same shape as Upload Attachment (multipart/form-data).

**Success Response (200 OK):** The updated Attachment object.

---

### Update Attachment

**Endpoint:** `PATCH /api/tasks/attachments/{attachment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update an attachment.

**Request Body (multipart/form-data):** Any subset of Upload Attachment fields.

**Success Response (200 OK):** The updated Attachment object.

---

### Delete Attachment

**Endpoint:** `DELETE /api/tasks/attachments/{attachment_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to delete an attachment.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Task Checklists

### List Checklists

**Endpoint:** `GET /api/tasks/checklists/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all checklists for their tasks.

**Success Response (200 OK):**

```json
[
    {
        "id": 1701,
        "task": 401,
        "title": "API acceptance checklist",
        "position": 1,
        "items": [],
        "created_at": "2026-06-15T08:40:00Z",
        "updated_at": "2026-06-15T08:40:00Z"
    }
]
```

---

### Create Checklist

**Endpoint:** `POST /api/tasks/checklists/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a new checklist group on a task.

**Request Body:**

```json
{
    "task": 401,                  // REQUIRED: Integer ID of the task
    "title": "API acceptance checklist",  // REQUIRED: Max 255 characters
    "position": 1                 // Optional: Positive integer for ordering, defaults to 0
}
```

**Success Response (201 Created):** Same shape as a single object in List Checklists.

---

### Get Checklist

**Endpoint:** `GET /api/tasks/checklists/{checklist_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single checklist with its items.

**Success Response (200 OK):** Same shape as a single object in List Checklists.

---

### Update Checklist

**Endpoint:** `PATCH /api/tasks/checklists/{checklist_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a checklist.

**Request Body:** Any subset of Create Checklist fields.

**Success Response (200 OK):** The updated Checklist object.

---

### Delete Checklist

**Endpoint:** `DELETE /api/tasks/checklists/{checklist_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to delete a checklist and all its items.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Checklist Items

### List Checklist Items

**Endpoint:** `GET /api/tasks/checklist-items/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all checklist items.

**Success Response (200 OK):**

```json
[
    {
        "id": 1751,
        "checklist": 1701,
        "content": "Document response schema",
        "is_completed": false,
        "completed_by": null,
        "completed_at": null,
        "completed_by_detail": null,
        "position": 1,
        "created_at": "2026-06-15T08:41:00Z",
        "updated_at": "2026-06-15T08:41:00Z"
    }
]
```

---

### Create Checklist Item

**Endpoint:** `POST /api/tasks/checklist-items/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to add an item to a checklist.

**Request Body:**

```json
{
    "checklist": 1701,                                                       // REQUIRED: Integer ID of the checklist
    "content": "Document response schema",                                    // REQUIRED: Max 255 characters
    "is_completed": false,                                                    // Optional: defaults to false
    "position": 1                                                             // Optional: Positive integer for ordering, defaults to 0
}
```

**Success Response (201 Created):** Same shape as a single object in List Checklist Items.

---

### Update Checklist Item

**Endpoint:** `PATCH /api/tasks/checklist-items/{item_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to update a checklist item (e.g., mark as complete).

**Request Body (Complete Item):**

```json
{
    "is_completed": true       // Optional: Setting to true auto-sets completed_by and completed_at
}
```

**Success Response (200 OK):** The updated Checklist Item object.

**Auto-behaviors:**
- Setting `is_completed` from `false` to `true`: stores `completed_by` (current user) and `completed_at`.
- Setting `is_completed` from `true` to `false`: clears `completed_by` and `completed_at`.

---

### Delete Checklist Item

**Endpoint:** `DELETE /api/tasks/checklist-items/{item_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to delete a checklist item.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Task Activity

### List Activity

**Endpoint:** `GET /api/tasks/activity/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view read-only activity history for their tasks. Activity records are auto-generated on task create/update and cannot be created via API.

**Success Response (200 OK):**

```json
[
    {
        "id": 1801,
        "task": 401,
        "actor": 12,
        "actor_detail": {
            "id": 12,
            "username": "mona",
            "full_name": "Mona Hassan",
            "email": "mona@uni.edu.eg",
            "role": "STUDENT",
            "avatar_url": null
        },
        "action": "created",
        "message": "Task created",
        "data": {},
        "created_at": "2026-06-15T08:20:00Z",
        "updated_at": "2026-06-15T08:20:00Z"
    }
]
```

---

### Get Activity Record

**Endpoint:** `GET /api/tasks/activity/{activity_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single activity record.

**Success Response (200 OK):** Same shape as a single object in List Activity.

---

## Sprints

### List Sprints

**Endpoint:** `GET /api/tasks/sprints/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all sprints (only valid for sprint-methodology projects).

**Success Response (200 OK):**

```json
[
    {
        "id": 601,
        "project": 101,
        "name": "Sprint 1",
        "goal": "Deliver task CRUD and kanban UI.",
        "starts_at": "2026-07-01T09:00:00Z",
        "ends_at": "2026-07-14T17:00:00Z",
        "status": "planned",
        "deleted_at": null,
        "created_at": "2026-06-15T08:40:00Z",
        "updated_at": "2026-06-15T08:40:00Z"
    }
]
```

---

### Create Sprint

**Endpoint:** `POST /api/tasks/sprints/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a sprint for a sprint-methodology project.

**Request Body:**

```json
{
    "project": 101,                                              // REQUIRED: Integer ID of the project
    "name": "Sprint 1",                                          // REQUIRED: Max 255 characters
    "goal": "Deliver task CRUD and kanban UI.",                  // Optional
    "starts_at": "2026-07-01T09:00:00Z",                         // REQUIRED: ISO 8601 datetime
    "ends_at": "2026-07-14T17:00:00Z",                           // REQUIRED: ISO 8601 datetime, must be after starts_at
    "status": "planned"                                          // Optional, defaults to "planned". Values: "planned" | "active" | "completed"
}
```

**Success Response (201 Created):** Same shape as a single object in List Sprints.

---

### Get Sprint

**Endpoint:** `GET /api/tasks/sprints/{sprint_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single sprint.

**Success Response (200 OK):** Same shape as a single object in List Sprints.

---

### Sprint Dashboard

**Endpoint:** `GET /api/tasks/sprints/{sprint_id}/dashboard/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view sprint statistics. Returns sprint data, backlog count, task counts, story points, velocity, and sprint tasks.

**Success Response (200 OK):** Custom dashboard object with sprint metrics.

---

### Replace Sprint

**Endpoint:** `PUT /api/tasks/sprints/{sprint_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace a sprint.

**Request Body:** Same shape as Create Sprint.

**Success Response (200 OK):** The updated Sprint object.

---

### Update Sprint (Start/Complete)

**Endpoint:** `PATCH /api/tasks/sprints/{sprint_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to update a sprint. Use this to start or complete a sprint by changing the status.

**Request Body (Start):**

```json
{
    "status": "active"
}
```

**Request Body (Complete):**

```json
{
    "status": "completed"
}
```

**Success Response (200 OK):** The updated Sprint object.

---

### Delete Sprint

**Endpoint:** `DELETE /api/tasks/sprints/{sprint_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to soft-delete a sprint.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Sprint-Task Assignments

### List Sprint-Task Assignments

**Endpoint:** `GET /api/tasks/sprint-tasks/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all sprint-task assignments.

**Success Response (200 OK):**

```json
[
    {
        "id": 1301,
        "sprint": 601,
        "task": 401,
        "created_at": "2026-06-15T08:40:00Z",
        "updated_at": "2026-06-15T08:40:00Z"
    }
]
```

---

### Assign Task to Sprint

**Endpoint:** `POST /api/tasks/sprint-tasks/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to assign a task to a sprint. Both must belong to the same project.

**Request Body:**

```json
{
    "sprint": 601,               // REQUIRED: Integer ID of the sprint
    "task": 401                  // REQUIRED: Integer ID of the task
}
```

**Success Response (201 Created):** Same shape as a single object in List Sprint-Task Assignments.

---

### Get Sprint-Task Assignment

**Endpoint:** `GET /api/tasks/sprint-tasks/{sprint_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single sprint-task assignment.

**Success Response (200 OK):** Same shape as a single object in List Sprint-Task Assignments.

---

### Replace Sprint-Task Assignment

**Endpoint:** `PUT /api/tasks/sprint-tasks/{sprint_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to replace a sprint-task assignment.

**Request Body:** Same shape as Assign Task to Sprint.

**Success Response (200 OK):** The updated SprintTask object.

---

### Update Sprint-Task Assignment

**Endpoint:** `PATCH /api/tasks/sprint-tasks/{sprint_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a sprint-task assignment.

**Request Body:** Any subset of Assign Task to Sprint fields.

**Success Response (200 OK):** The updated SprintTask object.

---

### Remove Task from Sprint

**Endpoint:** `DELETE /api/tasks/sprint-tasks/{sprint_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to remove a task from a sprint.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Milestones

### List Milestones

**Endpoint:** `GET /api/tasks/milestones/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all milestones (only valid for milestone-methodology projects).

**Success Response (200 OK):**

```json
[
    {
        "id": 701,
        "project": 101,
        "name": "Prototype Review",
        "description": "Demo the first working prototype.",
        "due_at": "2026-08-01T12:00:00Z",
        "status": "planned",
        "position": 1,
        "deleted_at": null,
        "created_at": "2026-06-15T08:45:00Z",
        "updated_at": "2026-06-15T08:45:00Z"
    }
]
```

---

### Create Milestone

**Endpoint:** `POST /api/tasks/milestones/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a milestone for a milestone-methodology project.

**Request Body:**

```json
{
    "project": 101,                                              // REQUIRED: Integer ID of the project
    "name": "Prototype Review",                                   // REQUIRED: Max 255 characters
    "description": "Demo the first working prototype.",          // Optional
    "due_at": "2026-08-01T12:00:00Z",                            // REQUIRED: ISO 8601 datetime
    "status": "planned",                                          // Optional, defaults to "planned". Values: "planned" | "in_progress" | "completed"
    "position": 1                                                 // Optional: Positive integer, defaults to 0
}
```

**Success Response (201 Created):** Same shape as a single object in List Milestones.

---

### Get Milestone

**Endpoint:** `GET /api/tasks/milestones/{milestone_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single milestone.

**Success Response (200 OK):** Same shape as a single object in List Milestones.

---

### Milestone Dashboard

**Endpoint:** `GET /api/tasks/milestones/{milestone_id}/dashboard/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view milestone progress statistics (total/completed tasks, progress percentage).

**Success Response (200 OK):** Custom dashboard object with milestone metrics.

---

### Replace Milestone

**Endpoint:** `PUT /api/tasks/milestones/{milestone_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace a milestone.

**Request Body:** Same shape as Create Milestone.

**Success Response (200 OK):** The updated Milestone object.

---

### Update Milestone (Complete)

**Endpoint:** `PATCH /api/tasks/milestones/{milestone_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to update a milestone. Use this to mark a milestone as completed.

**Request Body (Complete):**

```json
{
    "status": "completed"
}
```

**Success Response (200 OK):** The updated Milestone object.

---

### Delete Milestone

**Endpoint:** `DELETE /api/tasks/milestones/{milestone_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to soft-delete a milestone.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Milestone-Task Assignments

### List Milestone-Task Assignments

**Endpoint:** `GET /api/tasks/milestone-tasks/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all milestone-task assignments.

**Success Response (200 OK):**

```json
[
    {
        "id": 1401,
        "milestone": 701,
        "task": 401,
        "created_at": "2026-06-15T08:45:00Z",
        "updated_at": "2026-06-15T08:45:00Z"
    }
]
```

---

### Assign Task to Milestone

**Endpoint:** `POST /api/tasks/milestone-tasks/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to assign a task to a milestone. Both must belong to the same project.

**Request Body:**

```json
{
    "milestone": 701,            // REQUIRED: Integer ID of the milestone
    "task": 401                  // REQUIRED: Integer ID of the task
}
```

**Success Response (201 Created):** Same shape as a single object in List Milestone-Task Assignments.

---

### Get Milestone-Task Assignment

**Endpoint:** `GET /api/tasks/milestone-tasks/{milestone_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single milestone-task assignment.

**Success Response (200 OK):** Same shape as a single object in List Milestone-Task Assignments.

---

### Replace Milestone-Task Assignment

**Endpoint:** `PUT /api/tasks/milestone-tasks/{milestone_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to replace a milestone-task assignment.

**Request Body:** Same shape as Assign Task to Milestone.

**Success Response (200 OK):** The updated MilestoneTask object.

---

### Update Milestone-Task Assignment

**Endpoint:** `PATCH /api/tasks/milestone-tasks/{milestone_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a milestone-task assignment.

**Request Body:** Any subset of Assign Task to Milestone fields.

**Success Response (200 OK):** The updated MilestoneTask object.

---

### Remove Task from Milestone

**Endpoint:** `DELETE /api/tasks/milestone-tasks/{milestone_task_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to remove a task from a milestone.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Kanban Board Columns

### List Columns

**Endpoint:** `GET /api/tasks/board-columns/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all board columns (only valid for kanban-methodology projects).

**Success Response (200 OK):**

```json
[
    {
        "id": 301,
        "project": 101,
        "name": "In Review",
        "position": 30,
        "wip_limit": 4,
        "deleted_at": null,
        "created_at": "2026-06-15T08:15:00Z",
        "updated_at": "2026-06-15T08:15:00Z"
    }
]
```

---

### Create Column

**Endpoint:** `POST /api/tasks/board-columns/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a board column for a kanban-methodology project.

**Request Body:**

```json
{
    "project": 101,              // REQUIRED: Integer ID of the project
    "name": "In Review",         // REQUIRED: Max 100 characters, unique per project
    "position": 30,              // Optional: Positive integer for ordering, defaults to 0
    "wip_limit": 4               // Optional: Work-in-progress limit
}
```

**Success Response (201 Created):** Same shape as a single object in List Columns.

---

### Get Column

**Endpoint:** `GET /api/tasks/board-columns/{column_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single board column.

**Success Response (200 OK):** Same shape as a single object in List Columns.

---

### Replace Column

**Endpoint:** `PUT /api/tasks/board-columns/{column_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace a board column.

**Request Body:** Same shape as Create Column.

**Success Response (200 OK):** The updated BoardColumn object.

---

### Update Column (Reorder)

**Endpoint:** `PATCH /api/tasks/board-columns/{column_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to update a board column. Use this to reorder columns by changing the `position`.

**Request Body:**

```json
{
    "position": 40               // Optional: Change position for reordering
}
```

**Success Response (200 OK):** The updated BoardColumn object.

---

### Delete Column

**Endpoint:** `DELETE /api/tasks/board-columns/{column_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to soft-delete a board column.

**Request Body:** None

**Success Response:** `204 No Content`

---

### Kanban Dashboard

**Endpoint:** `GET /api/tasks/board-columns/dashboard/?project={project_id}`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view the full kanban board: columns, tasks in each column, throughput, blocked tasks, and cycle time.

**Success Response (200 OK):** Custom dashboard object with columns, tasks, throughput count, blocked task count, and cycle time hours.

---

### Base URL: `/api/projects`

---

## Deliverables

### List Deliverables

**Endpoint:** `GET /api/projects/deliverables/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all deliverables.

**Success Response (200 OK):**

```json
[
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
]
```

---

### Create Deliverable

**Endpoint:** `POST /api/projects/deliverables/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a deliverable for a project.

**Request Body:**

```json
{
    "project": 101,                                              // REQUIRED: Integer ID of the project
    "title": "Final Report",                                      // REQUIRED: Max 255 characters
    "description": "PDF report and source-code archive.",         // Optional
    "due_at": "2026-09-10T23:59:00Z"                             // Optional: ISO 8601 datetime
}
```

**Success Response (201 Created):** Same shape as a single object in List Deliverables.

---

### Get Deliverable

**Endpoint:** `GET /api/projects/deliverables/{deliverable_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single deliverable and its files.

**Success Response (200 OK):** Same shape as a single object in List Deliverables.

---

### Replace Deliverable

**Endpoint:** `PUT /api/projects/deliverables/{deliverable_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace a deliverable.

**Request Body:** Same shape as Create Deliverable.

**Success Response (200 OK):** The updated Deliverable object.

---

### Update Deliverable

**Endpoint:** `PATCH /api/projects/deliverables/{deliverable_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a deliverable.

**Request Body:** Any subset of Create Deliverable fields.

**Success Response (200 OK):** The updated Deliverable object.

---

### Delete Deliverable

**Endpoint:** `DELETE /api/projects/deliverables/{deliverable_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to soft-delete a deliverable.

**Request Body:** None

**Success Response:** `204 No Content`

---

### Submit Deliverable

**Endpoint:** `POST /api/projects/deliverables/{deliverable_id}/submit/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project members only** to submit a deliverable for review. Sets status to `pending` and stores `submitted_at`.

**Request Body:** None

**Success Response (200 OK):** The updated Deliverable object with `status: "pending"`.

---

### Approve Deliverable

**Endpoint:** `POST /api/projects/deliverables/{deliverable_id}/approve/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project supervisors only** to approve a submitted deliverable.

**Request Body:**

```json
{
    "note": "Looks good, approved."          // Optional: Review note
}
```

**Success Response (200 OK):** The updated Deliverable object with `status: "approved"`.

---

### Reject Deliverable

**Endpoint:** `POST /api/projects/deliverables/{deliverable_id}/reject/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project supervisors only** to reject a submitted deliverable.

**Request Body:**

```json
{
    "note": "Please add the evaluation results section."    // Optional: Reason for rejection
}
```

**Success Response (200 OK):** The updated Deliverable object with `status: "rejected"`.

---

### Request Deliverable Revision

**Endpoint:** `POST /api/projects/deliverables/{deliverable_id}/request-revision/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project supervisors only** to request changes to a submitted deliverable.

**Request Body:**

```json
{
    "note": "Please add the evaluation results section."    // Optional: Revision instructions
}
```

**Success Response (200 OK):** The updated Deliverable object with `status: "needs_revision"`.

---

## Deliverable Files

### List Deliverable Files

**Endpoint:** `GET /api/projects/deliverable-files/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all deliverable files.

**Success Response (200 OK):**

```json
[
    {
        "id": 1601,
        "deliverable": 1501,
        "file": "/media/projects/deliverables/final-report.pdf",
        "uploaded_by": 34,
        "created_at": "2026-06-15T09:00:00Z",
        "updated_at": "2026-06-15T09:00:00Z"
    }
]
```

---

### Upload Deliverable File

**Endpoint:** `POST /api/projects/deliverable-files/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to upload a file to a deliverable. Uses multipart form-data.

**Request Body (multipart/form-data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `deliverable` | Integer | REQUIRED | ID of the deliverable |
| `file` | File | REQUIRED | The file to upload |

**Success Response (201 Created):** Same shape as a single object in List Deliverable Files.

---

### Get Deliverable File

**Endpoint:** `GET /api/projects/deliverable-files/{file_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single deliverable file record.

**Success Response (200 OK):** Same shape as a single object in List Deliverable Files.

---

### Replace Deliverable File

**Endpoint:** `PUT /api/projects/deliverable-files/{file_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to replace a deliverable file.

**Request Body (multipart/form-data):** Same shape as Upload Deliverable File.

**Success Response (200 OK):** The updated DeliverableFile object.

---

### Update Deliverable File

**Endpoint:** `PATCH /api/projects/deliverable-files/{file_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a deliverable file.

**Request Body (multipart/form-data):** Any subset of Upload Deliverable File fields.

**Success Response (200 OK):** The updated DeliverableFile object.

---

### Delete Deliverable File

**Endpoint:** `DELETE /api/projects/deliverable-files/{file_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to delete a deliverable file.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Meetings

### List Meetings

**Endpoint:** `GET /api/projects/meetings/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all meetings for their projects. Meetings are records/notes only (not a video-conferencing system).

**Success Response (200 OK):**

```json
[
    {
        "id": 1801,
        "project": 101,
        "title": "Weekly supervisor sync",
        "description": "Discuss prototype progress.",
        "starts_at": "2026-07-05T10:00:00Z",
        "ends_at": "2026-07-05T10:30:00Z",
        "location": "Room 302",
        "created_by": 12,
        "attendees": [12, 34, 8],
        "deleted_at": null,
        "created_at": "2026-06-15T09:00:00Z",
        "updated_at": "2026-06-15T09:00:00Z",
        "notes": [],
        "attendance_records": []
    }
]
```

---

### Create Meeting

**Endpoint:** `POST /api/projects/meetings/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create a meeting record.

**Request Body:**

```json
{
    "project": 101,                                              // REQUIRED: Integer ID of the project
    "title": "Weekly supervisor sync",                            // REQUIRED: Max 255 characters
    "description": "Discuss prototype progress.",                 // Optional
    "starts_at": "2026-07-05T10:00:00Z",                         // REQUIRED: ISO 8601 datetime
    "ends_at": "2026-07-05T10:30:00Z",                           // Optional: ISO 8601 datetime, must be after starts_at
    "location": "Room 302",                                       // Optional: Max 255 characters
    "attendees": [12, 34, 8]                                     // Optional: Array of user IDs
}
```

**Success Response (201 Created):** Same shape as a single object in List Meetings.

---

### Get Meeting

**Endpoint:** `GET /api/projects/meetings/{meeting_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single meeting with its notes and attendance records.

**Success Response (200 OK):** Same shape as a single object in List Meetings.

---

### Replace Meeting

**Endpoint:** `PUT /api/projects/meetings/{meeting_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to fully replace a meeting.

**Request Body:** Same shape as Create Meeting.

**Success Response (200 OK):** The updated Meeting object.

---

### Update Meeting

**Endpoint:** `PATCH /api/projects/meetings/{meeting_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to partially update a meeting.

**Request Body:** Any subset of Create Meeting fields.

**Success Response (200 OK):** The updated Meeting object.

---

### Delete Meeting

**Endpoint:** `DELETE /api/projects/meetings/{meeting_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to soft-delete a meeting.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Meeting Attendance

### List Attendance Records

**Endpoint:** `GET /api/projects/meeting-attendance/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all meeting attendance records.

**Success Response (200 OK):**

```json
[
    {
        "id": 1901,
        "meeting": 1801,
        "user": 34,
        "user_detail": {
            "id": 34,
            "username": "omar",
            "full_name": "Omar Ali",
            "email": "omar@uni.edu.eg",
            "role": "STUDENT",
            "avatar_url": null
        },
        "status": "present",
        "note": "Joined online.",
        "created_at": "2026-06-15T09:05:00Z",
        "updated_at": "2026-06-15T09:05:00Z"
    }
]
```

---

### Create Attendance Record

**Endpoint:** `POST /api/projects/meeting-attendance/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to create an attendance record for a meeting.

**Request Body:**

```json
{
    "meeting": 1801,                       // REQUIRED: Integer ID of the meeting
    "user": 34,                            // REQUIRED: Integer ID of the user
    "status": "present",                   // Optional, defaults to "invited". Values: "invited" | "present" | "absent" | "excused"
    "note": "Joined online."               // Optional
}
```

**Success Response (201 Created):** Same shape as a single object in List Attendance Records.

---

### Update Attendance Record

**Endpoint:** `PATCH /api/projects/meeting-attendance/{attendance_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to update an attendance record (e.g., change status).

**Request Body:** Any subset of Create Attendance Record fields.

**Success Response (200 OK):** The updated MeetingAttendance object.

---

### Delete Attendance Record

**Endpoint:** `DELETE /api/projects/meeting-attendance/{attendance_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to delete an attendance record.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Meeting Notes

### List Meeting Notes

**Endpoint:** `GET /api/projects/meeting-notes/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all meeting notes.

**Success Response (200 OK):**

```json
[
    {
        "id": 2001,
        "meeting": 1801,
        "author": 34,
        "author_detail": {
            "id": 34,
            "username": "omar",
            "full_name": "Omar Ali",
            "email": "omar@uni.edu.eg",
            "role": "STUDENT",
            "avatar_url": null
        },
        "content": "Supervisor approved the revised milestone plan.",
        "created_at": "2026-06-15T09:10:00Z",
        "updated_at": "2026-06-15T09:10:00Z"
    }
]
```

---

### Create Meeting Note

**Endpoint:** `POST /api/projects/meeting-notes/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to add a note to a meeting.

**Request Body:**

```json
{
    "meeting": 1801,                                              // REQUIRED: Integer ID of the meeting
    "content": "Supervisor approved the revised milestone plan."   // REQUIRED: Note text
}
```

**Success Response (201 Created):** Same shape as a single object in List Meeting Notes.

---

### Update Meeting Note

**Endpoint:** `PATCH /api/projects/meeting-notes/{note_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **note author** only to update a meeting note.

**Request Body:** Any subset of Create Meeting Note fields.

**Success Response (200 OK):** The updated MeetingNote object.

---

### Delete Meeting Note

**Endpoint:** `DELETE /api/projects/meeting-notes/{note_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **note author** only to delete a meeting note.

**Request Body:** None

**Success Response:** `204 No Content`

---

## Feedback

### List Feedback

**Endpoint:** `GET /api/projects/feedback/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to list all feedback entries.

**Success Response (200 OK):**

```json
[
    {
        "id": 2101,
        "project": 101,
        "task": null,
        "deliverable": null,
        "meeting": null,
        "author": 8,
        "author_detail": {
            "id": 8,
            "username": "dr.samir",
            "full_name": "Samir Nabil",
            "email": "samir@uni.edu.eg",
            "role": "SUPERVISOR",
            "avatar_url": null
        },
        "content": "The scope is acceptable; focus on measurable evaluation.",
        "created_at": "2026-06-15T09:15:00Z",
        "updated_at": "2026-06-15T09:15:00Z"
    }
]
```

---

### Create Feedback

**Endpoint:** `POST /api/projects/feedback/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project supervisors only** to provide feedback. Must attach to exactly one target: `project`, `task`, `deliverable`, or `meeting`.

**Request Body:**

```json
{
    "project": 101,                                              // Optional: Integer ID of the project (provide exactly one target)
    "task": null,                                                 // Optional: Integer ID of the task
    "deliverable": null,                                          // Optional: Integer ID of the deliverable
    "meeting": null,                                              // Optional: Integer ID of the meeting
    "content": "The scope is acceptable; focus on measurable evaluation."    // REQUIRED: Feedback text
}
```

**Success Response (201 Created):** Same shape as a single object in List Feedback.

---

### Get Feedback

**Endpoint:** `GET /api/projects/feedback/{feedback_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by **project participants** to view a single feedback entry.

**Success Response (200 OK):** Same shape as a single object in List Feedback.

---

### Update Feedback

**Endpoint:** `PATCH /api/projects/feedback/{feedback_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **feedback author** only to update feedback.

**Request Body:** Any subset of Create Feedback fields.

**Success Response (200 OK):** The updated Feedback object.

---

### Delete Feedback

**Endpoint:** `DELETE /api/projects/feedback/{feedback_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **feedback author** only to delete feedback.

**Request Body:** None

**Success Response:** `204 No Content`

---

### Base URL: `/api/notifications`

---

## Notifications

### List Notifications

**Endpoint:** `GET /api/notifications/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **authenticated user** to view their own notifications. Optionally filter by `?unread=true` to see only unread notifications.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `unread` | String | Optional | `true`, `1`, or `yes` filters to unread notifications only |

**Success Response (200 OK):**

```json
[
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
]
```

---

### Create Notification

**Endpoint:** `POST /api/notifications/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by any **authenticated user** to create a notification. Both `recipient` and `actor` are force-set to the current user (you can only create notifications for yourself). For sending notifications to other users, the system uses programmatic calls via `services.create_notification()`.

**Request Body:**

```json
{
    "notification_type": "invitation",                // REQUIRED: Values: "invitation" | "request" | "approval" | "comment" | "task_assignment" | "task_update" | "feedback" | "meeting" | "deliverable_review" | "system"
    "title": "Project Invitation",                     // REQUIRED: Max 255 characters
    "message": "You have been invited to...",          // REQUIRED: Notification body text
    "data": {}                                         // Optional: Arbitrary JSON payload
}
```

**Success Response (201 Created):** Same shape as a single object in List Notifications.

---

### Get Notification

**Endpoint:** `GET /api/notifications/{notification_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **notification recipient** to view a single notification.

**Success Response (200 OK):** Same shape as a single object in List Notifications.

---

### Replace Notification

**Endpoint:** `PUT /api/notifications/{notification_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **notification recipient** to fully replace a notification.

**Request Body:** Same shape as Create Notification.

**Success Response (200 OK):** The updated Notification object.

---

### Update Notification

**Endpoint:** `PATCH /api/notifications/{notification_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **notification recipient** to partially update a notification.

**Request Body:** Any subset of Create Notification fields.

**Success Response (200 OK):** The updated Notification object.

---

### Delete Notification

**Endpoint:** `DELETE /api/notifications/{notification_id}/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **notification recipient** to delete a notification.

**Request Body:** None

**Success Response:** `204 No Content`

---

### Unread Count

**Endpoint:** `GET /api/notifications/unread-count/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **authenticated user** to get the count of their unread notifications.

**Success Response (200 OK):**

```json
{
    "count": 3
}
```

---

### Mark One Read

**Endpoint:** `POST /api/notifications/{notification_id}/mark-read/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **notification recipient** to mark a single notification as read. Sets `read_at` to the current time.

**Request Body:** None

**Success Response (200 OK):** The updated Notification object with `read_at` set.

---

### Mark All Read

**Endpoint:** `POST /api/notifications/mark-all-read/`
**Authentication:** Required (Bearer Token)

**Description:**
Used by the **authenticated user** to mark all their unread notifications as read.

**Request Body:** None

**Success Response (200 OK):**

```json
{
    "updated": 3
}
```

---

## Notification Websocket

**Connection URL:** `ws://localhost:8000/ws/notifications/?token=<access_token>`

**Authentication:** Required JWT. The token can be passed as a query parameter (`?token=<jwt>`) or as an `Authorization: Bearer <jwt>` header. Unauthenticated connections close with code `4401`.

**Description:**
The websocket pushes newly created notifications in real-time to the authenticated recipient. When a notification is created programmatically (e.g., when someone sends you an invitation), it is pushed to your websocket connection.

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

**Note:** Read-state changes from `mark-read` and `mark-all-read` do not emit websocket events. Refresh notification state through the REST endpoints after marking notifications read.

---

## Common Status Codes

| Status Code | Meaning |
|-------------|---------|
| `200 OK` | Successful read, update, or custom action |
| `201 Created` | Successful resource creation |
| `204 No Content` | Successful deletion |
| `400 Bad Request` | Validation error (invalid fields, missing required fields, business rule violation) |
| `401 Unauthorized` | Missing, expired, or invalid JWT |
| `403 Forbidden` | User lacks permission for the action |
| `404 Not Found` | Resource does not exist or is outside the user's visible queryset |

---

## Permissions Summary

| Role | Tasks | Labels | Comments | Attachments | Checklists | Checklist Items | Sprints | Milestones | Board Columns | Deliverables | Deliverable Files | Meetings | Attendance | Meeting Notes | Feedback | Notifications |
|------|-------|--------|----------|-------------|------------|-----------------|---------|------------|---------------|--------------|-------------------|----------|------------|---------------|----------|---------------|
| Project Member | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | Create, Submit | CRUD | CRUD | CRUD | Create | View only | Own only |
| Project Leader | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | View only | Own only |
| Project Supervisor | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | Approve/Reject/Review | CRUD | CRUD | CRUD | CRUD | Create, CRUD own | Own only |
| Non-participant | None | None | None | None | None | None | None | None | None | None | None | None | None | None | None | Own only |

**Notes:**
- "CRUD" = Create, Read, Update, Delete (full access to that resource).
- Comment authors can edit/delete their own comments. Meeting note authors can edit/delete their own notes. Feedback authors can edit/delete their own feedback.
- Deliverable submit is member-only. Approve/reject/request-revision are supervisor-only.
- Feedback creation is supervisor-only.
- Activity records are read-only for all participants.
