import Group from './models/Group.js';

export const seedGroup = async (groupData) => {
    try {
        // 1. Look for an existing group with this campusCode
        const existingGroup = await Group.findOne({ 
            where: { campusCode: groupData.campusCode } 
        });

        if (existingGroup) {
            // 2. If it exists, just update it
            await existingGroup.update(groupData);
            console.log(`Updated configuration for ${groupData.campusCode}`);
        } else {
            // 3. If it doesn't exist, create it
            await Group.create(groupData);
            console.log(`Created new configuration for ${groupData.campusCode}`);
        }
    } catch (err) {
        console.error("Seeding/Configuration failed:", err);
    }
};