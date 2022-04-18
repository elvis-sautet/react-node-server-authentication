//verify jwt token
const { verify } = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  //verify jwt token
  try {
    const decoded = verify(token, process.env.ACCESS_TOKEN);
    //set the user name to the request object
    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;
    next();
  } catch (err) {
    //forbidden
    return res.status(403).json({ message: "Token is not valid" });
  }
};

module.exports = verifyJwt;
