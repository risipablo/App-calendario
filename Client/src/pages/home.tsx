import { Route, Routes } from "react-router-dom"
import { TaskPage } from "./taskPage"
import { GoalPage } from "./goalPage"


export const Home = () => {
  return (
    <>
    <Routes>
        <Route path="/" />
        <Route path="/task" element={<TaskPage/>} />
        <Route path="/goals" element={<GoalPage/>}/>
    </Routes>
    </>
    
  )
}
