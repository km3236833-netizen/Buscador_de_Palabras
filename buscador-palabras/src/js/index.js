
import "../css/styles.css";
// Importamos el archivo CSS para aplicar los estilos visuales
// a la página web.



// const declara una variable que no puede ser reasignada.
// document representa el documento HTML.
// querySelector() busca el primer elemento que coincida
// con el selector indicado entre paréntesis.

const campoTexto = document.querySelector("#texto");
// Busca el textarea donde el usuario escribe el texto.
// El símbolo # indica que buscamos un elemento por su id.

const campoPalabra = document.querySelector("#palabra");
// Busca el input donde se escribe la palabra que se desea buscar.

const botonBuscar = document.querySelector("#buscar");
// Obtiene el botón que ejecutará la búsqueda.

const botonLimpiar = document.querySelector("#limpiar");
// Obtiene el botón que limpiará los campos y los resultados.

const alerta = document.querySelector("#alerta");
// Obtiene el elemento HTML donde aparecerán los mensajes.

const resultados = document.querySelector("#resultados");
// Obtiene la sección que contiene los resultados de la búsqueda.

const resumen = document.querySelector("#resumen");
// Obtiene el elemento que muestra un resumen de la búsqueda.

const cantidad = document.querySelector("#cantidad");
// Obtiene el elemento donde se mostrará el total de coincidencias.

const textoProcesado = document.querySelector("#textoProcesado");
// Obtiene el elemento donde se mostrará el texto con resaltados.




// const declara la función mostrarAlerta.
// Los parámetros mensaje y tipo reciben los datos que se mostrarán.
// La función flecha => permite definir una función de manera concisa.

const mostrarAlerta = (mensaje, tipo) => {

  // textContent cambia el texto del elemento HTML.
  // Es más seguro que innerHTML cuando mostramos mensajes de texto.
  alerta.textContent = mensaje;

  // className cambia las clases CSS del elemento.
  // Por ejemplo: "alert success" o "alert error".
  // Las clases determinan la apariencia de la alerta.
  alerta.className = `alert ${tipo}`;

  // hidden controla si el elemento está oculto.
  // false hace que la alerta sea visible.
  alerta.hidden = false;
};



// Esta función convierte ciertos caracteres especiales
// en entidades HTML para que se muestren como texto
// y no se interpreten como etiquetas o código HTML.

const escaparHTML = (texto) => {

  // Creamos un objeto llamado entidades.
  // Cada propiedad relaciona un carácter con su representación segura.
  const entidades = {
    "&": "&amp;",   // Representa el carácter ampersand.
    "<": "&lt;",    // Representa el símbolo menor que.
    ">": "&gt;",    // Representa el símbolo mayor que.
    '"': "&quot;",  // Representa las comillas dobles.
    "'": "&#39;"    // Representa la comilla simple.
  };

  // replace() busca los caracteres que coinciden con la expresión
  // regular y los reemplaza por sus entidades HTML.
  //
  // /[&<>"']/g significa:
  // [] = conjunto de caracteres que se buscan.
  // g  = buscar todas las apariciones, no solamente la primera.
  //
  // caracter es el parámetro que recibe cada coincidencia.
  return texto.replace(/[&<>"']/g, (caracter) => {

    // Busca en el objeto entidades la representación
    // correspondiente al carácter encontrado.
    return entidades[caracter];
  });
};



// Las expresiones regulares utilizan caracteres especiales.
// Esta función permite buscarlos como caracteres literales.

const escaparRegex = (texto) => {

  // replace() encuentra los caracteres especiales de Regex
  // y agrega una barra invertida delante de cada uno.
  //
  // /[.*+?^${}()|[\]\\]/g identifica los caracteres especiales.
  // "\\$&" significa:
  // \\ = una barra invertida en la cadena de reemplazo.
  // $& = el texto completo que coincidió con la expresión.
  //
  // Ejemplo: "." se convierte en "\.".
  // De esta forma, el punto se busca como punto literal.
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};



// Esta función obtiene el texto, valida los campos,
// encuentra las coincidencias, las resalta y cuenta
// cuántas veces aparece la palabra buscada.

const buscarPalabra = () => {

  // value obtiene el contenido escrito en el textarea.
  const texto = campoTexto.value;

  // value obtiene la palabra del input.
  // trim() elimina los espacios al principio y al final.
  const palabra = campoPalabra.value.trim();


  // trim() elimina espacios externos para comprobar
  // si el usuario escribió solamente espacios en blanco.
  // === compara estrictamente los valores.
  if (texto.trim() === "") {

    // Ocultamos los resultados anteriores.
    resultados.hidden = true;

    // Mostramos una alerta de tipo error.
    mostrarAlerta(
      "Escribe o pega un texto antes de realizar la búsqueda.",
      "error"
    );

    // Colocamos el cursor en el campo de texto.
    campoTexto.focus();

    // return termina la ejecución de la función.
    // Así se evita continuar con una entrada inválida.
    return;
  }


  // Comprobamos si el campo de búsqueda está vacío.
  if (palabra === "") {

    // Ocultamos los resultados anteriores.
    resultados.hidden = true;

    // Indicamos al usuario qué dato necesita introducir.
    mostrarAlerta(
      "Escribe la palabra o el carácter que deseas buscar.",
      "error"
    );

    // Colocamos el cursor en el input de búsqueda.
    campoPalabra.focus();

    // Detenemos la función para evitar una búsqueda vacía.
    return;
  }


  // ----------------------------------------------------
  // 5.3 CREAR LA EXPRESIÓN REGULAR
  // ----------------------------------------------------

  // escaparRegex() protege los caracteres especiales.
  // RegExp() crea una expresión regular a partir del texto.
  //
  // La bandera g significa búsqueda global:
  // permite encontrar todas las coincidencias.
  //
  // La bandera i ignora mayúsculas y minúsculas.
  // Por ejemplo, "hola", "HOLA" y "Hola" coinciden.
  const expresion = new RegExp(escaparRegex(palabra), "gi");



  // Guardará temporalmente cada coincidencia encontrada.
  let coincidencia;

  // Cuenta el número total de coincidencias.
  // Comenzamos en cero porque todavía no encontramos ninguna.
  let total = 0;

  // Guarda la posición hasta la cual ya procesamos el texto.
  let posicion = 0;

  // Acumula el texto final en formato HTML.
  // Comienza como una cadena vacía.
  let textoHTML = "";


  // ----------------------------------------------------
  // 5.5 RECORRER TODAS LAS COINCIDENCIAS
  // ----------------------------------------------------

  // exec() busca la siguiente coincidencia en el texto.
  //
  // Mientras la expresión encuentre una coincidencia,
  // el resultado será diferente de null y el ciclo continuará.
  //
  // Como la expresión tiene la bandera g, exec() avanza
  // a la siguiente coincidencia en cada iteración.
  while ((coincidencia = expresion.exec(texto)) !== null) {



    // slice() obtiene una parte del texto.
    // posicion indica dónde comienza el fragmento.
    // coincidencia.index indica dónde comienza la coincidencia.
    //
    // escaparHTML() protege el fragmento antes de mostrarlo.
    //
    // += agrega el fragmento al contenido acumulado.
    textoHTML += escaparHTML(
      texto.slice(posicion, coincidencia.index)
    );



    // coincidencia[0] contiene el texto completo encontrado.
    //
    // escaparHTML() protege la coincidencia.
    // Las etiquetas <mark> permiten resaltarla visualmente.
    //
    // Las comillas invertidas permiten utilizar una plantilla
    // de texto e insertar variables mediante ${...}.
    textoHTML += `<mark>${escaparHTML(coincidencia[0])}</mark>`;



    // coincidencia.index indica dónde comienza la coincidencia.
    // coincidencia[0].length indica cuántos caracteres contiene.
    //
    // Sumamos ambos valores para saber dónde termina.
    // La siguiente búsqueda continuará desde esa posición.
    posicion = coincidencia.index + coincidencia[0].length;

    // El operador ++ incrementa total en una unidad.
    // Cada coincidencia encontrada suma uno al contador.
    total++;
  }



  // Cuando termina el ciclo, agregamos el texto que queda
  // desde la última posición procesada hasta el final.
  //
  // Si no hubo coincidencias, se agrega todo el texto original.
  // escaparHTML() protege el contenido antes de mostrarlo.
  textoHTML += escaparHTML(texto.slice(posicion));



  // innerHTML inserta el contenido HTML generado.
  // En este caso, el texto se escapó y las etiquetas <mark>
  // se agregaron únicamente para resaltar las coincidencias.
  textoProcesado.innerHTML = textoHTML;

  // textContent muestra el total de coincidencias.
  cantidad.textContent = total;

  // Mostramos un resumen indicando qué palabra se buscó.
  resumen.textContent =
    `Búsqueda de "${palabra}" en el texto ingresado.`;

  // false hace visible la sección de resultados.
  resultados.hidden = false;




  // Si total es mayor que cero, se encontró la palabra.
  if (total > 0) {

    // Mostramos un mensaje de éxito con el total encontrado.
    // ${total} inserta el valor de la variable en el mensaje.
    mostrarAlerta(
      `¡Búsqueda completada! Se encontraron ${total} coincidencia(s).`,
      "success"
    );

  } else {

    // Si total vale cero, no se encontró ninguna coincidencia.
    // Mostramos un mensaje de error informativo.
    mostrarAlerta(
      `No se encontró "${palabra}" en el texto.`,
      "error"
    );
  }
};



 // Función flecha llamada limpiarPantalla.
// Se encarga de borrar los datos y ocultar los resultados.
// No recibe parámetros porque utiliza los elementos de la página.
const limpiarPantalla = () => {

  // Borra el contenido que el usuario escribió en el área de texto.
  campoTexto.value = "";

  // Borra la palabra o el carácter que se estaba buscando.
  campoPalabra.value = "";

  // Borra el texto procesado que se muestra después de la búsqueda.
  // Se escribe textoProcesado con P mayúscula porque JavaScript
  // distingue entre mayúsculas y minúsculas.
  textoProcesado.textContent = "";

  // Restablece el contador de coincidencias a cero.
  cantidad.textContent = "0";

  // Borra el mensaje que describe la búsqueda anterior.
  resumen.textContent = "";

  // Oculta el apartado donde se muestran los resultados.
  // La propiedad hidden en true hace que el elemento no se muestre.
  resultados.hidden = true;

  // Oculta la alerta de éxito o error.
  alerta.hidden = true;

  // Borra el texto de la alerta anterior.
  alerta.textContent = "";

  // Coloca el cursor en el área de texto para que el usuario
  // pueda comenzar a escribir nuevamente sin hacer clic en ella.
  campoTexto.focus();

// Cierra la función limpiarPantalla.
};



// addEventListener() registra un evento en un elemento.
// "click" significa que la función se ejecuta al hacer clic.
//
// Cuando se pulsa Buscar, se ejecuta buscarPalabra.
botonBuscar.addEventListener("click", buscarPalabra);

// Cuando se pulsa Limpiar, se ejecuta limpiarPantalla.
botonLimpiar.addEventListener("click", limpiarPantalla);



// Registramos el evento keydown, que ocurre cuando se presiona
// una tecla mientras el input de búsqueda tiene el foco.
//
// evento es el objeto que contiene información sobre la tecla.
campoPalabra.addEventListener("keydown", (evento) => {

  // evento.key contiene el nombre de la tecla presionada.
  // Comprobamos si es la tecla Enter.
  if (evento.key === "Enter") {

    // Ejecutamos la misma función que utiliza el botón Buscar.
    buscarPalabra();
  }
});
