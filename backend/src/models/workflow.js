// backend/src/models/workflow.js
module.exports = (sequelize, DataTypes) => {
  const Workflow = sequelize.define('Workflow', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    taxRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    isPublic: {                        // ← new privacy flag
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_public',
    },
  }, {
    tableName: 'workflows',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Workflow.associate = models => {
    Workflow.belongsTo(models.User,    { foreignKey: 'userId' });
    Workflow.belongsToMany(models.Task, {
      through:    models.WorkflowTask,
      foreignKey: 'workflowId',
      otherKey:   'taskId',
      as:         'tasks'
    });
    Workflow.hasMany(models.Comment,   { foreignKey: 'workflowId', as: 'comments' });
  };

  return Workflow;
};
