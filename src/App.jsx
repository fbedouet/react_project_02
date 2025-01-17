import { useEffect, useState } from "react";
import { getUserData } from "./utils/getUserData";
import { ActivityGph } from "./components/features/ActivityGph";
import { ScoreGph } from "./components/features/ScoreGph";

function App() {
  const [data, setData] = useState({score:0})

  useEffect( ()=> {

    async function fetchData() {
      const result = await getUserData(12)
      setData({...result})
    }

    fetchData()
    
  },[] )
  return <div className="flex justify-center mt-10">
  <ActivityGph/>
  <ScoreGph score={0.12}/>
  </div>
}

export default App
