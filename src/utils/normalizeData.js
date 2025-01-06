import { getMockData } from "../services/apiServices";

export async function normalizedData (shouldReject = false){
    return  await getMockData(shouldReject)
}