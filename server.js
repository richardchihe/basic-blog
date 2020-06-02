if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('./routes/articles');
const authenticationRouter = require('./routes/authentication');
const methodOverride = require('method-override');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const Article = require('./models/article');
const User = require('./models/user');

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  async email => {
    return await User.findOne({email: email});
  },
  async id => {
    return await User.findById(id);
  }
);

mongoose.connect('mongodb://localhost/blog', { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/authentication/login',
  failureFlash: true
}));

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

app.use('/articles', articleRouter);

app.use('/authentication', authenticationRouter);

app.listen(5000);