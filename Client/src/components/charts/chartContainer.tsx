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
import { 
    CheckCircle2, 
    Clock, 
    XCircle, 
    ListTodo,
    Inbox
} from 'lucide-react';
import { useTaskFilter, type PeriodType } from "../filter/useTaskFilter"
import "../../style/chart.css";
import "../../style/task.css";
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
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [showCompleted, setShowCompleted] = useState(true);
    const [showPending, setShowPending] = useState(true);
    const [showFailed, setShowFailed] = useState(true);

    const { useFilteredData } = useTaskFilter();
    
    const hasMonthFilter = selectedMonth !== '';
    
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
    } = useFilteredData(
        hasMonthFilter ? selectedMonth : undefined,
        hasMonthFilter ? selectedYear : undefined,
        !hasMonthFilter ? selectedPeriod : undefined
    );

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

    // Datos para gráfico de dona
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

    // Datos para gráfico de línea
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

    // Opciones para gráficos
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { font: { size: 12 }, padding: 15 },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 13, weight: 'bold' as const },
                bodyFont: { size: 12 },
            },
        },
    };

    const barChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, callback: (value: string | number) => Math.floor(Number(value)) },
            },
        },
    };

    // Renderizar gráfico
    const renderChart = () => {
        if (stats.total === 0) {
            return (
                <div className="no-data-chart">
                    <p>No hay datos para mostrar</p>
                </div>
            );
        }

        switch (chartType) {
            case 'bar': return <Bar data={barChartData} options={barChartOptions} />;
            case 'pie': return <Pie data={pieChartData} options={chartOptions} />;
            case 'doughnut': return <Doughnut data={doughnutChartData} options={chartOptions} />;
            case 'line': return <Line data={getLineChartData()} options={chartOptions} />;
            default: return <Bar data={barChartData} options={barChartOptions} />;
        }
    };

    // Renderizar listas de tareas
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
                        <h4>Tareas:</h4>
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

    
    const getActiveFilterLabel = () => {
        if (selectedMonth) {
            const months: Record<string, string> = {
                '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
                '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
                '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
            };
            const year = selectedYear || new Date().getFullYear();
            return `${months[selectedMonth]} ${year}`;
        }
        if (selectedPeriod === 'day') return 'Hoy';
        if (selectedPeriod === 'week') return 'Esta Semana';
        if (selectedPeriod === 'month') return 'Este Mes';
        return 'Todas';
    };

    
    const clearFilters = () => {
        setSelectedMonth('');
        setSelectedYear('');
        setSelectedPeriod('week');
    };

    return (
        <div className="task-table-container">
            {/* Controles de filtro */}
            <div className="controls-container">
                {/* Selector de período */}
                {!selectedMonth && (
                    <div className="control-group">
                        <label>Período:</label>
                        <div className="period-selector">
                            <button className={selectedPeriod === 'day' ? 'active' : ''} onClick={() => setSelectedPeriod('day')}>
                                Hoy
                            </button>
                            <button className={selectedPeriod === 'week' ? 'active' : ''} onClick={() => setSelectedPeriod('week')}>
                                Semana
                            </button>
                            <button className={selectedPeriod === 'month' ? 'active' : ''} onClick={() => setSelectedPeriod('month')}>
                                Mes
                            </button>
                            <button className={selectedPeriod === 'all' ? 'active' : ''} onClick={() => setSelectedPeriod('all')}>
                                Todas
                            </button>
                        </div>
                    </div>
                )}

                {/* Selector de mes */}
                <div className="control-group">
                    <label>Filtrar por mes:</label>
                    <div className="month-selector">
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">Todos los meses</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>

                        <select 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)}
                            disabled={!selectedMonth}
                        >
                            <option value="">Año</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>

                        {selectedMonth && (
                            <button onClick={clearFilters} className="clear-filter-btn">
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Indicador de filtro activo */}
            {(selectedMonth || selectedPeriod !== 'all') && (
                <div className="active-filter-indicator">
                    Mostrando: {getActiveFilterLabel()}
                </div>
            )}

            {/* Tarjetas de estadísticas */}
            <div className="stats-cards">
                <div className="stat-card total">
                    <div className="stat-icon"><ListTodo size={20} /></div>
                    <div className="stat-content">
                        <h3>Total</h3>
                        <p className="stat-number">{stats.total}</p>
                        <small>{tasks.length + subtasks.length} tareas</small>
                    </div>
                </div>
                
                <div className="stat-card completed">
                    <div className="stat-icon"><CheckCircle2 size={20} /></div>
                    <div className="stat-content">
                        <h3>Completadas</h3>
                        <p className="stat-number">{stats.completed.total}</p>
                        <small>{percentages.completed}%</small>
                    </div>
                </div>
                
                <div className="stat-card pending">
                    <div className="stat-icon"><Clock size={20} /></div>
                    <div className="stat-content">
                        <h3>Pendientes</h3>
                        <p className="stat-number">{stats.pending.total}</p>
                        <small>{percentages.pending}%</small>
                    </div>
                </div>
                
                <div className="stat-card failed">
                    <div className="stat-icon"><XCircle size={20} /></div>
                    <div className="stat-content">
                        <h3>No Realizadas</h3>
                        <p className="stat-number">{stats.failed.total}</p>
                        <small>{percentages.failed}%</small>
                    </div>
                </div>
            </div>

            {/* Selector de tipo de gráfico */}
            <div className="controls-container">
                <div className="control-group">
                    <label>Tipo de Gráfico:</label>
                    <div className="chart-type-selector">
                        <button className={chartType === 'bar' ? 'active' : ''} onClick={() => setChartType('bar')}>Barras</button>
                        <button className={chartType === 'pie' ? 'active' : ''} onClick={() => setChartType('pie')}>Pastel</button>
                        <button className={chartType === 'doughnut' ? 'active' : ''} onClick={() => setChartType('doughnut')}>Dona</button>
                        <button className={chartType === 'line' ? 'active' : ''} onClick={() => setChartType('line')}>Línea</button>
                    </div>
                </div>
            </div>

            {/* Gráfico */}
            <div className="chart-wrapper">
                <div className="chart-header">
                    <h2>Visualización - {getActiveFilterLabel()}</h2>
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

            {/* Filtros de visualización de tareas */}
            <div className="controls-container">
                <div className="control-group">
                    <label>Mostrar:</label>
                    <div className="filter-buttons">
                        <button className={`filter-btn completed ${!showCompleted ? 'inactive' : ''}`}
                                onClick={() => setShowCompleted(!showCompleted)}>
                            Completadas
                        </button>
                        <button className={`filter-btn pending ${!showPending ? 'inactive' : ''}`}
                                onClick={() => setShowPending(!showPending)}>
                            Pendientes
                        </button>
                        <button className={`filter-btn failed ${!showFailed ? 'inactive' : ''}`}
                                onClick={() => setShowFailed(!showFailed)}>
                            No Realizadas
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista detallada de tareas */}
            <div className="tasks-details">
                {showCompleted && (
                    <div className="tasks-column completed">
                        <h3>
                            <CheckCircle2 size={18} />
                            Completadas ({completedTasks.length + completedSubtasks.length})
                        </h3>
                        {renderTaskList(completedTasks, completedSubtasks)}
                    </div>
                )}

                {showPending && (
                    <div className="tasks-column pending">
                        <h3>
                            <Clock size={18} />
                            Pendientes ({pendingTasks.length + pendingSubtasks.length})
                        </h3>
                        {renderTaskList(pendingTasks, pendingSubtasks)}
                    </div>
                )}

                {showFailed && (
                    <div className="tasks-column failed">
                        <h3>
                            <XCircle size={18} />
                            No Realizadas ({failedTasks.length + failedSubtasks.length})
                        </h3>
                        {renderTaskList(failedTasks, failedSubtasks)}
                    </div>
                )}
            </div>

            {/* Mensaje cuando no hay datos */}
            {stats.total === 0 && (
                <div className="empty-state">
                    <Inbox size={42} />
                    <p>No hay tareas para mostrar</p>
                    <small>Prueba cambiando los filtros</small>
                </div>
            )}
        </div>
    );
};

export default ChartContainer;