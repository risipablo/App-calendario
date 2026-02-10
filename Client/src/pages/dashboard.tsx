import { CheckCircle2, Clock, ListTodo } from "lucide-react"
import { useTasks } from "../context/taskContex"
import "../style/dashboard.css"

export const Dashboard = () => {

    const{
      // getAllSubtasksDay,
      getCompletedSubtasks,
      getCompletedTask,
      getPendigTask,
      getPendingSubtasks,
      // getTaskDay,
      getTotalTaskCompleted,
      getTotalTaskIncompleted,
      getTotalTasksDay,
      getFailTask
    } = useTasks()

    const totalTasks = getTotalTasksDay()
    const completedTasks = getTotalTaskCompleted()
    const incompletedTasks = getTotalTaskIncompleted()
    // const tasksToday = getTaskDay()
    const pendingMain = getPendigTask()
    const pendingSub = getPendingSubtasks()
    const completedMain = getCompletedTask()
    const completedSub = getCompletedSubtasks()
    const failTask = getFailTask()
    
    const totalPendingTask = () => {
        return pendingMain.length + pendingSub.length
    }

    return (
      <div className="task-table-container">
          <h2 className="dashboard-title">Dashboard</h2>

          <div className="dashboard-cards">

              {/* Tareas pendientes */}
              <div className="dashboard-card card-green">
                  <div className="card-icon">
                      <CheckCircle2 size={48} />
                  </div>
                  <div className="card-content">
                      <h3 className="card-number">{incompletedTasks}</h3>
                      <p className="card-label">Tareas pendientes</p>
                  </div>
              </div>

              {/* Tareas completadas */}
              <div className="dashboard-card card-purple">
                  <div className="card-icon">
                      <ListTodo size={48} />
                  </div>
                  <div className="card-content">
                      <h3 className="card-number">{completedTasks}</h3>
                      <p className="card-label">Tareas completadas</p>
                  </div>
              </div>

              {/* Total de tareas del día */}
              <div className="dashboard-card card-orange">
                  <div className="card-icon">
                      <Clock size={48} />
                  </div>
                  <div className="card-content">
                      <h3 className="card-number">{totalTasks}</h3>
                      <p className="card-label">Total tareas del día</p>
                  </div>
              </div>
          </div>

          {/* Lista de tareas principales pendientes */}
          <div className="tasks-section">
              <h3 className="section-title">Tareas Pendientes ({totalPendingTask()})</h3>
              {pendingMain.length === 0 ? (
                  <p className="empty-message">No hay tareas principales pendientes</p>
              ) : (
                  <ul className="task-list">
                      {pendingMain.map(task => (
                          <li key={task._id} className="task-item pending">
                              
                              <div className="task-info">
                                  <span className="task-title">{task.title}</span>
                                  <span className="task-priority priority-{task.priority.toLowerCase()}">
                                      {task.priority}
                                  </span>
                              </div>
                          </li>
                      ))}
                  </ul>
              )}

{pendingSub.length === 0 ? (
                  <p className="empty-message">✅ No hay subtareas pendientes</p>
              ) : (
                  <ul className="task-list">
                      {pendingSub.map((subtask, idx) => (
                          <li key={idx} className="task-item pending">
                              
                              <div className="task-info">
                                  <span className="task-title">{subtask.title}</span>
                                  <span className="task-priority priority-{subtask.priority.toLowerCase()}">
                                      {subtask.priority}
                                  </span>
                                  
                              </div>
                          </li>
                      ))}
                  </ul>
              )}
          </div>


          {/* Lista de tareas completadas */}
          <div className="tasks-section">
              <h3 className="section-title">Tareas Completadas ({completedTasks})</h3>
              {completedMain.length > 0 && (
                  <ul className="task-list">
                      {completedMain.map(task => (
                          <li key={task._id} className="task-item completed">
                              
                              <div className="task-info">
                                  <span className="task-title">{task.title}</span>
                                  <span className="task-priority priority-{task.priority.toLowerCase()}">
                                      {task.priority}
                                  </span>
                              </div>
                          </li>
                      ))}
                  </ul>
              )}

{completedSub.length > 0 && (
                  <ul className="task-list">
                      {completedSub.map((subtask, idx) => (
                          <li key={idx} className="task-item completed">
                              
                              <div className="task-info">
                                  <span className="task-title">{subtask.title}</span>
                                  <span className="task-priority priority-{subtask.priority.toLowerCase()}">
                                      {subtask.priority}
                                  </span>
                                  
                              </div>
                          </li>
                      ))}
                  </ul>
              )}
          </div>

          
          <div>
            <h3> Tareas Incompletas ({failTask.length})</h3>
            {failTask.map((subtask,idx) =>(
              <ul key={idx}>
                {subtask.title}
                
              </ul>
            ))}
            
          </div>
      </div>
  )
}