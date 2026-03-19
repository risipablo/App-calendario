// components/ChartContainer.tsx
import React, { useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { useTaskFilters, type PeriodType } from "../filter/useTaskFilter"
import "../../style/chart.css";
import type { ISubtask, ITodo } from "../../interfaces/type.task";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

type ChartType = 'bar' | 'pie' | 'doughnut' | 'line';

export const ChartContainer: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [showCompleted, setShowCompleted] = useState(true);
    const [showPending, setShowPending] = useState(true);
    const [showFailed, setShowFailed] = useState(true);

    const { useFilteredData } = useTaskFilters();
    const {
        tasks,
        subtasks,
        stats,
        completedTasks,
        completedSubtasks,
        pendingTasks,
        pendingSubtasks,
        failedTasks,
        failedSubtasks,
    } = useFilteredData(selectedPeriod);

    // Calcular porcentajes
    const percentages = useMemo(() => {
        if (stats.total === 0) return { completed: 0, pending: 0, failed: 0 };
        return {
            completed: Math.round((stats.completed.total / stats.total) * 100),
            pending: Math.round((stats.pending.total / stats.total) * 100),
            failed: Math.round((stats.failed.total / stats.total) * 100),
        };
    }, [stats]);

    // Datos para gráfico de barras
    const barChartData = {
        labels: ['Completadas', 'Pendientes', 'No Realizadas'],
        datasets: [
            {
                label: 'Tareas Principales',
                data: [stats.completed.tasks, stats.pending.tasks, stats.failed.tasks],
                backgroundColor: 'rgba(40, 167, 69, 0.7)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1,
            },
            {
                label: 'Subtareas',
                data: [stats.completed.subtasks, stats.pending.subtasks, stats.failed.subtasks],
                backgroundColor: 'rgba(23, 162, 184, 0.7)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1,
            }
        ],
    };

    // Datos para gráfico de pastel
    const pieChartData = {
        labels: ['Completadas', 'Pendientes', 'No Realizadas'],
        datasets: [{
            data: [stats.completed.total, stats.pending.total, stats.failed.total],
            backgroundColor: [
                'rgba(40, 167, 69, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(220, 53, 69, 0.8)',
            ],
            borderColor: [
                'rgba(40, 167, 69, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(220, 53, 69, 1)',
            ],
            borderWidth: 1,
        }],
    };

    // Datos para gráfico de dona (con desglose por prioridad)
    const doughnutChartData = {
        labels: ['Alta Completadas', 'Media Completadas', 'Baja Completadas', 'Pendientes', 'No Realizadas'],
        datasets: [{
            data: [
                stats.byPriority.alta.completed,
                stats.byPriority.media.completed,
                stats.byPriority.baja.completed,
                stats.pending.total,
                stats.failed.total,
            ],
            backgroundColor: [
                'rgba(220, 53, 69, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(40, 167, 69, 0.8)',
                'rgba(108, 117, 125, 0.8)',
                'rgba(52, 58, 64, 0.8)',
            ],
            borderColor: [
                'rgba(220, 53, 69, 1)',
                'rgba(255, 193, 7, 1)',
                'rgba(40, 167, 69, 1)',
                'rgba(108, 117, 125, 1)',
                'rgba(52, 58, 64, 1)',
            ],
            borderWidth: 1,
        }],
    };

    // Datos para gráfico de línea (tendencia semanal)
    const getLineChartData = () => {
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        
        const completedByDay = days.map(() => Math.floor(stats.completed.total / 7) + Math.floor(Math.random() * 2));
        const pendingByDay = days.map(() => Math.floor(stats.pending.total / 7) + Math.floor(Math.random() * 2));
        
        return {
            labels: days,
            datasets: [
                {
                    label: 'Completadas',
                    data: completedByDay,
                    borderColor: 'rgb(40, 167, 69)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: 'Pendientes',
                    data: pendingByDay,
                    borderColor: 'rgb(255, 193, 7)',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    tension: 0.4,
                    fill: true,
                },
            ],
        };
    };

    // Opciones comunes para los gráficos
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 12,
                    },
                    padding: 15,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                // Chart.js expects `weight` to be a specific union (e.g. "bold" | "normal" | numbers).
                // Without a contextual type, TS can widen "'bold'" to `string`, which breaks assignability.
                titleFont: { size: 13, weight: 'bold' as const },
                bodyFont: { size: 12 },
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1,
            },
        },
    };

    const barChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    // Chart.js can pass `tickValue` as `string | number` depending on scale/data.
                    // Normalize to number so the callback matches Chart.js' expected signature.
                    callback: (value: string | number) => Math.floor(Number(value)),
                },
            },
        },
    };

    // Función para renderizar el gráfico seleccionado
    const renderChart = () => {
        if (stats.total === 0) {
            return (
                <div className="no-data-chart">
                    <p>No hay datos para mostrar en este período</p>
                </div>
            );
        }

        switch (chartType) {
            case 'bar':
                return <Bar data={barChartData} options={barChartOptions} />;
            case 'pie':
                return <Pie data={pieChartData} options={chartOptions} />;
            case 'doughnut':
                return <Doughnut data={doughnutChartData} options={chartOptions} />;
            case 'line':
                return <Line data={getLineChartData()} options={chartOptions} />;
            default:
                return <Bar data={barChartData} options={barChartOptions} />;
        }
    };

    // Función para renderizar listas de tareas
    const renderTaskList = (
        tasksList: ITodo[],
        subtasksList: Array<ISubtask & { parentTask: string; parentId?: string }>
    ) => {
        if (tasksList.length === 0 && subtasksList.length === 0) {
            return <p className="no-tasks-message">No hay tareas en esta categoría</p>;
        }

        return (
            <>
                {tasksList.length > 0 && (
                    <div className="task-group">
                        <h4>Tareas Principales:</h4>
                        <ul>
                            {tasksList.map(task => (
                                <li key={task._id} className="task-item">
                                    <span className="task-title">{task.title}</span>
                                    <span className={`priority priority-${task.priority?.toLowerCase() || 'media'}`}>
                                        {task.priority || 'Media'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {subtasksList.length > 0 && (
                    <div className="task-group">
                        <h4>Subtareas:</h4>
                        <ul>
                            {subtasksList.map((subtask, idx) => (
                                <li key={`${subtask.parentId}-${idx}`} className="task-item">
                                    <span className="task-title">
                                        {subtask.title} 
                                        <small> (de: {subtask.parentTask})</small>
                                    </span>
                                    <span className={`priority priority-${subtask.priority?.toLowerCase() || 'media'}`}>
                                        {subtask.priority || 'Media'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </>
        );
    };

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case 'day':
                return 'Hoy';
            case 'week':
                return 'Esta Semana';
            case 'month':
                return 'Este Mes';
            case 'all':
                return 'Todas';
            default:
                return selectedPeriod;
        }
    };

    return (
        <div className="task-table-container">
            {/* Header con controles */}
            <div className="dashboard-header">
                <h1>Dashboard de Tareas</h1>
                
                <div className="controls-container">
                    <div className="control-group">
                        <label>Período:</label>
                        <div className="period-selector">
                            <button 
                                className={selectedPeriod === 'day' ? 'active' : ''}
                                onClick={() => setSelectedPeriod('day')}
                            >
                                Hoy
                            </button>
                            <button 
                                className={selectedPeriod === 'week' ? 'active' : ''}
                                onClick={() => setSelectedPeriod('week')}
                            >
                                Semana
                            </button>
                            <button 
                                className={selectedPeriod === 'month' ? 'active' : ''}
                                onClick={() => setSelectedPeriod('month')}
                            >
                                Mes
                            </button>
                            <button 
                                className={selectedPeriod === 'all' ? 'active' : ''}
                                onClick={() => setSelectedPeriod('all')}
                            >
                                Todas
                            </button>
                        </div>
                    </div>

                    <div className="control-group">
                        <label>Tipo de Gráfico:</label>
                        <div className="chart-type-selector">
                            <button 
                                className={chartType === 'bar' ? 'active' : ''} 
                                onClick={() => setChartType('bar')}
                                title="Gráfico de barras"
                            >
                                Barras
                            </button>
                            <button 
                                className={chartType === 'pie' ? 'active' : ''} 
                                onClick={() => setChartType('pie')}
                                title="Gráfico de pastel"
                            >
                                Pastel
                            </button>
                            <button 
                                className={chartType === 'doughnut' ? 'active' : ''} 
                                onClick={() => setChartType('doughnut')}
                                title="Gráfico de dona"
                            >
                                Dona
                            </button>
                            <button 
                                className={chartType === 'line' ? 'active' : ''} 
                                onClick={() => setChartType('line')}
                                title="Gráfico de línea"
                            >
                                Línea
                            </button>
                        </div>
                    </div>

                    <div className="control-group">
                        <label>Filtros:</label>
                        <div className="filter-buttons">
                            <button 
                                className={`filter-btn completed ${!showCompleted ? 'inactive' : ''}`}
                                onClick={() => setShowCompleted(!showCompleted)}
                            >
                                Completadas
                            </button>
                            <button 
                                className={`filter-btn pending ${!showPending ? 'inactive' : ''}`}
                                onClick={() => setShowPending(!showPending)}
                            >
                                Pendientes
                            </button>
                            <button 
                                className={`filter-btn failed ${!showFailed ? 'inactive' : ''}`}
                                onClick={() => setShowFailed(!showFailed)}
                            >
                                No Realizadas
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="stats-cards">
                <div className="stat-card total">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>Total</h3>
                        <p className="stat-number">{stats.total}</p>
                        <small>
                            {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} | {subtasks.length} subtarea{subtasks.length !== 1 ? 's' : ''}
                        </small>
                    </div>
                </div>
                
                <div className="stat-card completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>Completadas</h3>
                        <p className="stat-number">{stats.completed.total}</p>
                        <small>{percentages.completed}% del total</small>
                        <div className="stat-detail">
                            <span>📌 {stats.completed.tasks}</span>
                            <span>📎 {stats.completed.subtasks}</span>
                        </div>
                    </div>
                </div>
                
                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3>Pendientes</h3>
                        <p className="stat-number">{stats.pending.total}</p>
                        <small>{percentages.pending}% del total</small>
                        <div className="stat-detail">
                            <span>📌 {stats.pending.tasks}</span>
                            <span>📎 {stats.pending.subtasks}</span>
                        </div>
                    </div>
                </div>
                
                <div className="stat-card failed">
                    <div className="stat-icon">❌</div>
                    <div className="stat-content">
                        <h3>No Realizadas</h3>
                        <p className="stat-number">{stats.failed.total}</p>
                        <small>{percentages.failed}% del total</small>
                        <div className="stat-detail">
                            <span>📌 {stats.failed.tasks}</span>
                            <span>📎 {stats.failed.subtasks}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico */}
            <div className="chart-wrapper">
                <div className="chart-header">
                    <h2>Visualización - {getPeriodLabel()}</h2>
                    {stats.total > 0 && (
                        <div className="chart-legend">
                            <span className="legend-item main-task">Tareas principales</span>
                            <span className="legend-item subtask">Subtareas</span>
                        </div>
                    )}
                </div>
                <div className="chart-container">
                    {renderChart()}
                </div>
            </div>

            {/* Lista detallada de tareas */}
            <div className="tasks-details">
                {showCompleted && (
                    <div className="tasks-column completed">
                        <h3>✅ Completadas ({completedTasks.length + completedSubtasks.length})</h3>
                        {renderTaskList(completedTasks, completedSubtasks)}
                    </div>
                )}

                {showPending && (
                    <div className="tasks-column pending">
                        <h3>⏳ Pendientes ({pendingTasks.length + pendingSubtasks.length})</h3>
                        {renderTaskList(pendingTasks, pendingSubtasks)}
                    </div>
                )}

                {showFailed && (
                    <div className="tasks-column failed">
                        <h3>❌ No Realizadas ({failedTasks.length + failedSubtasks.length})</h3>
                        {renderTaskList(failedTasks, failedSubtasks)}
                    </div>
                )}
            </div>

            {/* Mensaje cuando no hay datos */}
            {stats.total === 0 && (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No hay tareas para el período seleccionado</p>
                    <small>Prueba cambiando el período o agregando nuevas tareas</small>
                </div>
            )}
        </div>
    );
};

export default ChartContainer;