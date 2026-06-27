/**
 * @file models/Group.js
 * @description Schema definition for group configurations. 
 * This table stores unique parameters for each group, ensuring that
 * business logic and UI theming remain isolated as per assignment constraints.
 */

import { DataTypes } from "sequelize";
import { dbConnection } from "../config/db.js";

/**
 * Group Model
 * Stores the specific assignment parameters for each of the 20 groups[cite: 8, 47].
 * @typedef {Object} Group
 */
const Group = dbConnection.define(
    'Group',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        campusCode: { // e.g., 'CAM-NYC-01' [cite: 52]
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        primaryColor: { // e.g., '#1A237E' [cite: 52]
            type: DataTypes.STRING(10),
            allowNull: false
        },
        secondaryColor: { // e.g., '#FF6F00' [cite: 52]
            type: DataTypes.STRING(10),
            allowNull: false
        },
        apiBasePath: { // e.g., '/api/v1/nyc/' [cite: 56]
            type: DataTypes.STRING(50),
            allowNull: false
        },
        constraints: { 
            // Stores unique constraints as JSON (e.g., chat limits, timeout windows) [cite: 68]
            type: DataTypes.JSON,
            allowNull: false
        }
    },
    {
        tableName: 'Groups',
        timestamps: true
    }
);

export default Group;