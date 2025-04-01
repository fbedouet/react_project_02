import { getMockUserData } from "../services/apiUsers";

export async function getActivityData(id) {
    try{
        const receivedData = await getMockUserData(id, "activity")
        const mapper = receivedData.data.sessions.reduce( (acc, {day, kilogram, calories})=> {
            const dayNumber = day.split('-')[2]
            const dayKey = dayNumber[0]==='0' ? dayNumber[1] : dayNumber
            acc[dayKey] = {
                kilogram: kilogram,
                calories: calories
            }
            return acc
        },{})
        return mapper
    }catch(e){
        console.error(`${e}`)
    }
    
}