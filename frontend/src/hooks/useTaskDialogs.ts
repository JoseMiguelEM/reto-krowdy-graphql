import { useState } from 'react';
import { Task } from '@/gql/types';

export const useTaskDialogs = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenCreate = () => setIsCreateDialogOpen(true);
  const handleCloseCreate = () => setIsCreateDialogOpen(false);

  const handleOpenView = (task: Task) => {
    setSelectedTask(task);
    setIsViewDialogOpen(true);
  };
  const handleCloseView = () => {
    setIsViewDialogOpen(false);
    setSelectedTask(null);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  };
  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleOpenDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };
  const handleCloseDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedTask(null);
  };

  return {
    selectedTask,
    isCreateDialogOpen,
    isViewDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleOpenCreate,
    handleOpenView,
    handleOpenEdit,
    handleOpenDelete,
    handleCloseCreate,
    handleCloseView,
    handleCloseEdit,
    handleCloseDelete
  };
};