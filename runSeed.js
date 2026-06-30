// Example for Group 1
import { seedGroup } from "./seed.js";

const myConfig = {
    campusCode: 'CAM-COL-14',
    primaryColor: '#3E2723',
    secondaryColor: '#18FFFF',
    apiBasePath: '/api/v2/col/',
    constraints: { 
        maxPinnedChartParUser: 10
    }
};

seedGroup(myConfig);

// again this is jus example so each groups should fill there data