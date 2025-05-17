// backend/src/models/comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workflowId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'workflow_id',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  }, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Comment.associate = models => {
    Comment.belongsTo(models.Workflow, {
      foreignKey: 'workflowId',
      as: 'workflow'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Comment;
};
