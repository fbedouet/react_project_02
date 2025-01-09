import { useEffect, useState } from "react";
import { getUserData } from "./utils/getUserData";

function App() {
  const [data, setData] = useState(null)
  let name=""

  useEffect( ()=> {

    async function fetchData() {
      const result = await getUserData(12)
      setData(result)
    }

    fetchData()
    
  },[] )

  if(data){
    name=data.userInfos.firstName;
  }
  return (
    <>
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <h1 className="text-white text-4xl">Bienvenue {name} dans mon app React avec Tailwind CSS!</h1>
    </div>
    </>
  )
}

export default App
