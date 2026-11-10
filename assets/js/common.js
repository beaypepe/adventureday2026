/* ==========================================================================
   Adventure Day 2026 — Funciones compartidas por todas las páginas
   --------------------------------------------------------------------------
   De momento solo controla la fecha de apertura del Adventure Lab.
   ========================================================================== */
(function () {
  "use strict";

  /* El Adventure Lab no está activo hasta el día del evento.
     29 de noviembre de 2026, 00:00 en la España peninsular (UTC+1).
     Se compara con un instante fijo para que todos los móviles lo abran a la
     vez, sin depender de la zona horaria que tenga configurada cada teléfono. */
  var LAB_OPEN_AT = Date.UTC(2026, 10, 28, 23, 0, 0);

  var link = document.querySelector("[data-lab-link]");
  var message = document.querySelector("[data-lab-locked]");

  if (!link) {
    return;
  }

  link.addEventListener("click", function (event) {
    // A partir del 29 de noviembre la navegación sigue su curso normal.
    if (Date.now() >= LAB_OPEN_AT) {
      return;
    }

    // Antes del evento: no se sale de la página y se muestra el aviso.
    event.preventDefault();

    if (message) {
      message.hidden = false;
      // Se lleva el aviso a la vista para que el visitante lo lea sin buscarlo.
      message.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
