import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const ChatRoom = dbConnection.define(
    'ChatRoom',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        groupId: {
            type: DataTypes.UUID,
            allowNull: false // Enforces tenant isolation 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            defaultValue: 5 // Example constraint [cite: 72]
        }
    },
    {
        tableName: 'chatRooms',
        timestamps: true
    }
);

export default ChatRoom;