# 🗺️ ROADMAP — Adventure Day 2026

Lista de tareas para el desarrollo completo del proyecto.

## Fase 1: Documentación y Base del Proyecto
- [x] Crear `README.md`, `AGENTS.md`, `ROADMAP.md` y `CHANGELOG.md`.
- [ ] Definir los 5 nombres de carpeta aleatorios (hashes), las 5 respuestas de las etapas y la URL del Adventure Lab.
- [ ] Crear la hoja de estilos global (`assets/css/styles.css`) y utilidades (`assets/js/common.js`) con diseño Mobile-Only, bloqueo de scroll en áreas táctiles, colores corporativos (`#d65b33`, `#ffffff`, `#02874d`), Header con fallback automático para `logo.png`, Footer con enlace a BeayPepe y modal de revelación de respuesta.

## Fase 2: Páginas Generales
- [ ] Crear `index.html` (Página de inicio con instrucciones breves de la dinámica de los QR en la mesa y botón de acceso al Adventure Lab).
- [ ] Crear `404.html` (Página para los códigos QR señuelo con el mensaje "Aquí no hay nada, sigue buscando" y rutas absolutas a `/adventureday2026/assets/`).

## Fase 3: Desarrollo de los 5 Minijuegos (Etapas)
- [ ] **Etapa 1 — Laberinto Táctil:** Implementar en `<canvas>` con pasillos anchos aptos para dedos (grid 6x6 a 8x8). Permitir rozar paredes pero reiniciar el recorrido si el trazo atraviesa un muro o si se intenta hacer trampa levantando el dedo.
- [ ] **Etapa 2 — Puzzle Deslizante (3x3):** Implementar cuadrícula 3x3 con `assets/img/puzzle.png` (600x600px, con fallback numérico si no hay imagen), mezclando el tablero mediante 15-20 movimientos válidos inversos desde la posición resuelta para garantizar que siempre tenga solución rápida.
- [ ] **Etapa 3 — Juego de Parejas (Memoria):** Implementar cuadrícula 4x5 (20 cartas / 10 parejas) usando `assets/img/cards/back.png` y `card1.png` a `card10.png` (200x200px, con fallback visual si aún no están las imágenes), giro 3D al tocar y descarte de parejas acertadas.
- [ ] **Etapa 4 — Sopa de Letras Táctil:** Confirmar lista definitiva de palabras (ej. `GEOCACHING`, `ADVENTURELAB`, `EVENTO`) e implementar cuadrícula adaptada (12x12) con soporte táctil tanto por arrastre como por toque en primera y última letra.
- [ ] **Etapa 5 — Arcade "Atrapa el Logo":** Implementar juego en `<canvas>` con control táctil deslizante horizontal usando `assets/img/arcade/item-good.png` y `item-bad.png` (128x128px, con fallback vectorial). Victoria al atrapar 26 logos; penalización o reinicio al chocar con bombas.

## Fase 4: Activos Gráficos, QRs y Despliegue Final
- [ ] Subir imágenes definitivas (`logo.png`, `puzzle.png`, las 11 imágenes de `cards/` y las imágenes de `arcade/`).
- [ ] Generar el listado definitivo de 5 URLs válidas y 25-30 URLs falsas para imprimir los códigos QR del evento.
- [ ] Verificar funcionamiento táctil en GitHub Pages (`https://beaypepe.github.io/adventureday2026/`) desde móviles reales.
