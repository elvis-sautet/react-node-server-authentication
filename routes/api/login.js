const handleLogin = require("../../controllers/login");

const router = require("express").Router();

router.route("/").post(handleLogin);

module.exports = router;
