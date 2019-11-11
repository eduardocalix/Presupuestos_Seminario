const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("./node_modules/slug");
const shortid = require("./node_modules/shortid");

// Definición del schema
// https://mongoosejs.com/docs/guide.html#models
// Tipos de schemas en Mongoose
// https://mongoosejs.com/docs/schematypes.html
const gastoSchema = new mongoose.Schema({
    nombre: {
    type: String,
    trim: true,
    required: "El nombre del gasto es requerido"
  },
  presupuesto:{
    type: String,
    trim: true
  },
  usuario:{
    type: String,
    trim: true
  },
  gastoEsperado:  {
    type: Number,
    required: " El gasto Esperado es requerido"
  },
  gastoReal: {
    type: Number,
    required: " El gasto Real es requerido",
    trim: true
  },
  
  diferencia: {
    type: Number,
    trim: true
  }, 
  descripcion: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    lowercase: true
  }
});
// Hooks para generar la URL (en Mongoose se conoce como middleware)
gastoSchema.pre("save", function(next) {
  // Crear la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

module.exports = mongoose.model("gasto", gastoSchema);