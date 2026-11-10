# 🗺️ ROADMAP — Adventure Day 2026

Lista de tareas para el desarrollo completo del proyecto.

## Fase 1: Documentación y Base del Proyecto
- [x] Crear `README.md`, `AGENTS.md`, `ROADMAP.md` y `CHANGELOG.md`.
- [ ] Definir los 5 nombres aleatorios para las carpetas de las etapas (para que los asistentes no puedan adivinar las URLs), las 5 respuestas de las etapas y la URL del Adventure Lab.
  - *Avance (2026-11-10):* definida la URL del Adventure Lab y enlazada en `index.html`. Pendientes los 5 nombres de carpeta y las 5 respuestas.
- [ ] Crear la hoja de estilos global (`assets/css/styles.css`) y utilidades (`assets/js/common.js`) con diseño Mobile-Only, bloqueo de scroll en áreas táctiles, colores corporativos (`#d65b33`, `#ffffff`, `#02874d`), Header con fallback automático para `logo.png`, Footer con enlace a BeayPepe y modal de revelación de respuesta.
  - *Avance (2026-11-10):* creada la base de `assets/css/styles.css` (paleta corporativa, reset, layout móvil, Header con fallback del logo, Footer y botón). Pendientes `assets/js/common.js`, el bloqueo de scroll en áreas táctiles y el modal de revelación de respuesta.

## Fase 2: Páginas Generales y Captura de QRs Falsos
- [x] Crear `index.html` (Página de inicio accesible desde la descripción del evento con instrucciones breves de la dinámica de los QR en la mesa y botón de acceso al Adventure Lab).
- [ ] Crear `404.html` (Página a la que redirigirán automáticamente todos los códigos QR incorrectos/señuelos con el mensaje "Aquí no hay nada... sigue buscando", usando rutas absolutas a `/adventureday2026/assets/`).

## Fase 3: Desarrollo de los 5 Minijuegos (En sus carpetas aleatorias)
- [ ] **Etapa 1 — Laberinto Táctil:** Implementar en `<canvas>` con pasillos anchos aptos para dedos (grid 6x6 a 8x8). Permitir rozar paredes pero reiniciar el recorrido si el trazo atraviesa un muro o si se levanta el dedo para saltar camino.
- [ ] **Etapa 2 — Puzzle Deslizante (3x3):** Implementar cuadrícula 3x3 con `assets/img/puzzle.png` (600x600px, con fallback numérico si no hay imagen), mezclando el tablero mediante 15-20 movimientos válidos inversos desde la posición resuelta para garantizar que siempre tenga solución rápida.
- [ ] **Etapa 3 — Juego de Parejas (Memoria):** Implementar cuadrícula 4x5 (20 cartas / 10 parejas) usando `assets/img/cards/back.png` y `card1.png` a `card10.png` (200x200px, con fallback visual si aún no están las imágenes), giro 3D al tocar y descarte de parejas acertadas.
- [ ] **Etapa 4 — Sopa de Letras Táctil:** Confirmar lista definitiva de palabras (ej. `GEOCACHING`, `ADVENTURELAB`, `EVENTO`) e implementar cuadrícula adaptada (12x12) con soporte táctil tanto por arrastre como por toque en primera y última letra.
- [ ] **Etapa 5 — Arcade "Atrapa el Logo":** Implementar juego en `<canvas>` con control táctil deslizante horizontal usando `assets/img/arcade/item-good.png` y `item-bad.png` (128x128px, con fallback vectorial). Victoria al atrapar 26 logos; penalización o reinicio al chocar con bombas.

## Fase 4: Activos Gráficos y Despliegue Final
- [ ] Subir las imágenes definitivas (`logo.png`, `puzzle.png`, las 11 imágenes de `cards/` y las imágenes de `arcade/`).
- [ ] Verificar en GitHub Pages (`https://beaypepe.github.io/adventureday2026/`) desde móviles reales tanto las 5 rutas válidas como el salto a `404.html` en rutas inventadas.
