const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");

// Definición del schema
// https://mongoosejs.com/docs/guide.html#models
// Tipos de schemas en Mongoose
// https://mongoosejs.com/docs/schematypes.html
const presupuestoSchema = new mongoose.Schema({
  ingresoMensual: {
    type: Number,
     default: 0,
    required: "El ingreso mensual es requerido"
  },
  fecha: {
    type: Date,
    trim: true
  },
  mes: {
    type: String,
    required: " El mes es requerido",
    trim: true
  },
  
  descripcion: {
    type: String,
    trim: true
  },
  usuario: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    lowercase: true
  },
  /* skills: [String],
  gastos: [
    {
      tipo: String,
      gastoEsperado: Number,
      gasoReal: Number,
      diferencia: Number
    }
  ], */
  totalPresupuesto: {
    type: Number,
    trim: true,
    default:0
  }
});
// Hooks para generar la URL (en Mongoose se conoce como middleware)
presupuestoSchema.pre("save", function(next) {
  // Crear la URL
  const url = slug(this.ingresoMensual);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

module.exports = mongoose.model("presupuesto", presupuestoSchema);