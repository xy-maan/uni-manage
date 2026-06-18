# Marketplace API

## Marketplace Project List

Returns paginated list of public archived projects.

### URL

GET /api/projects/marketplace/projects/

### Permission

Public (No authentication required)

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search across name, description, and technology names (case insensitive) |
| category | integer | No | Filter by category ID |
| technology | string | No | Filter by technology name (case insensitive) |
| project_type | string | No | Filter by project type (`course` or `graduation`) |
| academic_year | integer | No | Filter by academic year ID |
| ordering | string | No | Sort order: `created_at`, `-created_at`, `updated_at`, `-updated_at`, `name`, `-name`. Default: `-created_at` |
| page | integer | No | Page number (default: 1) |
| page_size | integer | No | Items per page (default: 12, max: 50) |

### Request Example

```
GET /api/projects/marketplace/projects/?search=ai&category=3&project_type=graduation&page=1
```

### Success Response

Status Code: 200 OK

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "AI Healthcare Assistant",
      "description": "A deep learning model for early disease detection...",
      "category": "Artificial Intelligence",
      "project_type": "graduation",
      "academic_year": "2024-2025",
      "technology_names": ["Python", "TensorFlow", "React"],
      "member_count": 4,
      "supervisor_count": 1,
      "repository_url": "https://github.com/example/repo",
      "documentation_url": "https://example.com/docs",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-06-01T15:30:00Z"
    }
  ]
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Marketplace Project Detail

Returns detailed information about a specific public archived project.

### URL

GET /api/projects/marketplace/projects/{id}/

### Permission

Public (No authentication required)

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Project ID |

### Request Example

```
GET /api/projects/marketplace/projects/1/
```

### Success Response

Status Code: 200 OK

```json
{
  "id": 1,
  "name": "AI Healthcare Assistant",
  "description": "A deep learning model for early disease detection...",
  "project_type": "graduation",
  "methodology": "sprint",
  "status": "archived",
  "proposal": "Project proposal text...",
  "abstract": "Project abstract text...",
  "expected_scope": "Expected scope text...",
  "archive_year": 2025,
  "category": "Artificial Intelligence",
  "subject": "CS401 - Machine Learning",
  "semester": "Fall 2024",
  "academic_year": "2024-2025",
  "technology_names": ["Python", "TensorFlow", "React"],
  "members": [
    {"id": 10, "name": "Ahmed Ali", "role": "leader"},
    {"id": 11, "name": "Sara Mohamed", "role": "co_leader"},
    {"id": 12, "name": "Omar Hassan", "role": "member"}
  ],
  "supervisors": [
    {"id": 3, "name": "Dr. Mohamed", "role": "primary"},
    {"id": 4, "name": "Eng. Ahmed", "role": "secondary"}
  ],
  "member_count": 3,
  "technology_count": 3,
  "supervisor_count": 2,
  "repository_url": "https://github.com/example/repo",
  "documentation_url": "https://example.com/docs",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-06-01T15:30:00Z"
}
```

### Error Responses

#### 404 Not Found

Returned when the project does not exist, is not public, or is not archived.

```json
{
  "detail": "Not found."
}
```

#### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Marketplace Technology List

Returns list of official technologies for filter dropdown.

### URL

GET /api/projects/technologies/

### Permission

Public (No authentication required)

### Request Example

```
GET /api/projects/technologies/
```

### Success Response

Status Code: 200 OK

```json
[
  {"id": 1, "name": "Python", "is_official": true},
  {"id": 2, "name": "Django", "is_official": true},
  {"id": 3, "name": "React", "is_official": true}
]
```

### Error Responses

#### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```
