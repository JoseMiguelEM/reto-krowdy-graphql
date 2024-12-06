import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { TaskStatus, Priority } from '@/gql/types';

interface TaskFiltersProps {
  searchTerm: string;
  status: TaskStatus | '';
  priority: Priority | '';
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (event: any) => void;
  onPriorityChange: (event: any) => void;
  onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onCreateClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TaskFilters = ({
  searchTerm,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onKeyPress,
  onCreateClick,
  inputRef
}: TaskFiltersProps) => {
  return (
    <Box className="flex gap-4 items-center">
      <TextField
        label="Buscar tareas"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={onSearchChange}
        onKeyPress={onKeyPress}
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
          onChange={onStatusChange}
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
          onChange={onPriorityChange}
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
        onClick={onCreateClick}
        startIcon={<Add />}
        className="whitespace-nowrap"
      >
        Crear Tarea
      </Button>
    </Box>
  );
};