import { 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
  } from '@mui/material';
  import { Task, TaskStatus, Priority } from '@/gql/types';
  interface ViewTaskDialogProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
  }
  
  const ViewTaskDialog = ({ open, onClose, task }: ViewTaskDialogProps) => {
    if (!task) return null;
  
    const formatDate = (date: any) => {
      return new Date(date).toLocaleString();
    };
  
    const getStatusText = (status: TaskStatus) => {
      return status === TaskStatus.InProgress ? 'En Progreso' :
             status === TaskStatus.Completed ? 'Completado' :
             status === TaskStatus.Pending ? 'Pendiente' :
             'Cancelado';
    };
  
    const getPriorityText = (priority?: Priority | null) => {
      return priority === Priority.High ? 'Alta' :
             priority === Priority.Medium ? 'Media' :
             priority === Priority.Low ? 'Baja' : 'No establecida';
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de la Tarea</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Título</Typography>
              <Typography>{task.title}</Typography>
            </Box>
  
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Descripción</Typography>
              <Typography>{task.description || 'Sin descripción'}</Typography>
            </Box>
  
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Estado</Typography>
              <Typography>{getStatusText(task.status)}</Typography>
            </Box>
  
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Prioridad</Typography>
              <Typography>{getPriorityText(task.priority)}</Typography>
            </Box>
  
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Fecha de Creación</Typography>
              <Typography>{formatDate(task.createdAt)}</Typography>
            </Box>
  
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Última Actualización</Typography>
              <Typography>{formatDate(task.updatedAt)}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ViewTaskDialog;