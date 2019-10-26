const express = require('express');
const router = express.Router();
//controllers
const presupuestoController = require("../Controllers/presupuestoController");
const authController = require("../Controllers/authController");
const gastoController = require("../Controllers/gastoController");

// Models

// Helpers
const { check } = require("express-validator");

module.exports = () => {
    router.get("/", presupuestoController.homePresupuesto);
     //Presupuestos
    router.get("/nuevoPresupuesto", presupuestoController.formularioPresupuesto);
 //router.post("/nuevoPresupuesto", presupuestoController.autenticarUsuario);

 router.post(
  "/nuevoPresupuesto",
  authController.verificarUsuario,
  presupuestoController.agregarPresupuesto
);

// Mostrar una presupuesto
router.get("/mostrarPresupuesto", presupuestoController.mostrarPresupuesto);

// Editar un presupuesto
router.get(
  "/editarPresupuesto/:url",
  authController.verificarUsuario,
  presupuestoController.formularioEditarPresupuesto
);
router.post(
  "/editarPresupuesto/:url",
  authController.verificarUsuario,
  presupuestoController.editarPresupuesto
);

// Eliminar un presupuesto
router.delete("/eliminar/:id", presupuestoController.eliminarPresupuesto);


//Agregar un gasto
router.get("/nuevoGasto", gastoController.agregarGasto);

router.post(
  "/nuevoGasto",
  authController.verificarUsuario,
  gastoController.agregarGasto
);

// Mostrar los gastos
router.get("/mostrarGasto/", gastoController.mostrarGastos);

// Editar una gasto
router.get(
  "/gasto/editar/:url",
  authController.verificarUsuario,
  gastoController.formularioEditarGasto
);
router.post(
  "/gasto/editar/:url",
  authController.verificarUsuario,
  gastoController.editarGasto
);

// Eliminar una gasto
router.delete("/gasto/eliminar/:id", gastoController.eliminarGasto);


  return router;
};
