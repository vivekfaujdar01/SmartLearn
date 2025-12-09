Till now in backend i worked on course listing and course details by id. I removed lesson population from course details to optimize performance. I also ensured that only instructors or admins can create, update, or delete courses.

I made auth routes like auth/register and auth/login public for user registration and login.

Following are the routes i have implemented so far:

- Public routes:

  - GET api/courses - List all courses with pagination // Public route (http://localhost:8000/api/courses
    )
  - GET api/courses/:id - Get course details by ID // Public route (http://localhost:8000/api/courses/<COURSE_ID>
    )

- Protected routes (require authentication and specific roles):

  - POST api/courses - Create a new course // Protected route (instructor/admin only) (http://localhost:8000/api/courses
    )
    Authorization → Bearer Token (paste token)
    Body → raw → JSON
    {
    "title": "Mastering Node.js",
    "shortDescription": "Complete beginner to advanced course",
    "description": "Full course content...",
    "price": 499,
    "category": "backend",
    "thumbnailUrl": "https://example.com/node.jpg"
    }
    Expected response:
    {
    "course": {
    "\_id": "65f1...",
    "title": "Mastering Node.js",
    ...
    }
    }

  - PUT api/courses/:id - Update an existing course // Protected route (instructor/admin only) (http://localhost:8000/api/courses/<COURSE_ID>
    )
    Body → JSON:
    {
    "title": "Updated Node.js Course Title",
    "price": 599
    }
    Expected response:
    {
    "course": {
    "\_id": "65f1...",
    "title": "Updated Node.js Course Title",
    ...
    }
    }
  - DELETE api/courses/:id - Delete a course // Protected route (instructor/admin only) (http://localhost:8000/api/courses/<COURSE_ID>
    )
    Expected:
    { "message": "Course removed" }

- Auth routes:
  - POST api/auth/register - User registration // Public route
  - POST api/auth/login - User login // Public route
