# 📝 CHANGELOG — Adventure Day 2026

Registro de cambios y avances del proyecto.

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
