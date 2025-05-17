import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const TaskSchema = Yup.object().shape({
  title:    Yup.string().required('Required'),
  status:   Yup.string().oneOf(['todo','in-progress','done']).required(),
  priority: Yup.string().oneOf(['low','medium','high']).required(),
  dueDate:  Yup.date().required('Required'),
});

export default function TaskForm({ task, onSaved, onCancel }) {
  const [serverError, setServerError] = useState(null);

  return (
    <div className="container" style={{ margin: '1rem 0' }}>
      <h2>{task ? 'Edit Task' : 'New Task'}</h2>
      {serverError && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {serverError}
        </div>
      )}
      <Formik
        initialValues={{
          title:       task?.title       || '',
          description: task?.description || '',
          status:      task?.status      || 'todo',
          priority:    task?.priority    || 'medium',
          dueDate:     task?.dueDate ? task.dueDate.slice(0,10) : '',
        }}
        validationSchema={TaskSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError(null);
          try {
            if (task) {
              await api.put(`/tasks/${task.id}`, values);
            } else {
              await api.post('/tasks', values);
            }
            onSaved();
          } catch (err) {
            console.error('📌 TaskForm save error:', err.response || err);
            const msg = err.response?.data?.message || err.message || 'Save failed';
            setServerError(msg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {['title','status','priority','dueDate'].map(field => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field === 'status' ? (
                  <Field as="select" name="status">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </Field>
                ) : field === 'priority' ? (
                  <Field as="select" name="priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Field>
                ) : (
                  <Field
                    name={field}
                    type={field === 'dueDate' ? 'date' : 'text'}
                  />
                )}
                <ErrorMessage name={field} component="div" className="error" />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={onCancel}>Cancel</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
);
}
