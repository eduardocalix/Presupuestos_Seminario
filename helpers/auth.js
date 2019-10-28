const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'No Autenticado');
  res.redirect('/iniciarSesion');
};

module.exports = helpers;
