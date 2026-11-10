# 🤖 AGENTS.md — Directrices Técnicas y de Contexto para IA / Desarrollo

Este documento define la arquitectura, reglas de diseño, restricciones tecnológicas, mecánicas de juego y flujo de trabajo del proyecto **Adventure Day 2026**. Cualquier agente de IA o desarrollador que intervenga en este repositorio **DEBE** leer y cumplir estrictamente estas directrices.

---

## 1. Contexto y Entorno de Despliegue
* **Repositorio:** `https://github.com/beaypepe/adventureday2026`
* **URL de Producción (GitHub Pages):** `https://beaypepe.github.io/adventureday2026/`
* **Tecnologías permitidas:** Exclusivamente **HTML5, CSS3 y JavaScript (Vanilla JS)**. 
* **Restricción de servidor:** Al alojarse en GitHub Pages, **NO** se puede utilizar PHP, bases de datos ni procesamiento backend. Todo debe ejecutarse en el navegador del cliente (*client-side*).
* **Rutas relativas/base:** El proyecto se sirve desde la subcarpeta `/adventureday2026/` en GitHub Pages. Todas las referencias a estilos e imágenes deben usar rutas que funcionen tanto desde la raíz (`index.html`, `404.html`) como desde las subcarpetas de las etapas (ej. `/adventureday2026/assets/...`).

---

## 2. Diseño e Interfaz (UI/UX Mobile-Only)
El proyecto se consumirá **exclusivamente desde teléfonos móviles** durante el evento presencial del 29 de noviembre de 2026.

* **Enfoque Mobile-First estricto:** 
  * Diseño pensado para pantallas verticales (ancho de `360px` a `430px`).
  * Bloquear el *scroll* vertical, zoom o recarga por arrastre (*pull-to-refresh*) durante los juegos táctiles usando `touch-action: none` y `user-select: none` en los contenedores interactivos.
  * Limitar el contenedor principal a un `max-width: 480px` centrado para facilitar pruebas en escritorio sin comprometer la vista móvil.
* **Paleta de Colores Corporativa:**
  * **Header (Encabezado):** Fondo naranja `#d65b33`, texto blanco `#ffffff`.
  * **Main (Contenido):** Fondo blanco `#ffffff`, texto negro `#000000`.
  * **Footer (Pie de página):** Fondo verde `#02874d`, texto blanco `#ffffff`.
* **Header (Común a todas las páginas):**
  * Centrado, color de fondo `#d65b33`.
  * Contiene la imagen `/adventureday2026/assets/img/logo.png` centrada (resolución recomendada: `600x160px`, altura máxima en CSS `55px`).
  * **Regla de Fallback del Logo:** Si `logo.png` no existe o falla al cargar, debe ocultarse automáticamente y mostrar el texto `"Adventure Day 2026"` estilizado en blanco y negrita mediante el evento `onerror` en el HTML.
* **Footer (Común a todas las páginas):**
  * Centrado, color de fondo `#02874d`.
  * Texto obligatorio: `Una ocurrencia de <a href="https://beaypepe.com" target="_blank" rel="noopener">BeayPepe</a>` (con el enlace en blanco, negrita y subrayado).

---

## 3. Especificaciones Técnicas de los 5 Minijuegos (Etapas)
Los juegos deben ser **rápidos y fáciles de resolver (1-2 minutos máximo)** para no atascar a los asistentes del evento. Al superar cualquiera de ellos, se mostrará de forma clara y destacada en pantalla la **respuesta/código de esa etapa** para introducirla en la app Adventure Lab.

### Etapa 1: El Laberinto Táctil de Trazo (HTML5 Canvas + Touch API)
* **Mecánica:** Un laberinto sencillo dibujado en un `<canvas>` (ej. cuadrícula de 10x10 o 12x12). El jugador debe apoyar el dedo en la casilla de salida y arrastrarlo de forma continua (`touchstart`, `touchmove`, `touchend` + soporte de ratón para pruebas) hasta la meta sin levantar el dedo ni chocar con los muros.
* **Colisiones y Feedback:** Si el trazo toca una pared o el usuario levanta el dedo antes de llegar a la meta, el trazo se reinicia (con vibración corta `navigator.vibrate(100)` si el dispositivo lo soporta y aviso visual).
* **Optimización móvil:** Calibrar el grosor del pasillo y del puntero para que el dedo del jugador no tape el camino inmediato.

### Etapa 2: El Puzzle Deslizante 3x3 (CSS Grid + Algoritmo Soluble)
* **Mecánica:** Cuadrícula de **3x3** (8 piezas con fragmentos de la imagen cuadrada `/adventureday2026/assets/img/puzzle.png` de `600x600px` + 1 casilla vacía). Al tocar una pieza adyacente al hueco vacío, se desliza hacia él. Si `puzzle.png` aún no existe, las fichas deben mostrar números grandes (1-8) y un fondo de color como fallback para poder jugar igual.
* **Garantía de solubilidad y baja dificultad (CRÍTICO):** **PROHIBIDO** barajar las piezas con un `Math.random()` simple sobre el array (puede generar permutaciones matemáticamente irresolubles o demasiado largas). El estado inicial debe generarse partiendo del puzzle **ya resuelto** y ejecutando por código entre **15 y 20 movimientos aleatorios válidos inversos** (sin deshacer inmediatamente el movimiento anterior). Esto garantiza al 100% que tiene solución y que se resuelve en menos de un minuto.

### Etapa 3: Juego de Memoria / Encontrar Parejas (Grid 5x4)
* **Mecánica:** Cuadrícula de **20 cartas (4 columnas × 5 filas)** dadas la vuelta. Hay 10 parejas de iconos/símbolos relacionados con el geocaching o el evento, barajadas con el algoritmo Fisher-Yates.
* **Interacción y Animación:** Al tocar una carta, gira con efecto 3D en CSS (`transform: rotateY(180deg)`). Se voltean de dos en dos (bloqueando el tablero mientras se comprueba la pareja). Si coinciden, quedan marcadas/descartadas; si no, vuelven a girarse tras `800ms`. El juego termina al emparejar las 20 cartas.

### Etapa 4: Sopa de Letras Táctil (Grid Pequeño)
* **Mecánica:** Cuadrícula pequeña (ej. **8x8** celdas) con **3 o 4 palabras** temáticas de geocaching ocultas en horizontal, vertical o diagonal. La lista de palabras a buscar se muestra encima o debajo del tablero y se van tachando al encontrarlas.
* **Interacción táctil adaptada a móvil:** Permitir doble modalidad para evitar fallos de precisión en pantallas pequeñas:
  1. Arrastrar el dedo de la primera a la última letra (`touchstart` + `touchmove` usando `document.elementFromPoint(touch.clientX, touch.clientY)`).
  2. Tocar la primera letra y luego tocar la última letra de la palabra (modo *tap-inicio / tap-fin*).

### Etapa 5: Mini-Juego Arcade "Atrapa el Logo" (HTML5 Canvas)
* **Mecánica:** Juego tipo *catcher* usando `<canvas>` y `requestAnimationFrame`. En la parte inferior hay un receptor/cesta que el jugador mueve de izquierda a derecha deslizando el dedo por la pantalla (seguimiento horizontal suave del toque).
* **Objetos y Reglas:** Desde la parte superior caen dos tipos de objetos:
  * **Logos del Adventure Day** (buenos): Suman `+1` al marcador.
  * **Bombas** (malos): Si chocan con el jugador, restan una vida (o penalizan puntos / reinician la ronda si se agotan las 3 vidas).
* **Condición de victoria:** El juego finaliza inmediatamente al atrapar **26 logos** (en honor al año 2026), deteniendo el bucle de animación y mostrando la clave de la etapa.

---

## 4. Estructura de Archivos del Proyecto
Para evitar que los usuarios adivinen las URLs de las etapas cambiando números, cada etapa se alojará en una carpeta con un **identificador alfanumérico aleatorio**:

```text
/
├── index.html          # Página inicial con instrucciones y enlace al Adventure Lab
├── 404.html            # Página de señuelo ("Aquí no hay nada, sigue buscando") para QRs falsos
├── README.md           # Descripción pública del proyecto
├── AGENTS.md           # Este archivo de directrices técnicas
├── ROADMAP.md          # Lista de tareas pendientes y completadas
├── CHANGELOG.md        # Registro cronológico de cambios realizados
├── assets/
│   ├── css/
│   │   └── styles.css  # Estilos globales (Header, Footer, Reset, Layout móvil, Modales de éxito)
│   ├── js/
│   │   └── common.js   # Funciones compartidas (header/footer dinámicos o utilidades)
│   └── img/
│       ├── logo.png    # Logo del encabezado (600x160px aprox.)
│       └── puzzle.png  # Imagen cuadrada para el puzzle 3x3 (600x600px)
├── [hash-etapa-1]/     # Etapa 1: Laberinto táctil de trazo
│   └── index.html
├── [hash-etapa-2]/     # Etapa 2: Puzzle deslizante 3x3
│   └── index.html
├── [hash-etapa-3]/     # Etapa 3: Juego de parejas (5x4 - 20 cartas)
│   └── index.html
├── [hash-etapa-4]/     # Etapa 4: Sopa de letras táctil (3-4 palabras)
│   └── index.html
└── [hash-etapa-5]/     # Etapa 5: Mini-juego arcade (26 logos vs bombas)
    └── index.html
```

---

## 5. Flujo de Trabajo y Mantenimiento Documental (REGLA ESTRICTA)
Cada vez que se complete una tarea o se realice un cambio de los listados en `ROADMAP.md`:
1. **Actualizar `ROADMAP.md`:** Marcar la tarea correspondiente como completada (`[x]`).
2. **Actualizar `CHANGELOG.md`:** Añadir una nueva entrada con la fecha y el detalle técnico de lo que se ha creado o modificado.
3. No dar por cerrada una fase sin entregar la actualización de ambos archivos.
