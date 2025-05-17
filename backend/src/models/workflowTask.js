// workflowTask.js - project skeleton file
module.exports = (sequelize, DataTypes) => {
  const WorkflowTask = sequelize.define('WorkflowTask', {
    workflowId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'workflow_id',
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'task_id',
      primaryKey: true,
    },
    position: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'workflow_tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return WorkflowTask;
};