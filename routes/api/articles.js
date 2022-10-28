const { Router } = require("express");
const router = Router();
const verifyJWT = require("../../middleware/verifyJWT");
const rolesList = require("../../config/user_roles");
const verifyRoles = require("../../middleware/verifyRoles");
const {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticle,
} = require("../../controllers/articles");

router
  .route("/")
  .get(getArticles)
  .post(
    verifyJWT,
    verifyRoles(rolesList.USER_ROLES.Admin, rolesList.USER_ROLES.Editor),
    addArticle
  )
  .put(
    verifyJWT,
    verifyRoles(rolesList.USER_ROLES.Admin, rolesList.USER_ROLES.Editor),
    updateArticle
  )
  .delete(
    verifyJWT,
    verifyRoles(rolesList.USER_ROLES.Admin),
    deleteArticle
  );

router.route("/:id").get(getArticle);

module.exports = router;
