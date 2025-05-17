const { User } = require('../models');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email'] });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: { code: 'ServerError', message: 'Could not retrieve profile' } });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(409).json({ error: { code: 'Conflict', message: 'Email already in use' } });
      }
    }
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    return res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: { code: 'ServerError', message: 'Could not update profile' } });
  }
};

module.exports = { getProfile, updateProfile };