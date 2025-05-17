// frontend/src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header" style={{ padding: '1rem', background: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Task & Workflow Manager
        </Link>
      </h2>
      <nav>
        {token ? (
          <>
            <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Tasks</Link>
            <Link to="/workflows" style={{ color: 'white', marginRight: '1rem' }}>Workflows</Link>
            <Link to="/profile" style={{ color: 'white', marginRight: '1rem' }}>Profile</Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
