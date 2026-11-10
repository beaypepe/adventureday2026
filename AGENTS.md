# 🤖 AGENTS.md — Directrices Técnicas y de Contexto para IA / Desarrollo

Este documento define la arquitectura, reglas de diseño, restricciones tecnológicas, lógica de enrutamiento con códigos QR, especificaciones de activos gráficos, mecánicas de juego y flujo de trabajo del proyecto **Adventure Day 2026**. Cualquier agente de IA o desarrollador que intervenga en este repositorio **DEBE** leer y cumplir estrictamente estas directrices.

---

## 1. Contexto y Entorno de Despliegue
* **Repositorio:** `https://github.com/beaypepe/adventureday2026`
* **URL de Producción (GitHub Pages):** `https://beaypepe.github.io/adventureday2026/`
* **Tecnologías permitidas:** Exclusivamente **HTML5, CSS3 y JavaScript (Vanilla JS)**. 
* **Restricción de servidor:** Al alojarse en GitHub Pages, **NO** se puede utilizar PHP, bases de datos ni procesamiento backend. Todo debe ejecutarse en el navegador del cliente (*client-side*).
* **Rutas relativas/base:** El proyecto se sirve desde la subcarpeta `/adventureday2026/` en GitHub Pages. Todas las referencias a estilos e imágenes deben usar rutas absolutas respecto al subdirectorio (`/adventureday2026/assets/...`) para que funcionen tanto desde la raíz (`index.html`, `404.html`) como desde las subcarpetas de las etapas o desde cualquier URL inexistente.
* **Caché:** toda referencia a un archivo de `assets/` debe ir acompañada de la marca de tiempo `?v=...` descrita en el apartado 7.

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

## 3. Lógica de Enrutamiento y Dinámica de Códigos QR
Durante el evento habrá entre 20 y 30 códigos QR físicos sobre la mesa (los códigos QR en sí se generarán con una herramienta externa; **NO** hay que programar un generador de QRs en este proyecto). La web debe dar soporte a esa dinámica de la siguiente forma:

1. **5 Enlaces Correctos (Carpetas con nombres aleatorios):**
   * Para evitar que los asistentes adivinen las URLs de las etapas escribiendo `/etapa1`, `/etapa2`, etc. en el navegador, cada una de las 5 etapas estará alojada en una carpeta con un **nombre aleatorio de letras/números** (ej. `/klajdf/`, `/hbdta/`, `/uhufhd/`, etc.).
   * Los 5 códigos QR buenos apuntarán a `https://beaypepe.github.io/adventureday2026/[codigo-aleatorio]/`.
2. **20-25 Enlaces Incorrectos / Señuelos (Captura mediante `404.html`):**
   * El resto de códigos QR físicos tendrán URLs falsas con rutas aleatorias que **NO existen** en el repositorio (ej. `https://beaypepe.github.io/adventureday2026/uyzxcvhjaht`).
   * Aprovechando el comportamiento nativo de **GitHub Pages**, cualquier ruta inexistente cargará automáticamente el archivo **`404.html`** situado en la raíz del repositorio.
   * La página **`404.html`** debe mantener exactamente el mismo diseño corporativo (Header naranja, fondo blanco, Footer verde) y mostrar de forma clara y simpática un mensaje tipo: **"Aquí no hay nada... ¡sigue buscando!"**, sin dar pistas de cuáles son las rutas reales.
   * **Importante en `404.html`:** Como el navegador la renderizará bajo cualquier ruta inventada, todos sus enlaces a CSS e imágenes deben ser rutas absolutas hacia `/adventureday2026/assets/...`.

---

## 4. Especificaciones Técnicas de los 5 Minijuegos (Etapas)
Los juegos deben ser **rápidos y fáciles de resolver (1-2 minutos máximo)** para no atascar a los asistentes del evento. Todos los juegos deben incluir **fallbacks visuales** (colores, números o emojis) en caso de que las imágenes `.png` aún no estén subidas al repositorio, permitiendo probar toda la lógica desde el primer momento. Al superar cualquiera de ellos, se mostrará de forma clara y destacada en pantalla la **respuesta/código de esa etapa** para introducirla en la app Adventure Lab.

### Etapa 1: El Laberinto Táctil (HTML5 Canvas + Touch API)
* **Tamaño y Ergonomía ("Dedos Gordos"):** 
  * **CRÍTICO:** En pantallas de móvil de `360px` de ancho, una cuadrícula de 10x10 o 12x12 deja pasillos demasiado estrechos y el propio dedo tapa el camino. Se debe utilizar una cuadrícula más amplia y cómoda, de **6x6, 7x7 u 8x8 celdas** como máximo (pasillos de al menos `45px–55px` de ancho).
* **Mecánica de Colisión (Rozar vs. Atravesar):**
  * **NO** se penaliza que el jugador roce o toque los bordes de las paredes con el dedo (algo natural en pantallas táctiles).
  * Lo que está **prohibido es ATRAVESAR una pared** (pasar de una celda a otra cuando existe un muro entre ambas, o saltar celdas haciendo trampa).
  * El seguimiento del dedo (`touchmove`) debe evaluar el segmento entre la celda anterior y la celda actual: si el vector de movimiento cruza un muro (o si el usuario levanta el dedo y lo apoya en otra parte saltándose el camino), **el laberinto se reinicia al inicio** (acompañado de vibración corta `navigator.vibrate(100)` si está disponible y feedback visual).

### Etapa 2: El Puzzle Deslizante 3x3 (CSS Grid + Algoritmo Soluble)
* **Activos gráficos:** Usa la imagen cuadrada `/adventureday2026/assets/img/puzzle.png` (**600×600 píxeles**). Si la imagen no carga, cada ficha mostrará su número del 1 al 8 sobre un fondo de color como fallback.
* **Mecánica:** Cuadrícula de **3x3** (8 piezas + 1 casilla vacía). Al tocar una pieza adyacente al hueco vacío, se desliza hacia él.
* **Garantía de solubilidad y baja dificultad (CRÍTICO):** **PROHIBIDO** barajar las piezas con un `Math.random()` libre (genera permutaciones matemáticamente irresolubles el 50% de las veces). El estado inicial debe generarse partiendo del puzzle **resuelto** y aplicando por código entre **15 y 20 movimientos aleatorios válidos inversos** (evitando deshacer el movimiento inmediatamente anterior).

### Etapa 3: Juego de Memoria / Encontrar Parejas (Grid 4x5)
* **Activos gráficos:** 
  * **Ubicación:** Carpeta `/adventureday2026/assets/img/cards/`
  * **Reverso de las cartas:** `back.png` (**200×200 píxeles**, formato PNG).
  * **Anverso (10 parejas = 10 archivos):** `card1.png`, `card2.png`, `card3.png`, `card4.png`, `card5.png`, `card6.png`, `card7.png`, `card8.png`, `card9.png`, `card10.png` (**200×200 píxeles** cada uno, proporción 1:1, formato PNG).
  * **Fallback:** Si alguna imagen aún no existe en el servidor, la carta mostrará automáticamente un icono/emoji o número distintivo para poder jugar sin errores.
* **Mecánica:** Cuadrícula de **20 cartas (4 columnas × 5 filas en vertical)** dadas la vuelta y barajadas con el algoritmo Fisher-Yates.
* **Interacción:** Al tocar dos cartas, giran con efecto 3D (`rotateY(180deg)`). Si tienen el mismo logo, quedan emparejadas/descartadas; si no, vuelven a voltearse tras `800ms`. Gana al descubrir las 10 parejas.

### Etapa 4: Sopa de Letras Táctil
* **Palabras a buscar:** Se confirmarán al programar la etapa, pero se debe contemplar por defecto el uso de palabras largas como `"GEOCACHING"`, `"ADVENTURELAB"` (12 letras) y `"EVENTO"` (más alguna adicional si se decide).
* **Tamaño de cuadrícula:** Dado que `"ADVENTURELAB"` tiene **12 letras**, la cuadrícula debe adaptarse dinámicamente a la palabra más larga (por ejemplo, **12×12 celdas**). Las palabras a buscar se muestran en una lista superior/inferior y se tachan al encontrarlas.
* **Interacción táctil adaptada a móvil (Doble modalidad):**
  1. **Por arrastre:** Deslizar el dedo desde la primera hasta la última letra (`touchstart` + `touchmove` calculando la línea recta mediante `document.elementFromPoint`).
  2. **Por dos toques (ideal para celdas pequeñas en 12x12):** Tocar la primera letra de la palabra y luego tocar la última letra; si forman línea recta válida y coinciden con una palabra buscada, se marca como encontrada.

### Etapa 5: Mini-Juego Arcade "Atrapa el Logo" (HTML5 Canvas)
* **Activos gráficos:**
  * **Ubicación:** Carpeta `/adventureday2026/assets/img/arcade/`
  * **Logo bueno (a recoger):** `item-good.png` (**128×128 píxeles**, PNG con fondo transparente).
  * **Bomba (a esquivar):** `item-bad.png` (**128×128 píxeles**, PNG con fondo transparente).
  * **Receptor/Jugador (opcional):** `player.png` (**160×100 píxeles**, PNG con fondo transparente).
  * **Fallback:** Si las imágenes aún no están subidas, el `<canvas>` dibujará figuras/iconos vectoriales en su lugar para que sea 100% jugable.
* **Mecánica:** En la parte inferior hay un receptor que el jugador mueve horizontalmente arrastrando el dedo por la pantalla.
* **Reglas y Victoria:** Caen logos (`item-good.png`) y bombas (`item-bad.png`). Cada logo suma `+1`. Chocar con una bomba resta una vida (o reinicia el contador/partida al perder las vidas). El juego termina con victoria al atrapar **26 logos**.

---

## 5. Estructura de Archivos del Proyecto

```text
/
├── index.html                  # Página inicial con instrucciones y enlace al Adventure Lab
├── 404.html                    # Página señuelo ("Aquí no hay nada... sigue buscando") para QRs falsos
├── README.md                   # Descripción pública del proyecto
├── AGENTS.md                   # Este archivo de directrices técnicas
├── ROADMAP.md                  # Lista de tareas pendientes y completadas
├── CHANGELOG.md                # Registro cronológico de cambios realizados
├── tools/
│   └── bump-versions.sh        # Actualiza la marca de tiempo (?v=) de los activos
├── assets/
│   ├── css/
│   │   └── styles.css          # Estilos globales (Header, Footer, Reset, Layout móvil, Modales)
│   ├── js/
│   │   └── common.js           # Funciones compartidas (header/footer/modales de victoria)
│   └── img/
│       ├── logo.png            # Logo del encabezado (600x160px)
│       ├── puzzle.png          # Imagen cuadrada para Etapa 2 (600x600px)
│       ├── cards/              # Imágenes para Etapa 3 (200x200px cada una)
│       │   ├── back.png        # Parte trasera de las cartas
│       │   ├── card1.png       # Pareja 1
│       │   ├── ...             # ...
│       │   └── card10.png      # Pareja 10
│       └── arcade/             # Imágenes para Etapa 5
│           ├── item-good.png   # Logo Adventure Day que cae (128x128px)
│           ├── item-bad.png    # Bomba a esquivar (128x128px)
│           └── player.png      # Cesta/receptor opcional (160x100px)
├── [hash-etapa-1]/             # Carpeta con nombre aleatorio -> Etapa 1: Laberinto táctil
│   └── index.html
├── [hash-etapa-2]/             # Carpeta con nombre aleatorio -> Etapa 2: Puzzle deslizante 3x3
│   └── index.html
├── [hash-etapa-3]/             # Carpeta con nombre aleatorio -> Etapa 3: Juego de parejas (20 cartas)
│   └── index.html
├── [hash-etapa-4]/             # Carpeta con nombre aleatorio -> Etapa 4: Sopa de letras táctil
│   └── index.html
└── [hash-etapa-5]/             # Carpeta con nombre aleatorio -> Etapa 5: Mini-juego arcade (26 logos)
    └── index.html
```

---

## 6. Flujo de Trabajo y Mantenimiento Documental (REGLA ESTRICTA)
Cada vez que se complete una tarea o se realice un cambio de los listados en `ROADMAP.md`:
1. **Actualizar `ROADMAP.md`:** Marcar la tarea correspondiente como completada (`[x]`).
2. **Actualizar `CHANGELOG.md`:** Añadir una nueva entrada con la fecha y el detalle técnico de lo que se ha creado o modificado.
3. No dar por cerrada una fase sin entregar la actualización de ambos archivos.

---

## 7. Caché del Móvil y Versionado de Activos (REGLA ESTRICTA)
Los navegadores móviles guardan en caché el CSS, el JavaScript y las imágenes, y tras un cambio pueden seguir usando la versión antigua durante un buen rato. Para que el día del evento (y en las pruebas) siempre se cargue la última versión:

* **Marca de tiempo obligatoria:** toda referencia local a `/adventureday2026/assets/...` (hojas de estilo, scripts e imágenes) debe llevar el parámetro `?v=AAAAMMDDHHMMSS`, por ejemplo:
  `/adventureday2026/assets/css/styles.css?v=20261129103000`.
* **No se versionan renombrando archivos:** los nombres y rutas del apartado 5 se mantienen siempre; solo cambia el valor de `?v=`.
* **Script del proyecto:** antes de publicar cualquier cambio en `assets/`, ejecutar `tools/bump-versions.sh`. Aplica la fecha y hora actuales (UTC) a todos los archivos `.html` del proyecto y muestra la marca utilizada. Admite una marca manual: `tools/bump-versions.sh 20261129103000`. Es idempotente (no duplica el parámetro).
* **Páginas nuevas:** cualquier `index.html` nuevo (etapas) o `404.html` debe incluir el `?v=` desde el principio y pasar por el script antes de publicarse.
* **HTML:** las páginas no se pueden versionar de este modo; GitHub Pages las envía con una caché de unos 10 minutos, así que un cambio recién publicado puede tardar un poco en verse en el móvil.
