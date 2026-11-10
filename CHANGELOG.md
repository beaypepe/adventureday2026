# 📝 CHANGELOG — Adventure Day 2026

Registro de cambios y avances del proyecto.

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
