import { Helmet } from "react-helmet"

import "../../style/task.css"
import { TaskContainer } from "../../components/task/taskContainer";

const TaskPage = () => {

    return(
        <div>
            <Helmet> <title> Tareas </title> </Helmet>
            <TaskContainer/>
        </div>
    )
}

export default TaskPage