const User = require("../models/User");
const jwt = require("jsonwebtoken"); 

const refreshJWT = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decodedToken) => {
    if (err || foundUser.email !== decodedToken.userInfo.email)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        userInfo: {
          email: decodedToken.userInfo.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "5m" }
    );
    return res.json({ accessToken });
  }
  
  );
};

module.exports = refreshJWT;
