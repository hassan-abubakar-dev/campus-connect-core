import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const ChatMessage = dbConnection.define(
    'ChatMessage',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        chatRoomId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        groupId: {
            type: DataTypes.UUID,
            allowNull: false // Ensures messages belong to the correct tenant 
        },
        senderId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'text' // Supports requirements like file/voice [cite: 70, 90]
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // Supports read receipts [cite: 46]
        }
    },
    {
        tableName: 'chatMessages',
        timestamps: true
    }
);

export default ChatMessage;