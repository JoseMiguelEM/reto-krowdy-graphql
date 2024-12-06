'use client';

import { useState } from 'react';
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
  CreateTaskInput,
  Mutation,
  MutationCreateTaskArgs 
} from '@/gql/types';
import { CREATE_TASK_MUTATION, TASKS_QUERY } from '@/graphql/queries';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateTaskDialog = ({ open, onClose }: CreateTaskDialogProps) => {
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    priority: undefined,
    active: true
  });

  const [createTask] = useMutation<Mutation, MutationCreateTaskArgs>(
    CREATE_TASK_MUTATION,
    {
      refetchQueries: [TASKS_QUERY],
      onCompleted: () => {
        onClose();
        resetForm();
      }
    }
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: undefined,
      active: true
    });
  };

  const _handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const _handlePriorityChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      priority: e.target.value as Priority || undefined
    }));
  };

  const _handleSubmit = async () => {
    try {
      await createTask({
        variables: {
          input: formData
        }
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Nueva Tarea</DialogTitle>
      <DialogContent>
        <div className="space-y-4 mt-4">
          <TextField
            autoFocus
            name="title"
            label="Título"
            fullWidth
            required
            value={formData.title}
            onChange={_handleInputChange}
          />
          
          <TextField
            name="description"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={_handleInputChange}
          />
          
          <FormControl fullWidth>
            <InputLabel>Prioridad</InputLabel>
            <Select
              value={formData.priority || ''}
              label="Prioridad"
              onChange={_handlePriorityChange}
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
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};