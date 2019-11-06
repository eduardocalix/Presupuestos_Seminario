const mongoose = require("mongoose");
//const Gasto = mongoose.model("gasto");

//const Presupuesto = mongoose.model("presupuesto");
const Presupuesto = require('../Models/modeloPresupuesto');
const Usuario = require('../Models/modeloUsuario');

const Gasto = require("../Models/modeloGastos");

exports.formularioNuevaGasto = async (req, res) => {
  const presupuesto = await Presupuesto.findOne({ url: req.params.url });
    res.render("presupuesto/nuevoGasto", {
      nombrePagina: "Nuevo gasto",
      tagline: "Llena el formulario y publica un nueva gasto",
      presupuesto
    });
  };
  // Opciones de querys Mongoose para CRUDS
  // https://mongoosejs.com/docs/queries.html
  
  // Agregar una nueva gasto a la base de datos
  exports.agregarGasto = async (req, res, next) => {
    const usuarioO = req.user;
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });
    if (!presupuesto) return next();
    var diferencia = 0;
    const gasto = new Gasto(req.body);
    //console.log(presupuesto._id);
    gasto.presupuesto = presupuesto._id;
    const id =presupuesto._id;
    // Agregrando el usuario que crea la gasto
    gasto.usuario = usuarioO._id;
    diferencia= req.body.gastoEsperado - req.body.gastoReal;
    gasto.diferencia= diferencia;
    // Almacenar en la base de datos
    const nuevoGasto = await gasto.save();
  
    // Redireccionar
    res.redirect(`/mostrarGasto/${{id}}`);
  };
  
  // Mostrar una gasto
  exports.mostrarGastos = async (req, res, next) => {
    const gastos = await Gasto.find({presupuesto: req.params._id});
  
    // Si no hay resultados
    if (!gastos) return next();
  
    res.render("presupuesto/mostrarGasto", {
      nombrePagina: "Gastos",
      gastos
    });
  };
  
  // Muestra el formulario para editar una gasto
  exports.formularioEditarGasto = async (req, res, next) => {
    const gasto = await Gasto.findOne({ url: req.params.url });
  
    // Si no existe la gasto
    if (!gasto) return next();
  
    res.render("presupuesto/editarGasto", {
      nombrePagina: `Editar ${gasto.nombre}`,
      gasto,
      cerrarSesion: true
    });
  };
  
  // Almacenar una gasto editada
  exports.editarGasto = async (req, res, next) => {
    const gastoEditado = req.body;
  
    //console.log(gastoEditado);
    const usuarioO = req.user;
    var diferencia = 0;

    gastoEditado.usuario=usuarioO._id;
    gastoEditado.presupuesto= req.params._id;
    const id=req.params._id;
    diferencia= req.body.gastoEsperado - req.body.gastoReal;
    gastoEditado.diferencia= diferencia;
    // Almacenar la gasto editada
    const gasto = await Gasto.findOneAndUpdate(

      { url: req.params.url },
      gastoEditado,
      {
        new: true,
        runValidators: true
      }
    );
    res.redirect(`/mostrarGasto/${{id}}`);
    //res.redirect("/mostrarGasto");
    //res.redirect(`/gasto/${gasto.url}`);
  };
  
  // Eliminar una gasto
  exports.eliminarGasto = async (req, res) => {
    // Obtener el id de la gasto
    const gasto = await Gasto.findByIdAndDelete(req.params._id);
    req.flash("success", ["Presupuesto eliminado correctamente"]);
    gasto.remove();
    const presupuesto = await Presupuesto.findById(id);
    const id= presupuesto._id;
    res.redirect(`/mostrarGasto/${{id}}`);
    
  
  };
  
  