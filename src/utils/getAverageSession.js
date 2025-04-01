import { getMockUserData } from "../services/apiUsers"

export async function getAvergageSession(id) {
    try {
        const receivedData = await getMockUserData(id, "average-sessions")
        const mapper = receivedData.data.sessions.map( session => session.sessionLength  )

        return mapper

    }catch(e){
        console.error(`${e}`)
    }
}