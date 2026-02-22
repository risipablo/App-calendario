

import { TaskTable } from "./taskTable"
import { ModalConfirm } from "../layout/modalConfirm"
import { useTasks } from "../../context/taskContex"


export const TaskContainer = () => {
    const { 
        task,
        filterTask,
        setFilterTask,
        addTask,
        deleteTask,
        deleteAll,
        addNewTask,
        deleteSubTask,
        editSubTask,
        saveTask,
        toogleAllTask,
        completedTask,
        completedSubTasks,
        incompletedSubtask
    } = useTasks()


    return(
        <>

            <TaskTable
                task={task}
                filterTask={filterTask}
                setFilterTask={setFilterTask}
                addTask={addTask}
                onDelete={deleteTask}
                onDeleteAll={deleteAll}
                addNewTask={addNewTask}
                deleteSubTask={deleteSubTask}
                editSubTask={editSubTask}
                saveTask={saveTask}
                toogleAllTask={toogleAllTask}
                completedTask={completedTask}
                completedSubTasks={completedSubTasks}
                incompletedSubtask={incompletedSubtask}
                ModalConfirm={ModalConfirm}
            />
        </>
        
    )

}