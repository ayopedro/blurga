const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and Password are required" });

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = foundUser.roles;

    const accessToken = jwt.sign(
      {
        userInfo: {
          email: foundUser.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      {
        userInfo: {
          email: foundUser.email,
          roles,
        },
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1h" }
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
   

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ accessToken });
  }
};

module.exports = { loginUser };
