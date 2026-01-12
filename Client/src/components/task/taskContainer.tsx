
import { UseTask } from "../../hooks/useTodo"
import { TaskTable } from "./taskTable"
import { ModalConfirm } from "../layout/modalConfirm"


export const TaskContainer = () => {
    const tasks = UseTask()


    return(
        <>

            <TaskTable
                task={tasks.task} 
                addTask={tasks.addTask}
                onDelete={tasks.deleteTask} 
                deletePrincipalTask={tasks.deletePrincipalTask}
                onDeleteAll={tasks.deleteAll}
                addNewTask={tasks.addNewTask}
                deleteSubTask={tasks.deleteSubTask}
                editSubTask={tasks.editSubTask}
                saveTask={tasks.saveTask}
                toogleAllTask={tasks.toogleAllTask}
                completedTask={tasks.completedTask}
                completedSubTasks={tasks.completedSubTasks}
                ModalConfirm={ModalConfirm}
            />
        </>
        
    )

}