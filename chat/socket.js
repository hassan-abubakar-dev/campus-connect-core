import { Server } from "socket.io";
import ChatMessage from "../models/chatMessage.js";
import ChatRoom from "../models/chatRoom.js";

let io;

const socketInit = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        const { userId, groupId } = socket.handshake.query;
        
        if (!userId || !groupId) {
            return socket.disconnect();
        }

        socket.join(`group-${groupId}`);
        socket.join(`user-${userId}`);

        socket.on('new-connection', async (data) => {
            const { roomId } = data;
            const room = await ChatRoom.findOne({ where: { id: roomId, groupId } });
            
            if (room) {
                socket.roomId = roomId;
                socket.join(`room-${roomId}`);
            } else {
                socket.emit('error', { message: 'Unauthorized access to room.' });
            }
        });

        // --- TYPING INDICATOR LOGIC (Ephemeral) ---
        socket.on('typing', (data) => {
            if (socket.roomId) {
                socket.to(`room-${socket.roomId}`).emit('typing', {
                    userId: userId,
                    isTyping: true
                });
            }
        });

        socket.on('stop-typing', (data) => {
            if (socket.roomId) {
                socket.to(`room-${socket.roomId}`).emit('typing', {
                    userId: userId,
                    isTyping: false
                });
            }
        });
        // ------------------------------------------

        socket.on('new-message', async (data) => {
            if (!socket.roomId) return;

            try {
                const message = await ChatMessage.create({
                    content: data.message,
                    chatRoomId: socket.roomId,
                    senderId: userId,
                    groupId: groupId,
                    type: 'text'
                });

                io.to(`room-${socket.roomId}`).emit('new-message', {
                    id: message.id,
                    senderId: userId,
                    message: data.message,
                    createdAt: message.createdAt
                });
            } catch (err) {
                console.error('Message Error:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

export const getIo = () => io;
export default socketInit;