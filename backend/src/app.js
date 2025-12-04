import express from 'express';
import cors from 'cors';

const app = express();

// basic express middlewares for parsing json and urlencoded data with increased size limit
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));

//enable CORS or CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// test route
app.get('/', (req, res)=>{
    res.send('Root Endpoint is working fine');
})

export default app;