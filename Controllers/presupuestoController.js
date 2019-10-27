const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/news');
//const Presupuesto = mongoose.model("presupuesto");
const Presupuesto = require('../Models/modeloPresupuesto');
//const Vacante = mongoose.model("Vacante");
const { isAuthenticated } = require('../helpers/auth');

exports.homePresupuesto = async (req, res, next) => {
  res.render("inicio", {
    nombrePagina: " MasterPresupuesto",
    tagline: "Realiza tu presupuesto en nuetra App"
  });
};

exports.formularioPresupuesto =  async (req, res, next) => {
 
  res.render("presupuesto/nuevoPresupuesto", {
    nombrePagina: "Nuevo presupuesto",
    tagline: "Realiza tu presupuesto en nuetra App"
  });
  req.flash("success", ["Bienvenido"]);
};



  // Agregar una nueva presupuesto a la base de datos
  exports.agregarPresupuesto = async (req, res) => {
    const usuarioO = req.user;
    console.log("estos son los datos qwue tra el presupuesto");
    console.log(req.body);
  
    const presupuesto = new Presupuesto(req.body);
  
    // Agregrando el usuario que crea la presupuesto
    presupuesto.usuario = usuarioO._id;
  
    // Almacenar en la base de datos
    const nuevoPresupuesto = await presupuesto.save();
  
    // Redireccionar
   res.redirect(`presupuesto/nuevoGasto/${nuevoPresupuesto.url}`);
  };
  
  // Mostrar una presupuesto
  exports.mostrarPresupuesto = async (req, res, next) => {
    
    const usuarioO = req.user;
    const presupuesto = await Presupuesto.find({ usuario: usuarioO._id });
  
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
    const usuarioO = req.user;
    
    
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });
  
    // Si no existe la presupuesto
    if (!presupuesto) return next();
        const lasCategorias = await Categoria.find({
        registradoPor: elUsuario._id,
        estado: 1
      });
  
    // Si no existen categorias
    if (!lasCategorias) return next();

    res.render("editarPresupuesto", {
      nombrePagina: 'Editar presupuesto',
      presupuesto,
      //cerrarSesion: true,
      usuarioO,
      nombre: req.user.nombre
    });
  };
  
  // Almacenar una presupuesto editada
  exports.editarPresupuesto = async (req, res, next) => {
    const presupuestoEditado = req.body;
  
    console.log(presupuestoEditado);
    const usuarioO = req.user;
    presupuestoEditado.usuario=usuarioO._id;
    // Almacenar la presupuesto editada
    const presupuesto = await Presupuesto.findOneAndUpdate(
      { url: req.params.url },
      presupuestoEditado,
      {
        new: true,
        runValidators: true
      }
    );
  
    res.redirect('/presupuesto/mostrarPresupuesto');
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
    if (!presupuesto.usuario.equals(usuario._id)) {
      return false;
    }
  
    return true;
  };