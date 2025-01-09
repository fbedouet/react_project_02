import {getMockUserData } from "../services/apiUsers";

export function normalizedData(idUser) {

}

export async function getUserData(id) {
    try{
        const userData = await getMockUserData(id, "user")
        const performanceData = await getMockUserData(id, "performance")
        const averageSessionsData = await getMockUserData(id, "average-sessions")
        const activityData = await getMockUserData(id, "activity")
        console.log(userData);
        console.log(performanceData);
        console.log(activityData);
        console.log(averageSessionsData);
        return 
    }catch(e){
        console.error(`${e}`)
    }
}