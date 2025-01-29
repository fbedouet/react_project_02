import { getMockUserData } from "../services/apiUsers";

export async function getActivityData(id) {
    try{
        const receivedData = await getMockUserData(id, "activity")
        const mapper = receivedData.data.sessions.map(({day, calories, kilogram})=>{
            return {day: day.split('-')[2], calories: calories, kilogram: kilogram}
        })
        return mapper
    }catch(e){
        console.error(`${e}`)
    }
    
}