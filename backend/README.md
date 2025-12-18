# SmartLearn Backend API 🚀

Express.js REST API for the SmartLearn educational platform.

---

## 📁 Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── index.js            # Server entry point
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   │   ├── auth.js         # Register/Login
│   │   ├── courseController.js
│   │   ├── articleController.js
│   │   ├── enrollmentController.js
│   │   └── lessonController.js
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Article.js
│   │   ├── Enrollment.js
│   │   └── Lesson.js
│   ├── routes/             # Route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── articleRoutes.js
│   │   ├── adminArticleRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   └── lessonRoutes.js
│   └── middlewares/
│       ├── authMiddleware.js      # JWT verification
│       ├── roleMiddleware.js      # Role-based access
│       ├── articleOwnership.js    # Article ownership check
│       └── asyncHandler.js        # Async error wrapper
└── package.json
```

---

## 🔧 Setup

```bash
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartlearn
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
ADMIN_SECRET=your_admin_secret_key
```

Run:

```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

---

## 🔐 Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## 📊 Data Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, hashed (not returned) |
| `role` | String | `student`, `instructor`, `admin` |
| `createdAt` | Date | Auto-generated |

### Course
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Required |
| `slug` | String | Auto-generated from title |
| `description` | String | Full description |
| `shortDescription` | String | Brief summary |
| `instructor` | ObjectId | Ref to User |
| `price` | Number | Default: 0 |
| `category` | String | Course category |
| `thumbnailUrl` | String | Image URL |
| `lessons` | [ObjectId] | Ref to Lessons |
| `published` | Boolean | Default: false |

### Article
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Required |
| `content` | String | HTML content (rich text) |
| `author` | ObjectId | Ref to User |
| `category` | String | Default: `Development` |
| `thumbnailUrl` | String | Image URL |
| `tags` | [String] | Article tags |
| `likes` | [ObjectId] | Users who liked |
| `views` | Number | View count |
| `published` | Boolean | Default: true |

### Enrollment
| Field | Type | Description |
|-------|------|-------------|
| `user` | ObjectId | Ref to User |
| `course` | ObjectId | Ref to Course |
| `enrolledAt` | Date | Auto-generated |

### Lesson
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Required |
| `slug` | String | Auto-generated |
| `content` | String | Text/description |
| `videoUrl` | String | Video URL |
| `duration` | Number | Minutes |
| `course` | ObjectId | Ref to Course |
| `isFree` | Boolean | Preview enabled |
| `order` | Number | Lesson order |

---

## 📡 API Routes

### Auth Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

> **Admin Registration:** Include `"adminSecret": "your_admin_secret"` to register as admin.

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": "664abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### POST `/api/auth/login`
Login with credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

> **Admin Login:** Include `"adminSecret": "your_admin_secret"` for admin accounts.

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUz...",
  "user": {
    "id": "664abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### User Routes (`/api/users`)

> 🔒 All routes require authentication

#### GET `/api/users/me`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "_id": "664abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### PUT `/api/users/me`
Update profile (name/email).

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

#### PUT `/api/users/change-password`
Change password.

**Request Body:**
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass456",
  "confirmPassword": "newpass456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### Course Routes (`/api/courses`)

#### GET `/api/courses`
List all courses with pagination & filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 10) |
| `search` | String | Search in title/description |
| `category` | String | Filter by category |
| `price` | String | `free` or `paid` |
| `sort` | String | `fieldname:asc` or `fieldname:desc` |

**Response (200):**
```json
{
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "courses": [
    {
      "_id": "664abc...",
      "title": "React Masterclass",
      "shortDescription": "Learn React from scratch",
      "price": 0,
      "category": "Web Development",
      "thumbnailUrl": "https://...",
      "instructor": { "name": "John Doe" },
      "studentCount": 150
    }
  ]
}
```

---

#### GET `/api/courses/:id`
Get course details by ID.

**Response (200):**
```json
{
  "course": {
    "_id": "664abc...",
    "title": "React Masterclass",
    "description": "Full course description...",
    "instructor": { "name": "John", "email": "john@email.com", "role": "instructor" },
    "studentCount": 150,
    ...
  }
}
```

---

#### POST `/api/courses` 🔒
Create a new course.

**Roles:** `instructor`, `admin`

**Request Body:**
```json
{
  "title": "React Masterclass",
  "description": "Learn React from scratch...",
  "shortDescription": "Master React development",
  "price": 49.99,
  "category": "Web Development",
  "thumbnailUrl": "https://..."
}
```

**Response (201):**
```json
{
  "course": { ... }
}
```

---

#### PUT `/api/courses/:id` 🔒
Update a course.

**Roles:** Course owner or `admin`

**Request Body:** (any updatable field)
```json
{
  "title": "Updated Title",
  "published": true
}
```

---

#### DELETE `/api/courses/:id` 🔒
Delete a course.

**Roles:** Course owner or `admin`

**Response (200):**
```json
{
  "message": "Course removed successfully"
}
```

---

### Article Routes (`/api/articles`)

#### GET `/api/articles`
Get all articles.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | String | Filter by category |
| `search` | String | Search in title/content |

**Response (200):**
```json
[
  {
    "_id": "664abc...",
    "title": "Getting Started with Node.js",
    "content": "<p>HTML content...</p>",
    "author": { "name": "John", "role": "instructor" },
    "category": "Development",
    "likes": ["userId1", "userId2"],
    "views": 1250,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### GET `/api/articles/:id`
Get single article (increments view count).

---

#### GET `/api/articles/my/articles` 🔒
Get current user's articles.

---

#### POST `/api/articles` 🔒
Create article.

**Roles:** `student`, `instructor`, `admin`

**Request Body:**
```json
{
  "title": "My Article",
  "content": "<p>Rich HTML content...</p>",
  "category": "Development",
  "thumbnailUrl": "https://...",
  "tags": ["nodejs", "javascript"]
}
```

---

#### PUT `/api/articles/:id` 🔒
Update article (owner only).

---

#### DELETE `/api/articles/:id` 🔒
Delete article (owner only).

---

#### POST `/api/articles/:id/like` 🔒
Toggle like on article.

**Response (200):**
```json
{
  "likes": ["userId1", "userId2"],
  "isLiked": true
}
```

---

### Admin Routes (`/api/admin`)

#### GET `/api/admin/articles` 🔒
Get all articles (admin view).

**Roles:** `admin`

---

### Enrollment Routes (`/api/enrollments`)

> 🔒 All routes require authentication

#### POST `/api/enrollments`
Enroll in a course.

**Request Body:**
```json
{
  "courseId": "664abc..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Enrolled successfully",
  "enrollment": { ... }
}
```

---

#### GET `/api/enrollments/check/:courseId`
Check if enrolled in a course.

**Response (200):**
```json
{
  "isEnrolled": true
}
```

---

#### GET `/api/enrollments/my-courses`
Get all enrolled courses.

**Response (200):**
```json
{
  "enrollments": [
    {
      "_id": "664abc...",
      "course": {
        "title": "React Masterclass",
        "thumbnailUrl": "https://...",
        ...
      },
      "enrolledAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Lesson Routes (`/api/lessons`)

#### GET `/api/lessons/course/:courseId`
Get all lessons for a course (public syllabus).

**Response (200):**
```json
{
  "lessons": [
    {
      "_id": "664abc...",
      "title": "Introduction",
      "content": "...",
      "videoUrl": "https://...",
      "duration": 15,
      "isFree": true,
      "order": 1
    }
  ]
}
```

---

#### POST `/api/lessons/course/:courseId` 🔒
Add lesson to course.

**Roles:** Course owner or `admin`

**Request Body:**
```json
{
  "title": "Introduction to React",
  "content": "Welcome to the course...",
  "videoUrl": "https://youtube.com/...",
  "duration": 15,
  "isFree": true
}
```

---

#### DELETE `/api/lessons/:id` 🔒
Delete a lesson.

**Roles:** Course owner or `admin`

---

## ⚠️ Error Responses

| Status | Description |
|--------|-------------|
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Invalid/missing token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Duplicate resource (e.g., email) |
| `500` | Server Error |

**Error Response Format:**
```json
{
  "message": "Error description"
}
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT authentication |
| `bcryptjs` | Password hashing |
| `cors` | Cross-origin support |
| `dotenv` | Environment variables |
| `slugify` | URL slug generation |
| `nodemon` | Development hot-reload |
