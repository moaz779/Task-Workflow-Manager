// frontend/src/components/Auth/Login.js
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const LoginSchema = Yup.object().shape({
  email:    Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

export default function Login() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          try {
            const res = await api.post('/auth/login', values);
            // Save token + expiry to localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('expiresAt', (Date.now() + res.data.expiresIn * 1000).toString());
            navigate('/'); // go to dashboard
          } catch (err) {
            console.error('Login error:', err);
            setStatus(err.response?.data?.error?.message || 'Login failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, touched, errors, isSubmitting, status }) => (
          <Form>
            {status && <Alert severity="error" sx={{ mb: 2 }}>{status}</Alert>}

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in…' : 'Login'}
            </Button>

            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Don’t have an account? <Link to="/register">Register</Link>
            </Typography>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
