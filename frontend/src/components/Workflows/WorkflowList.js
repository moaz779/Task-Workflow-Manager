import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/workflows')
      .then(res => setWorkflows(res.data))
      .catch(err => console.error('Fetch workflows error:', err));
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Workflows
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/workflows/new')}
        sx={{ mb: 2 }}
      >
        Create Workflow
      </Button>

      <List>
        {workflows.map(wf => (
          <ListItem
            key={wf.id}
            button
            component={Link}
            to={`/workflows/${wf.id}`}
          >
            <ListItemText
              primary={wf.name}
              secondary={`Tasks: ${wf.tasks.length} | ${
                wf.isPublic ? 'Public' : 'Private'
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
