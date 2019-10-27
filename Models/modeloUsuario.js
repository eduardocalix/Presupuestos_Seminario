// Definición del schema
// https://mongoosejs.com/docs/guide.html#models
// Tipos de schemas en Mongoose
// https://mongoosejs.com/docs/schematypes.html


const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");

// Definición del schema
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    unique:true,
    required: " El mes es requerido",
    lowercase:true,
    trim: true
  },
  telefono: {
    type: String,
    default: 0,
    trim: true
  },
  ocupacion: {
    type: String,
    trim: true
  },
  /* imagen: {
    type: String,
    trim: true,
    default: "defecto.jpg"
  }, */

  contrasena: {
    type: String,
    required: true,
    trim: true
  },
  token: String,
  expira: Date
});


// Hooks (método) para hash + salt contrasena
usuarioSchema.pre("save", function(next) {
  const user = this;

  // Si el contrasena ya fué modificado (ya hasheado)
  if (!user.isModified("contrasena")) {
    return next();
  }

  // Generar el salt y si no hay error, hashear el contrasena
  // Se almacena tanto el hash+salt para evitar ataques
  // de rainbow table.
  bcrypt.genSalt(10, (err, salt) => {
    // Si hay un error no continuar
    if (err) return next(err);

    // Si se produjo el salt, realizar el hash
    bcrypt.hash(user.contrasena, salt, (err, hash) => {
      if (err) return next(err);

      user.contrasena = hash;
      next();
    });
  });
});

// Hooks para poder pasar los errores de MongoBD hacia express validator
usuarioSchema.post("save", function(error, doc, next) {
  // Verificar que es un error de MongoDB
  if (error.name === "MongoError" && error.code === 11000) {
    next(
      "Ya existe un usuario con la dirección de correo electrónico ingresada"
    );
  } else {
    next(error);
  }
});

// Realizar un método que automáticamente verifique el contrasena ingresado
// contra el almacenado (hash + salt)
usuarioSchema.methods.compararcontrasena = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.contrasena);
};
usuarioSchema.methods.comparecontrasena = function(candidatePassword) {
  const user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.contrasena, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  }).catch();
};

module.exports = mongoose.model("usuario", usuarioSchema);
