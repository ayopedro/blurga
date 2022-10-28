const { Router } = require("express");
const router = Router();
const rolesList = require("../../config/user_roles");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/")

module.exports = router;