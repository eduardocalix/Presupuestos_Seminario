const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
//const Usuario = require('../Models/modeloUsuario');
const Usuario = mongoose.model("usuario");

// Configurar la estrategia a utilizar
passport.use(
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "contrasena"
    },
    async (correo, contrasena, done) => {
      const usuario = await Usuario.findOne({ correo });
      //console.log(usuario);

      //   Si el usuario no existe
      if (!usuario) {
      //console.log("datos no encontrado correo");
        return done(null, false, {
          message: error["El correo electrónico no es válido"]
        });
      }

      // El usuario existe, verificar si la contraseña es correcta
      const verificarPassword = usuario.compararContrasena(contrasena);

      //   Si el password es incorrecto
      if (!verificarPassword) {
      //console.log("datos no encontrado");

        return done(null, false, {
          message: ["La contraseña ingresada es incorrecta"]
        });
      }

      //  El usuario existe y la contraseña es correcta
      return done(null, usuario);
    }
  )
);

passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id).exec();

  return done(null, usuario);
});

module.exports = passport;
