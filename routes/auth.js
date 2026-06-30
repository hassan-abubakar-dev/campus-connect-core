import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route POST /api/chat/room
 * @desc Get existing room or create a new one
 * @access Private
 */
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;