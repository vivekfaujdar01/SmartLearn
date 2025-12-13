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

**POST `/api/auth/login`** (Public)
- User login

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

