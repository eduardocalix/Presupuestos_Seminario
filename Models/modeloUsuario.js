const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");

// Definición del schema
// https://mongoosejs.com/docs/guide.html#models
// Tipos de schemas en Mongoose
// https://mongoosejs.com/docs/schematypes.html
const usuarioSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: "El ingreso mensual es requerido",
    trim: true
  },
  nombreUsuario: {
    type: String,
    trim: true
  },
  correo: {
    type: String,
    required: " El mes es requerido",
    trim: true
  },
  telefono: {
    type: String,
    default: 0,
    trim: true
  },
  contrasena: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    lowercase: true
  }
});
// Hooks para generar la URL (en Mongoose se conoce como middleware)
usuarioSchema.pre("save", function(next) {
  // Crear la URL
  const url = slug(this.titulo);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

module.exports = mongoose.model("usuario", usuarioSchema);