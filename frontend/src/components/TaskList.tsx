'use client';

import { useRef } from 'react';
import { useQuery } from '@apollo/client';
import { Task, Query, QueryTasksArgs } from '@/gql/types';
import { TASKS_QUERY } from '@/graphql/queries';
import { CircularProgress, Alert } from "@mui/material";

// Componentes modulares
import { TaskFilters } from './TaskFilters';
import { TaskTable } from './TaskTable';
import { CreateTaskDialog } from './CreateTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import ViewTaskDialog from './ViewTaskDialog';

// Custom hooks
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTaskDialogs } from '@/hooks/useTaskDialogs';

export const TaskList = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Custom hooks para manejar filtros y diálogos
  const {
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    priority,
    setPriority,
    filters
  } = useTaskFilters();

  const {
    selectedTask,
    isCreateDialogOpen,
    isViewDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleOpenCreate,
    handleOpenView,
    handleOpenEdit,
    handleOpenDelete,
    handleCloseCreate,
    handleCloseView,
    handleCloseEdit,
    handleCloseDelete
  } = useTaskDialogs();

  // Query para obtener tareas
  const { data, loading, error } = useQuery<Query, QueryTasksArgs>(TASKS_QUERY, {
    variables: { filters }
  });

  // Manejadores de eventos para los filtros
  const _handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const _handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    const target = event.target as HTMLInputElement;
    setSearchTerm(target.value);
  }
};

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4">
        Error al cargar las tareas: {error.message}
      </Alert>
    );
  }

  const tasks = data?.tasks || [];

  return (
    <div className="space-y-4">
      {/* Componente de Filtros */}
      <TaskFilters
        searchTerm={searchTerm}
        status={status}
        priority={priority}
        onSearchChange={_handleSearchChange}
        onStatusChange={(e) => setStatus(e.target.value)}
        onPriorityChange={(e) => setPriority(e.target.value)}
        onKeyPress={_handleKeyPress}
        onCreateClick={handleOpenCreate}
        inputRef={inputRef}
      />

      {/* Componente de Tabla */}
      <TaskTable
        tasks={tasks}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Diálogos */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onClose={handleCloseCreate}
      />

      <ViewTaskDialog
        open={isViewDialogOpen}
        onClose={handleCloseView}
        task={selectedTask}
      />

      <EditTaskDialog
        open={isEditDialogOpen}
        onClose={handleCloseEdit}
        task={selectedTask}
      />

      <DeleteTaskDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDelete}
        taskId={selectedTask?.id || null}
        taskTitle={selectedTask?.title || ''}
      />
    </div>
  );
};

export default TaskList;