const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Usuario = require('../Models/modeloUsuario');
//const Vacante = mongoose.model("Vacante");
const { isAuthenticated } = require('../helpers/auth');

exports.homePresupuesto = async (req, res, next) => {
  // Obtener todos los documentos de las vacantes
  //const vacantes = await Vacante.find();

 /*  console.log(vacantes);

  // Si no hay vacantes
  if (!vacantes) return next(); */

  res.render("inicio", {
    nombrePagina: " MasterPresupuesto",
    tagline: "Realiza tu presupuesto en nuetra App"
  });
};

exports.formularioPresupuesto =  async (req, res, next) => {
  if (isAuthenticated){
  res.render("presupuesto/nuevoPresupuesto", {
    nombrePagina: "Nuevo Presupuesto",
    tagline: "Realiza tu presupuesto en nuetra App"
  });
  req.flash("success", [
    "Bienvenido"
  ]);}
};

exports.crearPresupuesto =  async (req, res, next) => {


};