const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decodedToken) => {

    if (err) return res.sendStatus(403);

    req.user = decodedToken.userInfo.email;
    req.roles = decodedToken.userInfo.roles;
    
    next();
  });
};

module.exports = verifyJWT;