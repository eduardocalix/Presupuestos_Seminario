const mongoose = require("mongoose");
//const Presupuesto = mongoose.model("presupuesto");
const Presupuesto = require('../models/modeloPresupuesto');
const Gastos = require("../models/modeloGastos");
//const Vacante = mongoose.model("Vacante");
const { isAuthenticated } = require('../helpers/auth');
const Usuario = require('../models/modeloUsuario');

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
    //console.log("estos son los datos que trae el presupuesto");
    //console.log(req.body);
  
    const presupuesto = new Presupuesto(req.body);
  
    // Agregrando el usuario que crea la presupuesto
    presupuesto.usuario = usuarioO._id;
  
    // Almacenar en la base de datos
    const nuevoPresupuesto = await presupuesto.save();
  
    // Redireccionar
   res.redirect("/mostrarPresupuesto");
  };
  
  // Mostrar una presupuesto
  exports.mostrarPresupuesto = async (req, res, next) => {
    const usuarioO = req.user;
    const presupuestos = await Presupuesto.find({ usuario: usuarioO._id });
    const usuario = await Usuario.findOne({ _id: usuarioO._id });    
    // Si no hay resultados
    if (!presupuestos) return next();
    //console.log(usuario);
    var resultado = 0;
    const nombre= usuario.nombre;
    var total = 0;
    var porcentaje =0;
    const gastos = await Gastos.find({presupuesto: presupuestos._id});    
    if (!gastos){
      total =0;
      req.flash("error",["no hay gastos todavía"]);
     // console.log("no hay gastos");
      resultado="no hay gastos todavía";
      
   // console.log(nombre);

      res.render("presupuesto/mostrarPresupuesto", {
        nombrePagina: "Presupuestos",
        presupuestos,
        usuario,
        total,
        resultado,
        porcentaje
      });
    }else{
      total =0;
   // console.log(nombre);
   for (a in presupuestos) {
    
  
    //Calcular el total de los gastos
    const gastos1 = await Gastos.find({presupuesto: presupuestos[a]._id});    

    var gasto = 0;
    for (i in gastos1) {
      gasto += gastos1[i].gastoReal;
    }
    //Vemos si el presupuesto alcanza
    total = presupuestos[a].ingresoMensual - gasto;
    if (total > 0) {
      resultado = "El presupuesto del mes está en lo establecido";
    } else {
      resultado = "Se contabilizó una pérdida";
    }
     porcentaje = ((total / presupuestos[a].ingresoMensual) * 100).toFixed(2);
     //console.log(porcentaje);
    //
    presupuestos[a].usuario=usuarioO._id;
    presupuestos[a].mes=presupuestos[a].mes;
    presupuestos[a].ingresoMensual=presupuestos[a].ingresoMensual;
    presupuestos[a].fecha=presupuestos[a].fecha;
    presupuestos[a].descripcion=presupuestos[a].descripcion;
    presupuestos[a].totalPresupuesto=total;
    // Almacenar la presupuesto editada
    const presupuesto1 = await Presupuesto.findOneAndUpdate(
      { url: req.params.url },
      presupuestos[a],
      {
        new: true,
        runValidators: true
      }
    );}

    res.render("presupuesto/mostrarPresupuesto", {
      nombrePagina: "Presupuestos",
      presupuestos,
      usuario,
      total,
      resultado,
      porcentaje
    });}
  };
  
  // Mostrar una presupuesto
  exports.verTodo = async (req, res, next) => {
    const usuarioO = req.user;
    const presupuesto = await Presupuesto.findOne({ _id: req.params._id});
    const usuario = await Usuario.findOne({ _id: usuarioO._id });    
    // Si no hay resultados
    if (!presupuesto) return next();
    const gastos = await Gastos.find({presupuesto: req.params._id});
  
    // Si no hay resultados
    if (!gastos) return next();
  
    res.render("presupuesto/totalPresupuesto", {
      nombrePagina: "Gastos",
      gastos,
      presupuesto
    });
    //console.log(usuario);
  };

  // Muestra el formulario para editar una presupuesto
  exports.formularioEditarPresupuesto = async (req, res, next) => {
    const usuarioO = req.user;
    
    
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });
  
    // Si no existe la presupuesto
    if (!presupuesto) return next();
     
    res.render("presupuesto/editarPresupuesto", {
      nombrePagina: 'Editar presupuesto',
      presupuesto
    });
  };
  
  // Almacenar una presupuesto editada
  exports.editarPresupuesto = async (req, res, next) => {
    const presupuestoEditado = req.body;
  
    //console.log(presupuestoEditado);
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
  
    res.redirect('/mostrarPresupuesto');
  };
  
  // Eliminar una presupuesto
  exports.eliminarPresupuesto = async (req, res) => {
    // Obtener el id de la presupuesto
    const { id } = req.params;
    const presupuesto = await Presupuesto.findByIdAndDelete(req.params._id);
    req.flash("success", ["Presupuesto eliminado correctamente"]);
    presupuesto.remove();
    res.redirect('/mostrarPresupuesto');

   };