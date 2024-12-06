import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Box
  } from '@mui/material';
  import { Visibility, Edit, Delete } from '@mui/icons-material';
  import { Task, TaskStatus, Priority } from '@/gql/types';
  
  interface TaskTableProps {
    tasks: Task[];
    onView: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
  }
  
  export const TaskTable = ({
    tasks,
    onView,
    onEdit,
    onDelete
  }: TaskTableProps) => {
    return (
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
                        onClick={() => onView(task)}
                        color="primary"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
  
                    <Tooltip title="Editar tarea">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(task)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
  
                    <Tooltip title="Eliminar tarea">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(task)}
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
    );
  };