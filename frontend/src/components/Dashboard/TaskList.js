import React from 'react';
import TaskItem from '../Tasks/TaskItem';    // Tasks folder, not same dir

export default function TaskList({ tasks, onEdit, onDeleted }) {
  if (tasks.length === 0) return <p>No tasks yet.</p>;
  return (
    <div>
      {tasks.map(t => (
        <TaskItem
          key={t.id}
          task={t}
          onEdit={() => onEdit(t)}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}
