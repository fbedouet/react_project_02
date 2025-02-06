import { getMockUserData } from "../services/apiUsers";

export async function getPerfData(id) {

    try{
        const receivedData = await getMockUserData(id, "performance")
        const {kind, data} = receivedData.data
        const mapper = {}
        const result = []
        for (let i of data){
            const obj ={}
            const kindNumber = i.kind.toString()
            const perfType = kind[kindNumber]
            obj[kindNumber]= {perfType: perfType, value: i.value}
            Object.assign(mapper,obj)
        }
        return mapper
    }catch(e){
        console.error(`${e}`)
    }
    
}