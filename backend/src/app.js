// Express App Configuration - Main application setup
import express from 'express'; // Web framework for Node.js
import cors from 'cors'; // Cross-Origin Resource Sharing middleware
import helmet from 'helmet'; // Security headers middleware
import rateLimit from 'express-rate-limit'; // Rate limiting for API protection

// Import route handlers for different API endpoints
import authRoutes from './routes/authRoutes.js'; // Authentication routes (login, register)
import userRoutes from './routes/userRoutes.js'; // User profile routes
import courseRoutes from './routes/courseRoutes.js'; // Course CRUD routes
import articleRoutes from './routes/articleRoutes.js'; // Article CRUD routes
import adminArticleRoutes from './routes/adminArticleRoutes.js'; // Admin-only article routes
import lessonRoutes from './routes/lessonRoutes.js'; // Lesson CRUD routes
import enrollmentRoutes from './routes/enrollmentRoutes.js'; // Enrollment routes
import paymentRoutes from './routes/paymentRoutes.js'; // Payment processing routes


const app = express(); // Create Express application instance

// Security: Add helmet for secure HTTP headers (prevents common vulnerabilities)
app.use(helmet());

// Body parsing middlewares for handling JSON and URL-encoded request data
app.use(express.json({ limit: '16kb' })); // Parse JSON bodies with 16KB limit
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // Parse URL-encoded bodies

// Enable CORS with explicit origins (no wildcard in production for security)
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
    origin: allowedOrigins, // Only allow requests from these origins
    credentials: true, // Allow cookies and auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"] // Allowed request headers
}));

// Rate limiting for general API endpoints (prevents abuse)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 100, // Limit each IP to 100 requests per window
    message: { message: 'Too many requests, please try again later.' }
});

// Stricter rate limiting for auth routes (prevents brute force attacks)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 60, // Limit each IP to 60 auth attempts per hour
    message: { message: 'Too many authentication attempts, please try again after an hour.' }
});

// Apply rate limiters to routes
app.use('/api/', generalLimiter); // General rate limit for all API routes
app.use('/api/auth', authLimiter); // Stricter rate limit for auth routes only

// Mount API routes at their respective paths
app.use('/api/auth', authRoutes); // /api/auth/* - login, register
app.use('/api/users', userRoutes); // /api/users/* - profile operations
app.use('/api/courses', courseRoutes); // /api/courses/* - course CRUD
app.use('/api/articles', articleRoutes); // /api/articles/* - article CRUD
app.use('/api/admin', adminArticleRoutes); // /api/admin/* - admin operations
app.use('/api/lessons', lessonRoutes); // /api/lessons/* - lesson CRUD
app.use('/api/enrollments', enrollmentRoutes); // /api/enrollments/* - enrollment operations
app.use('/api/payments', paymentRoutes); // /api/payments/* - Razorpay payment

// Health check / test route for verifying server is running
app.get('/', (req, res) => {
    res.send('Root Endpoint is working fine');
});

export default app; // Export app for use in server startup
