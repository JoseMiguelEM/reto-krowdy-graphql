import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { 
  Priority, 
  TaskStatus,
  Task,
  UpdateTaskInput,
  Mutation,
  MutationUpdateTaskArgs 
} from '@/gql/types';
import { UPDATE_TASK_MUTATION, TASKS_QUERY } from '@/graphql/queries';

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

export const EditTaskDialog = ({ open, onClose, task }: EditTaskDialogProps) => {
  const [formData, setFormData] = useState<UpdateTaskInput>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || undefined,
        status: task.status,
        priority: task.priority || undefined,
      });
    }
  }, [task]);

  const [updateTask] = useMutation<Mutation, MutationUpdateTaskArgs>(
    UPDATE_TASK_MUTATION,
    {
      refetchQueries: [TASKS_QUERY],
      onCompleted: () => {
        onClose();
      }
    }
  );

  const _handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const _handleSelectChange = (e: SelectChangeEvent, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const _handleSubmit = async () => {
    if (!task?.id) return;
    
    try {
      await updateTask({
        variables: {
          id: task.id,
          input: formData
        }
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Tarea</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            autoFocus
            name="title"
            label="Título"
            fullWidth
            required
            value={formData.title || ''}
            onChange={_handleInputChange}
          />
          
          <TextField
            name="description"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={formData.description || ''}
            onChange={_handleInputChange}
          />
          
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.status || ''}
              label="Estado"
              onChange={(e) => _handleSelectChange(e, 'status')}
            >
              {Object.values(TaskStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status === TaskStatus.InProgress ? 'En Progreso' :
                   status === TaskStatus.Completed ? 'Completado' :
                   status === TaskStatus.Pending ? 'Pendiente' :
                   'Cancelado'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={formData.priority || ''}
              label="Prioridad"
              onChange={(e) => _handleSelectChange(e, 'priority')}
            >
              <MenuItem value="">
                <em>Sin prioridad</em>
              </MenuItem>
              {Object.values(Priority).map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority === Priority.High ? 'Alta' :
                   priority === Priority.Medium ? 'Media' :
                   'Baja'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={_handleSubmit}
          variant="contained"
          disabled={!formData.title}
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};