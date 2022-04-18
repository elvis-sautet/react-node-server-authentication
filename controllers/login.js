const User = require("../models/User");
const { compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const cookie = require("cookie");

const usersDb = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  //check if we have the username and password
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Pasword are required" });
  }
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    return res.sendStatus(401);
  } //unAuthorized

  //evaluate password
  const match = await compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //create token
    const accessToken = sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        //expire in 30 minutes
        expiresIn: "30m",
      }
    );

    //create a refresh token which will be used to generate a new access token
    const refreshToken = sign({ username }, process.env.REFRESH_TOKEN, {
      expiresIn: "1d",
    });

    //save the refresh token in the db
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    console.log(result);
    //send a cookie jwt which will be jwt
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24, //24 hours or 1 day
        sameSite: "strict",
      })
    );

    res.status(200).json({
      accessToken,
      message: `Welcome ${username}`,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = handleLogin;
