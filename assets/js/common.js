/* ==========================================================================
   Adventure Day 2026 — Funciones compartidas por todas las páginas
   --------------------------------------------------------------------------
   1. Apertura del Adventure Lab según la fecha.
   2. Modal de victoria con la respuesta de la etapa.
   ========================================================================== */
(function () {
  "use strict";

  window.AD = window.AD || {};

  /* ======================================================================
     1. El Adventure Lab solo se abre el día del evento
     ====================================================================== */

  /* 29 de noviembre de 2026, 00:00 en la España peninsular (UTC+1).
     Se compara con un instante fijo para que todos los móviles lo abran a la
     vez, sin depender de la zona horaria que tenga configurada cada teléfono. */
  var LAB_OPEN_AT = Date.UTC(2026, 10, 28, 23, 0, 0);

  var enlaceLab = document.querySelector("[data-lab-link]");
  var avisoLab = document.querySelector("[data-lab-locked]");

  if (enlaceLab) {
    enlaceLab.addEventListener("click", function (evento) {
      // A partir del 29 de noviembre la navegación sigue su curso normal.
      if (Date.now() >= LAB_OPEN_AT) {
        return;
      }

      // Antes del evento: no se sale de la página y se muestra el aviso.
      evento.preventDefault();

      if (avisoLab) {
        avisoLab.hidden = false;
        // Se lleva el aviso a la vista para que el visitante lo lea sin buscarlo.
        avisoLab.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  /* ======================================================================
     2. Modal de victoria con la respuesta de la etapa
     ====================================================================== */

  var modal = null;
  var focoAnterior = null;

  function crearModal() {
    var capa = document.createElement("div");
    capa.className = "modal";
    capa.hidden = true;
    capa.innerHTML =
      '<div class="modal__caja" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" tabindex="-1">' +
        '<h2 class="modal__titulo" id="modal-titulo">¡Enhorabuena!</h2>' +
        '<p class="modal__intro">Has superado el reto. Esta es la respuesta de la etapa:</p>' +
        '<p class="modal__respuesta" data-respuesta></p>' +
        '<p class="modal__ayuda">Escríbela en la app Adventure Lab para validar la etapa.</p>' +
        '<button class="btn" type="button" data-cerrar>Cerrar</button>' +
      '</div>';

    capa.addEventListener("click", function (evento) {
      if (evento.target === capa) {
        cerrarModal();
      }
    });

    capa.querySelector("[data-cerrar]").addEventListener("click", cerrarModal);

    document.body.appendChild(capa);
    return capa;
  }

  function cerrarModal() {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    document.documentElement.classList.remove("sin-scroll");

    if (focoAnterior && typeof focoAnterior.focus === "function") {
      focoAnterior.focus();
    }
  }

  /* Muestra el modal con la respuesta indicada. Lo usan los cinco minijuegos. */
  function mostrarRespuesta(texto) {
    if (!modal) {
      modal = crearModal();
    }

    modal.querySelector("[data-respuesta]").textContent = texto || "Pendiente de definir";
    focoAnterior = document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("sin-scroll");

    // El foco va a la caja del diálogo: los lectores de pantalla la anuncian
    // y no aparece el contorno del botón al tocar con el dedo.
    var caja = modal.querySelector(".modal__caja");
    if (caja) {
      caja.focus();
    }
  }

  document.addEventListener("keydown", function (evento) {
    if (!modal || modal.hidden) {
      return;
    }

    if (evento.key === "Escape") {
      cerrarModal();
      return;
    }

    if (evento.key === "Tab") {
      // Solo hay un botón: el tabulador lo enfoca y no se sale del diálogo.
      evento.preventDefault();
      var boton = modal.querySelector("[data-cerrar]");
      if (boton) {
        boton.focus();
      }
    }
  });

  window.AD.mostrarRespuesta = mostrarRespuesta;
})();
