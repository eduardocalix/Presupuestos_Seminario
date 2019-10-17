const mongoose = require("mongoose");
//const Usuario = mongoose.model("Usuario");
//const { validationResult } = require("express-validator");

// Mostrar el formulario de inicio de sesión

exports.formularioInicioSesion = (req, res) => {
    res.render("user/signin", {
      nombrePagina: "Iniciar sesión en Master Presupuesto"
    });
  };

  
exports.formularioCrearUsuario = (req, res) => {
    res.render("user/signup", {
      nombrePagina: "Iniciar sesión en Master Presupuesto"
    });
  };