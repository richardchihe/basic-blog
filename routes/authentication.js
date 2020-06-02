const express = require('express');
const User = require('./../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const { checkNotLoggedIn } = require('./../middleware/loggedInAuthentication');

router.get('/register', checkNotLoggedIn, (req, res) => {
  res.render('authentication/register');
});

router.post('/register', checkNotLoggedIn, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    user = await user.save();

    console.log(user);

    res.redirect('/authentication/login');
  } catch {
    res.redirect('/authentication/register');
  }
});

router.get('/login', checkNotLoggedIn, (req, res) => {
  res.render('authentication/login');
});

module.exports = router;