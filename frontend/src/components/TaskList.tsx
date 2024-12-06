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
} from "@mui/material";

const DEBOUNCE_DELAY = 2000;

export const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data, loading, error } = useQuery<Query, QueryTasksArgs>(TASKS_QUERY, {
    variables: {
      filters: {
        searchTerm: debouncedSearchTerm || undefined,
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
      <TextField
        fullWidth
        label="Buscar tareas"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={_handleSearchChange}
        onKeyPress={_handleKeyPress}
        placeholder="Buscar por título o descripción"
        className="mb-4"
        inputRef={inputRef}
        inputProps={{
          autoComplete: 'off'
        }}
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
            {tasks.map((task: Task) => (
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