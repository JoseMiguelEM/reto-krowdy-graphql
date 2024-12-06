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
import { TASKS_QUERY } from   '@/graphql/queries';
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
 Button
} from "@mui/material";
import { CreateTaskDialog } from './CreateTaskDialog';

const DEBOUNCE_DELAY = 2000;

export const TaskList = () => {
 const [searchTerm, setSearchTerm] = useState<string>('');
 const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
 const [status, setStatus] = useState<TaskStatus | ''>('');
 const [priority, setPriority] = useState<Priority | ''>('');
 const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);
 
 const { data, loading, error } = useQuery<Query, QueryTasksArgs>(TASKS_QUERY, {
   variables: {
     filters: {
       searchTerm: debouncedSearchTerm || undefined,
       status: status || undefined,
       priority: priority || undefined
     } as TaskFilterInput
   }
 });

 useEffect(() => {
   const timeoutId = setTimeout(() => {
     setDebouncedSearchTerm(searchTerm);
   }, DEBOUNCE_DELAY);

   return () => clearTimeout(timeoutId);
 }, [searchTerm]);

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
         className="whitespace-nowrap"
       >
         + Crear Tarea
       </Button>
     </Box>

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
               <TableCell>{task.description}</TableCell>
               <TableCell>
                 {task.status === TaskStatus.InProgress ? 'En Progreso' :
                  task.status === TaskStatus.Completed ? 'Completado' :
                  task.status === TaskStatus.Pending ? 'Pendiente' :
                  'Cancelado'}
               </TableCell>
               <TableCell>
                 {task.priority === Priority.High ? 'Alta' :
                  task.priority === Priority.Medium ? 'Media' :
                  task.priority === Priority.Low ? 'Baja' : ''}
               </TableCell>
               <TableCell align="right">
                 {/* Aquí irán los botones de acciones */}
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>

     <CreateTaskDialog
       open={isCreateDialogOpen}
       onClose={() => setIsCreateDialogOpen(false)}
     />
   </div>
 );
};

export default TaskList;