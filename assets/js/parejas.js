/* ==========================================================================
   Juego de parejas — Adventure Day 2026 (carpeta 3n9w2q)
   --------------------------------------------------------------------------
   Reglas:
   • 20 cartas (4 columnas × 5 filas) boca abajo y barajadas con Fisher-Yates:
     diez parejas, cada una repetida dos veces.
   • Al tocar una carta se da la vuelta; solo pueden estar dos a la vista. Si
     coinciden se quedan boca arriba; si no, se tapan otra vez a los 800 ms.
   • Se gana al encontrar las diez parejas.
   • Sin imágenes (assets/img/cards/) cada carta enseña su emoji de reserva, así
     que el juego funciona desde el primer día.
   ========================================================================== */
(function () {
  "use strict";

  /* Respuesta de esta etapa, guardada en clave (ver AD.abrir en common.js).
     No se escribe en claro en el repositorio para que no se encuentre de un vistazo. */
  var RESPUESTA = window.AD.abrir("XgtUGEAYW21RVgFaFlEZX0A=", "3n9w2q:26");

  var PAREJAS = 10;
  var CARTAS = PAREJAS * 2;   // 20 cartas en el tablero
  var ESPERA = 800;           // ms que se quedan a la vista las dos cartas falladas

  /* Reserva visual mientras no existan las imágenes de assets/img/cards/ */
  var EMOJIS = ["🎈", "🎪", "🎯", "🎲", "🧭", "🗺️", "🔍", "📌", "🏆", "🎟️"];
  var NOMBRES = ["globo", "carpa", "diana", "dado", "brújula", "mapa",
                 "lupa", "chincheta", "trofeo", "entrada"];
  var COLORES = ["#ffd9c7", "#ffeab3", "#d5f2df", "#cfe6ff", "#f4dcff",
                 "#fde2e4", "#e2e0ff", "#eaf5c6", "#ffe1f0", "#d8f1f7"];

  var raiz = document.getElementById("cartas");
  var textoEstado = document.getElementById("estado");
  var botonBarajar = document.getElementById("barajar");
  var cajaRespuesta = document.getElementById("respuesta-final");

  if (!raiz) {
    return;
  }

  var botones = [];            // las 20 cartas del tablero
  var urls = {};               // 1..10 -> URL de la imagen de esa pareja
  var disponible = {};         // 1..10 -> true si la imagen existe
  var voltadas = [];           // cartas dadas la vuelta en este intento
  var encontradas = 0;
  var bloqueado = false;
  var terminado = false;

  /* ---------- Imágenes (o su ausencia) ---------- */

  /* Las imágenes se declaran en el HTML (ocultas) para que el navegador las
     tenga listas y para que tools/bump-versions.sh les actualice el ?v=. Aquí
     se comprueba si cada una ha cargado de verdad: si no, queda el emoji. */
  function vigilar(img, alEstar, alFallar) {
    if (!img) {
      return;
    }

    if (img.complete) {
      if (img.naturalWidth > 0) {
        alEstar();
      } else {
        alFallar();
      }
      return;
    }

    img.addEventListener("load", alEstar);
    img.addEventListener("error", alFallar);
  }

  function prepararImagenes() {
    var reverso = document.getElementById("img-reverso");

    vigilar(reverso, function () {
      raiz.style.setProperty("--reverso", "url(\"" + reverso.src + "\")");
      raiz.classList.add("cartas--con-reverso");
    }, function () {});

    for (var pareja = 1; pareja <= PAREJAS; pareja++) {
      (function (numero) {
        var img = document.getElementById("img-carta-" + numero);

        vigilar(img, function () {
          urls[numero] = img.src;
          disponible[numero] = true;
          pintarCaras();
        }, function () {
          disponible[numero] = false;
        });
      })(pareja);
    }
  }

  /* ---------- Tablero ---------- */

  function crearCartas() {
    for (var i = 0; i < CARTAS; i++) {
      var boton = document.createElement("button");
      boton.type = "button";
      boton.className = "carta";
      boton.setAttribute("aria-label", "Carta boca abajo");

      var interior = document.createElement("span");
      interior.className = "carta__interior";

      var detras = document.createElement("span");
      detras.className = "carta__cara carta__cara--detras";

      var delante = document.createElement("span");
      delante.className = "carta__cara carta__cara--delante";

      var simbolo = document.createElement("span");
      simbolo.className = "carta__simbolo";

      // Número de la pareja: se ve pequeño en la esquina. Sirve de reserva si
      // el móvil no dibuja el emoji y ayuda a quien no distingue bien los colores.
      var numero = document.createElement("span");
      numero.className = "carta__numero";

      delante.appendChild(simbolo);
      delante.appendChild(numero);
      interior.appendChild(detras);
      interior.appendChild(delante);
      boton.appendChild(interior);
      boton.addEventListener("click", alTocarCarta);

      raiz.appendChild(boton);
      botones.push(boton);
    }
  }

  /* Pinta la cara de una carta según la pareja que le haya tocado */
  function pintarCara(boton) {
    var pareja = Number(boton.dataset.pareja);
    var delante = boton.querySelector(".carta__cara--delante");
    var simbolo = boton.querySelector(".carta__simbolo");

    if (!pareja || !delante) {
      return;
    }

    simbolo.textContent = EMOJIS[pareja - 1];
    delante.querySelector(".carta__numero").textContent = String(pareja);
    delante.style.backgroundColor = COLORES[pareja - 1];

    if (disponible[pareja]) {
      delante.style.backgroundImage = "url(\"" + urls[pareja] + "\")";
      boton.classList.add("carta--con-imagen");
    } else {
      delante.style.backgroundImage = "";
      boton.classList.remove("carta--con-imagen");
    }
  }

  function pintarCaras() {
    for (var i = 0; i < botones.length; i++) {
      pintarCara(botones[i]);
    }
  }

  /* ---------- Partida ---------- */

  function estado(texto) {
    if (textoEstado) {
      textoEstado.textContent = texto;
    }
  }

  function mazoBarajado() {
    var mazo = [];
    var i;

    for (i = 0; i < PAREJAS; i++) {
      mazo.push(i + 1);
      mazo.push(i + 1);
    }

    // Fisher-Yates
    for (i = mazo.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var cambio = mazo[i];
      mazo[i] = mazo[j];
      mazo[j] = cambio;
    }

    return mazo;
  }

  function voltear(boton, bocaArriba) {
    var pareja = Number(boton.dataset.pareja);

    boton.classList.toggle("carta--volteada", bocaArriba);
    boton.setAttribute("aria-label", bocaArriba
      ? "Carta " + NOMBRES[pareja - 1]
      : "Carta boca abajo");
  }

  function emparejar(a, b) {
    a.classList.add("carta--emparejada");
    b.classList.add("carta--emparejada");
    a.disabled = true;
    b.disabled = true;
    a.setAttribute("aria-label", a.getAttribute("aria-label") + ", emparejada");
    b.setAttribute("aria-label", b.getAttribute("aria-label") + ", emparejada");

    // Un instante después la pareja desaparece (el hueco se queda vacío, sin
    // mover las demás cartas), para que el tablero se vea cada vez más limpio.
    window.setTimeout(function () {
      a.classList.add("carta--fuera");
      b.classList.add("carta--fuera");
    }, 450);
  }

  function ganar() {
    terminado = true;
    raiz.classList.add("cartas--resueltas");
    estado("¡Parejas encontradas: las diez!");

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
    var a = voltadas[0];
    var b = voltadas[1];

    if (a.dataset.pareja === b.dataset.pareja) {
      emparejar(a, b);
      encontradas = encontradas + 1;
      voltadas = [];
      estado("Parejas: " + encontradas + " de " + PAREJAS);

      if (navigator.vibrate) {
        navigator.vibrate(30);
      }

      if (encontradas === PAREJAS) {
        ganar();
      }
      return;
    }

    // No coinciden: se quedan a la vista un momento y se vuelven a tapar
    bloqueado = true;
    estado("No son iguales: se vuelven a tapar.");

    window.setTimeout(function () {
      voltear(a, false);
      voltear(b, false);
      voltadas = [];
      bloqueado = false;
      estado("Parejas: " + encontradas + " de " + PAREJAS);
    }, ESPERA);
  }

  function alTocarCarta(evento) {
    var boton = evento.currentTarget;

    if (bloqueado || terminado || boton.disabled) {
      return;
    }

    if (boton.classList.contains("carta--volteada")) {
      return;
    }

    voltear(boton, true);
    voltadas.push(boton);

    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    if (voltadas.length === 2) {
      comprobar();
    }
  }

  function empezar() {
    terminado = false;
    bloqueado = false;
    voltadas = [];
    encontradas = 0;

    raiz.classList.remove("cartas--resueltas");

    if (cajaRespuesta) {
      cajaRespuesta.hidden = true;
    }

    var mazo = mazoBarajado();

    for (var i = 0; i < botones.length; i++) {
      var boton = botones[i];

      boton.classList.remove("carta--volteada", "carta--emparejada", "carta--fuera");
      boton.disabled = false;
      boton.setAttribute("aria-label", "Carta boca abajo");
      boton.dataset.pareja = String(mazo[i]);
      pintarCara(boton);
    }

    estado("Parejas: 0 de " + PAREJAS);
  }

  if (botonBarajar) {
    botonBarajar.addEventListener("click", empezar);
  }

  /* ---------- Arranque ---------- */

  crearCartas();
  prepararImagenes();
  empezar();
})();
