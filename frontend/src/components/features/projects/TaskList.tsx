'use client';

import { useState, useEffect } from 'react';
import { taskService, type Task } from '@/services/taskService';
import { getInitials, getTaskStatusColor } from '@/utils/helpers';
import { useProjectSocket } from '@/contexts/ProjectSocketContext';
import { TaskModal } from '@/components/modals/project';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  User as UserIcon,
  AlertCircle,
  PlayCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
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

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const handleTaskUpdate = (action: string, taskData: Task) => {
      if (action === 'created' && taskData.project_id === projectId) {
        setTasks(prev => [taskData, ...prev]);
      } else if (action === 'updated' && taskData.project_id === projectId) {
        setTasks(prev => prev.map(task => task.id === taskData.id ? taskData : task));
      } else if (action === 'deleted' && taskData.project_id === projectId) {
        setTasks(prev => prev.filter(task => task.id !== taskData.id));
      }
    };

    onTaskUpdate(handleTaskUpdate);
  }, [projectId, onTaskUpdate]);

  const filteredTasks = tasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      setUpdatingStatus(taskId);
      await taskService.updateTask(projectId, taskId, { status: newStatus as any });
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setDeletingTask(taskId);
      await taskService.deleteTask(projectId, taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    } finally {
      setDeletingTask(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleTaskSave = () => {
    loadTasks();
    handleModalClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={20} color="#22c55e" />;
      case 'in_progress': return <PlayCircle size={20} color="#3b82f6" />;
      case 'pending': return <Circle size={20} color="#94a3b8" />;
      default: return <AlertCircle size={20} color="#94a3b8" />;
    }
  };

  const statusFilters = [
    { key: 'all' as StatusFilter, label: 'All', count: tasks.length },
    { key: 'pending' as StatusFilter, label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { key: 'in_progress' as StatusFilter, label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { key: 'completed' as StatusFilter, label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} size={32} />
        <span style={{ marginLeft: '1rem' }}>Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Project Tasks</h2>
          <p>Deliver your project piece by piece</p>
        </div>
        <button className={styles.createButton} onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
            <XCircle size={18} />
          </button>
        </div>
      )}

      <div className={styles.filters}>
        {statusFilters.map(filter => (
          <button
            key={filter.key}
            className={`${styles.filterButton} ${statusFilter === filter.key ? styles.active : ''}`}
            onClick={() => setStatusFilter(filter.key)}
          >
            {filter.label} 
            <span style={{ marginLeft: '0.4rem', opacity: 0.8 }}>({filter.count})</span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <CheckCircle2 size={64} strokeWidth={1} color="#cbd5e1" />
          </div>
          <h3>No tasks found</h3>
          <p>
            {statusFilter === 'all' 
              ? "Your project is a blank canvas. Start adding tasks to keep the momentum going."
              : `It looks like there are no tasks matching the "${statusFilter}" filter right now.`
            }
          </p>
          <button className={styles.createButton} style={{ marginTop: '0.5rem' }} onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Create First Task
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
                      style={{ 
                        backgroundColor: getTaskStatusColor(task.status),
                        opacity: task.status === 'completed' ? 0.7 : 1
                      }}
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
                    <option value="pending">Todo</option>
                    <option value="in_progress">Working</option>
                    <option value="completed">Done</option>
                  </select>
                  <button
                    className={styles.editButton}
                    onClick={() => { setEditingTask(task); setShowModal(true); }}
                    title="Edit task"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deletingTask === task.id}
                    title="Delete task"
                  >
                    <Trash2 size={16} />
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
                  {task.assignee ? (
                    <div className={styles.assigneeBadge}>
                      <div className={styles.assigneeInitials}>
                        {getInitials(task.assignee.name)}
                      </div>
                      <span className={styles.assigneeName}>{task.assignee.name}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
                      <UserIcon size={14} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Unassigned</span>
                    </div>
                  )}
                </div>
                <div className={styles.statusIcon}>
                  {getStatusIcon(task.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal
          projectId={projectId}
          task={editingTask}
          projectMembers={[]} // Members will be handled by the modal internally or passed if needed
          onClose={handleModalClose}
          onSave={async (data) => {
            if (editingTask) {
              await taskService.updateTask(projectId, editingTask.id, data);
            } else {
              await taskService.createTask(projectId, data);
            }
            handleTaskSave();
          }}
        />
      )}
    </div>
  );
}