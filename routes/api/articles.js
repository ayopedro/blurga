const { Router } = require("express");
const router = Router();
const Article = require("../../models/Article");
const verifyJWT = require("../../middleware/verifyJWT");
const rolesList = require("../../config/user_roles");
const verifyRoles = require("../../middleware/verifyRoles");
const {
  getArticles,
  getAdminArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getArticle,
} = require("../../controllers/articles");
const checkAuth = require("../../middleware/checkAuth");
const paginatedResult = require("../../middleware/paginatedResult")

router
  .route("/")
  .get(paginatedResult(Article), getArticles)
  .post(
    verifyJWT,
    verifyRoles(rolesList.USER_ROLES.Admin, rolesList.USER_ROLES.Editor),
    addArticle
  )
  .put(
    verifyJWT,
    verifyRoles(rolesList.USER_ROLES.Admin, rolesList.USER_ROLES.Editor),
    checkAuth,
    updateArticle
  )
  .delete(verifyJWT, verifyRoles(rolesList.USER_ROLES.Admin), deleteArticle);

router.get(
  "/admin",
  verifyJWT,
  verifyRoles(rolesList.USER_ROLES.Admin),
  paginatedResult(Article),
  getAdminArticles
);

router.route("/:id").get(getArticle);

module.exports = router;
