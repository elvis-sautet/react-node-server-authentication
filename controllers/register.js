const User = require("../models/User");
const { compare, hash } = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  //check if we have user or password
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Paswword are required" });
  }

  //check duplicate usernames in the db
  const duplicateUsername = await User.findOne({ username }).exec();

  if (duplicateUsername) {
    res.status(409).json({ message: "Duplicate username" });
  }

  try {
    //encrypt the password
    const hashedPassword = await hash(password, 10);
    //store the new user
    const newUser = {
      username,
      password: hashedPassword,
    };
    const user = await User.create(newUser);

    res.status(201).json({
      success: `New user ${user.username} has been created successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
