const User = require("../models/User");

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }

foundUser.refreshToken = "";
const result = await foundUser.save();
console.log(result);

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
  });
  res.send("successfully logged out");
  return res.sendStatus(204);
};

module.exports = { logout };
