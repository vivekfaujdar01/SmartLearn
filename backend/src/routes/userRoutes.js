import express from 'express';
const router = express.Router();
import auth from '../middlewares/authMiddleware.js';

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
