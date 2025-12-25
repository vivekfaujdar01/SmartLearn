# SmartLearn Frontend 🎨

React + Vite frontend for the SmartLearn educational platform.

---

## 📁 Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles (Tailwind)
│   ├── App.css              # App-specific styles
│   │
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx       # Home page
│   │   ├── Login.jsx             # User login
│   │   ├── Register.jsx          # User registration
│   │   ├── Profile.jsx           # User profile management
│   │   ├── Courses.jsx           # Course listing
│   │   ├── CourseDetails.jsx     # Single course view
│   │   ├── Articles.jsx          # Article listing
│   │   ├── ArticleDetails.jsx    # Single article view
│   │   ├── CreateArticle.jsx     # Write new article
│   │   ├── EditArticle.jsx       # Edit article
│   │   ├── CreateCourse.jsx      # Create new course
│   │   ├── EditCourse.jsx        # Edit course
│   │   ├── AddChapter.jsx        # Add lesson to course
│   │   ├── StudentDashboard.jsx  # Student dashboard
│   │   ├── InstructorDashboard.jsx # Instructor dashboard
│   │   ├── AdminDashboard.jsx    # Admin dashboard
│   │   ├── TicTacToe.jsx         # Fun game
│   │   ├── About.jsx             # About the platform
│   │   └── Contact.jsx           # Contact page
│   │
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── Footer.jsx            # Page footer
│   │   ├── Hero.jsx              # Hero section
│   │   ├── ArticleList.jsx       # Article cards
│   │   ├── Products.jsx          # Product showcase
│   │   ├── Roadmap.jsx           # Learning roadmap
│   │   ├── Testmonials.jsx       # Testimonials
│   │   ├── TiltCard.jsx          # 3D tilt hover effect
│   │   └── ProtectedRoute.jsx    # Route auth guard
│   │
│   ├── services/            # API service functions
│   │   ├── auth.js               # Authentication API
│   │   ├── articleService.js     # Article API
│   │   ├── courseService.js      # Course API
│   │   ├── enrollmentService.js  # Enrollment API
│   │   └── userService.js        # User API
│   │
│   ├── context/             # React Context
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── ThemeContext.jsx      # Dark/Light theme toggle
│   │
│   └── assets/              # Static assets
│       └── need.css              # Additional styles
│
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── package.json
```

---

## 🔧 Setup

```bash
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 🛣️ Routes

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Homepage with hero, features, testimonials |
| `/login` | `Login` | User authentication |
| `/register` | `Register` | New user registration |
| `/courses` | `Courses` | Browse all courses |
| `/courses/:id` | `CourseDetails` | View course details, lessons, enroll |
| `/articles` | `Articles` | Browse all articles |
| `/articles/:id` | `ArticleDetails` | Read article |
| `/about` | `About` | About the platform |
| `/contact` | `Contact` | Contact form and info |

### Protected Routes (Require Login)

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/profile` | `Profile` | All users | Manage profile, change password |
| `/dashboard` | `StudentDashboard` | Students | View enrolled courses |
| `/articles/create` | `CreateArticle` | All users | Write new article |
| `/articles/:id/edit` | `EditArticle` | Article owner | Edit own article |
| `/games/tictactoe` | `TicTacToe` | All users | Tic Tac Toe brain game |

### Instructor Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/instructor/dashboard` | `InstructorDashboard` | Manage created & enrolled courses |
| `/instructor/create-course` | `CreateCourse` | Create new course |
| `/instructor/course/:courseId/edit` | `EditCourse` | Edit course details |
| `/instructor/course/:courseId/add-chapter` | `AddChapter` | Add lesson to course |

### Admin Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/admin/dashboard` | `AdminDashboard` | Platform administration |

---

## 🔌 API Services

### Auth Service (`services/auth.js`)

```javascript
import { login, register } from './services/auth';

// Login
const { token, user } = await login({ email, password });

// Register
const { token, user } = await register({ name, email, password, role });
```

### Article Service (`services/articleService.js`)

```javascript
import * as articleService from './services/articleService';

// Get all articles
const articles = await articleService.getAllArticles(category, search);

// Get single article
const article = await articleService.getArticleById(id);

// Get my articles
const myArticles = await articleService.getMyArticles();

// Create article
const article = await articleService.createArticle({ title, content, category, tags });

// Update article
const article = await articleService.updateArticle(id, { title, content });

// Delete article
await articleService.deleteArticle(id);

// Toggle like
const { likes, isLiked } = await articleService.toggleLike(id);
```

### Course Service (`services/courseService.js`)

```javascript
import * as courseService from './services/courseService';

// List courses with filters
const { courses, meta } = await courseService.getCourses({ page, search, category, price });

// Get course by ID
const course = await courseService.getCourseById(id);

// Create course
const course = await courseService.createCourse({ title, description, price, category });

// Update course
const course = await courseService.updateCourse(id, data);

// Delete course
await courseService.deleteCourse(id);

// Get lessons for course
const lessons = await courseService.getLessons(courseId);

// Add lesson
const lesson = await courseService.addLesson(courseId, { title, content, videoUrl });

// Delete lesson
await courseService.deleteLesson(lessonId);
```

### Enrollment Service (`services/enrollmentService.js`)

```javascript
import * as enrollmentService from './services/enrollmentService';

// Enroll in course
await enrollmentService.enrollInCourse(courseId);

// Check enrollment
const isEnrolled = await enrollmentService.checkEnrollment(courseId);

// Get my enrollments
const enrollments = await enrollmentService.getMyEnrollments();
```

### Payment Service (Razorpay Integration)

Payment processing is handled directly in `CourseDetails.jsx` using Razorpay:

```javascript
// 1. Create order for course purchase
const orderData = await enrollmentService.createOrder(courseId);

// 2. If course is free, enrollment is automatic
if (orderData.isFree) {
  // User is now enrolled
}

// 3. For paid courses, open Razorpay checkout
const options = {
  key: orderData.key,
  amount: orderData.order.amount,
  currency: 'INR',
  order_id: orderData.order.id,
  handler: async (response) => {
    // 4. Verify payment after successful checkout
    await enrollmentService.verifyPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      courseId
    });
  }
};
const razorpay = new window.Razorpay(options);
razorpay.open();
```

### User Service (`services/userService.js`)

```javascript
import * as userService from './services/userService';

// Get profile
const user = await userService.getProfile();

// Update profile
const user = await userService.updateProfile({ name, email });

// Change password
await userService.changePassword({ oldPassword, newPassword, confirmPassword });
```

---

## 🎨 Components

### Navbar

Responsive navigation with:
- Logo and branding
- Navigation links (Home, Courses, Articles, Games)
- User menu (Profile, Dashboard, Logout)
- Role-based navigation
- Mobile hamburger menu

### Hero

Landing page hero section with:
- Catchy headline
- Call-to-action buttons
- Background gradient

### ArticleList

Grid of article cards displaying:
- Thumbnail
- Title
- Author
- Category
- View/Like counts

### Footer

Page footer with:
- Links
- Social icons
- Copyright

---

## 🔐 Authentication Context

The `AuthContext` provides:

```javascript
import { useAuth } from './context/AuthContext';

const { 
  user,          // Current user object
  token,         // JWT token
  isLoading,     // Loading state
  login,         // Login function
  logout,        // Logout function
  isLoggedIn     // Boolean check
} = useAuth();
```

### Usage Example

```jsx
import { useAuth } from '../context/AuthContext';

function ProfileButton() {
  const { user, isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return <Link to="/login">Login</Link>;
  }

  return (
    <div>
      <span>Hello, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🎯 Features

### Landing Page
- Hero section with call-to-action
- Featured courses
- Learning roadmap
- Testimonials
- Footer with links

### Courses
- Grid/list view of courses
- Search and filter by category
- Price filter (free/paid)
- Pagination
- Enrollment button
- Lesson preview

### Articles
- Rich text content (HTML)
- Category filtering
- Like system
- View counter
- Create/Edit with rich text editor (React Quill)

### Dashboards
- **Student:** Enrolled courses, progress
- **Instructor:** Created courses, enrolled courses, student stats
- **Admin:** Platform overview, content management

### Profile
- Update name and email
- Change password
- View account info

### Games
- Tic Tac Toe with AI and PvP modes
- Win tracking

### Payments
- Razorpay integration for course purchases
- UPI and Netbanking support
- Free course instant enrollment
- Secure payment verification

---

## 🎨 Styling

### Tailwind CSS

The project uses **Tailwind CSS 4** for styling:

- **Configuration:** Tailwind is configured via `@tailwindcss/vite` plugin
- **Custom styles:** Located in `index.css` and `App.css`
- **Colors:** Uses modern gradients and glass morphism effects
- **Responsive:** Mobile-first responsive design

### Key CSS Classes

```css
/* Gradient backgrounds */
bg-linear-to-r from-purple-600 to-blue-600

/* Glass effect */
backdrop-blur-md bg-white/10

/* Cards */
rounded-2xl shadow-lg hover:shadow-xl transition-shadow

/* Buttons */
px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `react-dom` | DOM rendering |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP client |
| `tailwindcss` | Utility-first CSS |
| `@tailwindcss/vite` | Vite plugin for Tailwind |
| `sonner` | Toast notifications |
| `lucide-react` | Icon library |
| `react-quill-new` | Rich text editor |
| `dompurify` | HTML sanitization |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `vite` | Build tool |
| `@vitejs/plugin-react` | React plugin for Vite |

---

## 🧪 Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🔧 Configuration Files

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small devices |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Environment Variables for Production

Set `VITE_API_URL` to your production API URL before building.
