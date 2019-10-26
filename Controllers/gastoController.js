const mongoose = require("mongoose");
//const Gasto = mongoose.model("gasto");
const Gasto = require("../Models/modeloGastos");

exports.formularioNuevaGasto = (req, res) => {
    res.render("presupuesto/nuevoGasto", {
      nombrePagina: "Nueva gasto",
      tagline: "Llena el formulario y publica una nueva gasto",
      cerrarSesion: true,
      nombre: req.user.nombre
    });
  };
  // Opciones de querys Mongoose para CRUDS
  // https://mongoosejs.com/docs/queries.html
  
  // Agregar una nueva gasto a la base de datos
  exports.agregarGasto = async (req, res) => {
    const gasto = new Gasto(req.body);
  
    // Agregrando el usuario que crea la gasto
    gasto.nombre = req.user._id;
  
    // Crear el arreglo de skills
  
    // Almacenar en la base de datos
    const nuevaGasto = await gasto.save();
  
    // Redireccionar
    res.redirect(`presupuesto/gasto/${nuevaGasto.url}`);
  };
  
  // Mostrar una gasto
  exports.mostrarGastos = async (req, res, next) => {
    const gastos = await Gasto.find();
  
    // Si no hay resultados
    if (!gastos) return next();
  
    res.render("presupuesto/mostrarGastos", {
      nombrePagina: "Gastos",
      gastos
    });
  };
  
  // Muestra el formulario para editar una gasto
  exports.formularioEditarGasto = async (req, res, next) => {
    const gasto = await Gasto.findOne({ url: req.params.url });
  
    // Si no existe la gasto
    if (!gasto) return next();
  
    res.render("editarGasto", {
      nombrePagina: `Editar ${gasto.titulo}`,
      gasto,
      cerrarSesion: true,
      nombre: req.user.nombre
    });
  };
  
  // Almacenar una gasto editada
  exports.editarGasto = async (req, res, next) => {
    const gastoEditada = req.body;
  
    // Convertir las skills a un arreglo de skills
    gastoEditada.skills = req.body.skills.split(",");
  
    console.log(gastoEditada);
  
    // Almacenar la gasto editada
    const gasto = await Gasto.findOneAndUpdate(
      { url: req.params.url },
      gastoEditada,
      {
        new: true,
        runValidators: true
      }
    );
  
    res.redirect(`/gasto/${gasto.url}`);
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