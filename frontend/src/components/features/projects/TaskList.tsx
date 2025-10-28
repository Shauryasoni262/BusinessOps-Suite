'use client';

import { useState, useEffect } from 'react';
import { taskService, type Task } from '@/services/taskService';
import { getInitials, getTaskStatusColor } from '@/utils/helpers';
import { useProjectSocket } from '@/contexts/ProjectSocketContext';
import { TaskModal } from '@/components/modals/project';
import styles from './TaskList.module.css';

interface TaskListProps {
  projectId: string;
}

type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed';

export default function TaskList({ projectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deletingTask, setDeletingTask] = useState<string | null>(null);

  const { onTaskUpdate } = useProjectSocket();

  // Load tasks
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectTasks = await taskService.getProjectTasks(projectId);
      setTasks(projectTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, [projectId]);

  // Listen for real-time task updates
  useEffect(() => {
    if (!projectId) return;

    const handleTaskUpdate = (action: string, taskData: Task) => {
      console.log(`📡 Real-time task ${action}:`, taskData);
      
      if (action === 'created' && taskData.project_id === projectId) {
        setTasks(prev => [taskData, ...prev]);
      } else if (action === 'updated' && taskData.project_id === projectId) {
        setTasks(prev => prev.map(task => 
          task.id === taskData.id ? taskData : task
        ));
      } else if (action === 'deleted' && taskData.project_id === projectId) {
        setTasks(prev => prev.filter(task => task.id !== taskData.id));
      }
    };

    onTaskUpdate(handleTaskUpdate);
  }, [projectId, onTaskUpdate]);

  // Filter tasks by status
  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  // Handle status change
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      setUpdatingStatus(taskId);
      await taskService.updateTask(projectId, taskId, { status: newStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled' });
      // Real-time update will handle the UI update
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setDeletingTask(taskId);
      await taskService.deleteTask(projectId, taskId);
      // Real-time update will handle the UI update
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    } finally {
      setDeletingTask(null);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // Handle task save
  const handleTaskSave = () => {
    loadTasks(); // Refresh the list
    handleModalClose();
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
      case 'in_progress':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        );
      case 'pending':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
    }
  };

  // Status filter options
  const statusFilters = [
    { key: 'all' as StatusFilter, label: 'All', count: tasks.length },
    { key: 'pending' as StatusFilter, label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { key: 'in_progress' as StatusFilter, label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { key: 'completed' as StatusFilter, label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Project Tasks</h2>
          <p>Track progress on individual tasks</p>
        </div>
        <button 
          className={styles.createButton}
          onClick={() => setShowModal(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Task
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      {/* Status filters */}
      <div className={styles.filters}>
        {statusFilters.map(filter => (
          <button
            key={filter.key}
            className={`${styles.filterButton} ${statusFilter === filter.key ? styles.active : ''}`}
            onClick={() => setStatusFilter(filter.key)}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* Tasks list */}
      {filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"/>
              <path d="M3 12h18v6c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1v-6z"/>
            </svg>
          </div>
          <h3>No tasks found</h3>
          <p>
            {statusFilter === 'all' 
              ? "Get started by creating your first task for this project."
              : `No tasks found with status "${statusFilter}".`
            }
          </p>
          <button 
            className={styles.createButton}
            onClick={() => setShowModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Task
          </button>
        </div>
      ) : (
        <div className={styles.tasksList}>
          {filteredTasks.map(task => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskHeader}>
                <div className={styles.taskInfo}>
                  <h3 className={`${styles.taskTitle} ${task.status === 'completed' ? styles.completed : ''}`}>
                    {task.title}
                  </h3>
                  <div className={styles.taskBadges}>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getTaskStatusColor(task.status) }}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className={styles.taskActions}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={styles.statusSelect}
                    disabled={updatingStatus === task.id}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setEditingTask(task);
                      setShowModal(true);
                    }}
                    title="Edit task"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deletingTask === task.id}
                    title="Delete task"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>

              {task.description && (
                <div className={styles.taskDescription}>
                  <p>{task.description}</p>
                </div>
              )}

              <div className={styles.taskFooter}>
                <div className={styles.taskAssignee}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {task.assignee ? (
                    <div className={styles.assigneeBadge}>
                      <span className={styles.assigneeInitials}>
                        {getInitials(task.assignee.name)}
                      </span>
                      <span className={styles.assigneeName}>{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span>Unassigned</span>
                  )}
                </div>
                <div className={styles.statusIcon} style={{ color: getTaskStatusColor(task.status) }}>
                  {getStatusIcon(task.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          projectId={projectId}
          task={editingTask}
          onClose={handleModalClose}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
}