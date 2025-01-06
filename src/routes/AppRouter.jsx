import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "../App"

export function AppRouter (){
    const router = createBrowserRouter([
        {
            path: '/',
            element: <App/>
        }
    ])
    return <RouterProvider router={router}/>
}