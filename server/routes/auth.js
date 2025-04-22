const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    const { password, ...others } = savedUser._doc; //when destructuring user, because of mongodb rules, use user._doc
    res.status(200).json({ ...others });
  } catch (err) {
    res.status(500).json(err);
  }
});

// login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(401).json("user does not exist");

    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SEC
    );
    const OriginalPassword = hashPassword.toString(CryptoJS.enc.Utf8);

    req.body.password != OriginalPassword &&
      res.status(401).json("wrong credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc; //when destructuring user, because of mongodb rules, use user._doc
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
