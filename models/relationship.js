import User from './user.js';
import Group from './Group.js';
import ChatRoom from './chatRoom.js';
import ChatMessage from './chatMessage.js';
import ChatParticipant from './chatParticipant.js';

/**
 * Centralized Relationship Definitions
 * This file establishes all foreign keys and associations.
 */
const setupRelationships = () => {

    // 1. Group to User (One Group can have many Users)
    Group.hasMany(User, { foreignKey: 'groupId' });
    User.belongsTo(Group, { foreignKey: 'groupId' });

    // 2. Group to ChatRoom (Tenant Isolation)
    Group.hasMany(ChatRoom, { foreignKey: 'groupId' });
    ChatRoom.belongsTo(Group, { foreignKey: 'groupId' });

    // 3. User to ChatParticipant
    User.hasMany(ChatParticipant, { foreignKey: 'userId' });
    ChatParticipant.belongsTo(User, { foreignKey: 'userId' });

    // 4. ChatRoom to ChatParticipant (One Room has many participants)
    ChatRoom.hasMany(ChatParticipant, { foreignKey: 'chatRoomId' });
    ChatParticipant.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' });

    // 5. ChatRoom to ChatMessage (One Room has many messages)
    ChatRoom.hasMany(ChatMessage, { foreignKey: 'chatRoomId' });
    ChatMessage.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' });

    // 6. User to ChatMessage (Sender)
    User.hasMany(ChatMessage, { foreignKey: 'senderId' });
    ChatMessage.belongsTo(User, { foreignKey: 'senderId' });

    console.log('Database relationships established successfully.');
};

export default setupRelationships;