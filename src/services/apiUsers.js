import mockUserData from "../mocks/mockUsers.json"
import mockPerformanceData from "../mocks/mockPerformances.json"
import mockActivityData from "../mocks/mockActivity.json"
import mockAverageSessionsData from "../mocks/mockAverageSessions.json"

export function getMockUserData(idUser, dataType, shouldReject=false) {
    
    const fetchUser =(id)=> {
        const user = mockUserData.data.filter(user=> user.user===idUser)
        return user[0].data
    }

    const fetchPerformance =(id=> {
        const user =mockPerformanceData.data.filter(user=> user.user===idUser)
        return user[0].data
    })

    const fetchActivity =(id=> {
        const user =mockActivityData.data.filter(user=> user.user===idUser)
        return user[0].data
    })

    const fetchAverageSessions =(id=> {
        const user = mockAverageSessionsData.data.filter(user=> user.user===idUser)
        return user[0].data
    })

    return new Promise( (resolve, reject)=> {
        setTimeout( ()=> {
                if (shouldReject){
                    reject(new Error('505'))
                }else{
                    switch(dataType) {
                        case 'user':
                            resolve(fetchUser(idUser))
                            break
                        case 'performance':
                            resolve(fetchPerformance(idUser))
                            break
                        case 'activity':
                            resolve(fetchActivity(idUser))
                            break
                        case 'average-sessions':
                            resolve(fetchAverageSessions(idUser))
                        break
                        default:
                            console.error('Erreur "getMockUserData" function: Data type undefined')

                    }
                }
            },1000
        )
    })    
}