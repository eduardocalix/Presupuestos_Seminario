const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
//const Presupuesto = mongoose.model("presupuesto");
const Presupuesto = require('../Models/modeloPresupuesto');
//const Vacante = mongoose.model("Vacante");
const { isAuthenticated } = require('../helpers/auth');

exports.homePresupuesto = async (req, res, next) => {
  // Obtener todos los documentos de las vacantes
  //const vacantes = await Vacante.find();

 /*  console.log(vacantes);

  // Si no hay vacantes
  if (!vacantes) return next(); */

  res.render("inicio", {
    nombrePagina: " MasterPresupuesto",
    tagline: "Realiza tu presupuesto en nuetra App"
  });
};

exports.formularioPresupuesto =  async (req, res, next) => {
  if (isAuthenticated){
  res.render("presupuesto/nuevoPresupuesto", {
    nombrePagina: "Nuevo Presupuesto",
    tagline: "Realiza tu presupuesto en nuetra App"
  });
  req.flash("success", ["Bienvenido"]);}
};


  // Agregar una nueva presupuesto a la base de datos
  exports.agregarPresupuesto = async (req, res) => {
    const presupuesto = new Presupuesto(req.body);
  
    // Agregrando el usuario que crea la presupuesto
    presupuesto.autor = req.user._id;
  
    // Crear el arreglo de skills
    presupuesto.skills = req.body.skills.split(",");
  
    // Almacenar en la base de datos
    const nuevaPresupuesto = await presupuesto.save();
  
    // Redireccionar
    res.redirect(`/presupuesto/${nuevaPresupuesto.url}`);
  };
  
  // Mostrar una presupuesto
  exports.mostrarPresupuesto = async (req, res, next) => {
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });
  
    // Si no hay resultados
    if (!presupuesto) return next();
  
    res.render("presupuesto", {
      nombrePagina: presupuesto.titulo,
      barra: true,
      presupuesto
    });
  };
  
  // Muestra el formulario para editar una presupuesto
  exports.formularioEditarPresupuesto = async (req, res, next) => {
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });
  
    // Si no existe la presupuesto
    if (!presupuesto) return next();
  
    res.render("editarPresupuesto", {
      nombrePagina: `Editar ${presupuesto.titulo}`,
      presupuesto,
      cerrarSesion: true,
      nombre: req.user.nombre
    });
  };
  
  // Almacenar una presupuesto editada
  exports.editarPresupuesto = async (req, res, next) => {
    const presupuestoEditada = req.body;
  
    // Convertir las skills a un arreglo de skills
    presupuestoEditada.skills = req.body.skills.split(",");
  
    console.log(presupuestoEditada);
  
    // Almacenar la presupuesto editada
    const presupuesto = await Presupuesto.findOneAndUpdate(
      { url: req.params.url },
      presupuestoEditada,
      {
        new: true,
        runValidators: true
      }
    );
  
    res.redirect(`/presupuesto/${presupuesto.url}`);
  };
  
  // Eliminar una presupuesto
  exports.eliminarPresupuesto = async (req, res) => {
    // Obtener el id de la presupuesto
    const { id } = req.params;
  
    const presupuesto = await Presupuesto.findById(id);
  
    if (verificarUsuario(presupuesto, req.user)) {
      // El usuario es el autor de la presupuesto
      presupuesto.remove();
      res.status(200).send("La presupuesto ha sido eliminada correctamente");
    } else {
      // El usuario no es el autor, no permitir eliminación
      res.status(403).send("Error al momento de eliminar la presupuesto");
    }
  };
  
  // Verificar que el autor de una presupuesto sea el usuario enviado
  const verificarUsuario = (presupuesto = {}, usuario = {}) => {
    if (!presupuesto.autor.equals(usuario._id)) {
      return false;
    }
  
    return true;
  };