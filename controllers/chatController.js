import ChatRoom from "../models/chatRoom.js";
import ChatParticipant from "../models/chatParticipant.js";
import { checkConstraint } from "../groupConstraints/group1-2.js";

/**
 * Gets or creates a room between users.
 * Validates concurrent chat limits for NYC (Group 1) participants.
 */

/**
 * @swagger
 * /api/chat/room:
 * post:
 * summary: Get or create a chat room
 * tags: [Chat]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * userId: { type: string, description: "ID of the user to chat with" }
 * isGroup: { type: boolean }
 * roomName: { type: string }
 * responses:
 * 200:
 * description: Room retrieved or created successfully.
 * 403:
 * description: Constraint violation (Max concurrent chats reached).
 */
export const getOrCreateRoom = async (req, res) => {
    const { userId, isGroup, roomName } = req.body; 
    const { id: currentUserId, groupId } = req.user;

    try {
        let room;

        // 1. Find existing room
        if (!isGroup) {
            room = await ChatRoom.findOne({
                where: { groupId, name: null },
                include: [
                    { model: ChatParticipant, where: { userId: currentUserId } },
                    { model: ChatParticipant, where: { userId: userId } }
                ]
            });
        } else {
            room = await ChatRoom.findOne({ where: { id: req.body.roomId, groupId } });
        }

        // 2. If no room exists, check constraints before creating
        if (!room) {
            // Check concurrent chat limit for Group 1 (NYC)
            const currentChatCount = await ChatParticipant.count({
                where: { userId: currentUserId, groupId }
            });

            const isAllowed = await checkConstraint(groupId, 'MAX_CONCURRENT_CHATS', currentChatCount);
            
            if (!isAllowed) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Constraint violation: You have reached the maximum of 3 concurrent chats." 
                });
            }

            // 3. Create new room if constraint passes
            room = await ChatRoom.create({ groupId, name: isGroup ? roomName : null });
            
            // 4. Add participants
            await ChatParticipant.bulkCreate([
                { userId: currentUserId, roomId: room.id, groupId },
                { userId: userId, roomId: room.id, groupId }
            ]);
        }

        res.status(200).json({ roomId: room.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**
 * Retrieves all chat rooms for the authenticated user.
 * Ensures the result is isolated to the user's groupId.
 */



/**
 * @swagger
 * /api/chat/my-rooms:
 * get:
 * summary: Retrieve all chat rooms for the authenticated user
 * tags: [Chat]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: List of rooms successfully retrieved
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean }
 * rooms: 
 * type: array
 * items:
 * $ref: '#/components/schemas/ChatRoom'
 * 500:
 * description: Server error
 */
export const getAllUserRooms = async (req, res) => {
    const { id: currentUserId, groupId } = req.user;

    try {
        // Query rooms where the current user is a participant
        const rooms = await ChatRoom.findAll({
            where: { groupId }, // Strict tenant isolation
            include: [
                {
                    model: ChatParticipant,
                    where: { userId: currentUserId },
                    attributes: ['id'] // We only need to know they are a member
                },
                {
                    model: ChatParticipant,
                    attributes: ['userId'] // To show other participants in the UI
                }
            ],
            order: [['updatedAt', 'DESC']] // Show most recent chats first
        });

        res.status(200).json({ success: true, rooms });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};