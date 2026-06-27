// Example for Group 1
import { seedGroup } from "./seed.js";

const myConfig = {
    campusCode: 'CAM-NYC-01',
    primaryColor: '#1A237E',
    secondaryColor: '#FF6F00',
    apiBasePath: '/api/v1/nyc/',
    constraints: { 
        maxConcurrentChats: 3, 
        messageExpiryHours: 24 
    }
};

seedGroup(myConfig);

// again this is jus example so each groups should fill there data