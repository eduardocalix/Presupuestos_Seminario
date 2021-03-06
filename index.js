const mongoose = require("mongoose");
require("./Config/db");
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./Routes/index");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("./Config/passport");



// Habilitando el archivo de variables de entorno
require("dotenv").config({ path: "variables.env" });

const app = express();

// Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar Handlebars como Template Engine
// Habilité la extensión .hbs para evitar escribir toda la palabra
app.engine(
  ".hbs",
  exphbs({
      //El main es la vista principal de todo el proyecto
   // defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    defaultLayout: "layout"
   // helpers: require("./helpers/handlebars")
  })
);
//Todas las vistas las reconocerá como .hbs
app.set("view engine", ".hbs");

// Definir ruta para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Creación de la sesión y de la cookie
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
); 

//Implementación de passport
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());
//Mensajes
app.use(flash());
//variables GLobales
app.use((req, res, next) => {
  //Estos son los mensajes que hemos creado para las operaciones
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.errors = req.flash('errors');
  app.locals.user = req.user;
  next();
});


//rutas
//que son las carpetas de donde renderizamos nuestras vistas
app.use("/", router());
//app.use(require('./Routes/index'));

//app.use(require('./Routes/presupuesto.js'));


//iniciar el servidor
app.listen(process.env.PORT);
