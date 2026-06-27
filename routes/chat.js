import express from 'express';
import { getOrCreateRoom, getAllUserRooms } from '../controllers/chat.js'; 
import { protectRoutes } from '../middlewares/protectRoute.js'; 

const router = express.Router();

/**
 * @route POST /api/chat/room
 * @desc Get existing room or create a new one
 * @access Private
 */
router.post('/room', protectRoutes, getOrCreateRoom);
router.get('/user-room', protectRoutes, getAllUserRooms);

export default router;