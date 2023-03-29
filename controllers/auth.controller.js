const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user.model");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User or password are not corrects" });

    if (!user.status)
      return res.status(400).json({ msg: "User or password are not corrects" });

    const validatePassword = bcryptjs.compareSync(password, user.password);
    if (!validatePassword)
      return res
        .status(400)
        .json({ msg: "User or password are not corrects - password" });

    const token = await generateJWT(user.id);

    res.json({
      msg: "login ok",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Something was wrong" });
  }
};

module.exports = {
  login,
};
