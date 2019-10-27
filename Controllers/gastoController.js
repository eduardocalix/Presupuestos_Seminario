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
    gasto.presupuesto = presupuesto._id;
    // Agregrando el usuario que crea la gasto
    gasto.usuario = usuarioO._id;
    diferencia= req.body.gastoEsperado - req.body.gastoReal;
    gasto.diferencia= diferencia;
    // Almacenar en la base de datos
    const nuevoGasto = await gasto.save();
  
    // Redireccionar
    res.redirect("/mostrarGasto");
  };
  
  // Mostrar una gasto
  exports.mostrarGastos = async (req, res, next) => {
    const gastos = await Gasto.find();
  
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
  
    console.log(gastoEditado);
    const usuarioO = req.user;
    var diferencia = 0;

    gastoEditado.usuario=usuarioO._id;
    gastoEditado.presupuesto= req.params._id;
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
    res.redirect("/mostrarGasto");
    //res.redirect(`/gasto/${gasto.url}`);
  };
  
  // Eliminar una gasto
  exports.eliminarGasto = async (req, res) => {
    // Obtener el id de la gasto
    const { id } = req.params;
  
    const gasto = await Gasto.findById(id);
  
    if (verificarUsuario(gasto, req.user)) {
      // El usuario es el autor de la gasto
      gasto.remove();
      res.status(200).send("La gasto ha sido eliminada correctamente");
    } else {
      // El usuario no es el autor, no permitir eliminación
      res.status(403).send("Error al momento de eliminar la gasto");
    }
  };
  
  // Verificar que el autor de una gasto sea el usuario enviado
  const verificarUsuario = (gasto = {}, usuario = {}) => {
    if (!gasto.autor.equals(usuario._id)) {
      return false;
    }
  
    return true;
  };