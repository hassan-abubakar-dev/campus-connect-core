/**
 * @file models/User.js
 * @description User schema with a foreign key to the Group model.
 * Linking users to groups allows for multi-tenant isolation.
 */

import { DataTypes, UUIDV4 } from "sequelize";
import { dbConnection } from "../config/db.js";
import Group from "./group.js"; // Import Group to establish relationship
import dotenv from 'dotenv';
dotenv.config();

const User = dbConnection.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        // [cite: 19, 20] Added groupId to associate users with specific campus requirements
        groupId: {
             type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Group,
                key: 'id'
            }
        },
        firstName: { type: DataTypes.STRING(35), allowNull: false },
        surName: { type: DataTypes.STRING(35), allowNull: false },
        email: { 
            type: DataTypes.STRING(45), 
            allowNull: false, 
            unique: true, 
            validate: { isEmail: true } 
        },
        password: { type: DataTypes.STRING(100), allowNull: false },
        //  Required for biometric/auth module
       /**
 * @field isBiometricEnabled
 * @description Stores user preference for native biometric authentication (FaceID/Fingerprint).
 * Used by the mobile client to determine whether to trigger hardware-level security prompts.
 */
isBiometricEnabled: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
},

profilePicture: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: process.env.DEFAULT_IMAGE
}
    },
    {
        tableName: 'Users',
        timestamps: true
    }
);

export default User;