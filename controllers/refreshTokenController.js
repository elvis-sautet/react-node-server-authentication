const User = require("../models/User");
const { verify } = require("jsonwebtoken");
const cookie = require("cookie");
const { sign } = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  //handle creating a new access token
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401); //unAuthorized
  }

  const refreshedToken = cookies?.jwt;

  //is the refresh token in the db?
  const foundUser = await User.findOne({ refreshToken: refreshedToken }).exec();

  if (!foundUser) {
    //send a forbidden status
    return res.sendStatus(403);
  }
  verify(refreshedToken, process.env.REFRESH_TOKEN, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); //forbidden
    }
    const roles = Object.values(foundUser.roles);

    //create a new access token
    const accessToken = sign(
      {
        userInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        //expire in 30 minutes
        expiresIn: "30m",
      }
    );

    //send a response
    res.status(200).json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
