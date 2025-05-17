// frontend/src/components/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Snackbar, Alert, Typography,
  FormControl, InputLabel, Select, MenuItem, TextField
} from '@mui/material';
import api from '../../services/api';
import TaskList from '../Dashboard/TaskList';
import TaskForm from '../Tasks/TaskForm';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueBefore: ''
  });

  // Fetch tasks with filters
  const fetchTasks = async () => {
    try {
      const params = {};
      if (filters.status)    params.status    = filters.status;
      if (filters.priority)  params.priority  = filters.priority;
      if (filters.dueBefore) params.dueBefore = filters.dueBefore;
      const res = await api.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch tasks error:', err);
    }
  };

  // Initial & filter-triggered load
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleEdit = (task) => {
    setEditing(task);
    setShowForm(true);
  };

  const handleSaved = (created = true) => {
    fetchTasks();
    setShowForm(false);
    setToast({
      open: true,
      message: created ? 'Task created successfully' : 'Task updated successfully',
      severity: 'success',
    });
  };

  const handleDeleted = async (taskId) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);
      fetchTasks();
      setToast({ open: true, message: res.data.message, severity: 'success' });
    } catch (err) {
      setToast({ open: true, message: err.response?.data?.message || 'Delete failed', severity: 'error' });
    }
  };

  // Filter handlers
  const handleFilterChange = (field) => (e) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({ status: '', priority: '', dueBefore: '' });
  };

  return (
    <Box className="container" sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Tasks
      </Typography>

      {/* + New Task button */}
      <Button
        variant="contained"
        onClick={() => { setEditing(null); setShowForm(true); }}
        sx={{ mb: 2 }}
      >
        + New Task
      </Button>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={handleFilterChange('status')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            label="Priority"
            value={filters.priority}
            onChange={handleFilterChange('priority')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Due Before"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.dueBefore}
          onChange={handleFilterChange('dueBefore')}
        />

        <Button variant="outlined" onClick={resetFilters}>
          Reset
        </Button>
      </Box>

      {/* Task form (create/edit) */}
      {showForm && (
        <TaskForm
          task={editing}
          onSaved={() => handleSaved(!editing)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Task list */}
      <TaskList tasks={tasks} onEdit={handleEdit} onDeleted={handleDeleted} />

      {/* Snackbar toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
