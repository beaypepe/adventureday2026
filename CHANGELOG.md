# 📝 CHANGELOG — Adventure Day 2026

Registro de cambios y avances del proyecto.

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
