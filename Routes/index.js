const express = require("express");
const router = express.Router();
const presupuestoController = require("../Controllers/presupuestoController");
const usuarioController = require("../controllers/usuarioController");

module.exports = () => {
  router.get("/", presupuestoController.homePresupuesto);
  router.get("/iniciarSesion", usuarioController.formularioInicioSesion);
  router.get("/crearCuenta", usuarioController.formularioCrearUsuario);


 // router.post("/iniciarSesion", authController.autenticarUsuario);

  return router;
};
