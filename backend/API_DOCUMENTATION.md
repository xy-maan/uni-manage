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

## Base URL

```
http://localhost:8000/api/users
```

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. After successful login, you'll receive:

- `access`: Valid for 1 day
- `refresh`: Valid for 7 days

Include the access token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <access_token>
```

---

## Google OAuth Complete Flow

### Overview

The backend handles the entire OAuth flow. The frontend only needs to:

1. Link users to the auth endpoint
2. Handle the success/error redirects
3. Store the received tokens

### Step-by-Step Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │    Google    │     │   Frontend   │
│  (Next.js)   │     │   (Django)   │     │    OAuth     │     │   Callback   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │  1. User clicks    │                    │                    │
       │  "Login with       │                    │                    │
       │   Google" link     │                    │                    │
       │ ─────────────────► │                    │                    │
       │                    │                    │                    │
       │                    │  2. Redirect to    │                    │
       │                    │  Google OAuth      │                    │
       │                    │ ─────────────────► │                    │
       │                    │                    │                    │
       │                    │                    │  3. User logs in   │
       │                    │                    │  with Google       │
       │                    │                    │                    │
       │                    │  4. Google sends   │                    │
       │                    │  auth code back    │                    │
       │                    │ ◄───────────────── │                    │
       │                    │                    │                    │
       │                    │  5. Backend        │                    │
       │                    │  exchanges code    │                    │
       │                    │  for tokens &      │                    │
       │                    │  creates/logs in   │                    │
       │                    │  user              │                    │
       │                    │                    │                    │
       │                    │  6. Redirect to    │                    │
       │                    │  frontend with     │                    │
       │                    │  JWT tokens        │                    │
       │                    │ ───────────────────────────────────────►│
       │                    │                    │                    │
       │                    │                    │    7. Frontend     │
       │                    │                    │    extracts tokens │
       │                    │                    │    from URL and    │
       │                    │                    │    stores them     │
       │                    │                    │                    │
```

### Step 1: Initiate Login

Create a login button that links to the backend auth endpoint:

```tsx
// components/LoginButton.tsx
export function GoogleLoginButton() {
	const handleLogin = () => {
		window.location.href = 'http://localhost:8000/api/users/auth/google/';
	};

	return <button onClick={handleLogin}>Login with Google</button>;
}
```

**What happens:** User is redirected to Google's login page.

### Step 2: Create Success Callback Page

Create a page at `/auth/success` to receive the tokens:

```tsx
// app/auth/success/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccess() {
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const accessToken = searchParams.get('access_token');
		const refreshToken = searchParams.get('refresh_token');

		if (accessToken && refreshToken) {
			localStorage.setItem('access_token', accessToken);
			localStorage.setItem('refresh_token', refreshToken);

			checkUserStatus(accessToken);
		} else {
			router.push('/login?error=no_tokens');
		}
	}, [searchParams, router]);

	const checkUserStatus = async (token: string) => {
		try {
			const response = await fetch('http://localhost:8000/api/users/status/', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();

				if (data.is_complete) {
					if (data.role === 'STUDENT') {
						router.push('/student/dashboard');
					} else {
						router.push('/supervisor/dashboard');
					}
				} else {
					router.push('/complete-profile');
				}
			} else {
				router.push('/login?error=invalid_token');
			}
		} catch (error) {
			router.push('/login?error=network_error');
		}
	};

	return (
		<div>
			<p>Authenticating...</p>
		</div>
	);
}
```

### Step 3: Create Error Callback Page

Create a page at `/auth/error` to handle OAuth errors:

```tsx
// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');

	const errorMessages: Record<string, string> = {
		access_denied: 'You denied access to your Google account.',
		no_code: 'No authorization code received from Google.',
		network_error: 'Network error occurred. Please try again.',
		login_failed: 'Failed to create your account. Please try again.',
		'Use your .edu.eg email.':
			'You must use a university email (.edu.eg) to register.',
		default: 'An error occurred during authentication.',
	};

	const message = errorMessages[error || ''] || errorMessages['default'];

	return (
		<div>
			<h1>Authentication Error</h1>
			<p>{message}</p>
			<Link href="/login">Try Again</Link>
		</div>
	);
}
```

### Step 4: Complete Profile Page

After successful authentication, new users need to complete their profile:

```tsx
// app/complete-profile/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
	const router = useRouter();
	const [role, setRole] = useState<'STUDENT' | 'SUPERVISOR' | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [studentData, setStudentData] = useState({
		major: '',
		academic_level: '',
		skills: [] as string[],
		gpa: 0,
	});

	const [supervisorData, setSupervisorData] = useState({
		department: '',
		expertise: [] as string[],
		is_professor: true,
	});

	const handleSubmit = async () => {
		const token = localStorage.getItem('access_token');
		if (!token) {
			router.push('/login');
			return;
		}

		setLoading(true);
		setError('');

		const body =
			role === 'STUDENT'
				? { role, ...studentData }
				: { role, ...supervisorData };

		try {
			const response = await fetch(
				'http://localhost:8000/api/users/profile/complete/',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(body),
				},
			);

			if (response.ok) {
				if (role === 'STUDENT') {
					router.push('/student/dashboard');
				} else {
					router.push('/supervisor/dashboard');
				}
			} else {
				const data = await response.json();
				setError(data.error || 'Failed to complete profile');
			}
		} catch (err) {
			setError('Network error. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h1>Complete Your Profile</h1>

			{!role && (
				<div>
					<p>Select your role:</p>
					<button onClick={() => setRole('STUDENT')}>I am a Student</button>
					<button onClick={() => setRole('SUPERVISOR')}>
						I am a Supervisor
					</button>
				</div>
			)}

			{role === 'STUDENT' && (
				<div>
					<input
						placeholder="Major"
						value={studentData.major}
						onChange={(e) =>
							setStudentData({ ...studentData, major: e.target.value })
						}
					/>
					<select
						value={studentData.academic_level}
						onChange={(e) =>
							setStudentData({ ...studentData, academic_level: e.target.value })
						}
					>
						<option value="">Select Level</option>
						<option value="Freshman">Freshman</option>
						<option value="Sophomore">Sophomore</option>
						<option value="Junior">Junior</option>
						<option value="Senior">Senior</option>
					</select>
					<input
						type="number"
						placeholder="GPA"
						step="0.1"
						min="0"
						max="4"
						value={studentData.gpa || ''}
						onChange={(e) =>
							setStudentData({
								...studentData,
								gpa: parseFloat(e.target.value),
							})
						}
					/>
					<button onClick={handleSubmit} disabled={loading}>
						{loading ? 'Saving...' : 'Complete Profile'}
					</button>
				</div>
			)}

			{role === 'SUPERVISOR' && (
				<div>
					<input
						placeholder="Department"
						value={supervisorData.department}
						onChange={(e) =>
							setSupervisorData({
								...supervisorData,
								department: e.target.value,
							})
						}
					/>
					<label>
						<input
							type="checkbox"
							checked={supervisorData.is_professor}
							onChange={(e) =>
								setSupervisorData({
									...supervisorData,
									is_professor: e.target.checked,
								})
							}
						/>
						I am a Professor (uncheck if TA)
					</label>
					<button onClick={handleSubmit} disabled={loading}>
						{loading ? 'Saving...' : 'Complete Profile'}
					</button>
				</div>
			)}

			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
}
```

---

## Endpoints

### Authentication Endpoints

#### 1. Google Auth Redirect

**Endpoint:** `GET /auth/google/`

**Description:** Initiates Google OAuth flow by redirecting to Google's authorization page.

**Authentication:** None required

**Usage:** Link or redirect users to this URL to start login.

**Response:** HTTP 302 redirect to Google OAuth.

---

#### 2. Google Auth Callback

**Endpoint:** `GET /auth/google/callback/`

**Description:** Handles the OAuth callback from Google. Exchanges auth code for tokens, creates/authenticates user, and redirects to frontend.

**Authentication:** None required

**Query Parameters (set by Google):**

- `code`: Authorization code from Google
- `error`: Error message if user denied access

**Success Response:** HTTP 302 redirect to:

```
http://localhost:3000/auth/success?access_token=<jwt>&refresh_token=<jwt>
```

**Error Response:** HTTP 302 redirect to:

```
http://localhost:3000/auth/error?error=<error_message>
```

**Possible Errors:**

- `access_denied`: User denied Google access
- `no_code`: No authorization code received
- `network_error`: Failed to communicate with Google
- `Use your .edu.eg email.`: User's email is not a university email

---

#### 3. Direct Google Login (Alternative)

**Endpoint:** `POST /login/google/`

**Description:** Authenticate with Google tokens directly (for frontend-initiated OAuth flows).

**Authentication:** None required

**Request Body:**

```json
{
	"access_token": "google_oauth_access_token",
	"id_token": "google_id_token"
}
```

**Success Response (200 OK):**

```json
{
	"access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
	"refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
	"user": {
		"pk": 1,
		"email": "student@university.edu.eg",
		"first_name": "John",
		"last_name": "Doe"
	}
}
```

---

#### 4. Logout

**Endpoint:** `POST /logout/`

**Description:** Logout user and blacklist their refresh token.

**Authentication:** Required (Bearer Token)

**Request Body:**

```json
{
	"refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response (200 OK):**

```json
{
	"detail": "Successfully logged out."
}
```

---

#### 5. Refresh Token

**Endpoint:** `POST /token/refresh/`

**Description:** Get a new access token using a refresh token.

**Authentication:** None required

**Request Body:**

```json
{
	"refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Success Response (200 OK):**

```json
{
	"access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
	"refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### User Endpoints

#### 6. User Status

**Endpoint:** `GET /status/`

**Description:** Get current user's authentication status and profile completion state.

**Authentication:** Required (Bearer Token)

**Success Response (200 OK):**

```json
{
	"is_complete": false,
	"role": "",
	"email": "student@university.edu.eg",
	"full_name": "John Doe"
}
```

**Notes:**

- `is_complete: false` means user needs to complete their profile
- `role` will be empty string until profile is completed
- Use this endpoint after login to determine where to redirect the user

---

#### 7. Complete Profile

**Endpoint:** `POST /profile/complete/`

**Description:** Complete user profile by selecting role and providing role-specific information.

**Authentication:** Required (Bearer Token)

##### For Student:

**Request Body:**

```json
{
	"role": "STUDENT",
	"major": "Computer Science",
	"academic_level": "Senior",
	"skills": ["React", "Python", "Django"],
	"gpa": 3.8
}
```

##### For Supervisor:

**Request Body:**

```json
{
	"role": "SUPERVISOR",
	"is_professor": true,
	"department": "Computer Science",
	"expertise": ["Machine Learning", "Data Science"]
}
```

**Success Response (201 Created):**

```json
{
	"message": "Student profile created successfully"
}
```

**Error Responses:**

Profile already exists (400):

```json
{
	"error": "Profile already completed"
}
```

Invalid role (400):

```json
{
	"error": "Invalid role selected"
}
```

---

#### 8. Student Profile

**Endpoint:** `GET /profile/student/`

**Description:** Get current user's student profile.

**Authentication:** Required (Bearer Token)

**Success Response (200 OK):**

```json
{
	"user": {
		"id": 1,
		"email": "student@university.edu.eg",
		"first_name": "John",
		"last_name": "Doe",
		"role": "STUDENT"
	},
	"major": "Computer Science",
	"academic_level": "Senior",
	"gpa": 3.8,
	"skills": ["React", "Python", "Django"]
}
```

---

**Endpoint:** `PATCH /profile/student/`

**Description:** Update current user's student profile.

**Authentication:** Required (Bearer Token)

**Request Body (partial update):**

```json
{
	"skills": ["React", "Python", "Django", "TypeScript"],
	"gpa": 3.9
}
```

---

#### 9. Supervisor Profile

**Endpoint:** `GET /profile/supervisor/`

**Description:** Get current user's supervisor profile.

**Authentication:** Required (Bearer Token)

**Success Response (200 OK):**

```json
{
	"user": {
		"id": 2,
		"email": "professor@university.edu.eg",
		"first_name": "Jane",
		"last_name": "Smith",
		"role": "SUPERVISOR"
	},
	"is_professor": true,
	"role_display": "Primary Supervisor (Professor)",
	"department": "Computer Science",
	"expertise": ["Machine Learning", "Data Science"]
}
```

---

**Endpoint:** `PATCH /profile/supervisor/`

**Description:** Update current user's supervisor profile.

**Authentication:** Required (Bearer Token)

**Request Body (partial update):**

```json
{
	"expertise": ["Machine Learning", "Data Science", "NLP"]
}
```

---

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
**Base URL:** `/api/community/`  
*(All endpoints require Bearer Token Authentication)*

### 1. Posts & Feed

#### Get Feed
- **Method:** `GET`
- **Endpoint:** `/posts/`
- **Description:** Retrieves the community feed. Automatically filters to return public posts and private posts matching the current user's email domain.
- **Returns:** List of posts including author details (`author_name`, `author_username`, `author_role`), tags, attachments, poll options, and interaction metrics (`views_count`, `upvotes_count`, `downvotes_count`, `comments_count`, `has_upvoted`, `has_downvoted`).

#### Create Post
- **Method:** `POST`
- **Endpoint:** `/posts/`
- **Description:** Creates a new post or poll.
- **Payload (Text Post):**
  ```json
  {
    "title": "Best practices in React?",
    "content": "Looking for advice...",
    "post_type": "TEXT",
    "tag_names": ["React", "Frontend"] 
  }
  ```
- **Payload (Poll):**
  ```json
  {
    "title": "Which framework is better?",
    "post_type": "POLL",
    "poll_option_texts": ["Next.js", "Vue.js"]
  }
  ```

#### Get Single Post
- **Method:** `GET`
- **Endpoint:** `/posts/{id}/`
- **Description:** Retrieves the details of a single post.
- **Note:** Successfully calling this endpoint automatically increments the `views_count` for that post (with a 24-hour Redis/cache-based anti-abuse limit).

#### Upload Attachment
- **Method:** `POST`
- **Endpoint:** `/posts/{id}/upload_attachment/`
- **Description:** Attaches a file to an existing post. Supports Drag and Drop uploads.
- **Payload:** Requires `multipart/form-data` with the key named `file`.

---

### 2. Interactions
#### Upvote a Post
- **Method:** `POST`
- **Endpoint:** `/posts/{id}/upvote/`
- **Description:** Toggles an upvote for the current user. Removes existing downvote if present.
- **Returns:** Updated upvotes/downvotes metrics:
  ```json
  {
    "upvotes_count": 25,
    "downvotes_count": 2,
    "has_upvoted": true,
    "has_downvoted": false
  }
  ```

#### Downvote a Post
- **Method:** `POST`
- **Endpoint:** `/posts/{id}/downvote/`
- **Description:** Toggles a downvote for the current user. Removes existing upvote if present.
- **Returns:** Updated upvotes/downvotes metrics.

#### Get Comments
- **Method:** `GET`
- **Endpoint:** `/posts/{id}/comments/`
- **Description:** Retrieves all comments for a post, ordered newest first. Includes author name, username, and role.

#### Add Comment
- **Method:** `POST`
- **Endpoint:** `/posts/{id}/comments/`
- **Description:** Adds a new comment to a post.
- **Payload:**
  ```json
  {
    "content": "Here is my answer..."
  }
  ```

#### Vote on a Poll
- **Method:** `POST`
- **Endpoint:** `/posts/{id}/vote-poll/`
- **Description:** Records a user's vote on a poll. Returns an error if the user has already voted on this specific poll.
- **Payload:**
  ```json
  {
    "option_id": 5
  }
  ```

---

### 3. Metadata Selectors

#### Get Tags
- **Method:** `GET`
- **Endpoint:** `/tags/`
- **Description:** Returns all community tags for multi-select dropdowns. Deduplicates based on lowercase parsing backend logic.

#### Get Categories
- **Method:** `GET`
- **Endpoint:** `/categories/`
- **Description:** Returns a list of available categories and their slugs for the category creation dropdown.
