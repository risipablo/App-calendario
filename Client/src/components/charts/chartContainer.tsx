
import { useTasks } from "../../context/taskContex"



export const ChartContainer = () => {

  const{ 
    getCompletedTask,
    getCompletedSubtasks,
    getFailTask,
    getPendigTask, 
    getPendingSubtasks
     
    } = useTasks()

  const completedMain = getCompletedTask()
  const subTaskCompleted = getCompletedSubtasks()
  const failTask = getFailTask()
  const pendigTask = getPendigTask()
  const pendingsubtask = getPendingSubtasks()

  

  return (
    <div className="task-table-container">

      <span> tareas Completadas:
        {
          completedMain.map(task => (
            <li key={task._id}>
                    <span className="task-title-inline">{task.title}</span>
                  <span className={`task-priority-inline priority-${task.priority.toLowerCase()}`}>
                                                          {task.priority}
                  </span>
            </li>
          )) 
        }  
        {
                subTaskCompleted.map((task,id) => (
                  <li key={id}>
                          <span className="task-title-inline">{task.title}</span>
                        <span className={`task-priority-inline priority-${task.priority.toLowerCase()}`}>
                                                                {task.priority}
                        </span>
                  </li>
                )) 
        }
      </span>
      <span> tareas Pendientes:
        {
          pendigTask.map((task,idx )=> (
            <li key={idx}>
                    <span className="task-title-inline">{task.title}</span>
                  <span className={`task-priority-inline priority-${task.priority.toLowerCase()}`}>
                                                          {task.priority}
                  </span>
            </li>
          )) 
        }  

      {
          pendingsubtask.map((task,idx )=> (
            <li key={idx}>
                    <span className="task-title-inline">{task.title}</span>
                  <span className={`task-priority-inline priority-${task.priority.toLowerCase()}`}>
                                                          {task.priority}
                  </span>
            </li>
          )) 
        }  
      </span>

      <span> Tareas Incompletas:
        {
          failTask.map((task,idx) => (
            <li key={idx}>
                    <span className="task-title-inline">{task.title}</span>
                  <span className={`task-priority-inline priority-${task.priority.toLowerCase()}`}>
                                                          {task.priority}
                  </span>
            </li>
          )) 
        }  
      </span>
      
    </div>
  )
}
