/* ==========================================================================
   Sopa de letras — Adventure Day 2026 (carpeta m8d6fc)
   --------------------------------------------------------------------------
   Reglas:
   • Cinco palabras escondidas en una cuadrícula de 10x10, siempre escritas
     al derecho: horizontales de izquierda a derecha, verticales de arriba
     abajo y diagonales de izquierda a derecha (hacia abajo).
   • Se marcan deslizando el dedo de la primera letra a la última, o tocando
     una y luego la otra (cómodo cuando las casillas son pequeñas).
   • Las palabras NO se listan en la página: solo se dice cuántas hay y de qué
     tema, para que haya que buscarlas.
   ========================================================================== */
(function () {
  "use strict";

  /* Respuesta de esta etapa, guardada en clave (ver AD.abrir en common.js).
     No se escribe en claro en el repositorio para que no se encuentre de un vistazo. */
  var RESPUESTA = window.AD.abrir("AV0QRAcQZVdYMlQFaQsGSVM=", "m8d6fc:26");

  var PALABRAS = ["GEOCACHING", "ADVENTURE", "EVENTO", "WAYPOINT", "BONUS"];

  var LADO = 10;   // 10x10: la palabra más larga tiene 10 letras
  var RELLENO = "AAAAAAAAEEEEEEIIIIIOOOOUUBCDFGHLMNPRSTVZ";

  /* Solo tres direcciones, todas "al derecho": en horizontal de izquierda a
     derecha, en vertical de arriba abajo y en diagonal de izquierda a derecha
     (hacia abajo). Así nunca hay que leer al revés. */
  var DIRECCIONES = [
    [0, 1],    // →
    [1, 0],    // ↓
    [1, 1]     // ↘
  ];

  var contenedor = document.getElementById("sopa");
  var textoEstado = document.getElementById("estado");
  var botonOtra = document.getElementById("otra");
  var cajaRespuesta = document.getElementById("respuesta-final");

  if (!contenedor) {
    return;
  }

  var rejilla = [];          // rejilla[fila][columna] = letra
  var celdas = [];           // los 100 botones, en orden
  var colocadas = [];        // { palabra, celdas } de la sopa actual
  var encontradas = [];      // palabras ya halladas
  var seleccion = [];        // celdas resaltadas en este momento
  var armada = null;         // celda elegida con un toque, a la espera del segundo
  var presionando = false;
  var celdaInicio = null;
  var terminado = false;
  var temporizadorFallo = 0;

  /* ---------- Generación de la sopa ---------- */

  function filaDe(indice) {
    return Math.floor(indice / LADO);
  }

  function colDe(indice) {
    return indice % LADO;
  }

  function letraAlAzar() {
    return RELLENO.charAt(Math.floor(Math.random() * RELLENO.length));
  }

  function crearRejilla() {
    var filas = [];

    for (var f = 0; f < LADO; f++) {
      var fila = [];

      for (var c = 0; c < LADO; c++) {
        fila.push("");
      }
      filas.push(fila);
    }

    return filas;
  }

  /* Todos los huecos donde cabe la palabra en una dirección, apuntando cuántas
     letras cruzarían con palabras ya puestas (para poder preferir los cruces). */
  function huecosDe(palabra, dir) {
    var huecos = [];

    for (var fila = 0; fila < LADO; fila++) {
      for (var col = 0; col < LADO; col++) {
        var fFin = fila + dir[0] * (palabra.length - 1);
        var cFin = col + dir[1] * (palabra.length - 1);

        if (fFin < 0 || fFin >= LADO || cFin < 0 || cFin >= LADO) {
          continue;
        }

        var cabe = true;
        var cruces = 0;

        for (var i = 0; i < palabra.length && cabe; i++) {
          var actual = rejilla[fila + dir[0] * i][col + dir[1] * i];

          if (actual) {
            if (actual !== palabra.charAt(i)) {
              cabe = false;
            } else {
              cruces++;
            }
          }
        }

        if (cabe) {
          huecos.push({ fila: fila, col: col, cruces: cruces });
        }
      }
    }

    return huecos;
  }

  function unoAlAzar(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  /* Coloca la palabra: primero en la dirección que le toca y, si ahí no hay
     hueco, en cualquiera de las otras. Cuando puede, la cruza con una palabra
     ya puesta. Devuelve sus celdas o null si no cabe en ningún sitio. */
  function colocar(palabra, direccion) {
    var orden = [direccion];
    var d;

    for (d = 0; d < DIRECCIONES.length; d++) {
      if (DIRECCIONES[d] !== direccion) {
        orden.push(DIRECCIONES[d]);
      }
    }

    var huecos = [];

    for (d = 0; d < orden.length && !huecos.length; d++) {
      huecos = huecosDe(palabra, orden[d]);
      direccion = orden[d];
    }

    if (!huecos.length) {
      return null;
    }

    var conCruce = [];
    var i;

    for (i = 0; i < huecos.length; i++) {
      if (huecos[i].cruces > 0) {
        conCruce.push(huecos[i]);
      }
    }

    var elegido = unoAlAzar(conCruce.length ? conCruce : huecos);
    var usadas = [];

    for (i = 0; i < palabra.length; i++) {
      var f = elegido.fila + direccion[0] * i;
      var c = elegido.col + direccion[1] * i;

      rejilla[f][c] = palabra.charAt(i);
      usadas.push(f * LADO + c);
    }

    return { palabra: palabra, celdas: usadas };
  }

  function rellenar() {
    for (var f = 0; f < LADO; f++) {
      for (var c = 0; c < LADO; c++) {
        if (!rejilla[f][c]) {
          rejilla[f][c] = letraAlAzar();
        }
      }
    }
  }

  function barajar(lista) {
    for (var i = lista.length - 1; i > 0; i--) {
      var azar = Math.floor(Math.random() * (i + 1));
      var cambio = lista[i];

      lista[i] = lista[azar];
      lista[azar] = cambio;
    }

    return lista;
  }

  function generar() {
    var orden = PALABRAS.slice().sort(function (a, b) {
      return b.length - a.length; // primero las palabras largas, caben mejor
    });

    for (var vuelta = 0; vuelta < 40; vuelta++) {
      rejilla = crearRejilla();
      colocadas = [];

      // Reparto equilibrado: dos palabras en horizontal, dos en vertical y una
      // en diagonal. La diagonal se coloca la primera (así siempre encuentra
      // sitio) y se sortea entre las palabras cortas, porque en la más larga
      // quedaría entera sobre la diagonal principal y se vería de un vistazo.
      var indiceDiagonal = 2 + Math.floor(Math.random() * (orden.length - 2));
      var conDiagonal = [orden[indiceDiagonal]];
      var i;

      for (i = 0; i < orden.length; i++) {
        if (i !== indiceDiagonal) {
          conDiagonal.push(orden[i]);
        }
      }

      var reparto = [DIRECCIONES[2]].concat(
        barajar([DIRECCIONES[0], DIRECCIONES[0], DIRECCIONES[1], DIRECCIONES[1]])
      );

      orden = conDiagonal;

      var completa = true;

      for (i = 0; i < orden.length; i++) {
        var puesta = colocar(orden[i], reparto[i]);

        if (!puesta) {
          completa = false;
          break;
        }
        colocadas.push(puesta);
      }

      if (completa) {
        rellenar();
        return;
      }
    }

    // Por si acaso: nunca dejar casillas vacías.
    rellenar();
  }

  function pintar() {
    contenedor.textContent = "";
    celdas = [];

    for (var f = 0; f < LADO; f++) {
      for (var c = 0; c < LADO; c++) {
        var boton = document.createElement("button");
        boton.type = "button";
        boton.className = "sopa__celda";
        boton.dataset.i = String(f * LADO + c);
        boton.textContent = rejilla[f][c];
        boton.setAttribute("aria-label",
          "Fila " + (f + 1) + ", columna " + (c + 1) + ": " + rejilla[f][c]);
        contenedor.appendChild(boton);
        celdas.push(boton);
      }
    }
  }

  /* ---------- Selección ---------- */

  /* Celdas en línea recta (horizontal, vertical o diagonal) entre dos casillas.
     Devuelve null si no están alineadas. */
  function lineaEntre(a, b) {
    var fa = filaDe(a);
    var ca = colDe(a);
    var df = filaDe(b) - fa;
    var dc = colDe(b) - ca;

    if (df !== 0 && dc !== 0 && Math.abs(df) !== Math.abs(dc)) {
      return null;
    }

    var pasos = Math.max(Math.abs(df), Math.abs(dc));

    if (pasos === 0) {
      return [a];
    }

    var pasoF = df === 0 ? 0 : (df > 0 ? 1 : -1);
    var pasoC = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
    var lista = [];

    for (var k = 0; k <= pasos; k++) {
      lista.push((fa + pasoF * k) * LADO + (ca + pasoC * k));
    }

    return lista;
  }

  function marcar(lista) {
    var i;

    for (i = 0; i < seleccion.length; i++) {
      celdas[seleccion[i]].classList.remove("sopa__celda--marcada");
    }

    seleccion = lista || [];

    for (i = 0; i < seleccion.length; i++) {
      celdas[seleccion[i]].classList.add("sopa__celda--marcada");
    }
  }

  function textoDe(lista) {
    var texto = "";

    for (var i = 0; i < lista.length; i++) {
      texto += rejilla[filaDe(lista[i])][colDe(lista[i])];
    }

    return texto;
  }

  function palabraDe(texto) {
    var alReves = texto.split("").reverse().join("");
    var i;

    for (i = 0; i < PALABRAS.length; i++) {
      if (PALABRAS[i] === texto) {
        return PALABRAS[i];
      }
    }

    for (i = 0; i < PALABRAS.length; i++) {
      if (PALABRAS[i] === alReves) {
        return PALABRAS[i];
      }
    }

    return null;
  }

  function indiceDe(elemento) {
    var actual = elemento;

    while (actual && actual !== contenedor) {
      if (actual.classList && actual.classList.contains("sopa__celda")) {
        return Number(actual.dataset.i);
      }
      actual = actual.parentNode;
    }

    return null;
  }

  /* ---------- Partida ---------- */

  function estado(texto) {
    if (textoEstado) {
      textoEstado.textContent = texto;
    }
  }

  function marcarFallo() {
    var i;

    for (i = 0; i < seleccion.length; i++) {
      celdas[seleccion[i]].classList.add("sopa__celda--fallo");
    }

    window.clearTimeout(temporizadorFallo);
    temporizadorFallo = window.setTimeout(function () {
      var rojas = contenedor.querySelectorAll(".sopa__celda--fallo");

      for (var j = 0; j < rojas.length; j++) {
        rojas[j].classList.remove("sopa__celda--fallo");
      }
    }, 500);

    if (navigator.vibrate) {
      navigator.vibrate(80);
    }
  }

  function ganar() {
    terminado = true;
    contenedor.classList.add("sopa--completa");
    estado("¡Sopa resuelta! Las cinco palabras estaban escondidas ahí.");

    if (cajaRespuesta) {
      window.AD.escribirRespuesta(cajaRespuesta.querySelector("[data-respuesta]"), RESPUESTA);
      cajaRespuesta.hidden = false;
    }

    if (navigator.vibrate) {
      navigator.vibrate([60, 60, 90]);
    }

    window.setTimeout(function () {
      if (window.AD && typeof window.AD.mostrarRespuesta === "function") {
        window.AD.mostrarRespuesta(RESPUESTA);
      }
    }, 400);
  }

  function comprobar() {
    var texto = textoDe(seleccion);
    var palabra = texto.length > 1 ? palabraDe(texto) : null;
    var i;

    if (!palabra) {
      marcarFallo();
      marcar([]);
      armada = null;
      estado("Esa no es una de las palabras.");
      return;
    }

    if (encontradas.indexOf(palabra) !== -1) {
      marcar([]);
      armada = null;
      estado("«" + palabra + "» ya estaba. Palabras encontradas: " +
        encontradas.length + " de " + PALABRAS.length);
      return;
    }

    encontradas.push(palabra);

    for (i = 0; i < seleccion.length; i++) {
      celdas[seleccion[i]].classList.add("sopa__celda--hallada");
    }

    marcar([]);
    armada = null;

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    estado("¡" + palabra + "! Palabras encontradas: " +
      encontradas.length + " de " + PALABRAS.length);

    if (encontradas.length === PALABRAS.length) {
      ganar();
    }
  }

  /* Un toque: arma la casilla. Otro toque en línea recta con ella: marca la
     palabra (modo dos toques). */
  function elegir(celda) {
    if (armada !== null && armada !== celda) {
      var camino = lineaEntre(armada, celda);

      if (camino && camino.length > 1) {
        marcar(camino);
        presionando = false;   // el pointerup que venga no debe repetir esto
        comprobar();
        return;
      }
    }

    armada = celda;
    marcar([celda]);
  }

  contenedor.addEventListener("pointerdown", function (evento) {
    var celda = indiceDe(evento.target);

    if (celda === null || terminado) {
      return;
    }

    evento.preventDefault();
    presionando = true;
    celdaInicio = celda;
    elegir(celda);
  });

  contenedor.addEventListener("pointermove", function (evento) {
    if (!presionando || celdaInicio === null) {
      return;
    }

    // El dedo puede estar sobre cualquier casilla: se mira qué hay debajo
    var bajo = document.elementFromPoint(evento.clientX, evento.clientY);
    var celda = indiceDe(bajo);

    if (celda === null) {
      return;
    }

    var camino = lineaEntre(celdaInicio, celda);

    if (camino) {
      marcar(camino);
    }
  });

  function soltar() {
    if (!presionando) {
      return;
    }

    presionando = false;
    celdaInicio = null;

    if (seleccion.length > 1) {
      comprobar();
    }
  }

  contenedor.addEventListener("pointerup", soltar);
  contenedor.addEventListener("pointercancel", soltar);
  document.addEventListener("pointerup", soltar);

  /* Teclado: se elige la casilla con Enter o la barra espaciadora (los clics
     con ratón o dedo ya los llevan los eventos pointer). */
  contenedor.addEventListener("click", function (evento) {
    if (evento.detail !== 0 || terminado) {
      return;
    }

    var celda = indiceDe(evento.target);

    if (celda !== null) {
      elegir(celda);
    }
  });

  function empezar() {
    terminado = false;
    presionando = false;
    celdaInicio = null;
    armada = null;
    seleccion = [];
    encontradas = [];

    contenedor.classList.remove("sopa--completa");

    if (cajaRespuesta) {
      cajaRespuesta.hidden = true;
    }

    generar();
    pintar();

    estado("Palabras encontradas: 0 de " + PALABRAS.length);
  }

  if (botonOtra) {
    botonOtra.addEventListener("click", empezar);
  }

  /* ---------- Arranque ---------- */

  empezar();
})();
