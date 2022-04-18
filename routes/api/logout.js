const { handleLogout } = require("../../controllers/logoutController");

const router = require("express").Router();

router.route("/").get(handleLogout);

module.exports = router;
