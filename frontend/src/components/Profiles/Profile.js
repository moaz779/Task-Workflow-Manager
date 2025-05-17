import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';       // go up two levels

const ProfileSchema = Yup.object().shape({
  name:  Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function Profile() {
  const [initialValues, setInitial] = useState({ name: '', email: '' });

  useEffect(() => {
    api.get('/users/me').then(res => setInitial(res.data));
  }, []);

  return (
    <div className="container">
      <h1>My Profile</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await api.put('/users/me', values);
            alert('Profile updated');
          } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
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
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
