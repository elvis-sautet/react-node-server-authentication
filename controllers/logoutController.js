const cookie = require("cookie");
const User = require("../models/User");

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  //on client side, we will delete the access token
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //no content
  }

  const refreshedToken = cookies?.jwt;

  //is the refresh token in the db?
  const foundUser = await User.findOne({ refreshToken: refreshedToken }).exec();

  if (!foundUser) {
    //clear the cookie using httpOnly spec
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      })
    );
    return res.sendStatus(204); //no content
  }

  //delete the refresh token
  foundUser.refreshToken = "";
  const result = await foundUser.save();

  console.log(result);

  //clear the all the association cookies
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    })
  );

  //sendStatus the 204
  res.sendStatus(204);
};

module.exports = { handleLogout };
