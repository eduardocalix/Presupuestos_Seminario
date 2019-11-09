const emailConfig = require("../Config/email");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const util = require("util");

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

// Utilizar template de Handlebars
transport.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".hbs",
      partialsDir: __dirname + "/../views/emails",
      layoutsDir: __dirname + "/../views/emails",
      defaultLayout: ""
    },
    viewPath: __dirname + "/../views/emails",
    extName: ".hbs"
  })
);

exports.enviar = async opciones => {
  const opcionesEmail = {
    from: "Presupuesto <noreply@presupuesto.com>",
    to: opciones.usuario.correo,
    subject: opciones.subject,
    template: opciones.template,
    context: {
      resetUrl: opciones.resetUrl
    }
  };

  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail.call(transport, opcionesEmail);
};
