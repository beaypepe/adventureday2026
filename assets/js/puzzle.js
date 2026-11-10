/* ==========================================================================
   Puzzle deslizante — Adventure Day 2026 (carpeta 7k2m9p)
   --------------------------------------------------------------------------
   Reglas:
   • La imagen se reparte en una cuadrícula 3x3, pero faltan dos cosas: la pieza
     de la esquina superior derecha (no está en el dibujo) y una casilla vacía,
     el hueco, que es lo que deja moverse a las demás.
   • Se toca una ficha pegada al hueco y se desliza hacia él.
   • Se gana cuando las ocho fichas están en su sitio, es decir, cuando el hueco
     ha llegado a la esquina superior derecha.
   ========================================================================== */
(function () {
  "use strict";

  /* Respuesta de esta etapa, guardada en clave (ver AD.abrir en common.js).
     No se escribe en claro en el repositorio para que no se encuentre de un vistazo. */
  var RESPUESTA = window.AD.abrir("RwJXF1gDZVZTWzRXG1weTl0=", "7k2m9p:26");

  var LADO = 3;
  var TOTAL = LADO * LADO;

  /* Casilla vacía: no lleva trozo de imagen. */
  var HUECO = -1;

  /* Pieza que se ha quitado del dibujo y casilla en la que queda el hueco cuando
     el puzzle está resuelto: las dos son la esquina superior derecha (trozo 2),
     que en la imagen es cielo liso. */
  var TROZO_QUITADO = 2;
  var CELDA_HUECO = 2;

  /* Movimientos al azar con los que se mezcla el tablero cada partida. */
  var MEZCLA = 18;

  /* Colores de reserva por si puzzle.png no carga (cada ficha muestra su número). */
  var COLORES = ["#ffd9c7", "#ffe9b8", "#d9f2e6", "#cfe6ff",
                 "#f3dcff", "#fde2e4", "#e3e0ff", "#e8f3c4"];

  var raiz = document.getElementById("puzzle");
  var textoEstado = document.getElementById("estado");
  var botonMezclar = document.getElementById("mezclar");
  var cajaRespuesta = document.getElementById("respuesta-final");

  if (!raiz) {
    return;
  }

  /* tablero[casilla] = trozo de imagen que la ocupa (o HUECO) */
  var tablero = [];
  var fichas = [];       // fichas[trozo] = <button>
  var colorSiguiente = 0;
  var terminado = false;
  var movimientos = 0;

  /* Posición resuelta: cada casilla con el trozo que le toca, y el hueco en la
     esquina superior derecha. */
  var RESUELTO = [];
  var i;

  for (i = 0; i < TOTAL; i++) {
    RESUELTO.push(i === CELDA_HUECO ? HUECO : i);
  }

  /* ---------- Tablero ---------- */

  /* Número que se ve en la ficha cuando no hay imagen: 1 a 8 en el orden de
     lectura de la posición resuelta. */
  function numeroDe(trozo) {
    return trozo > TROZO_QUITADO ? trozo : trozo + 1;
  }

  function vecinas(casilla) {
    var x = casilla % LADO;
    var y = Math.floor(casilla / LADO);
    var lista = [];

    if (x > 0) { lista.push(casilla - 1); }
    if (x < LADO - 1) { lista.push(casilla + 1); }
    if (y > 0) { lista.push(casilla - LADO); }
    if (y < LADO - 1) { lista.push(casilla + LADO); }

    return lista;
  }

  function crearFichas() {
    for (var trozo = 0; trozo < TOTAL; trozo++) {
      if (trozo === TROZO_QUITADO) {
        continue;
      }

      var boton = document.createElement("button");
      boton.type = "button";
      boton.className = "puzzle__ficha";
      boton.dataset.trozo = String(trozo);
      boton.style.backgroundColor = COLORES[colorSiguiente % COLORES.length];
      colorSiguiente = colorSiguiente + 1;

      // Cada ficha enseña su tercio del dibujo: se pinta al triple de tamaño y
      // se desplaza a la posición que le toca.
      boton.style.backgroundPosition =
        (trozo % LADO) * (100 / (LADO - 1)) + "% " +
        Math.floor(trozo / LADO) * (100 / (LADO - 1)) + "%";

      var numero = document.createElement("span");
      numero.className = "puzzle__numero";
      numero.textContent = String(numeroDe(trozo));
      boton.appendChild(numero);

      boton.addEventListener("click", function (evento) {
        mover(parseInt(evento.currentTarget.dataset.trozo, 10));
      });

      raiz.appendChild(boton);
      fichas[trozo] = boton;
    }
  }

  function colocarFicha(trozo, casilla) {
    var ficha = fichas[trozo];
    var x = casilla % LADO;
    var y = Math.floor(casilla / LADO);

    ficha.style.transform = "translate(" + (x * 100) + "%, " + (y * 100) + "%)";
    ficha.setAttribute("aria-label",
      "Ficha " + numeroDe(trozo) + ", fila " + (y + 1) + ", columna " + (x + 1));
  }

  function pintar() {
    for (var trozo = 0; trozo < TOTAL; trozo++) {
      if (trozo !== TROZO_QUITADO) {
        colocarFicha(trozo, tablero.indexOf(trozo));
      }
    }
  }

  /* ---------- Imagen ---------- */

  function usarImagen(url) {
    raiz.classList.add("puzzle--con-imagen");

    for (var trozo = 0; trozo < TOTAL; trozo++) {
      if (trozo !== TROZO_QUITADO) {
        fichas[trozo].style.backgroundImage = "url(\"" + url + "\")";
      }
    }
  }

  function cargarImagen() {
    var url = raiz.getAttribute("data-imagen");

    if (!url) {
      return;
    }

    var prueba = new Image();

    prueba.addEventListener("load", function () {
      usarImagen(url);
    });
    prueba.src = url;
  }

  /* ---------- Partida ---------- */

  function estado(texto) {
    if (textoEstado) {
      textoEstado.textContent = texto;
    }
  }

  function deslizar(origen, destino) {
    tablero[destino] = tablero[origen];
    tablero[origen] = HUECO;
  }

  /* Mezclado honesto: se parte de la posición resuelta y se dan 18 movimientos
     legales al azar, sin volver el hueco por donde acaba de venir. Así el
     tablero siempre tiene solución y se resuelve en 18 movimientos o menos. */
  function mezclarTablero() {
    tablero = RESUELTO.slice();

    var prohibida = -1; // casilla a la que no vuelve el hueco en el paso siguiente
    var paso;

    for (paso = 0; paso < MEZCLA; paso++) {
      var hueco = tablero.indexOf(HUECO);
      var opciones = vecinas(hueco).filter(function (casilla) {
        return casilla !== prohibida;
      });
      var elegida = opciones[Math.floor(Math.random() * opciones.length)];

      deslizar(elegida, hueco);
      prohibida = hueco;
    }

    // Si la mezcla ha devuelto el puzzle a su posición resuelta, se repite
    if (tablero.join() === RESUELTO.join()) {
      mezclarTablero();
    }
  }

  function avisar(trozo) {
    var ficha = fichas[trozo];

    ficha.classList.remove("puzzle__ficha--no");
    void ficha.offsetWidth; // obliga al navegador a reiniciar la animación
    ficha.classList.add("puzzle__ficha--no");

    window.setTimeout(function () {
      ficha.classList.remove("puzzle__ficha--no");
    }, 400);

    estado("Esa ficha no toca el hueco: elige una de las que lo rodean.");

    if (navigator.vibrate) {
      navigator.vibrate(60);
    }
  }

  function ganar() {
    terminado = true;
    raiz.classList.add("puzzle--resuelto");
    estado("¡Puzzle resuelto!");

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

  function mover(trozo) {
    if (terminado) {
      return;
    }

    var origen = tablero.indexOf(trozo);
    var destino = tablero.indexOf(HUECO);

    if (vecinas(origen).indexOf(destino) === -1) {
      avisar(trozo);
      return;
    }

    deslizar(origen, destino);
    colocarFicha(trozo, destino);

    movimientos = movimientos + 1;
    estado("Movimientos: " + movimientos);

    if (tablero.join() === RESUELTO.join()) {
      ganar();
    }
  }

  function empezar() {
    terminado = false;
    raiz.classList.remove("puzzle--resuelto");
    raiz.classList.remove("puzzle--sin-animacion");

    if (cajaRespuesta) {
      cajaRespuesta.hidden = true;
    }

    mezclarTablero();
    pintar();

    movimientos = 0;
    estado("Movimientos: 0");
  }

  if (botonMezclar) {
    botonMezclar.addEventListener("click", empezar);
  }

  /* ---------- Arranque ---------- */

  crearFichas();
  cargarImagen();

  // La primera colocación no se anima: las fichas aparecen ya en su sitio
  raiz.classList.add("puzzle--sin-animacion");
  mezclarTablero();
  pintar();

  window.setTimeout(function () {
    raiz.classList.remove("puzzle--sin-animacion");
  }, 80);
})();
