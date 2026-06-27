import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";

const ChatParticipant = dbConnection.define(
    'ChatParticipant',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        chatRoomId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'chatRooms', // References your ChatRoom table
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users', // References your User table
                key: 'id'
            }
        },
        groupId: {
            type: DataTypes.UUID,
            allowNull: false // Enforces tenant isolation for participant records
        }
    },
    {
        tableName: 'chatParticipants',
        timestamps: true,
        // Ensure a user cannot be added to the same room twice
        indexes: [
            {
                unique: true,
                fields: ['chatRoomId', 'userId']
            }
        ]
    }
);

export default ChatParticipant;