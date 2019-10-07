const express = require("express");
const router = express.Router();
const presupuestoController = require("../Controllers/presupuestoController");
//const vacanteController = require("../controllers/vacanteController");

module.exports = () => {
  router.get("/", presupuestoController.homePresupuesto);
 

  return router;
};
