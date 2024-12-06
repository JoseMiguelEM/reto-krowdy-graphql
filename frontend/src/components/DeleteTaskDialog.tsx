import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { 
  Mutation,
  MutationDeleteTaskArgs 
} from '@/gql/types';
import { DELETE_TASK_MUTATION, TASKS_QUERY } from '@/graphql/queries';

interface DeleteTaskDialogProps {
  open: boolean;
  onClose: () => void;
  taskId: string | null;
  taskTitle: string;
}

export const DeleteTaskDialog = ({ 
  open, 
  onClose, 
  taskId,
  taskTitle 
}: DeleteTaskDialogProps) => {
  const [deleteTask] = useMutation<Mutation, MutationDeleteTaskArgs>(
    DELETE_TASK_MUTATION,
    {
      refetchQueries: [TASKS_QUERY],
      onCompleted: () => {
        onClose();
      }
    }
  );

  const _handleDelete = async () => {
    if (!taskId) return;
    
    try {
      await deleteTask({
        variables: {
          id: taskId
        }
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Estás seguro de que deseas eliminar la tarea "{taskTitle}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={_handleDelete}
          variant="contained"
          color="error"
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};