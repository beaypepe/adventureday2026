# 🗺️ ROADMAP — Adventure Day 2026

Lista de tareas para el desarrollo completo del proyecto.

## Fase 1: Documentación y Base del Proyecto
- [x] Crear `README.md`, `AGENTS.md`, `ROADMAP.md` y `CHANGELOG.md`.
- [ ] Definir los 5 códigos/nombres de carpeta aleatorios para las 5 etapas y las respuestas finales que mostrará cada etapa al superarse.
- [ ] Crear la hoja de estilos global (`assets/css/styles.css`) con diseño Mobile-Only, colores corporativos (`#d65b33`, `#ffffff`, `#02874d`), Header con fallback de `logo.png` y Footer con enlace a BeayPepe.

## Fase 2: Páginas Generales
- [ ] Crear `index.html` (Página de inicio con instrucciones del juego en el evento y botón de acceso al Adventure Lab).
- [ ] Crear `404.html` (Página para los códigos QR señuelo con el mensaje "Aquí no hay nada, sigue buscando" y estética corporativa).

## Fase 3: Desarrollo de los 5 Minijuegos (Etapas)
- [ ] **Etapa 1 — Laberinto Táctil:** Implementar juego en HTML5 Canvas donde el jugador traza el camino con el dedo de principio a fin sin tocar las paredes.
- [ ] **Etapa 2 — Puzzle Deslizante (3x3):** Implementar puzzle de 3x3 con el logo del evento, barajado mediante movimientos válidos inversos para garantizar que siempre tenga solución rápida.
- [ ] **Etapa 3 — Juego de Parejas (Memoria):** Implementar cuadrícula 5x4 (20 cartas) con giro táctil para encontrar las 10 parejas.
- [ ] **Etapa 4 — Sopa de Letras Táctil:** Implementar cuadrícula con 3-4 palabras temáticas de geocaching seleccionables de forma táctil.
- [ ] **Etapa 5 — Arcade "Atrapa el Logo":** Implementar juego donde caen logos del Adventure Day y bombas. Victoria al recoger 26 logos; penalización o reinicio al tocar una bomba.

## Fase 4: Pruebas y Despliegue Final
- [ ] Subir imágenes definitivas (`logo.png` e iconos de los juegos).
- [ ] Generar el listado de URLs válidas (5) y URLs falsas (25-35) para crear los códigos QR de la mesa.
- [ ] Verificar el funcionamiento en GitHub Pages (`https://beaypepe.github.io/adventureday2026/`) desde dispositivos móviles reales.
