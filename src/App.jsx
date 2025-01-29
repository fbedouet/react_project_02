import { useEffect, useState } from "react";
import { getUserData } from "./utils/getUserData";
import { ActivityGph } from "./components/features/ActivityGph";
import { ScoreGph } from "./components/features/ScoreGph";
import { getActivityData } from "./utils/getActivityData";
import { getPerfData } from "./utils/getPerfData";
import { TestResizeObs } from "./components/features/TestResizeObs";
import { PerformanceGph } from "./components/features/common/PerformanceGph";

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
const userId = 12

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
  {/* <ActivityGph data={activityData}/>
  <ScoreGph score={userData.score}/> */}
  {/* <PerformanceGphResp data={perfData} /> */}
  <PerformanceGph data={perfData}/>
  {/* <TestResizeObs/> */}
  </div>
}

export default App
