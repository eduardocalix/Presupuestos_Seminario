var i = 0;
var j=0;
var txt = '¡Bienvenido(a)!'; /* texto a mostrar */
var txt2 =' Tu presupuesto al instante';
var velocidad = 300; /* La duracion en milisegundos */
var velocidad2= 600;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("bienvenido").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, velocidad);    
  }
  if (j < txt2.length) {
    document.getElementById("bienvenido2").innerHTML += txt2.charAt(j);
    j++;
    setTimeout(typeWriter, velocidad2);    
  }
}