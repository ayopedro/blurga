const { Router } = require("express");
const { loginUser } = require("../../controllers/auth");
const { logout } = require("../../controllers/logout");
const { createUser } = require("../../controllers/register");
const router = Router();

const users = require("../../models/users.json");

router.get("/", (req, res) => {
  const usernames = users.map((user) => user.username);
  res.json(usernames);
});


router.post("/login", loginUser);

router.post("/register", createUser);

router.get("/logout", logout)

module.exports = router;
