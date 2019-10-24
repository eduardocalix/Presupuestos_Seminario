const express = require('express');
const router = express.Router();
//controllers
const presupuestoController = require("../Controllers/presupuestoController");

// Models

// Helpers
const { check } = require("express-validator");

module.exports = () => {
    router.get("/", presupuestoController.homePresupuesto);
     //Presupuestos
    router.get("/nuevoPresupuesto", presupuestoController.formularioPresupuesto);
 //router.post("/nuevoPresupuesto", presupuestoController.autenticarUsuario);
  return router;
};
