const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const presupuestoController = require("../Controllers/presupuestoController");
const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");

module.exports = () => {
  router.get("/", presupuestoController.homePresupuesto);
  //Iniciar sesion
  router.get("/iniciarSesion", usuarioController.formularioInicioSesion);
  router.post("/iniciarSesion", authController.autenticarUsuario);
  //Crear una nueva cuenta
  router.get("/crearCuenta", usuarioController.formularioCrearUsuario);
  router.post(
    "/crearCuenta",
    [
      // Verificar los atributos del formulario
      // https://express-validator.github.io/docs/index.html
      check("nombre", "El nombre de usuario es requerido.")
        .not()
        .isEmpty()
        .escape(),
      check("correo", "El correo electrónico es requerido.")
        .not()
        .isEmpty(),
      check("correo", "El correo electrónico no es vålido.")
        .isEmail()
        .normalizeEmail(),
      check("contrasena", "La contraseña es requerida.")
        .not()
        .isEmpty(),
      check("confirmpassword", "Debe ingresar la confirmación de tu contraseña")
        .not()
        .isEmpty(),
      check(
        "confirmpassword",
        "La confirmación de la contraseña no coincide con tu contraseña"
      ).custom((value, { req }) => value === req.body.contrasena)
    ],
    usuarioController.agregarUsuario
  );
 // router.post("/iniciarSesion", authController.autenticarUsuario);
 // Cerrar sesión
 router.get("/cerrarSesion", authController.cerrarSesion);
 //Presupuestos
 router.get("/nuevoPresupuesto", presupuestoController.formularioPresupuesto);
 //router.post("/nuevoPresupuesto", presupuestoController.autenticarUsuario);
  return router;
};
