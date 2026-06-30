// Example for Group 1
import { seedGroup } from "./seed.js";

const myConfig = {
    campusCode: 'CAM-DAL-09',
    primaryColor: '#BF360C',
    secondaryColor: '#651FFF',
    apiBasePath: '/api/v1/dal/',
    constraints: { 
        notificationBatching: 5
    }
};

seedGroup(myConfig);

// again this is jus example so each groups should fill there data