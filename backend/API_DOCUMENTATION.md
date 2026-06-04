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
