function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/authentication/login');
}

function checkNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  next();
}

module.exports = {
  checkLoggedIn,
  checkNotLoggedIn
}