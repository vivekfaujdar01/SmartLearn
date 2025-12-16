## Backend Progress

### Overview
I've implemented course listing, course details retrieval, and role-based access control. I optimized course details by removing lesson population and ensured only instructors/admins can manage courses.

Auth routes (`auth/register`, `auth/login`) are public for user registration and login.

---

### API Routes

#### Public Routes

**GET `/api/courses`**
- List all courses with pagination
- URL: `http://localhost:8000/api/courses`

**GET `/api/courses/:id`**
- Get course details by ID
- URL: `http://localhost:8000/api/courses/<COURSE_ID>`

---

#### Protected Routes (Authentication + Role Required)

**POST `/api/courses`** (Instructor/Admin only)
- Create a new course
- URL: `http://localhost:8000/api/courses`
- Header: `Authorization: Bearer <TOKEN>`
- Body:
```json
{
  "title": "Mastering Node.js",
  "shortDescription": "Complete beginner to advanced course",
  "description": "Full course content...",
  "price": 499,
  "category": "backend",
  "thumbnailUrl": "https://example.com/node.jpg"
}
```
- Response: `{ "course": { "_id": "65f1...", "title": "Mastering Node.js", ... } }`

**PUT `/api/courses/:id`** (Instructor/Admin only)
- Update an existing course
- Header: `Authorization: Bearer <TOKEN>`
- Body: `{ "title": "Updated Title", "price": 599 }`
- Response: `{ "course": { "_id": "...", "title": "Updated Title", ... } }`

**DELETE `/api/courses/:id`** (Instructor/Admin only)
- Delete a course
- Header: `Authorization: Bearer <TOKEN>`
- Response: `{ "message": "Course removed" }`

---

#### Auth Routes

**POST `/api/auth/register`** (Public)
- User registration
- Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "student"
}
```
- For Instructor Registration:
```json
{
  "name": "Jane Instructor",
  "email": "instructor@example.com",
  "password": "securepassword",
  "role": "instructor"
}
```
- For Admin Registration:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "admin",
  "adminSecret": "YOUR_SECRET_KEY"
}
```
- Response:
```json
{
  "success": true,
  "token": "eyJhbG...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student" // or "admin", "instructor"
  }
}
```

**POST `/api/auth/login`** (Public)
- User login
- Body:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
- For Admin Login:
```json
{
  "email": "admin@example.com",
  "password": "securepassword",
  "adminSecret": "YOUR_SECRET_KEY"
}
```
- Response:
```json
{
  "success": true,
  "token": "eyJhbG...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student" // or "admin"
  }
}
```

**GET `/api/users/me`** (Protected)
- Get current user profile
- Header: `Authorization: Bearer <TOKEN>`
- Response: `{ "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "instructor", "createdAt": "..." } }`

**PUT `/api/users/me`** (Protected)
- Update user profile
- Header: `Authorization: Bearer <TOKEN>`
- Body: `{ "name": "John Updated", "email": "newemail@example.com" }`

**PUT `/api/users/change-password`** (Protected)
- Change password
- Header: `Authorization: Bearer <TOKEN>`
- Body: `{ "oldPassword": "...", "newPassword": "...", "confirmPassword": "..." }`
- Errors: Invalid fields (400), weak password (400), mismatch (400), incorrect old password (401), user not found (404)


---

#### Article Routes

**GET `/api/articles`**
- Get all articles (Public)
- URL: `http://localhost:8000/api/articles`
- Response: `[ { "_id": "...", "title": "...", "content": "...", "author": { "name": "..." }, "createdAt": "..." } ]`

**GET `/api/articles/:id`**
- Get article by ID (Public)
- URL: `http://localhost:8000/api/articles/<ARTICLE_ID>`
- Response: `{ "_id": "...", "title": "...", "content": "...", "author": { "name": "..." } }`

**POST `/api/articles`** (Student/Instructor/Admin)
- Create a new article
- Header: `Authorization: Bearer <TOKEN>`
- Body:
```json
{
  "title": "My Article Title",
  "content": "Article content goes here..."
}
```
- Response: `{ "_id": "...", "title": "My Article Title", "content": "...", "author": "...", "createdAt": "..." }`

**GET `/api/articles/my/articles`** (Student/Instructor/Admin)
- Get my articles
- Header: `Authorization: Bearer <TOKEN>`
- Response: `[ { "_id": "...", "title": "...", ... } ]`

**PUT `/api/articles/:id`** (Owner only)
- Update an article
- Header: `Authorization: Bearer <TOKEN>`
- Body:
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```
- Response: `{ "_id": "...", "title": "Updated Title", ... }`

**DELETE `/api/articles/:id`** (Owner only)
- Delete an article
- Header: `Authorization: Bearer <TOKEN>`
- Response: `{ "message": "Article deleted successfully" }`

---

#### Admin Article Routes

**GET `/api/admin/articles`** (Admin only)
- Get all articles (Admin view with email)
- Header: `Authorization: Bearer <TOKEN>`
- Response: `[ { "_id": "...", "title": "...", "author": { "name": "...", "email": "..." }, ... } ]`
