const User = require("../models/User");

const checkAuth = async (req, res, next) => {
  const authUser = req.user;
  const foundUser = await User.findOne({ authUser }).exec();

  if ( authUser !== foundUser.email) return res.sendStatus(401);

  next();
};

module.exports = checkAuth;
