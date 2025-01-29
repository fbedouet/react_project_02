import { getMockUserData } from "../services/apiUsers";

export async function getPerfData(id) {
    try{
        const receivedData = await getMockUserData(id, "performance")
        const {kind, data} = receivedData.data
        const mapper = {}
        for (let i of data){
            const obj ={}
            const kindNumber = i.kind.toString()
            obj[kind[kindNumber]]= i.value
            Object.assign(mapper,obj)
        }
        return mapper
    }catch(e){
        console.error(`${e}`)
    }
    
}