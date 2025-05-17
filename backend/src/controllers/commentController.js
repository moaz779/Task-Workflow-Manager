// backend/src/controllers/commentController.js
const { Comment, User } = require('../models');

const listComments = async (req, res) => {
  console.log('📝  listComments called for workflow id=', req.params.id);
  try {
    const comments = await Comment.findAll({
      where: { workflowId: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    return res.json(comments);
  } catch (err) {
    console.error('List comments error:', err);
    // Temporarily return the actual error for debugging:
    return res
      .status(500)
      .json({ message: 'Could not list comments', error: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    console.log('📝  createComment body=', req.body, ' workflowId=', req.params.id);
    const { text, rating } = req.body;

    const comment = await Comment.create({
      workflowId: req.params.id,
      userId:     req.user.id,
      text,
      rating
    });

    // Fetch it back including the user association
    const result = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error('Create comment error:', err);
    return res.status(500).json({ message: 'Could not create comment', error: err.message });
  }
};

module.exports = {
  listComments,
  createComment
};
