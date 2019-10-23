const mongoose = require("mongoose");
//const Vacante = mongoose.model("Vacante");

exports.homePresupuesto = async (req, res, next) => {
  // Obtener todos los documentos de las vacantes
  //const vacantes = await Vacante.find();

 /*  console.log(vacantes);

  // Si no hay vacantes
  if (!vacantes) return next(); */

  res.render("inicio", {
    nombrePagina: " MasterPresupuesto",
    tagline: "Realiza tu presupuesto en nuetra App",
    barra: true,
    boton: true
    //vacantes
  });
};

exports.formularioPresupuesto = async (req, res, next) => {
  res.render("presupuesto/nuevoPresupuesto", {
    nombrePagina: "Nuevo Presupuesto",
    tagline: "Realiza tu presupuesto en nuetra App"
  });
};