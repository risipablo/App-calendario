import { Helmet } from "react-helmet"
import { TaskContainer } from "../components/task/taskContainer"
import "../style/task.css"

export const TaskPage = () => {

    return(
        <div className="container-pages">
            <Helmet> <title> Tareas </title> </Helmet>
            <TaskContainer/>
        </div>
    )
}