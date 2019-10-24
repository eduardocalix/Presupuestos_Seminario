const mongoose = require("mongoose");
//const Usuario = mongoose.model("modeloUsuario");
const { validationResult } = require("express-validator");
const Usuario = require('../Models/modeloUsuario');

// Mostrar el formulario de inicio de sesión

exports.formularioInicioSesion = (req, res) => {
    res.render("user/iniciarSesion", {
      nombrePagina: "Iniciar sesión en Master Presupuesto"
    });
  };

  // Almacena una cuenta de usuario
exports.agregarUsuario = async (req, res, next) => {
  console.log(req.body);

  // Verificar que no existan errores de validación
  const errores = validationResult(req);
  const erroresArray = [];

  // Si hay errores
  if (!errores.isEmpty()) {
    errores.array().map(error => erroresArray.push(error.msg));

    // Enviar los errores de regreso al usuario
    req.flash('errors', [erroresArray]);

    res.render("user/crearCuenta", {
      nombrePagina: "Crear cuenta en Master Presupuesto",
      tagline: "¡Haz tu presupuesto de forma gratuita!",
      messages: req.flash()
    });
    return;
  }

  // Crear el usuario
  const usuario = new Usuario(req.body);

  // tratar de almacenar el usuario
  try {
    await usuario.save();
    console.log(usuario);

    req.flash("success", ['El usuario registrado exitosamente']);

  } catch (error) {
    // Ingresar el error al arreglo de errores
    erroresArray.push(error);
    req.flash("error", erroresArray);

    // renderizar la página con los errores
    res.render("user/crearCuenta", {
      nombrePagina: "Crear cuenta en Master Presupuesto",
      tagline: "¡Haz tu presupuesto de forma gratuita!",
      messages: req.flash()
    });
  }
};
  
exports.formularioCrearUsuario = (req, res) => {
    res.render("user/crearCuenta", {
      nombrePagina: "Crear cuenta en Master Presupuesto"
    });
  };