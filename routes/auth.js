const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../routes/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register user
router.post("/register", async (req, res) => {
  // validating the data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check for duplicate user
  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).send("email already exists");

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const saveUser = await user.save();
    res.status(201).send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Log In

router.post("/login", async (req, res) => {
  // validating the data
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check for duplicate user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("register");

  // check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("pass is wrong");

  // jwt token - create and assign
  const token = jwt.sign({ _id: user._id }, "saywhatagainmotherfucker");
  res.header("auth-token", token);
});

module.exports = router;

// token secret : saywhatagainmotherfucker
