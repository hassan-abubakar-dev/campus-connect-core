import Group from '../models/Group.js';

/**
 * Campus-Specific Constraint Engine
 * * DOCUMENTATION:
 * This service handles business logic constraints exclusively for:
 * - Group 1 (NYC): Max concurrent chat sessions per user.
 * - Group 2 (LA): Automated 24-hour message deletion policy.
 * * Note: This module is strictly scoped to these two campus configurations.
 */
export const checkConstraint = async (groupId, constraintType, value) => {
    const group = await Group.findByPk(groupId);
    if (!group) return false;

    const { campusCode, constraints } = group;

    // --- CAMPUS-SPECIFIC SECURITY LAYER ---
    
    // Group 1 (NYC) Constraint: Concurrent chat limit
    if (campusCode === 'CAM-NYC-01') {
        if (constraintType === 'MAX_CONCURRENT_CHATS') {
            return value <= (constraints.maxChats || 3);
        }
    }

    // Group 2 (LA) Constraint: Message auto-deletion policy
    if (campusCode === 'CAM-LA-02') {
        if (constraintType === 'AUTO_DELETE_ENABLED') {
            return constraints.autoDeleteEnabled === true;
        }
    }

    // Default: If the constraint type doesn't match the group, 
    // the system proceeds as standard.
    return true;
};