import {getMockUserData } from "../services/apiUsers";

export async function getUserData(id) {
    try{
        const receivedData = await getMockUserData(id, "user")
        const {...profil} = receivedData.data.userInfos
        const {...energyExpenditure} = receivedData.data.keyData
        const score = receivedData.data.todayScore 
                        ? receivedData.data.todayScore 
                        : receivedData.data.score

        return {
            profil,
            score:score,
            energyExpenditure 
        }
    }catch(e){
        console.error(`${e}`)
    }

}

export async function getActivityData(id) {
    
}