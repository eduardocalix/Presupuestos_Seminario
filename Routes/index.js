const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const presupuestoController = require("../Controllers/presupuestoController");
const gastoController = require("../Controllers/gastoController");
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
        .isEmail()
        .normalizeEmail(),
      check("telefono", "El telefono no es vålido.")
        .not()
        .isEmpty(),
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
 router.post("/iniciarSesion", authController.autenticarUsuario);
 // Cerrar sesión
 router.get("/cerrarSesion", authController.verificarUsuario,authController.cerrarSesion);
 //Presupuestos
  //router.get("/nuevoPresupuesto", presupuestoController.formularioPresupuesto);
 //router.post("/nuevoPresupuesto", presupuestoController.crearPresupuesto);

router.get("/nuevoPresupuesto", presupuestoController.formularioPresupuesto);
//router.post("/nuevoPresupuesto", presupuestoController.autenticarUsuario);

router.post("/nuevoPresupuesto",
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
router.post("/delete/:_id", presupuestoController.eliminarPresupuesto);


//Agregar un gasto
router.get("/nuevoGasto/:url", gastoController.formularioNuevaGasto);

router.post("/nuevoGasto/:url",
authController.verificarUsuario,
gastoController.agregarGasto
);

// Mostrar los gastos
router.get("/mostrarGasto/:_id", gastoController.mostrarGastos);

// Editar una gasto
router.get(
"/editarGasto/:url",
authController.verificarUsuario,
gastoController.formularioEditarGasto
);
router.post(
"/editarGasto/:url",
authController.verificarUsuario,
gastoController.editarGasto
);

// Eliminar una gasto
router.delete("/delete/:_id", gastoController.eliminarGasto);
  return router;
};
