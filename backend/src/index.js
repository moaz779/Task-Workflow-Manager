require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const workflowRoutes = require('./routes/workflows');
const authMiddleware = require('./middleware/auth');
const userRoutes = require('./routes/users');
console.log('authRoutes:',    !!authRoutes);
console.log('taskRoutes:',    !!taskRoutes);
console.log('workflowRoutes:', !!workflowRoutes);
console.log('userRoutes:',    !!userRoutes);

const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors({
  origin: 'http://localhost:3000',    // allow your React dev server
  credentials: true                   // if you later use cookies/auth headers
}));
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/workflows', authMiddleware, workflowRoutes);
app.use('/api/users', authMiddleware, userRoutes);
// Health check
app.get('/', (req, res) => res.status(200).json({ message: 'API is running' }));

// Export app for testing
module.exports = app;

// Only start server if file is run directly
if (require.main === module) {
      sequelize.sync({ alter: true })
    .then(() => {
      console.log('Database synced');
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch(err => console.error('Error syncing database:', err));
}
