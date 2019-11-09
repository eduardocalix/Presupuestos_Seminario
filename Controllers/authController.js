const passport = require("passport");
const mongoose = require("mongoose");
const Usuario = mongoose.model("usuario");
const crypto = require("crypto");
const enviarEmail = require("../Handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/nuevoPresupuesto",
  failureRedirect: "/iniciarSesion",
  failureFlash: true,
  badRequestMessage: ["Debes ingresar ambos campos"]
});

// Cerrar la sesión del usuario actual
exports.cerrarSesion = (req, res) => {
  // Cierra la sesión actual
  req.logout();

  req.flash("success", ["Has cerrado tu sesión correctamente. ¡Vuelve pronto!" ]);

  return res.redirect("/iniciarSesion");
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

// Muestra el formulario de reseteo de contraseña
exports.formularioReestablecerContrasena = (req, res) => {
  res.render("user/reestablecer", {
    nombrePagina: "Reestablece tu contraseña",
    tagline:
      "Si ya tienes una cuenta en MasterPresupuesto pero olvidaste tu contraseña, favor coloca tu correo electrónico."
  });
};


exports.enviarToken = async (req, res) => {
  // Verificar si el correo electrónico es válido
  const usuario = await Usuario.findOne({ correo: req.body.correo });
  //console.log(usuario);
  // Si el usuario no existe
  if (!usuario) {
    req.flash("error", ["El correo electrónico ingresado no existe"]);
    return res.redirect("/reestablecer");
  }

  // El usuario existe, generar el token
  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expira = Date.now() + 36000;

  // Guardar el usuario
  await usuario.save();

  // Generar la URL
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // Enviar la notificación por correo
  await enviarEmail.enviar({
    usuario,
    subject: "Reestablecer tu contraseña",
    template: "resetContrasena",
    resetUrl
  });

  // Redireccionar
  req.flash("correcto", [
    "Verifica tu correo electrónico para seguir las instrucciones"
  ]);
  res.redirect("/iniciarSesion");
};

// Mostrar el formulario de cambio de contraseña
exports.formularioNuevoContrasena = async (req, res) => {
  // buscar el usuario por medio del token y la fecha de expiración
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: { $gt: Date.now() }
  });

  // No se pudo encontrar el usuario con el token o token vencido
  if (!usuario) {
    req.flash("error", [
      "Solicitud expirada. Vuelve a solicitar el cambio de contraseña"
    ]);
    return res.redirect("/reestablecer");
  }

  // Mostrar el formulario de nueva password
  res.render("user/nuevaContrasena", {
    nombrePagina: "Ingresa tu nueva contraseña",
    tagline: "Asegurate de utilizar una contraseña segura"
  });
};

// Almacena la nueva contraseña
exports.almacenarNuevaContrasena = async (req, res) => {
  // buscar el usuario por medio del token y la fecha de expiración
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: { $gt: Date.now() }
  });

  // No se pudo encontrar el usuario con el token o token vencido
  if (!usuario) {
    req.flash("error", [
      "Solicitud expirada. Vuelve a solicitar el cambio de contraseña"
    ]);
    return res.redirect("/reestablecer");
  }

  // Obtener el nuevo password
  usuario.contrasena = req.body.contrasena;
  // Limpiar los valores que ya no son requeridos
  usuario.token = undefined;
  usuario.expira = undefined;

  // Almacenar los valores en la base de datos
  await usuario.save();

  // Redireccionar
  req.flash("correcto", ["Contraseña modificada correctamente"]);
  res.redirect("/iniciarSesion");
};
