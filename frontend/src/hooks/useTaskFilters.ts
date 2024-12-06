import { useState, useEffect } from 'react';
import { TaskStatus, Priority, TaskFilterInput } from '@/gql/types';

const DEBOUNCE_DELAY = 2000;

export const useTaskFilters = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filters: TaskFilterInput = {
    searchTerm: debouncedSearchTerm || undefined,
    status: status || undefined,
    priority: priority || undefined
  };

  return {
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
    priority,
    setPriority,
    filters
  };
};