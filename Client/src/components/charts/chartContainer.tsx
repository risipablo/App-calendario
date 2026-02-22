
import { useTasks } from "../../context/taskContex"



export const ChartContainer = () => {

  const{task, getCompletedTask, getFailTask,getPendigTask} = useTasks()

  const completedMain = getCompletedTask()
  const failTask = getFailTask()
  const pendigTask = getPendigTask()

  

  return (
    <div className="task-table-container">
      
      {
        task.map(tas => (
          <ul key={tas._id}>
            <li>
              
            </li>
          </ul>
        ))
      }

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
