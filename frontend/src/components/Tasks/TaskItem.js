import React from 'react';
import api from '../../services/api';

export default function TaskItem({ task, onEdit, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    await onDeleted(task.id);  // pass the ID along
  };

  return (
    <div className="task-item">
      <div>
        <h3>{task.title}</h3>
        <p>Status: {task.status} | Priority: {task.priority}</p>
      </div>
      <div>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}
