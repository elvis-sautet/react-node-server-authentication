const {
  handleRefreshToken,
} = require("../../controllers/refreshTokenController");

const router = require("express").Router();

router.route("/").get(handleRefreshToken);

module.exports = router;
