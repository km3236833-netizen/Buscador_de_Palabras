
import "../css/styles.css";



// Área donde el usuario escribe el texto original.
const campoTexto = document.querySelector("#texto");

// Campo donde se escribe la palabra que se desea buscar.
const campoPalabra = document.querySelector("#palabra");

// Campo donde se escribe la palabra nueva para reemplazar.
const campoReemplazo = document.querySelector("#reemplazo");

// Botón para buscar palabras.
const botonBuscar = document.querySelector("#buscar");

// Botón para reemplazar palabras.
const botonReemplazar = document.querySelector("#reemplazar");

// Botón para limpiar la pantalla.
const botonLimpiar = document.querySelector("#limpiar");

// Elemento donde aparecen las alertas.
const alerta = document.querySelector("#alerta");

// Apartado donde se muestran los resultados.
const resultados = document.querySelector("#resultados");

// Elemento que muestra el resumen de la búsqueda.
const resumen = document.querySelector("#resumen");

// Elemento que muestra la cantidad de coincidencias.
const cantidad = document.querySelector("#cantidad");

// Elemento donde aparece el texto procesado.
const textoProcesado = document.querySelector("#textoProcesado");



const mostrarAlerta = (mensaje, tipo) => {

  // Coloca el mensaje dentro del elemento de alerta.
  alerta.textContent = mensaje;

  // Asigna la clase correspondiente: success o error.
  alerta.className = `alert ${tipo}`;

  // Hace visible la alerta.
  alerta.hidden = false;
};



const escaparHTML = (texto) => {

  // Convierte caracteres especiales en entidades HTML.
  // Esto ayuda a evitar que el texto del usuario se interprete
  // como etiquetas HTML al mostrar los resultados.

  const entidades = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  // Busca los caracteres especiales y los reemplaza.
  return texto.replace(/[&<>"']/g, (caracter) => {
    return entidades[caracter];
  });
};



const escaparRegex = (texto) => {

  // Escapa los caracteres especiales para que se busquen
  // literalmente y no como operadores de una expresión regular.
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};


const buscarPalabra = () => {

  // Obtenemos el texto original.
  const texto = campoTexto.value;

  // Obtenemos la palabra que se desea buscar.
  const palabra = campoPalabra.value.trim();

  // Validamos que el texto no esté vacío.
  if (texto.trim() === "") {

    // Ocultamos los resultados anteriores.
    resultados.hidden = true;

    // Mostramos un mensaje de error.
    mostrarAlerta(
      "Escribe o pega un texto antes de realizar la búsqueda.",
      "error"
    );

    // Colocamos el cursor en el área de texto.
    campoTexto.focus();

    // Detenemos la función.
    return;
  }

  // Validamos que se haya escrito una palabra.
  if (palabra === "") {

    resultados.hidden = true;

    mostrarAlerta(
      "Escribe la palabra o el carácter que deseas buscar.",
      "error"
    );

    campoPalabra.focus();
    return;
  }

  // Creamos una expresión regular.
  // g permite buscar todas las coincidencias.
  // i permite ignorar mayúsculas y minúsculas.
  const expresion = new RegExp(escaparRegex(palabra), "gi");

  // Obtenemos todas las coincidencias encontradas.
  const coincidencias = texto.match(expresion) || [];

  // Inicializamos las variables para procesar el texto.
  let coincidencia;
  let posicion = 0;
  let textoHTML = "";

  // Recorremos las coincidencias encontradas.
  while ((coincidencia = expresion.exec(texto)) !== null) {

    // Agregamos el texto anterior a la coincidencia,
    // convirtiéndolo en texto HTML seguro.
    textoHTML += escaparHTML(
      texto.slice(posicion, coincidencia.index)
    );

    // Agregamos la coincidencia resaltada.
    textoHTML += `<mark>${escaparHTML(coincidencia[0])}</mark>`;

    // Actualizamos la posición después de la coincidencia.
    posicion = coincidencia.index + coincidencia[0].length;
  }

  // Agregamos el texto restante después de la última coincidencia.
  textoHTML += escaparHTML(texto.slice(posicion));

  // Mostramos el texto con las coincidencias resaltadas.
  textoProcesado.innerHTML = textoHTML;

  // Mostramos el total de coincidencias.
  cantidad.textContent = coincidencias.length;

  // Mostramos el resumen de la búsqueda.
  resumen.textContent = `Búsqueda de "${palabra}" en el texto ingresado.`;

  // Hacemos visible el apartado de resultados.
  resultados.hidden = false;

  // Mostramos una alerta según el resultado.
  if (coincidencias.length > 0) {

    mostrarAlerta(
      `¡Búsqueda completada! Se encontraron ${coincidencias.length} coincidencia(s).`,
      "success"
    );

  } else {

    mostrarAlerta(
      `No se encontró "${palabra}" en el texto.`,
      "error"
    );
  }
};



const reemplazarPalabra = () => {

  // Obtenemos el texto que se va a modificar.
  const texto = campoTexto.value;

  // Obtenemos la palabra original que se desea buscar.
  const palabra = campoPalabra.value.trim();

  // Obtenemos la palabra nueva.
  const nuevaPalabra = campoReemplazo.value;

  // Validamos que exista texto.
  if (texto.trim() === "") {

    mostrarAlerta(
      "Escribe un texto antes de reemplazar.",
      "error"
    );

    campoTexto.focus();
    return;
  }

  // Validamos que exista una palabra original.
  if (palabra === "") {

    mostrarAlerta(
      "Escribe la palabra que deseas reemplazar.",
      "error"
    );

    campoPalabra.focus();
    return;
  }

  // Validamos que exista una palabra nueva.
  if (nuevaPalabra.trim() === "") {

    mostrarAlerta(
      "Escribe la nueva palabra que deseas utilizar.",
      "error"
    );

    campoReemplazo.focus();
    return;
  }

  // Creamos una expresión regular para buscar todas
  // las coincidencias sin distinguir mayúsculas y minúsculas.
  const expresion = new RegExp(escaparRegex(palabra), "gi");

  // Contamos las coincidencias antes de realizar el reemplazo.
  const coincidencias = texto.match(expresion);

  // Si no se encontró la palabra, mostramos una alerta.
  if (coincidencias === null) {

    mostrarAlerta(
      `No se encontró "${palabra}" para reemplazar.`,
      "error"
    );

    return;
  }

  // Reemplazamos todas las coincidencias por la palabra nueva.
  // Esta instrucción se ejecuta solamente al pulsar el botón.
  const textoNuevo = texto.replace(expresion, () => nuevaPalabra);

  // Actualizamos el área de texto con el texto modificado.
  campoTexto.value = textoNuevo;

  // Ocultamos los resultados de la búsqueda anterior.
  resultados.hidden = true;

  // Informamos cuántas coincidencias se reemplazaron.
  mostrarAlerta(
    `Se reemplazaron ${coincidencias.length} coincidencia(s) correctamente.`,
    "success"
  );
};



const limpiarPantalla = () => {

  // Borra el texto original.
  campoTexto.value = "";

  // Borra la palabra que se estaba buscando.
  campoPalabra.value = "";

  // Borra la palabra de reemplazo.
  campoReemplazo.value = "";

  // Borra el texto procesado.
  textoProcesado.textContent = "";

  // Reinicia el contador.
  cantidad.textContent = "0";

  // Borra el resumen de búsqueda.
  resumen.textContent = "";

  // Oculta los resultados.
  resultados.hidden = true;

  // Oculta la alerta.
  alerta.hidden = true;

  // Borra el mensaje de la alerta.
  alerta.textContent = "";

  // Coloca el cursor en el área de texto.
  campoTexto.focus();
};



// Ejecuta la búsqueda cuando se pulsa Buscar.
botonBuscar.addEventListener("click", buscarPalabra);

// Ejecuta el reemplazo únicamente al pulsar Reemplazar.
botonReemplazar.addEventListener("click", reemplazarPalabra);

// Limpia los campos cuando se pulsa Limpiar pantalla.
botonLimpiar.addEventListener("click", limpiarPantalla);



// Permite ejecutar la búsqueda con la tecla Enter
// cuando el cursor está en el campo de búsqueda.
campoPalabra.addEventListener("keydown", (evento) => {

  if (evento.key === "Enter") {
    buscarPalabra();
  }
});
