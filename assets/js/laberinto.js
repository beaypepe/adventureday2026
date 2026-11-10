/* ==========================================================================
   Laberinto táctil — Adventure Day 2026 (carpeta b4x8rf)
   --------------------------------------------------------------------------
   Reglas:
   • Se juega arrastrando el dedo desde la salida (arriba a la izquierda, verde)
     hasta la meta (naranja), que cada partida cae en un punto lejano distinto.
   • Rozar las paredes no penaliza; atravesarlas sí: el laberinto vuelve al inicio.
   • Se puede levantar el dedo y volver a apoyarlo en la casilla donde está la
     ficha (útil si la mano tapa el camino). Apoyarlo en otra casilla reinicia.
   ========================================================================== */
(function () {
  "use strict";

  /* Respuesta de esta etapa, guardada en clave (ver AD.abrir en common.js).
     No se escribe en claro en el repositorio para que no se encuentre de un vistazo. */
  var RESPUESTA = window.AD.abrir("EEEVWh05W1ZAB1oMTQADZQAGUAI=", "b4x8rf:26");

  var N = 8; // Cuadrícula 8x8: a todo el ancho del móvil salen pasillos de 40 a 54 px

  var canvas = document.getElementById("laberinto");
  var textoEstado = document.getElementById("estado");
  var cajaRespuesta = document.getElementById("respuesta-final");

  if (!canvas) {
    return;
  }

  var ctx = canvas.getContext("2d");
  var laberinto;
  var salida = { x: 0, y: 0 };
  var meta = { x: N - 1, y: N - 1 }; // se sortea al arrancar (ver elegirMeta)
  var celda = 0;
  var posicion = { x: 0, y: 0 };
  var camino = [{ x: 0, y: 0 }];
  var ultimoPunto = null;
  var arrastrando = false;
  var terminado = false;
  var temporizadorFallo = 0;

  /* ---------- Utilidades ---------- */

  /* Generador pseudoaleatorio con semilla (mulberry32). Solo se usa cuando la
     URL lleva ?seed=..., para poder repetir un mismo laberinto en las pruebas. */
  function azarConSemilla(semilla) {
    var a = semilla >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function crearAzar() {
    var semilla = new URLSearchParams(window.location.search).get("seed");

    if (semilla === null) {
      return Math.random;
    }

    return azarConSemilla(parseInt(semilla, 10) || 0);
  }

  /* Laberinto perfecto con retroceso recursivo: siempre tiene solución y no
     hay zonas aisladas. Cada celda guarda sus cuatro paredes (n, e, s, o). */
  function generarLaberinto(n, azar) {
    var celdas = [];
    var i;

    for (i = 0; i < n * n; i++) {
      celdas.push({ n: true, e: true, s: true, o: true, visto: false });
    }

    var indice = function (x, y) { return y * n + x; };
    var pila = [{ x: 0, y: 0 }];
    celdas[0].visto = true;

    while (pila.length) {
      var actual = pila[pila.length - 1];
      var vecinos = [];

      if (actual.y > 0 && !celdas[indice(actual.x, actual.y - 1)].visto) {
        vecinos.push({ x: actual.x, y: actual.y - 1, pared: "n", opuesta: "s" });
      }
      if (actual.x < n - 1 && !celdas[indice(actual.x + 1, actual.y)].visto) {
        vecinos.push({ x: actual.x + 1, y: actual.y, pared: "e", opuesta: "o" });
      }
      if (actual.y < n - 1 && !celdas[indice(actual.x, actual.y + 1)].visto) {
        vecinos.push({ x: actual.x, y: actual.y + 1, pared: "s", opuesta: "n" });
      }
      if (actual.x > 0 && !celdas[indice(actual.x - 1, actual.y)].visto) {
        vecinos.push({ x: actual.x - 1, y: actual.y, pared: "o", opuesta: "e" });
      }

      if (!vecinos.length) {
        pila.pop();
        continue;
      }

      var elegido = vecinos[Math.floor(azar() * vecinos.length)];
      celdas[indice(actual.x, actual.y)][elegido.pared] = false;
      celdas[indice(elegido.x, elegido.y)][elegido.opuesta] = false;
      celdas[indice(elegido.x, elegido.y)].visto = true;
      pila.push({ x: elegido.x, y: elegido.y });
    }

    return celdas;
  }

  /* Meta de la partida. No se fija en la esquina opuesta: se miden las
     distancias desde la salida y se sortea entre las casillas lejanas, es decir,
     las que piden al menos 20 pasos (y el 70 % del recorrido máximo) y quedan a
     6 o más casillas de la salida en línea recta. Así el camino siempre es largo,
     la meta aparece cada vez en un sitio distinto y nunca al lado de la salida. */
  function elegirMeta(celdas, azar) {
    var distancias = [];
    var cola = [0];
    var i;

    for (i = 0; i < N * N; i++) {
      distancias.push(-1);
    }
    distancias[0] = 0;

    // Recorrido en anchura: cuántas casillas hay que cruzar hasta cada una
    for (i = 0; i < cola.length; i++) {
      var actual = cola[i];
      var ax = actual % N;
      var ay = Math.floor(actual / N);
      var c = celdas[actual];
      var vecinos = [];

      if (!c.n && ay > 0) { vecinos.push(actual - N); }
      if (!c.e && ax < N - 1) { vecinos.push(actual + 1); }
      if (!c.s && ay < N - 1) { vecinos.push(actual + N); }
      if (!c.o && ax > 0) { vecinos.push(actual - 1); }

      for (var j = 0; j < vecinos.length; j++) {
        if (distancias[vecinos[j]] === -1) {
          distancias[vecinos[j]] = distancias[actual] + 1;
          cola.push(vecinos[j]);
        }
      }
    }

    var mayor = 0;
    for (i = 0; i < distancias.length; i++) {
      if (distancias[i] > mayor) { mayor = distancias[i]; }
    }

    var umbral = Math.max(20, Math.ceil(mayor * 0.7));
    var candidatas = [];
    var apartadas = [];

    for (i = 0; i < distancias.length; i++) {
      if (distancias[i] >= umbral) {
        candidatas.push(i);

        // Además, separada de la salida en línea recta (no solo en pasos)
        if ((i % N) + Math.floor(i / N) >= 6) {
          apartadas.push(i);
        }
      }
    }

    if (apartadas.length) {
      candidatas = apartadas;
    }

    if (!candidatas.length) {
      return { x: N - 1, y: N - 1 };
    }

    var elegida = candidatas[Math.floor(azar() * candidatas.length)];
    return { x: elegida % N, y: Math.floor(elegida / N) };
  }

  function celdaDe(x, y) {
    return laberinto[y * N + x];
  }

  /* ---------- Dibujo ---------- */

  function dibujar() {
    var tam = celda * N;
    var x;
    var y;

    ctx.clearRect(0, 0, tam, tam);

    // Fondos de salida y meta
    ctx.fillStyle = "rgba(2, 135, 77, 0.12)";
    ctx.fillRect(salida.x * celda, salida.y * celda, celda, celda);
    ctx.fillStyle = "rgba(214, 91, 51, 0.14)";
    ctx.fillRect(meta.x * celda, meta.y * celda, celda, celda);

    // Camino ya recorrido (se ve por debajo del dedo)
    if (camino.length > 1) {
      ctx.strokeStyle = "rgba(214, 91, 51, 0.45)";
      ctx.lineWidth = Math.max(6, celda * 0.2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      camino.forEach(function (c, i) {
        var cx = c.x * celda + celda / 2;
        var cy = c.y * celda + celda / 2;
        if (i === 0) {
          ctx.moveTo(cx, cy);
        } else {
          ctx.lineTo(cx, cy);
        }
      });
      ctx.stroke();
    }

    // Salida y meta
    ctx.beginPath();
    ctx.arc((salida.x + 0.5) * celda, (salida.y + 0.5) * celda, Math.max(4, celda * 0.14), 0, Math.PI * 2);
    ctx.fillStyle = "#02874d";
    ctx.fill();

    ctx.beginPath();
    ctx.arc((meta.x + 0.5) * celda, (meta.y + 0.5) * celda, Math.max(6, celda * 0.22), 0, Math.PI * 2);
    ctx.lineWidth = Math.max(4, celda * 0.09);
    ctx.strokeStyle = "#d65b33";
    ctx.stroke();

    // Paredes
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = Math.max(4, celda * 0.09);
    ctx.lineCap = "round";
    ctx.beginPath();

    for (y = 0; y < N; y++) {
      for (x = 0; x < N; x++) {
        var c = celdaDe(x, y);
        var x0 = x * celda;
        var y0 = y * celda;

        if (c.n) {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + celda, y0);
        }
        if (c.o) {
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0, y0 + celda);
        }
        // Las paredes este y sur solo se pintan en el borde exterior
        if (x === N - 1 && c.e) {
          ctx.moveTo(x0 + celda, y0);
          ctx.lineTo(x0 + celda, y0 + celda);
        }
        if (y === N - 1 && c.s) {
          ctx.moveTo(x0, y0 + celda);
          ctx.lineTo(x0 + celda, y0 + celda);
        }
      }
    }

    ctx.stroke();

    // Ficha del jugador
    var px = posicion.x * celda + celda / 2;
    var py = posicion.y * celda + celda / 2;

    ctx.beginPath();
    ctx.arc(px, py, Math.max(5, celda * 0.17), 0, Math.PI * 2);
    ctx.fillStyle = "#111111";
    ctx.fill();
    ctx.lineWidth = Math.max(2, celda * 0.05);
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }

  function ajustarTamano() {
    var lado = Math.round(canvas.clientWidth);
    var dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(lado * dpr);
    canvas.height = Math.round(lado * dpr);
    canvas.style.height = lado + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    celda = lado / N;
    dibujar();
  }

  /* ---------- Estado del juego ---------- */

  function estado(texto) {
    if (textoEstado) {
      textoEstado.textContent = texto;
    }
  }

  function reiniciar(mensaje) {
    posicion = { x: salida.x, y: salida.y };
    camino = [{ x: salida.x, y: salida.y }];
    ultimoPunto = null;
    arrastrando = false;
    terminado = false;

    if (cajaRespuesta) {
      cajaRespuesta.hidden = true;
    }

    estado(mensaje || "La meta cambia de sitio en cada partida. Puedes rozar las paredes, pero no atravesarlas: si lo haces, vuelves a empezar.");
    dibujar();
  }

  function fallar(mensaje) {
    reiniciar(mensaje);

    canvas.classList.add("maze--fallo");
    window.clearTimeout(temporizadorFallo);
    temporizadorFallo = window.setTimeout(function () {
      canvas.classList.remove("maze--fallo");
    }, 450);

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  }

  function ganar() {
    terminado = true;
    arrastrando = false;
    dibujar();
    estado("¡Has llegado a la meta!");

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

  /* ---------- Seguimiento del dedo ---------- */

  function puntoDe(evento) {
    var caja = canvas.getBoundingClientRect();
    return { x: evento.clientX - caja.left, y: evento.clientY - caja.top };
  }

  function celdaDelPunto(punto) {
    var x = Math.floor(punto.x / celda);
    var y = Math.floor(punto.y / celda);
    return {
      x: Math.max(0, Math.min(N - 1, x)),
      y: Math.max(0, Math.min(N - 1, y))
    };
  }

  /* Recorre el segmento entre el punto anterior y el actual en pasos pequeños:
     así un deslizamiento rápido no se salta casillas y solo cuenta la pared que
     realmente se cruza (rozar el borde de una pared no penaliza). */
  function avanzarHasta(punto) {
    var desde = ultimoPunto || punto;
    var distancia = Math.hypot(punto.x - desde.x, punto.y - desde.y);
    var pasos = Math.max(1, Math.ceil(distancia / Math.max(2, celda / 6)));

    for (var i = 1; i <= pasos; i++) {
      var t = i / pasos;
      var muestra = {
        x: desde.x + (punto.x - desde.x) * t,
        y: desde.y + (punto.y - desde.y) * t
      };
      var destino = celdaDelPunto(muestra);

      if (destino.x === posicion.x && destino.y === posicion.y) {
        continue;
      }

      var dx = destino.x - posicion.x;
      var dy = destino.y - posicion.y;

      // Solo se puede pasar a una casilla vecina (nada de saltos)
      if (Math.abs(dx) + Math.abs(dy) !== 1) {
        fallar("¡No vale saltar! Vuelves a la salida.");
        return false;
      }

      var pared = dx === 1 ? "e" : dx === -1 ? "o" : dy === 1 ? "s" : "n";

      if (celdaDe(posicion.x, posicion.y)[pared]) {
        fallar("¡Has atravesado una pared! Vuelves a la salida.");
        return false;
      }

      posicion = { x: destino.x, y: destino.y };
      camino.push(posicion);
      dibujar();

      if (posicion.x === meta.x && posicion.y === meta.y) {
        ganar();
        return true;
      }
    }

    return true;
  }

  canvas.addEventListener("pointerdown", function (evento) {
    if (terminado) {
      return;
    }

    evento.preventDefault();

    var celdaPulsada = celdaDelPunto(puntoDe(evento));

    if (celdaPulsada.x !== posicion.x || celdaPulsada.y !== posicion.y) {
      fallar("El recorrido empieza en la salida. Vuelves al principio.");
      return;
    }

    arrastrando = true;
    ultimoPunto = puntoDe(evento);

    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(evento.pointerId);
    }
  });

  canvas.addEventListener("pointermove", function (evento) {
    if (!arrastrando || terminado) {
      return;
    }

    evento.preventDefault();
    var punto = puntoDe(evento);

    if (avanzarHasta(punto)) {
      ultimoPunto = punto;
    }
  });

  function soltar() {
    arrastrando = false;
    ultimoPunto = null;
  }

  canvas.addEventListener("pointerup", soltar);
  canvas.addEventListener("pointercancel", soltar);
  canvas.addEventListener("pointerleave", soltar);

  window.addEventListener("resize", ajustarTamano);

  /* ---------- Arranque ---------- */

  var azar = crearAzar();
  laberinto = generarLaberinto(N, azar);
  meta = elegirMeta(laberinto, azar);
  ajustarTamano();
  reiniciar();
})();
