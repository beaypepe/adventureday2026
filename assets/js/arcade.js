/* ==========================================================================
   Arcade «Atrapa el logo» — Adventure Day 2026 (carpeta 5h1j7v)
   --------------------------------------------------------------------------
   Reglas:
   • Una cesta se mueve por la parte de abajo siguiendo el dedo.
   • Caen logos (hay que recogerlos) y bombas (hay que esquivarlas).
   • Cada logo suma uno; si se atrapa una bomba, se pierde la partida y hay
     que pulsar «Empezar de nuevo».
   • Se gana al recoger 26 logos.
   • Sin los dibujos de assets/img/arcade/, el canvas pinta las tres figuras,
     así que el juego funciona igual.
   ========================================================================== */
(function () {
  "use strict";

  /* Respuesta de esta etapa, guardada en clave (ver AD.abrir en common.js).
     No se escribe en claro en el repositorio para que no se encuentre de un vistazo. */
  var RESPUESTA = window.AD.abrir("VglLC2gaVVVZRjcDWgVA", "5h1j7v:26");

  var META = 26;          // logos que hay que atrapar para ganar
  var MAX_OBJETOS = 18;   // tope de figuras cayendo a la vez

  var canvas = document.getElementById("arcade");
  var textoEstado = document.getElementById("estado");
  var botonReiniciar = document.getElementById("reiniciar");
  var cajaRespuesta = document.getElementById("respuesta-final");

  if (!canvas) {
    return;
  }

  var ctx = canvas.getContext("2d");

  /* Dibujos (si aún no existen, se pintan figuras equivalentes) */
  var imgBueno = document.getElementById("img-bueno");
  var imgMalo = document.getElementById("img-malo");
  var imgCesta = document.getElementById("img-cesta");

  var ancho = 0;            // medidas del lienzo en píxeles CSS
  var alto = 0;
  var anchoCesta = 0;
  var altoCesta = 0;
  var tamObjeto = 0;

  var cesta = { x: 0 };     // centro de la cesta
  var objetos = [];         // figuras que caen
  var atrapados = 0;
  var acumulado = 0;        // segundos desde la última figura
  var ultimo = 0;           // marca de tiempo del fotograma anterior
  var jugando = true;       // la partida está en marcha
  var perdido = false;      // se ha chocado con una bomba: espera al botón
  var rojo = 0;             // fogonazo rojo al chocar con una bomba
  var arrastrando = false;

  /* Los dibujos traen un margen transparente alrededor. Las bombas, además,
     dibujan un círculo más pequeño que su recuadro: con el recuadro entero el
     choque salta cuando todavía se ven lejos. Se calcula el choque con una
     caja algo más pequeña que la figura. */
  var MARGEN_BOMBA = 0.75;

  /* ---------- Utilidades ---------- */

  function aleatorio(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo);
  }

  function lista(img) {
    return !!img && img.complete && img.naturalWidth > 0;
  }

  function estado(texto) {
    if (textoEstado) {
      textoEstado.textContent = texto;
    }
  }

  /* Cuanto más avanza la partida, más rápido caen y más bombas salen.
     Si en el evento se ve demasiado duro (o demasiado fácil), se toca aquí. */
  function velocidad() {
    return alto * (0.50 + atrapados * 0.020);
  }

  function intervalo() {
    return Math.max(0.30, 0.70 - atrapados * 0.018);
  }

  function probabilidadBomba() {
    return Math.min(0.52, 0.30 + atrapados * 0.009);
  }

  /* ---------- Tamaños ---------- */

  function ajustarTamano() {
    var anchoCss = Math.round(canvas.clientWidth);
    var altoCss = Math.round(anchoCss * 7 / 6);   // el campo de juego es algo más alto que ancho
    var dpr = window.devicePixelRatio || 1;

    canvas.style.height = altoCss + "px";
    canvas.width = Math.round(anchoCss * dpr);
    canvas.height = Math.round(altoCss * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ancho = anchoCss;
    alto = altoCss;

    anchoCesta = Math.round(ancho * 0.22);
    altoCesta = Math.round(anchoCesta * 0.55);
    tamObjeto = Math.round(ancho * 0.13);

    if (!cesta.x) {
      cesta.x = ancho / 2;
    }

    cesta.x = Math.min(Math.max(cesta.x, anchoCesta / 2), ancho - anchoCesta / 2);
    dibujar();
  }

  /* ---------- Dibujo ---------- */

  function dibujarLogo(x, y) {
    if (lista(imgBueno)) {
      ctx.drawImage(imgBueno, x - tamObjeto / 2, y - tamObjeto / 2, tamObjeto, tamObjeto);
      return;
    }

    // Reserva: globo naranja con anillo blanco
    var r = tamObjeto / 2;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#d65b33";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(2, r * 0.22);
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }

  function dibujarBomba(x, y) {
    if (lista(imgMalo)) {
      ctx.drawImage(imgMalo, x - tamObjeto / 2, y - tamObjeto / 2, tamObjeto, tamObjeto);
      return;
    }

    // Reserva: círculo negro con una cruz blanca
    var r = tamObjeto / 2;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a1a";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - r * 0.4, y - r * 0.4);
    ctx.lineTo(x + r * 0.4, y + r * 0.4);
    ctx.moveTo(x + r * 0.4, y - r * 0.4);
    ctx.lineTo(x - r * 0.4, y + r * 0.4);
    ctx.lineWidth = Math.max(2, r * 0.2);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }

  function dibujarCesta() {
    var x = cesta.x - anchoCesta / 2;
    var y = alto - altoCesta - 6;

    if (lista(imgCesta)) {
      ctx.drawImage(imgCesta, x, y, anchoCesta, altoCesta);
      return;
    }

    // Reserva: cesta verde con reborde
    ctx.beginPath();
    ctx.moveTo(x + anchoCesta * 0.1, y + altoCesta * 0.2);
    ctx.lineTo(x + anchoCesta * 0.9, y + altoCesta * 0.2);
    ctx.lineTo(x + anchoCesta * 0.78, y + altoCesta);
    ctx.lineTo(x + anchoCesta * 0.22, y + altoCesta);
    ctx.closePath();
    ctx.fillStyle = "#02874d";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y + altoCesta * 0.2);
    ctx.lineTo(x + anchoCesta, y + altoCesta * 0.2);
    ctx.lineWidth = Math.max(3, altoCesta * 0.22);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#046b3f";
    ctx.stroke();
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);

    if (rojo > 0) {
      ctx.fillStyle = "rgba(192, 57, 43, " + (rojo * 0.45) + ")";
      ctx.fillRect(0, 0, ancho, alto);
    }

    for (var i = 0; i < objetos.length; i++) {
      if (objetos[i].bomba) {
        dibujarBomba(objetos[i].x, objetos[i].y);
      } else {
        dibujarLogo(objetos[i].x, objetos[i].y);
      }
    }

    dibujarCesta();

    if (perdido) {
      var altoBanda = Math.round(alto * 0.16);
      var centro = Math.round(alto * 0.42);

      ctx.fillStyle = "rgba(26, 26, 26, 0.88)";
      ctx.fillRect(0, centro - altoBanda / 2, ancho, altoBanda);
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 " + Math.round(ancho * 0.085) + "px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("¡Has perdido!", ancho / 2, centro);
    }
  }

  /* ---------- Partida ---------- */

  function crearObjeto() {
    if (objetos.length >= MAX_OBJETOS) {
      return;
    }

    objetos.push({
      bomba: Math.random() < probabilidadBomba(),
      x: aleatorio(tamObjeto / 2, ancho - tamObjeto / 2),
      y: -tamObjeto / 2,
      vel: velocidad() * aleatorio(0.85, 1.15)
    });
  }

  function ganar() {
    jugando = false;
    estado("¡Has atrapado los " + META + " logos!");

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

  /* Chocar con una bomba termina la partida: se para el juego y se espera a que
     el jugador pulse «Empezar de nuevo». */
  function perder() {
    jugando = false;
    perdido = true;
    rojo = 0.7;
    estado("¡Bomba! Has perdido con " + atrapados + " de " + META +
      " logos. Pulsa «Empezar de nuevo».");

    if (navigator.vibrate) {
      navigator.vibrate([80, 60, 80]);
    }

    if (botonReiniciar) {
      botonReiniciar.classList.add("btn--atencion");   // botón bien visible
    }
  }

  function actualizar(dt) {
    acumulado = acumulado + dt;

    if (acumulado >= intervalo()) {
      acumulado = 0;
      crearObjeto();
    }

    var cestaX = cesta.x - anchoCesta / 2;
    var cestaY = alto - altoCesta - 6;
    var mitad = tamObjeto / 2;
    var i;

    for (i = objetos.length - 1; i >= 0; i--) {
      var objeto = objetos[i];
      objeto.y = objeto.y + objeto.vel * dt;

      // Con las bombas se perdona un poco: el choque se calcula con una caja
      // menor que el dibujo, porque el PNG trae margen transparente.
      var toca = objeto.bomba ? mitad * MARGEN_BOMBA : mitad;
      var solapa = objeto.x + toca > cestaX &&
                   objeto.x - toca < cestaX + anchoCesta &&
                   objeto.y + toca > cestaY &&
                   objeto.y - toca < cestaY + altoCesta + 10;

      if (solapa) {
        objetos.splice(i, 1);

        if (objeto.bomba) {
          perder();
        } else {
          atrapados = atrapados + 1;
          estado("Logos: " + atrapados + " de " + META);

          if (navigator.vibrate) {
            navigator.vibrate(12);
          }

          if (atrapados >= META) {
            ganar();
          }
        }
      } else if (objeto.y - mitad > alto) {
        objetos.splice(i, 1);   // se ha escapado por abajo
      }
    }
  }

  function bucle(tiempo) {
    if (!ultimo) {
      ultimo = tiempo;
    }

    var dt = Math.min(0.05, (tiempo - ultimo) / 1000);

    ultimo = tiempo;

    if (jugando) {
      actualizar(dt);
    }

    if (rojo > 0) {
      rojo = Math.max(0, rojo - dt * 1.6);   // también se apaga con el juego parado
    }

    dibujar();
    window.requestAnimationFrame(bucle);
  }

  /* ---------- Control con el dedo ---------- */

  function moverA(clientX) {
    var caja = canvas.getBoundingClientRect();
    var x = clientX - caja.left;

    cesta.x = Math.min(Math.max(x, anchoCesta / 2), ancho - anchoCesta / 2);
  }

  canvas.addEventListener("pointerdown", function (evento) {
    evento.preventDefault();

    if (!jugando) {
      return;      // partida terminada: solo queda pulsar «Empezar de nuevo»
    }

    arrastrando = true;
    moverA(evento.clientX);

    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(evento.pointerId);
    }
  });

  canvas.addEventListener("pointermove", function (evento) {
    // Con el dedo hace falta estar arrastrando; con ratón basta con pasar por encima
    if (!jugando || (!arrastrando && evento.pointerType === "touch")) {
      return;
    }

    evento.preventDefault();
    moverA(evento.clientX);
  });

  function soltar() {
    arrastrando = false;
  }

  canvas.addEventListener("pointerup", soltar);
  canvas.addEventListener("pointercancel", soltar);

  /* ---------- Reinicio ---------- */

  function empezar() {
    jugando = true;
    perdido = false;
    atrapados = 0;
    acumulado = 0;
    rojo = 0;
    objetos = [];
    ultimo = 0;
    cesta.x = ancho / 2 || cesta.x;

    if (cajaRespuesta) {
      cajaRespuesta.hidden = true;
    }

    estado("Logos: 0 de " + META);

    if (botonReiniciar) {
      botonReiniciar.classList.remove("btn--atencion");
    }
  }

  if (botonReiniciar) {
    botonReiniciar.addEventListener("click", empezar);
  }

  window.addEventListener("resize", ajustarTamano);

  /* ---------- Arranque ---------- */

  ajustarTamano();
  empezar();
  window.requestAnimationFrame(bucle);
})();
