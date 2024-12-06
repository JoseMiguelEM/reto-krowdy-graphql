// src/components/TaskList.tsx
'use client';

import { useState } from 'react';
import { gql,useQuery } from "@apollo/client";
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
} from "@mui/material";
const GET_TASKS = gql`
  query GetTasks($filters: TaskFilterInput) {
    tasks(filters: $filters) {
      id
      title
      description
      status
      priority
      active
      createdAt
      updatedAt
    }
  }
`;
export const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, loading, error } = useQuery(GET_TASKS, {
    variables: {
      filters: {
        searchTerm: searchTerm || undefined
      }
    }
  });

  const _handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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

  return (
    <div className="space-y-4">
      <TextField
        fullWidth
        label="Buscar tareas"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={_handleSearchChange}
        className="mb-4"
      />

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
            {data?.tasks.map((task:any) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell align="right">
                  {/* Aquí irán los botones de acciones */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TaskList;