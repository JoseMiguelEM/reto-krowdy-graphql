import { useState } from "react";
import { mockTasks, Task, TaskStatus, Priority } from "@/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: Priority.MEDIUM,
    status: TaskStatus.PENDING,
  });

  const _handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.active &&
      (task.title.toLowerCase().includes(searchTerm) ||
        task.description?.toLowerCase().includes(searchTerm))
  );

  const _handleOpenDialog = (task?: Task) => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description || "",
        priority: task.priority || Priority.MEDIUM,
        status: task.status,
      });
      setEditMode(true);
    } else {
      setFormData({
        title: "",
        description: "",
        priority: Priority.MEDIUM,
        status: TaskStatus.PENDING,
      });
      setEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const _handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditMode(false);
  };

  const _handleInputChange = (name: keyof TaskFormData, value: string | Priority | TaskStatus) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const _handleSubmit = () => {
    if (editMode && formData.id) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === formData.id
            ? { ...task, ...formData, updatedAt: new Date() }
            : task
        )
      );
    } else {
      const newTask: Task = {
        ...formData,
        id: Date.now().toString(),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks((prev) => [...prev, newTask]);
    }
    _handleCloseDialog();
  };

  const _handleDelete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, active: false } : task
      )
    );
  };

  const _getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return "#4caf50";  // Green
      case TaskStatus.IN_PROGRESS:
        return "#2196f3";  // Blue
      case TaskStatus.CANCELLED:
        return "#f44336";  // Red
      default:
        return "#757575";  // Grey
    }
  };

  const _getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "#f44336";  // Red
      case Priority.MEDIUM:
        return "#ff9800";  // Orange
      case Priority.LOW:
        return "#4caf50";  // Green
      default:
        return "#757575";  // Grey
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          label="Search tasks"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={_handleSearchChange}
          style={{ width: '300px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => _handleOpenDialog()}
        >
          Add Task
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell style={{ color: _getStatusColor(task.status) }}>
                  {task.status}
                </TableCell>
                <TableCell style={{ color: _getPriorityColor(task.priority || Priority.MEDIUM) }}>
                  {task.priority}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => _handleOpenDialog(task)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => _handleDelete(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={isDialogOpen} 
        onClose={_handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Task" : "Create New Task"}
        </DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '20px' }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => _handleInputChange("title", e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => _handleInputChange("description", e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => _handleInputChange("priority", e.target.value as Priority)}
              >
                {Object.values(Priority).map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {editMode && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => _handleInputChange("status", e.target.value as TaskStatus)}
                >
                  {Object.values(TaskStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={_handleCloseDialog}>Cancel</Button>
          <Button onClick={_handleSubmit} variant="contained" color="primary">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}