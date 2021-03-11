const {
  Types: { ObjectId },
} = require('mongoose');

async function logoutUser(req, res) {
  const { _id } = req.user;
  const userById = await User.findByIdAndUpdate(_id, { token: null });

  if (!userById) {
    return res.status(401).send('Not authorized');
  }

  return res.status(204);
}

module.exports = {
  logoutUser,
};
