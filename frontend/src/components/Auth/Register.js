import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../../services/api';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'At least 6 chars').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Register</h1>
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setFieldError, setSubmitting }) => {
          try {
            await api.post('/auth/register', {
              name: values.name,
              email: values.email,
              password: values.password,
            });
            navigate('/login');
          } catch (err) {
            setFieldError('email', err.response?.data?.message || 'Registration failed');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <Field name="name" />
              <ErrorMessage name="name" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field name="confirmPassword" type="password" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering…' : 'Register'}
            </button>
            <p style={{ marginTop: '1rem' }}>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
}
