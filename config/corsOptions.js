const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: function (origin, callBack) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callBack(null, true);
    } else {
      callBack(new Error("Not Allowed by Cors"));
    }
  },
};

module.exports = corsOptions;
