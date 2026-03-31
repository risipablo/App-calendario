import { Helmet } from "react-helmet"
import { TaskContainer } from "../components/task/taskContainer"
import "../style/task.css"

const TaskPage = () => {

    return(
        <div>
            <Helmet> <title> Tareas </title> </Helmet>
            <TaskContainer/>
        </div>
    )
}

export default TaskPage