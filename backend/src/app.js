import express from 'express';
import cors from 'cors';

// import your auth routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

const app = express();

// basic express middlewares for parsing json and urlencoded data
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));

//enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// mount routes here 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// test route
app.get('/', (req, res)=>{
    res.send('Root Endpoint is working fine');
});

export default app;
