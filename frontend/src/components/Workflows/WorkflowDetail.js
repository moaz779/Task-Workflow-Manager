import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentsSection from './CommentsSection';

export default function WorkflowDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [costInfo, setCostInfo] = useState(null);

  const fetchWorkflow = () => {
    api.get(`/workflows/${id}`)
       .then(res => setWorkflow(res.data))
       .catch(err => console.error('Get workflow error:', err));
  };
  const fetchTasks = () => {
    api.get('/tasks')
       .then(res => setAllTasks(res.data))
       .catch(err => console.error('List tasks error:', err));
  };
  const fetchCost = () => {
    api.get(`/workflows/${id}/calc`)
       .then(res => setCostInfo(res.data))
       .catch(err => console.error('Calc error:', err));
  };

  useEffect(() => {
    fetchWorkflow();
    fetchTasks();
    fetchCost();
  }, [id]);

  if (!workflow) return <Typography>Loading…</Typography>;

  // only allow re–fetching when you own it
  const owned = workflow.isOwner;

  // tasks that aren’t yet in this workflow
  const availableTasks = allTasks.filter(t =>
    !workflow.tasks.some(wt => wt.id === t.id)
  );

  return (
    <Box sx={{ p: 2 }}>
      <Button onClick={() => nav(-1)} sx={{ mb: 2 }}>← Back</Button>
      <Typography variant="h4">{workflow.name}</Typography>
      <Typography sx={{ mb: 2 }}>{workflow.description}</Typography>

      {owned && costInfo && (
        <Box sx={{ mb: 3, p:2, border: '1px solid #ccc', borderRadius:1 }}>
          <Typography variant="h6">Cost Summary</Typography>
          <Typography>Subtotal: ${costInfo.subtotal.toFixed(2)}</Typography>
          <Typography>Tax Rate: {(costInfo.taxRate * 100).toFixed(2)}%</Typography>
          <Typography>Tax Amount: ${costInfo.taxAmount.toFixed(2)}</Typography>
          <Typography>Total: ${costInfo.total.toFixed(2)}</Typography>
        </Box>
      )}

      <Typography variant="h6">Tasks in Workflow</Typography>
      <List>
        {workflow.tasks.map(task => (
          <ListItem
            key={task.id}
            secondaryAction={
              owned && (
                <IconButton edge="end" onClick={async () => {
                  await api.delete(`/workflows/${id}/tasks/${task.id}`);
                  fetchWorkflow();
                  if (owned) fetchCost();
                }}>
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemText primary={task.title} />
          </ListItem>
        ))}
      </List>

      {owned && (
        <>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="task-select-label">Add Task</InputLabel>
            <Select
              labelId="task-select-label"
              value={selectedTask}
              label="Add Task"
              onChange={e => setSelectedTask(e.target.value)}
            >
              {availableTasks.map(t => (
                <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={async () => {
              await api.post(`/workflows/${id}/tasks`, { taskId: selectedTask });
              setSelectedTask('');
              fetchWorkflow();
              fetchCost();
            }}
            sx={{ mt: 1 }}
            disabled={!selectedTask}
          >
            Add to Workflow
          </Button>
        </>
      )}

      {/* Always let people comment on public workflows */}
      {workflow.isPublic && <CommentsSection workflowId={id} />}
    </Box>
  );
}
