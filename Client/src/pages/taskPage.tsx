import { TaskContainer } from "../components/task/taskContainer"
import "../style/task.css"

export const TaskPage = () => {

    return(
        <div className="container-taskpage">
            <h2> Tareas del dia </h2>
            <TaskContainer/>
        </div>
    )
}