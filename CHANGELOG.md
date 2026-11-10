# 📝 CHANGELOG — Adventure Day 2026

Registro de cambios y avances del proyecto.

## 2026-11-10 — Llegan las cartas del juego de parejas

### Añadido
- **`assets/img/cards/`**: las 11 imágenes definitivas (`back.png` y `card1.png` a `card10.png`), todas de **400×400 px** y PNG. El juego las usa automáticamente: cada carta comprueba su archivo y, si carga, tapa el emoji y el número de reserva. Los anversos son chinchetas de colores sobre fondo blanco (naranja, verde, morado, rojo, azul, amarillo, verde neón, granate, negro y una solo de contorno) y el reverso es la imagen del globo con «AdventureDay».

### Notas
- Las cartas se parecen dos a dos: la 2 (verde `#02864D`) con la 7 (verde neón `#00FE4E`) y la 4 (rojo `#FE0000`) con la 8 (granate `#970000`). Se distinguen, pero si en el evento se confunden a menudo, basta con dejar visible el número pequeño de la esquina también con imagen.

## 2026-11-10 — Las parejas acertadas desaparecen

### Modificado
- **`assets/js/parejas.js`**: al acertar una pareja, las dos cartas se marcan con marco verde y, **450 ms después, se desvanecen**. Antes se quedaban boca arriba y el tablero acababa lleno de cartas destapadas.
- **`assets/css/styles.css`**: clase `.carta--fuera` con la transición de salida (opacidad a 0 y escala 0.85 en 300 ms). La carta se oculta con `visibility: hidden`, así que **sigue ocupando su sitio en la cuadrícula** y las demás no se recolocan. Al pulsar «Barajar otra vez» vuelven todas.

### Notas
- Verificado en Chromium (360×780): tras acertar, las dos cartas pasan a `visibility: hidden` y `opacity: 0`, y las otras dieciocho no se mueven ni un píxel; al barajar reaparecen las veinte. 0 errores de JavaScript.

## 2026-11-10 — Tercer minijuego: el juego de parejas

### Añadido
- **`3n9w2q/index.html`** (carpeta asignada a Parejas): página con el Header y el Footer comunes, instrucciones, tablero de 4×5 cartas, contador «Parejas: N de 10», botón «Barajar otra vez» y el recuadro de la respuesta.
- **`assets/js/parejas.js`**: lógica del juego.
  - 20 cartas (10 parejas repetidas dos veces) barajadas con **Fisher-Yates**.
  - Al tocar una carta gira en 3D; solo pueden estar dos a la vista. Si coinciden se quedan boca arriba con marco verde; si no, se tapan otra vez a los **800 ms**.
  - Se gana al encontrar las diez parejas; el modal y el recuadro muestran la respuesta, que se guarda codificada (`window.AD.abrir("…", "3n9w2q:26")`).
  - **Reserva sin imágenes:** cada carta enseña un emoji temático sobre un color pastel propio y, en la esquina, el número de la pareja; el reverso es verde con el logo. Cuando existan las imágenes de `assets/img/cards/`, se usan automáticamente (cada carta comprueba la suya y, si carga, tapa el emoji y el número).
- **`assets/img/cards/LEEME.txt`**: medidas y nombres exactos de las 11 imágenes pendientes (`back.png` y `card1.png` a `card10.png`, 400×400 px, cuadradas, PNG).
- **`assets/css/styles.css`**: bloque del juego de parejas (`.cartas`, `.carta`, giro 3D, caras, reverso y estados de pareja encontrada).

### Notas
- Verificado en Chromium con toques reales a 320, 360, 390 y 430 px: 20 cartas, cada pareja dos veces, sin desbordes, acierto y fallo (con el retapado a los 800 ms), victoria con la respuesta correcta, «Barajar otra vez» deja el tablero boca abajo y 0 errores de JavaScript. También se probó con imágenes servidas de prueba: las caras y el reverso cambian a las imágenes y desaparecen emoji y número.

## 2026-11-10 — Vuelve el botón «Empezar de nuevo»

### Modificado
- **`b4x8rf/index.html`** y **`assets/js/laberinto.js`**: se recupera el botón «Empezar de nuevo» debajo del laberinto, con el mismo comportamiento de antes: reinicia el recorrido del mismo laberinto (no genera uno nuevo) y, si ya se había ganado, oculta el recuadro de la respuesta para poder volver a jugar. Con el botón la página queda menos vacía y el Footer sigue viéndose sin hacer scroll.
- **`AGENTS.md`** y **`ROADMAP.md`**: la descripción de la página vuelve a incluir el botón (los avisos siguen solo en el párrafo invisible `.sr-only`).

### Notas
- Verificado en Chromium (360×780): tras ganar y pulsar el botón, el recuadro de la respuesta se oculta y el recorrido se puede repetir hasta ganar otra vez, con el modal mostrando la respuesta. 0 errores de JavaScript.

## 2026-11-10 — El laberinto se queda solo en su página

### Modificado
- **`b4x8rf/index.html`**: fuera el párrafo de avisos que había debajo del tablero y el botón «Empezar de nuevo». Ahora la página muestra el título, una instrucción, el laberinto y el Footer, que queda a la vista sin hacer scroll a cualquier alto de pantalla.
- La instrucción ya no dice «sin levantarlo»: **levantar el dedo está permitido**, basta con volver a apoyarlo en la casilla donde se quedó la ficha. Es cómodo cuando la propia mano tapa el camino.
- **`assets/js/laberinto.js`**: se quita el manejo del botón de reiniciar. Los mensajes de estado se mantienen en el párrafo `#estado`, que ahora es invisible (`.sr-only` con `role="status"`), para no perder el aviso en lectores de pantalla. El resto del feedback sigue igual: fogonazo rojo en el marco y vibración corta al atravesar una pared.
- **`assets/css/styles.css`**: utilidad `.sr-only` para el texto que solo leen los lectores de pantalla.
- **`AGENTS.md`** y **`ROADMAP.md`**: recogen que la página no lleva avisos visibles ni botón y que se puede levantar el dedo.

### Notas
- Comprobado con toques reales en Chromium (360×780, `hasTouch`): soltar el dedo a mitad del recorrido no reinicia nada y, al apoyarlo de nuevo en la misma casilla, se puede seguir hasta la meta; apoyarlo en otra casilla sí reinicia; el modal sigue mostrando la respuesta. 0 errores de JavaScript.

## 2026-11-10 — Segundo minijuego: el puzzle deslizante

### Añadido
- **`7k2m9p/index.html`** (carpeta asignada al Puzzle): página con el Header y el Footer comunes, instrucciones, el tablero, el contador de movimientos, el botón «Mezclar otra vez» y el recuadro donde queda la respuesta al ganar.
- **`assets/js/puzzle.js`**: lógica del juego.
  - La imagen `assets/img/puzzle.png` se reparte en una cuadrícula **3x3** pintando cada ficha con su tercio del dibujo (`background-size: 300% 300%`).
  - **Falta la pieza de la esquina superior derecha** (trozo 2, cielo liso): por eso el hueco, cuando el puzzle está resuelto, queda en esa esquina y la imagen se ve completa salvo ese noveno.
  - Solo se mueve una ficha de las que tocan el hueco; si se toca otra, no se mueve y parpadea en rojo. Se gana cuando las ocho fichas están en su sitio.
  - Cada partida se mezcla con **18 movimientos legales al azar desde la posición resuelta** (sin deshacer el anterior): siempre tiene solución y se resuelve en 18 movimientos o menos.
  - Si `puzzle.png` no carga, cada ficha muestra su número del 1 al 8 sobre un color pastel distinto, así que el juego funciona igual.
  - La respuesta de la etapa se guarda codificada (`window.AD.abrir("…", "7k2m9p:26")`) y se revela con el modal común y el recuadro de la página.
- **`assets/css/styles.css`**: bloque nuevo del puzzle (`.puzzle`, fichas, números de reserva, aviso en rojo y marco verde al resolverlo). La variable `--maze-inset` pasa a llamarse `--juego-inset`, porque ahora la comparten el laberinto y el puzzle.

### Notas
- Se preguntó por el reparto: la cuadrícula es 3x3 y, tal y como pidió la organización, la pieza que se quita es la de la esquina superior derecha (es la zona de cielo del dibujo, la menos vistosa si falta).
- Verificado en Chromium headless a 320, 360, 390 y 430 px: 8 fichas, sin desbordes horizontales, tocar una ficha lejana no mueve nada, el puzzle se resuelve con toques reales (14–18 movimientos), el modal y el recuadro muestran la respuesta correcta, «Mezclar otra vez» vuelve a desordenarlo y 0 errores de JavaScript.

## 2026-11-10 — La meta del laberinto ya no está fija en la esquina opuesta

### Añadido
- **`elegirMeta()` en `assets/js/laberinto.js`**: al empezar cada partida se miden las distancias desde la salida con un recorrido en anchura y la meta se sortea entre las casillas lejanas, que son las que piden **al menos 20 pasos** (y el 70 % del recorrido máximo) **y quedan a 6 o más casillas de la salida en línea recta**. La salida sigue arriba a la izquierda.

### Modificado
- El dibujo de la meta (fondo tenue y anillo naranja) y la condición de victoria usan la casilla sorteada, no la esquina inferior derecha.
- **`b4x8rf/index.html`** y el mensaje de estado del juego avisan de que **la meta cambia de sitio en cada partida**, para que nadie arrastre el dedo hacia la esquina por costumbre.

### Notas
- Medido sobre 2000 laberintos de 8x8: el recorrido hasta la meta va de **23 pasos** (el más corto) a unos 50, con una media de **38,8**, frente a los 31 pasos que pedía la esquina fija. En el 2 % de las partidas la meta cae en la esquina opuesta por azar, no por norma.
- Comprobado con toques reales en Chromium: la meta sorteada se alcanza, la victoria muestra la respuesta y el recorrido vuelve a la salida al cruzar una pared, con 0 errores de JavaScript.

## 2026-11-10 — El laberinto crece a 8x8 y pierde las esquinas redondeadas

### Modificado
- **`assets/js/laberinto.js`**: la cuadrícula pasa de 6x6 a **8x8** celdas. La solución media sube de unas 19 casillas a unas 32, así que el recorrido es más largo y pide más atención sin dejar de resolverse en menos de un minuto.
- **`assets/css/styles.css`**: `.maze` pierde el `border-radius` (esquinas rectas) y pasa a ocupar **casi todo el ancho de la pantalla**: rompe el margen lateral del contenido (20 px) con márgenes negativos y deja solo un respiro de 8 px por lado, definido en la variable `--maze-inset`. Así los pasillos miden 38 px en móviles de 320 px, 43 px en los de 360, 47 px en los de 390 y 52 px en los de 430, en lugar de los 35 px a los que se quedaban con 8x8 dentro del contenedor.
- **`AGENTS.md`** y **`ROADMAP.md`**: la especificación del laberinto recoge la cuadrícula 8x8 y el lienzo a todo lo ancho.

### Notas
- Se probaron 8x8 y 9x9: con 9x9 la solución media sube a unas 39,5 casillas (solo 7 más) pero los pasillos bajan a 31 px en móviles de 320, demasiado estrechos para el dedo. Se descarta el 9x9.
- Verificado en Chromium headless a 320, 360, 390 y 430 px: sin desbordes horizontales, cruzar una pared reinicia el recorrido, apoyar el dedo fuera del camino también, el trazo completo llega a la meta y el modal muestra la respuesta correcta, con 0 errores de JavaScript.

## 2026-11-10 — Respuestas de las etapas guardadas en clave

### Añadido
- **`window.AD.abrir(codificado, llave)`** en `assets/js/common.js`: recupera la respuesta de una etapa a partir de su forma guardada (base64 de los caracteres mezclados con una llave propia de cada juego). Así ninguna respuesta aparece en claro al abrir los archivos del repositorio.
- Las cinco respuestas del evento quedan definidas por la organización. La del **Laberinto** ya está incorporada en `assets/js/laberinto.js`; las otras cuatro se añadirán, con el mismo mecanismo, al programar sus juegos.

### Modificado
- **`assets/js/laberinto.js`**: `RESPUESTA` deja de ser un texto de prueba y pasa a ser `window.AD.abrir("…", "b4x8rf:26")`. El modal de victoria y el recuadro de la página muestran la respuesta ya descifrada.
- **`AGENTS.md`**: nueva regla estricta en el apartado 4: las respuestas no se escriben en claro ni en el código ni en la documentación, y se recuperan siempre con `AD.abrir()`.
- **`ROADMAP.md`**: la tarea de definir nombres, respuestas y URL del Lab queda cerrada (sin anotar los valores).

### Notas
- Comprobado que ninguna de las cinco respuestas aparece en texto plano en el repositorio (`grep` sobre todos los archivos) y que el recorrido completo del laberinto muestra la respuesta correcta en el modal y en el recuadro permanente.
- Limitación conocida: al ser un sitio estático en un repositorio público, la codificación evita el hallazgo casual, pero cualquiera que separe el tiempo suficiente puede descifrarla.

## 2026-11-10 — Primer minijuego: el laberinto táctil

### Añadido
- **`b4x8rf/index.html`** (carpeta asignada al Laberinto): página del minijuego con el Header y Footer comunes, instrucciones de una línea, `<canvas class="maze">`, mensaje de estado, botón «Empezar de nuevo» y un recuadro donde queda la respuesta al ganar.
- **`assets/js/laberinto.js`**: lógica del juego.
  - Laberinto generado con retroceso recursivo sobre una cuadrícula **6×6** (perfecto y siempre soluble; pasillos de 47 px en móviles de 320 px y 60 px en los de 430 px), distinto en cada partida.
  - Seguimiento del dedo con Pointer Events y muestreo del segmento recorrido entre eventos: rozar una pared no penaliza, pero atravesarla, saltar de casilla o apoyar el dedo fuera del camino reinicia la partida con vibración (`navigator.vibrate(100)`), borde rojo y aviso en pantalla.
  - Se dibuja el camino ya recorrido, la salida verde, la meta naranja y la ficha del jugador.
  - Al llegar a la meta: mensaje, vibración, recuadro con la respuesta y modal común. La respuesta se guarda en la constante `RESPUESTA` (de momento `"PENDIENTE"`).
  - Admite `?seed=N` para repetir un mismo laberinto en las pruebas.
- **Modal de victoria en `assets/js/common.js`**: `window.AD.mostrarRespuesta(texto)` crea (una sola vez) un diálogo `role="dialog" aria-modal="true"` con la respuesta de la etapa, bloquea el scroll de fondo, cierra con el botón, con `Escape` o tocando fuera, y devuelve el foco al elemento anterior. Es el que usarán los cinco juegos.

### Modificado
- **`assets/css/styles.css`**: botón secundario (`.btn--secundario`), estilos del tablero (`.maze`, con `touch-action: none` y `user-select: none`, y `.maze--fallo` para el fogonazo), textos de estado y de respuesta, y estilos del modal (`.modal`, `.modal__caja`, `.modal__respuesta`…).
- **`AGENTS.md`**: el árbol del apartado 5 recoge las cinco carpetas reales (`b4x8rf`, `7k2m9p`, `3n9w2q`, `m8d6fc`, `5h1j7v`) y `assets/js/laberinto.js`; el apartado 4 explica que la respuesta se revela con `AD.mostrarRespuesta()` y que las páginas se titulan solo con el nombre del juego, sin numerarlas.
- **`ROADMAP.md`**: nombres de carpeta asignados y tarea de la Fase 1 de estilos/utilidades cerrada; el laberinto queda marcado como hecho, con la respuesta real pendiente.

### Notas
- Probado en Chromium con eventos táctiles reales, replicando en Node el mismo generador con semilla fija: el recorrido completo de la solución abre el modal con la respuesta; atravesar una pared y empezar fuera de la casilla muestran su aviso y reinician; el modal se cierra con el botón y con `Escape`; la página no hace scroll mientras se arrastra.
- Sin desbordes a 320, 360, 390 y 430 px; `html-validate` y `csstree-validator` sin errores.
- Pendiente: escribir las respuestas reales en cada juego (ahora `"PENDIENTE"`).

## 2026-11-10 — El logo del Header lleva al inicio y la 404 deja de enlazarlo

### Modificado
- **`index.html` y `404.html`**: el logo del Header (y el texto de reserva) van ahora dentro de `.site-header__link`, un enlace a `/adventureday2026/`.
- **`404.html`**: eliminado el enlace «Volver al inicio» y el párrafo que lo contenía. Quien llega desde un QR señuelo ya no tiene un camino directo de vuelta; si lo busca, el logo del Header lo lleva al inicio.
- **`assets/css/styles.css`**: nueva regla `.site-header__link` (bloque, color heredado para que el texto de reserva siga en blanco, sin subrayado, sin destello al tocar, `:active` al 85 % de opacidad y `:focus-visible` con contorno blanco). Eliminada la regla `.note a`, que ya no se usaba.
- **`AGENTS.md`**: el apartado 2 exige que el logo del Header enlace al inicio en todas las páginas y el apartado 3 aclara que `404.html` no lleva enlaces de vuelta al inicio.

### Notas
- Comprobado en Chromium: desde la 404, el clic en el logo carga la portada; bloqueando `logo.png` aparece el texto de reserva dentro del mismo enlace; Header de 75 px, logo de 206×55 px y sin desbordes a 360 px.

## 2026-11-10 — Favicon propio y textos de inicio ajustados

### Añadido
- **`assets/img/favicon.png`** (180×180 px, fondo transparente) y **`assets/img/apple-touch-icon.png`** (180×180 px, fondo blanco para iOS): icono del sitio construido a partir del símbolo del logotipo oficial de Adventure Lab (el marcador con forma de globo naranja).
  - Se declaran en el `<head>` de `index.html` y `404.html` con `<link rel="icon">` y `<link rel="apple-touch-icon">`, con su marca de tiempo `?v=`.
  - Servidos desde el propio repositorio (no se enlaza el servicio de iconos de Google): así no dependemos de un tercero y se respeta la regla de rutas absolutas del apartado 1 de `AGENTS.md`.

### Modificado
- **`index.html`**:
  - Paso 1: «Encuentra los cinco códigos QR.», sin mencionar que estén repartidos por la mesa.
  - Entrada: «Durante el evento **Adventure Day 2026** (en negrita y enlazado a `https://www.geocaching.com/geocache/GCC0481`), que se celebra el **29 de noviembre**, podrás completar un **Adventure Lab** de 5 etapas…».
- **`assets/css/styles.css`**: nueva regla `.site-main a` (enlaces de texto en verde corporativo `#02874d` y subrayados, 4,59:1 de contraste sobre blanco); `.note a` conserva solo la negrita.
- **`AGENTS.md`**: el apartado 2 documenta el favicon como elemento común a todas las páginas y el árbol del apartado 5 incluye los dos archivos nuevos.

### Notas
- El icono se ha generado localmente porque el entorno de trabajo no tiene salida a `google.com` ni a `geocaching.com`. Si se prefiere el PNG exacto que devuelve Google (`https://www.google.com/s2/favicons?domain=labs.geocaching.com&sz=128`), basta con sustituir `assets/img/favicon.png` y ejecutar `tools/bump-versions.sh` para que los móviles dejen de usar el anterior.

## 2026-11-10 — Inicio más discreto, acceso al Lab con imagen y página 404

### Añadido
- **`404.html`**: página señuelo que GitHub Pages muestra automáticamente en cualquier ruta inexistente (todos los QR falsos).
  - Mismo Header y Footer que el resto de páginas; mensaje «Aquí no hay nada…» + «¡Sigue buscando!» centrado en pantalla, con un discreto enlace «Volver al inicio».
  - Rutas absolutas `/adventureday2026/assets/...` con su `?v=`, sin ninguna pista sobre las rutas reales de las etapas, y `<meta name="robots" content="noindex">` para que no la indexen los buscadores.
- **`assets/js/common.js`**: primer bloque de utilidades compartidas por todas las páginas.
  - `LAB_OPEN_AT = Date.UTC(2026, 10, 28, 23, 0, 0)`: 29 de noviembre de 2026 a las 00:00 en la España peninsular (UTC+1). Al ser un instante fijo, no depende de la zona horaria configurada en el teléfono.
  - Antes de esa fecha, el enlace al Adventure Lab (`[data-lab-link]`) no navega: muestra el aviso `[data-lab-locked]` y lo desplaza a la vista. A partir de la fecha el enlace funciona con normalidad.
  - Sin JavaScript no hay bloqueo (el `<a href>` funciona igual), pero el Adventure Lab tampoco está activo antes del evento.

### Modificado
- **`index.html`**:
  - Textos con menos pistas: tres pasos (encuentra los cinco QR / supera los cinco minijuegos / completa el Adventure Lab). Ya no se menciona la mesa del evento ni que haya QR señuelos, que será la sorpresa del día.
  - El botón verde se sustituye por `assets/img/puzzle.png` (260×260 px, esquinas redondeadas y sombra) como imagen-enlace al Adventure Lab, con el texto «Toca la imagen para abrir el Adventure Lab».
  - El aviso de que el Lab todavía no está activo solo aparece al tocar la imagen antes del 29 de noviembre.
- **`assets/css/styles.css`**: nuevas clases `.lab`, `.lab__link`, `.lab__img`, `.lab__hint`, `.lab__locked`, `.lead` y `.site-main--404` (centrado vertical del mensaje), más `.note a` en negrita.

### Notas
- Probado en Chromium con reloj simulado: el 10-nov y el 28-nov a las 23:59:59 (UTC) bloquean y muestran el aviso; desde el 29-nov a las 00:00:01 (hora peninsular) el enlace navega al Lab.
- Sin desbordamiento horizontal a 320, 360, 390 y 430 px. `404.html` responde con estado HTTP 404 y sin errores de JavaScript.
- `puzzle.png` pesa 455 KB (es también la imagen del puzzle de la etapa 2): se puede optimizar si conviene.

## 2026-11-10 — Versionado de los activos para evitar la caché del móvil

### Añadido
- **`tools/bump-versions.sh`**: script de mantenimiento que añade o actualiza el parámetro `?v=AAAAMMDDHHMMSS` en todas las referencias locales a `/adventureday2026/assets/...` de los archivos `.html`.
  - Sin argumentos usa la fecha y hora actuales en UTC; admite una marca manual (`tools/bump-versions.sh 20261129103000`) y valida que tenga 14 dígitos.
  - Es idempotente: ejecutarlo varias veces nunca duplica el parámetro, solo cambia su valor. Requiere `perl` (incluido por defecto en macOS y Linux) y no modifica nada más.

### Modificado
- **`index.html`**: la hoja de estilos y el logo se referencian ahora con marca de tiempo (`styles.css?v=...`, `logo.png?v=...`), y se ha añadido un comentario explicando cómo actualizarla. Marca en uso: `v=20261110111055`.
- **`assets/img/logo.png`** y **`assets/img/puzzle.png`** (subidas desde GitHub): imágenes definitivas del logo (600×160) y del puzzle de la etapa 2 (600×600). El Header ya muestra el logo real y el texto de reserva sigue disponible por si algún día falta el archivo.
- **`AGENTS.md`**: nuevo apartado 7 «Caché del móvil y versionado de activos», que hace obligatorio el `?v=` en toda referencia a `assets/`, prohíbe versionar renombrando archivos y obliga a ejecutar el script antes de publicar cambios. El árbol de archivos del apartado 5 incluye ahora `tools/` y el apartado 1 remite al 7.

### Notas
- El script se ejecutará antes de cada publicación que afecte a `assets/`. GitHub Pages cachea el HTML unos 10 minutos, así que un cambio recién publicado puede tardar un poco en verse en el móvil.
- Comprobado con la caché de 600 s simulada: cambiando el CSS sin tocar el `?v=`, el navegador sigue mostrando el estilo antiguo; con la marca nueva, descarga el archivo nuevo.
- `assets/img/logo.txt` contiene solo una nota de texto («aquí va el logo») y no se usa en la web; se puede borrar sin más.

## 2026-11-10 — Página de inicio y base de estilos

### Añadido
- **`index.html`**: página de inicio con la estructura común de Header y Footer, instrucciones breves de la dinámica de los códigos QR (4 pasos numerados) y botón «Abrir el Adventure Lab».
  - El botón enlaza a `https://labs.geocaching.com/goto/f07cb7fa-078f-4148-9afd-9f92e5e0029f` en la misma pestaña (sin `target="_blank"`), para que el móvil pueda abrir directamente la app. Debajo se avisa de que el Adventure Lab no estará visible hasta el día del evento.
  - Header con `logo.png` y fallback mediante `onerror` en el HTML: si la imagen no carga, se oculta y aparece el texto «Adventure Day 2026» en blanco y negrita.
  - Rutas absolutas `/adventureday2026/assets/...` para estilos e imágenes.
- **`assets/css/styles.css`**: base de la hoja de estilos global.
  - Variables CSS con la paleta corporativa (`#d65b33`, `#02874d`, `#ffffff`, `#000000`) y reset mínimo.
  - Layout móvil: columna centrada con `max-width: 480px`, altura mínima de pantalla completa (`100dvh`) y Footer siempre al final.
  - Estilos de Header (logo con `max-height: 55px`), Footer (enlace blanco, en negrita y subrayado), títulos, lista de pasos numerados (`.steps`), botón principal (`.btn`) y nota (`.note`).

### Notas
- `assets/img/logo.png` todavía no existe, así que de momento el Header muestra el texto de reserva.
