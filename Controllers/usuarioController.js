const mongoose = require("mongoose");
//const Usuario = mongoose.model("usuario");
const { validationResult } = require("express-validator");
const Usuario = require('../models/modeloUsuario');

// Mostrar el formulario de inicio de sesión

exports.formularioInicioSesion = (req, res) => {
    res.render("user/iniciarSesion", {
      nombrePagina: "Iniciar sesión en Master Presupuesto"
    });
  };

  // Almacena una cuenta de usuario
exports.agregarUsuario = async (req, res, next) => {
  //console.log(req.body);

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
    //console.log(usuario);

    req.flash("success", ["El usuario registrado exitosamente"]);
    // renderizar la página con los errores
    res.render("user/iniciarSesion", {
    nombrePagina: "Crear cuenta en Master Presupuesto",
    tagline: "¡Haz tu presupuesto de forma gratuita!",
    message: req.flash()
      });
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

  // Mostrar el formulario de editar perfil del usuario
exports.formularioEditarPerfil = (req, res) => {
  res.render("editarPerfil", {
    nombrePagina: "Edita el perfil de tu usuario en DevFinder",
    usuario: req.user,
    cerrarSesion: true,
    nombre: req.user.nombre
  });
};

// Almacena los cambios en el perfil del usuario
exports.editarPerfil = async (req, res) => {
  // Buscar el usuario
  const usuario = await Usuario.findById(req.user._id);

  // Modificar los valores
  usuario.nombre = req.body.nombre;
  usuario.email = req.body.email;

  if (req.body.password) {
    usuario.password = req.body.password;
  }

  // Verificar si el usuario agrega una imagen
  if (req.file) {
    usuario.imagen = req.file.filename;
  }

  // Guardar los cambios
  await usuario.save();

  req.flash("correcto", ["Cambios almacenados correctamente"]);

  // Redireccionar
  res.redirect("/administrar");
};