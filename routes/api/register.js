const { handleNewUser } = require("../../controllers/register");

const router = require("express").Router();

router.route("/").post(handleNewUser);

module.exports = router;
