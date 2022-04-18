const allowedOrigins = require("../config/allowedOrigins");

/**
 * If the origin of the request is in the allowedOrigins array, then set the
 * Access-Control-Allow-Credentials header to true
 * @param req - The request object.
 * @param res - The response object
 * @param next - This is a function that you call when you're done with your middleware.
 */
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
