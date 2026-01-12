import { Route, Routes } from "react-router-dom"
import { TaskPage } from "./taskPage"


export const Home = () => {
  return (
    <>
    <Routes>
        <Route path="/" />
        <Route path="/task" element={<TaskPage/>} />
    </Routes>
    </>
    
  )
}
