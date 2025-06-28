// Replace this file with the routes of your API

const { Router } = require("express");
const authController = require("../controllers/authController");
const dogController = require("../controllers/dogController");
const adoptController = require("../controllers/adoptController");
const { requireAuth } = require("../middlewares/middleware");

const router = Router();

//routes from dogController
router.get("/", dogController.dogs_get);
router.get("/dogs/:id", dogController.dog_get);
router.post("/", dogController.dogs_post);
router.patch("/dogs/:id", dogController.dog_patch);
router.delete("/dogs/:id", dogController.dog_delete);

//routes from adopt controller
router.get("/adopt/:id", requireAuth, adoptController.adopt_get);
router.post("/adopt/:id", requireAuth, adoptController.adopt_post);
router.patch("/adopt/:id", requireAuth, adoptController.adopt_patch);

//auth controller routes
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

//routes for user specific pages
router.get("/register", requireAuth, (req, res) => {
  res.render("register");
});
router.get("/registered", requireAuth, dogController.registered_get);
router.get("/adopted", requireAuth, dogController.adopted_get);

//login and logout routes
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

module.exports = router;
