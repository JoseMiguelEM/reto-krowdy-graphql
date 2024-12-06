'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import {
  Task,
  TaskStatus,
  Priority,
  TaskFilterInput,
  Query,
  QueryTasksArgs
} from '@/gql/types';
import { TASKS_QUERY } from '@/graphql/queries';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  IconButton,
  Tooltip
} from "@mui/material";
import { Visibility, Edit, Delete, Add } from '@mui/icons-material';
import { CreateTaskDialog } from './CreateTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import ViewTaskDialog from './ViewTaskDialog';

const DEBOUNCE_DELAY = 2000;

export const TaskList = () => {
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  // Estados para diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Query para obtener tareas
  const { data, loading, error } = useQuery<Query, QueryTasksArgs>(TASKS_QUERY, {
    variables: {
      filters: {
        searchTerm: debouncedSearchTerm || undefined,
        status: status || undefined,
        priority: priority || undefined
      } as TaskFilterInput
    }
  });

  // Efecto para el debounce de la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Manejadores de eventos
  const _handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const _handleStatusChange = (event: any) => {
    setStatus(event.target.value as TaskStatus);
  };

  const _handlePriorityChange = (event: any) => {
    setPriority(event.target.value as Priority);
  };

  const _handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setDebouncedSearchTerm(searchTerm);
    }
  };

  // Renderizado condicional para estados de carga y error
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
      {/* Barra de filtros y acciones */}
      <Box className="flex gap-4 items-center">
        <TextField
          label="Buscar tareas"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={_handleSearchChange}
          onKeyPress={_handleKeyPress}
          placeholder="Buscar por título o descripción"
          className="flex-1"
          inputRef={inputRef}
          inputProps={{
            autoComplete: 'off'
          }}
        />

        <FormControl size="small" className="min-w-[150px]">
          <InputLabel>Estado</InputLabel>
          <Select
            value={status}
            label="Estado"
            onChange={_handleStatusChange}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {Object.values(TaskStatus).map((statusOption) => (
              <MenuItem key={statusOption} value={statusOption}>
                {statusOption === TaskStatus.InProgress ? 'En Progreso' :
                 statusOption === TaskStatus.Completed ? 'Completado' :
                 statusOption === TaskStatus.Pending ? 'Pendiente' :
                 'Cancelado'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" className="min-w-[150px]">
          <InputLabel>Prioridad</InputLabel>
          <Select
            value={priority}
            label="Prioridad"
            onChange={_handlePriorityChange}
          >
            <MenuItem value="">
              <em>Todas</em>
            </MenuItem>
            {Object.values(Priority).map((priorityOption) => (
              <MenuItem key={priorityOption} value={priorityOption}>
                {priorityOption === Priority.High ? 'Alta' :
                 priorityOption === Priority.Medium ? 'Media' :
                 'Baja'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateDialogOpen(true)}
          startIcon={<Add />}
          className="whitespace-nowrap"
        >
          Crear Tarea
        </Button>
      </Box>

      {/* Tabla de tareas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task: Task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description || '-'}</TableCell>
                <TableCell>
                  {task.status === TaskStatus.InProgress ? 'En Progreso' :
                   task.status === TaskStatus.Completed ? 'Completado' :
                   task.status === TaskStatus.Pending ? 'Pendiente' :
                   'Cancelado'}
                </TableCell>
                <TableCell>
                  {task.priority === Priority.High ? 'Alta' :
                   task.priority === Priority.Medium ? 'Media' :
                   task.priority === Priority.Low ? 'Baja' : '-'}
                </TableCell>
                <TableCell align="right">
                  <Box className="space-x-1">
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsViewDialogOpen(true);
                        }}
                        color="primary"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar tarea">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsEditDialogOpen(true);
                        }}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar tarea">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedTask(task);
                          setIsDeleteDialogOpen(true);
                        }}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogos */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      <ViewTaskDialog
        open={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <EditTaskDialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <DeleteTaskDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTask(null);
        }}
        taskId={selectedTask?.id || null}
        taskTitle={selectedTask?.title || ''}
      />
    </div>
  );
};

export default TaskList;