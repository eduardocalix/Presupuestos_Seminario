const passport = require("passport");
const mongoose = require("mongoose");
//const Vacante = mongoose.model("Vacante");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "presupuesto/nuevoPresupuesto",
  failureRedirect: "user/iniciarSesion",
  failureFlash: true,
  badRequestMessage: ["Debes ingresar ambos campos"]
});

// Cerrar la sesión del usuario actual
exports.cerrarSesion = (req, res) => {
  // Cierra la sesión actual
  req.logout();

  req.flash("success", [
    "Has cerrado tu sesión correctamente. ¡Vuelve pronto!"
  ]);

  return res.redirect("user/iniciarSesion");
};

// Verificar si el usuario se encuentra autenticado
exports.verificarUsuario = (req, res, next) => {
  // Retorna true si el usuario ya realizó la autenticación
  if (req.isAuthenticated()) {
    return next();
  }

  // Si no se autenticó, redirecccionarlo al inicio de sesión
  res.redirect("/iniciarSesion");
};
