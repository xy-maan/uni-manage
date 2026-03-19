# UniManage API Documentation

## Base URL
```
http://localhost:8000/api/users
```

## Authentication
This API uses **JWT (JSON Web Tokens)** for authentication. After successful login, you'll receive:
- `access_token`: Valid for 1 day
- `refresh_token`: Valid for 7 days

Include the access token in the `Authorization` header for protected endpoints:
```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Login / Register with Google

**Endpoint:** `POST /login/google/`

**Description:** Authenticate users via Google OAuth2 (also creates new user if first time)

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "access_token": "google_oauth_access_token",
  "code": "google_oauth_code"
}
```

**Success Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "pk": 1,
    "email": "student@university.edu.eg",
    "first_name": "John",
    "last_name": "Doe"
  },
  "access_token_expiration": "2026-03-20T12:00:00Z",
  "refresh_token_expiration": "2026-03-26T12:00:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "non_field_errors": [
    "Incorrect value"
  ]
}
```

**Notes:**
- Google OAuth flow should be initiated from your Next.js frontend
- Callback URL is set to: `http://localhost:3000/login/callback`
- Accepts `.edu.eg` email addresses for university authentication

---

### 2. Login / Register with Microsoft

**Endpoint:** `POST /login/microsoft/`

**Description:** Authenticate users via Microsoft OAuth2 (also creates new user if first time)

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "access_token": "microsoft_oauth_access_token",
  "code": "microsoft_oauth_code"
}
```

**Success Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "pk": 2,
    "email": "professor@university.edu.eg",
    "first_name": "Jane",
    "last_name": "Smith"
  },
  "access_token_expiration": "2026-03-20T12:00:00Z",
  "refresh_token_expiration": "2026-03-26T12:00:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "non_field_errors": [
    "Incorrect value"
  ]
}
```

**Notes:**
- Microsoft OAuth flow should be initiated from your Next.js frontend
- Callback URL is set to: `http://localhost:3000/login/callback`
- Accepts `.edu.eg` email addresses for university authentication

---

### 3. Logout

**Endpoint:** `POST /logout/`

**Description:** Logout user and blacklist their refresh token

**Authentication:** Required (Bearer Token)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

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

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Notes:**
- The refresh token will be blacklisted and cannot be reused
- Clear all tokens from frontend storage after logout

---

### 4. Complete Profile

**Endpoint:** `POST /profile/complete/`

**Description:** Complete user profile by selecting role and providing role-specific information

**Authentication:** Required (Bearer Token)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

#### For Student Profile:

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

**Success Response (201 Created):**
```json
{
  "message": "Student profile created successfully"
}
```

#### For Supervisor Profile (Professor):

**Request Body:**
```json
{
  "role": "SUPERVISOR",
  "is_professor": true,
  "department": "Computer Science",
  "expertise": ["Machine Learning", "Data Science", "AI"]
}
```

**Success Response (201 Created):**
```json
{
  "message": "Supervisor profile created successfully"
}
```

#### For Supervisor Profile (TA):

**Request Body:**
```json
{
  "role": "SUPERVISOR",
  "is_professor": false,
  "department": "Software Engineering",
  "expertise": ["Web Development", "Mobile Apps"]
}
```

**Success Response (201 Created):**
```json
{
  "message": "Supervisor profile created successfully"
}
```

**Error Response (400 Bad Request) - Already Completed:**
```json
{
  "error": "Profile already completed"
}
```

**Error Response (400 Bad Request) - Invalid Role:**
```json
{
  "error": "Invalid role selected"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Field Requirements:**

**Student Fields:**
- `role` (required): Must be `"STUDENT"`
- `major` (required): String - student's major
- `academic_level` (required): String - e.g., "Freshman", "Sophomore", "Junior", "Senior"
- `skills` (optional): Array of strings - student's technical skills
- `gpa` (optional): Float - student's GPA (0.0 - 4.0)

**Supervisor Fields:**
- `role` (required): Must be `"SUPERVISOR"`
- `is_professor` (optional): Boolean - `true` for Professor, `false` for TA (default: `true`)
- `department` (required): String - supervisor's department
- `expertise` (optional): Array of strings - areas of expertise

**Notes:**
- This endpoint can only be called once per user
- After profile completion, redirect to the appropriate dashboard
- Skills and expertise are stored as JSON arrays

---

## Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid authentication |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Authentication Flow for Next.js Frontend

### Initial Login Flow:

1. **Initiate OAuth:**
   - User clicks "Login with Google" or "Login with Microsoft"
   - Redirect to OAuth provider's authorization page

2. **Handle OAuth Callback:**
   - Receive `code` or `access_token` from OAuth provider at `/login/callback`
   - Send the token to backend: `POST /api/users/login/google/` or `POST /api/users/login/microsoft/`
   - Store received `access_token` and `refresh_token` securely (e.g., httpOnly cookies or secure storage)

3. **Complete Profile:**
   - Show appropriate form based on selected role (Student/Supervisor)
   - Submit to `POST /api/users/profile/complete/`
   - After success, redirect to dashboard

### Authenticated Request Flow:

1. **Include Access Token:**
   - Add `Authorization: Bearer <access_token>` header to all requests

2. **Logout:**
   - Call `POST /api/users/logout/` with the refresh token
   - Clear all stored tokens
   - Redirect to login page

---

## Example Usage with Next.js

### Login with Google:

```typescript
// After receiving OAuth code from Google
const loginWithGoogle = async (code: string) => {
  try {
    const response = await fetch('http://localhost:8000/api/users/login/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store tokens securely
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      // Redirect to profile completion
      router.push('/complete-profile');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Complete Profile:

```typescript
const completeStudentProfile = async (profileData: any) => {
  const token = localStorage.getItem('access_token');

  try {
    const response = await fetch('http://localhost:8000/api/users/profile/complete/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: 'STUDENT',
        major: profileData.major,
        academic_level: profileData.academicLevel,
        skills: profileData.skills,
        gpa: profileData.gpa,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/student/dashboard');
    }
  } catch (error) {
    console.error('Profile completion failed:', error);
  }
};
```

### Logout:

```typescript
const logout = async () => {
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  try {
    await fetch('http://localhost:8000/api/users/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Redirect to login
    router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

---

## Notes for Frontend Developer

### Security Considerations:
- Store tokens securely (consider using httpOnly cookies for production)
- Never expose tokens in URLs or console logs in production
- Implement proper CORS configuration
- Use HTTPS in production

### Token Management:
- Access tokens expire after 1 day
- Refresh tokens expire after 7 days
- Handle 401 errors appropriately

### User Experience:
- Show appropriate loading states during authentication
- Handle OAuth errors gracefully
- Provide clear error messages for validation failures
- Implement form validation before submitting to endpoints

### Development vs Production:
- Update base URL for production environment
- Update OAuth callback URLs for production
- Use environment variables for configuration
- Ensure proper error logging

---

## Support

For questions or issues with the API, contact the backend team.

**Last Updated:** March 19, 2026
