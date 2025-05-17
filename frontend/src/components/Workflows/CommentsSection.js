// frontend/src/components/Workflows/CommentsSection.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Alert,
  Rating
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// fix import path to your Axios instance
import api from '../../services/api';

const CommentSchema = Yup.object({
  text:   Yup.string().required('Comment is required'),
  rating: Yup.number().min(1).max(5).required('Rating is required'),
});

export default function CommentsSection({ workflowId }) {
  const [comments, setComments]     = useState([]);
  const [submitError, setSubmitError] = useState('');

  // load existing comments on mount
  const fetchComments = async () => {
    try {
      const res = await api.get(`/workflows/${workflowId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Fetch comments error:', err);
      // do not setSubmitError here, so it doesn't show on initial load
    }
  };

  useEffect(() => {
    fetchComments();
  }, [workflowId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments & Ratings
      </Typography>

      <List>
        {comments.map(c => (
          <ListItem key={c.id} alignItems="flex-start">
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <strong>{c.user?.name || 'Anonymous'}</strong>
                  <Rating value={c.rating} readOnly size="small" />
                </Box>
              }
              secondary={c.text}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1" sx={{ mt: 3 }}>
        Add a Comment
      </Typography>
      {submitError && <Alert severity="error">{submitError}</Alert>}

      <Formik
        initialValues={{ text: '', rating: 0 }}
        validationSchema={CommentSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitError('');
          try {
            // post and get the created comment back
            const res = await api.post(
              `/workflows/${workflowId}/comments`,
              values
            );
            // clear the form
            resetForm();
            // optimistically prepend the new comment
            setComments(prev => [res.data, ...prev]);
          } catch (err) {
            console.error('Create comment error:', err);
            setSubmitError(
              err.response?.data?.error?.message ||
              err.response?.data?.message ||
              'Could not post comment'
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          handleChange,
          setFieldValue,
          touched,
          errors,
          isSubmitting
        }) => (
          <Form>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Comment"
              name="text"
              value={values.text}
              onChange={handleChange}
              error={touched.text && Boolean(errors.text)}
              helperText={touched.text && errors.text}
              sx={{ mb: 2 }}
            />
            <Rating
              name="rating"
              value={values.rating}
              onChange={(_, v) => setFieldValue('rating', v)}
            />
            {touched.rating && errors.rating && (
              <Typography variant="caption" color="error">
                {errors.rating}
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || values.rating === 0}
              >
                {isSubmitting ? 'Posting…' : 'Post Comment'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
