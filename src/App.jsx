import { useEffect, useState } from "react";
import { getUserData } from "./utils/getUserData";
import { getActivityData } from "./utils/getActivityData";
import { getPerfData } from "./utils/getPerfData";
import { PerformanceGph } from "./components/features/common/PerformanceGph";
import { ScoreGph } from "./components/features/common/ScoreGph";

function App() {
  const datas = [
    {day: 1, kilogram: 0, calories: 0},
    {day: 2, kilogram: 0, calories: 0},
    {day: 3, kilogram: 0, calories: 0},
    {day: 4, kilogram: 0, calories: 0},
    {day: 5, kilogram: 0, calories: 0},
    {day: 6, kilogram: 0, calories: 0},
    {day: 7, kilogram: 0, calories: 0},
  ]
  const frenchTranslate = {
    cardio:"Cardio",
    energy: "Energie", 
    endurance: "Endurance", 
    strength: "Force", 
    intensity: "Intensité",
    speed: "Vitesse"
  }

  const userId = 18
  const [userData, setUserData] = useState({score:0})
  const [activityData, setActivityData] = useState(datas)
  const [perfData, setPerfData]= useState(null)

  useEffect( ()=> {
    async function fetchData() {
      const profilData = await getUserData(userId)
      const sessionData = await getActivityData(userId)
      const performance = await getPerfData(userId)

      setUserData ({...profilData})
      setActivityData ([...sessionData])
      setPerfData ({...performance})
    }

    fetchData()
    
  },[] )

  return <div className="flex justify-center m-10">
    <PerformanceGph data={perfData} order={[5,4,3,2,1,6]} language={frenchTranslate}/>
    <ScoreGph score={userData.score} />
  </div>
}

export default App
