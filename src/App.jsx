import { normalizedData } from "./utils/normalizeData";


function App() {
  try {
    console.log(normalizedData(true));
  }catch(e){
    console.log('erreur');
  }
  return (
    <>
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <h1 className="text-white text-4xl">Bienvenue dans mon app React avec Tailwind CSS!</h1>
    </div>
    </>
  )
}

export default App
