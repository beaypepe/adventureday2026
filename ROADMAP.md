# 🗺️ ROADMAP — Adventure Day 2026

Lista de tareas para el desarrollo completo del proyecto.

## Fase 1: Documentación y Base del Proyecto
- [x] Crear `README.md`, `AGENTS.md`, `ROADMAP.md` y `CHANGELOG.md`.
- [x] Definir los 5 nombres aleatorios para las carpetas de las etapas (para que los asistentes no puedan adivinar las URLs), las 5 respuestas de las etapas y la URL del Adventure Lab.
  - *Avance (2026-11-10):* definida la URL del Adventure Lab (enlazada en `index.html`), los cinco nombres de carpeta (`b4x8rf`, `7k2m9p`, `3n9w2q`, `m8d6fc`, `5h1j7v`) y las cinco respuestas, que se guardan codificadas con `window.AD.abrir()` (nunca en claro). La del Laberinto ya está puesta; las otras cuatro se incorporarán al crear sus juegos.
- [x] Crear la hoja de estilos global (`assets/css/styles.css`) y utilidades (`assets/js/common.js`) con diseño Mobile-Only, bloqueo de scroll en áreas táctiles, colores corporativos (`#d65b33`, `#ffffff`, `#02874d`), Header con fallback automático para `logo.png`, Footer con enlace a BeayPepe y modal de revelación de respuesta.
  - *Avance (2026-11-10):* `assets/css/styles.css` con paleta, reset, layout móvil, Header con fallback del logo, Footer, botón, imagen de acceso al Lab, tablero de juego y modal; `assets/js/common.js` con el bloqueo por fecha del Lab y `AD.mostrarRespuesta()`, el modal de revelación de respuesta que usarán los cinco juegos. El bloqueo de scroll táctil se aplica en los contenedores de juego (`touch-action: none`).
- [x] Añadir marca de tiempo (`?v=`) a las referencias de `assets/` (CSS, JS e imágenes) y el script `tools/bump-versions.sh` para actualizarla, de modo que los móviles no sigan usando versiones antiguas desde la caché.
- [x] Añadir favicon propio a todas las páginas (`assets/img/favicon.png` y `apple-touch-icon.png`), generado a partir del símbolo del logotipo de Adventure Lab.

## Fase 2: Páginas Generales y Captura de QRs Falsos
- [x] Crear `index.html` (Página de inicio accesible desde la descripción del evento: instrucciones breves de los cinco códigos QR, los cinco minijuegos y las cinco etapas, y acceso al Adventure Lab mediante imagen).
- [x] Crear `404.html` (Página a la que redirigirán automáticamente todos los códigos QR incorrectos/señuelos con el mensaje «Aquí no hay nada… ¡sigue buscando!», usando rutas absolutas a `/adventureday2026/assets/` y sin dar pistas sobre las rutas reales).
  - *Avance (2026-11-10):* retirado el enlace «Volver al inicio»; el acceso de vuelta al inicio queda en el logo del Header, común a todas las páginas.
- [x] Abrir el enlace al Adventure Lab solo el día del evento: desde `assets/js/common.js`, antes del 29 de noviembre de 2026 (00:00, hora peninsular) se muestra un aviso al tocar la imagen y no se navega.

## Fase 3: Desarrollo de los 5 Minijuegos (En sus carpetas)
- [x] **Laberinto táctil** (`b4x8rf/`): implementado en `<canvas>` con cuadrícula 8x8 a todo el ancho de la pantalla (pasillos de 40–54 px según el móvil). Permite rozar paredes, pero reinicia el recorrido si el trazo atraviesa un muro o si se apoya el dedo fuera del camino. Página `b4x8rf/index.html` y lógica en `assets/js/laberinto.js`.
  - *Nota:* la respuesta real ya está incorporada, codificada, en `assets/js/laberinto.js`.
- [ ] **Puzzle deslizante 3x3** (`7k2m9p/`): Implementar cuadrícula 3x3 con `assets/img/puzzle.png` (600x600px, con fallback numérico si no hay imagen), mezclando el tablero mediante 15-20 movimientos válidos inversos desde la posición resuelta para garantizar que siempre tenga solución rápida.
- [ ] **Juego de parejas** (`3n9w2q/`): Implementar cuadrícula 4x5 (20 cartas / 10 parejas) usando `assets/img/cards/back.png` y `card1.png` a `card10.png` (200x200px, con fallback visual si aún no están las imágenes), giro 3D al tocar y descarte de parejas acertadas.
- [ ] **Sopa de letras táctil** (`m8d6fc/`): Confirmar lista definitiva de palabras (ej. `GEOCACHING`, `ADVENTURELAB`, `EVENTO`) e implementar cuadrícula adaptada (12x12) con soporte táctil tanto por arrastre como por toque en primera y última letra.
- [ ] **Arcade «Atrapa el logo»** (`5h1j7v/`): Implementar juego en `<canvas>` con control táctil deslizante horizontal usando `assets/img/arcade/item-good.png` y `item-bad.png` (128x128px, con fallback vectorial). Victoria al atrapar 26 logos; penalización o reinicio al chocar con bombas.

## Fase 4: Activos Gráficos y Despliegue Final
- [ ] Subir las imágenes definitivas (`logo.png`, `puzzle.png`, las 11 imágenes de `cards/` y las imágenes de `arcade/`).
  - *Avance (2026-11-10):* subidas `logo.png` (600×160, ya visible en el Header) y `puzzle.png` (600×600). Pendientes las imágenes de `cards/` y `arcade/`.
- [ ] Verificar en GitHub Pages (`https://beaypepe.github.io/adventureday2026/`) desde móviles reales tanto las 5 rutas válidas como el salto a `404.html` en rutas inventadas.
