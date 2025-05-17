import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const WorkflowSchema = Yup.object().shape({
  name:        Yup.string().required('Name is required'),
  description: Yup.string(),
  cost:        Yup.number().min(0, 'Must be ≥ 0').required('Cost is required'),
  taxRate:     Yup.number().min(0).max(1,'Must be ≤ 1').required('Tax rate is required'),
  isPublic:    Yup.boolean()
});

export default function WorkflowForm() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        name:        '',
        description: '',
        cost:        0.0,
        taxRate:     0.0,
        isPublic:    true
      }}
      validationSchema={WorkflowSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        setStatus(null);
        try {
          await api.post('/workflows', values);
          navigate('/workflows');
        } catch (err) {
          setStatus(err.response?.data?.message || 'Could not create workflow');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, touched, errors, isSubmitting, status }) => (
        <Form>
          <Box sx={{ maxWidth: 500, mx: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {status && <Alert severity="error">{status}</Alert>}

            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Cost"
              name="cost"
              type="number"
              value={values.cost}
              onChange={handleChange}
              error={touched.cost && Boolean(errors.cost)}
              helperText={touched.cost && errors.cost}
              fullWidth
            />

            <TextField
              label="Tax Rate (e.g. 0.15)"
              name="taxRate"
              type="number"
              value={values.taxRate}
              onChange={handleChange}
              error={touched.taxRate && Boolean(errors.taxRate)}
              helperText={touched.taxRate && errors.taxRate}
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="isPublic"
                  checked={values.isPublic}
                  onChange={handleChange}
                />
              }
              label="Public (visible to all users)"
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? 'Creating…' : 'Create Workflow'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
