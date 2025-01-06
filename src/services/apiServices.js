import { mockData } from "../mocks/mockData"

export function getMockData (shouldReject = false){
    return new Promise( (resolve, reject)=> {
        setTimeout( ()=> {
                if (shouldReject){
                    reject(new Error('505'))
                }else{
                    resolve(mockData)
                }
            },500
        )
    })
}