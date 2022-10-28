const { Router } = require("express");
const { loginUser } = require("../../controllers/login");
const { logout } = require("../../controllers/logout");
const refreshJWT = require("../../controllers/refreshJWT");
const { createUser } = require("../../controllers/register");
const router = Router();

router.get("/", (req, res) => {
  const usernames = users.map((user) => user.username);
  res.json(usernames);
});

router.get("/refresh", refreshJWT)

router.post("/login", loginUser);

router.post("/register", createUser);

router.get("/logout", logout)

module.exports = router;
