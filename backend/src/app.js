import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// import your auth routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import adminArticleRoutes from './routes/adminArticleRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


const app = express();

// Security: Add helmet for security headers
app.use(helmet());

// basic express middlewares for parsing json and urlencoded data
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Enable CORS with explicit origins (no wildcard in production)
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting for general API
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests, please try again later.' }
});

// Stricter rate limiting for auth routes (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 60, // limit each IP to 60 auth requests per hour
    message: { message: 'Too many authentication attempts, please try again after an hour.' }
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);

// mount routes here 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/admin', adminArticleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);

// test route
app.get('/', (req, res) => {
    res.send('Root Endpoint is working fine');
});

export default app;
