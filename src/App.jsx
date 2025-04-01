import { useEffect, useState } from "react";
import { getUserData } from "./utils/getUserData";
import { getActivityData } from "./utils/getActivityData";
import { getPerfData } from "./utils/getPerfData";
import { PerformanceGph } from "./components/features/common/PerformanceGph";
import { ScoreGph } from "./components/features/common/ScoreGph";
import { ActivityGph } from "./components/features/common/ActivityGph";
import { AverageSessionDurationGph } from "./components/features/common/AverageSessionDurationGph";
import { getAvergageSession } from "./utils/getAverageSession";

function App() {
  const datas = {
    1: {kilogram: 0, calories: 0},
    2: {kilogram: 0, calories: 0},
    3: {kilogram: 0, calories: 0},
    4: {kilogram: 0, calories: 0},
    5: {kilogram: 0, calories: 0},
    6: {kilogram: 0, calories: 0},
    7: {kilogram: 0, calories: 0},
  }

  const frenchTranslate = {
    cardio:"Cardio",
    energy: "Energie", 
    endurance: "Endurance", 
    strength: "Force", 
    intensity: "Intensité",
    speed: "Vitesse"
  }

  const userId = 12
  
  const [userData, setUserData] = useState({score:0})
  const [activityData, setActivityData] = useState(datas)
  const [perfData, setPerfData]= useState(null)
  const [durationSession, setDurationSession]= useState(null)

  useEffect( ()=> {
    async function fetchData() {
      const profilData = await getUserData(userId)
      const sessionData = await getActivityData(userId)
      const performance = await getPerfData(userId)
      const averageSession = await getAvergageSession(userId)

      setUserData ({...profilData})
      setActivityData ({...sessionData})
      setPerfData ({...performance})
      setDurationSession(averageSession)
    }

    fetchData()
    
  },[] )

  return <>
    <div className="m-10">
      <ActivityGph activityData={activityData}/>
    </div>
    <div className="flex justify-center m-10 gap-10">
      <PerformanceGph data={perfData} order={[5,4,3,2,1,6]} language={frenchTranslate}/>
      <ScoreGph score={userData.score} />
      <AverageSessionDurationGph data={durationSession}/>
    </div>
  </>
}

export default App
