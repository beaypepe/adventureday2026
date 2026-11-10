# 🤖 AGENTS.md — Directrices Técnicas y de Contexto para IA / Desarrollo

Este documento define la arquitectura, reglas de diseño, restricciones tecnológicas y flujo de trabajo del proyecto **Adventure Day 2026**. Cualquier agente de IA o desarrollador que intervenga en este repositorio **DEBE** leer y cumplir estrictamente estas directrices.

---

## 1. Contexto y Entorno de Despliegue
* **Repositorio:** `https://github.com/beaypepe/adventureday2026`
* **URL de Producción (GitHub Pages):** `https://beaypepe.github.io/adventureday2026/`
* **Tecnologías permitidas:** Exclusivamente **HTML5, CSS3 y JavaScript (Vanilla JS)**. 
* **Restricción de servidor:** Al alojarse en GitHub Pages, **NO** se puede utilizar PHP, bases de datos ni procesamiento backend. Todo debe ejecutarse en el navegador del cliente (*client-side*).
* **Rutas relativas/base:** Tener en cuenta que el proyecto se sirve desde la subcarpeta `/adventureday2026/` en GitHub Pages. Usar rutas relativas o absolutas referenciadas a `/adventureday2026/` (especialmente importante en `404.html`, ya que se carga desde cualquier URL errónea).

---

## 2. Diseño e Interfaz (UI/UX Mobile-Only)
El proyecto se consumirá **exclusivamente desde teléfonos móviles** durante el evento presencial del 29 de noviembre de 2026.

* **Enfoque Mobile-First estricto:** 
  * Diseño pensado para pantallas verticales (ancho de `360px` a `430px`).
  * Evitar el *scroll* vertical u horizontal involuntario durante los juegos táctiles (`touch-action: none` o `overflow: hidden` en los contenedores de juego).
  * En escritorio se puede limitar el contenedor principal a un `max-width: 480px` centrado para facilitar las pruebas, pero la prioridad absoluta es la experiencia táctil móvil.
* **Paleta de Colores Corporativa:**
  * **Header (Encabezado):** Fondo naranja `#d65b33`, texto blanco `#ffffff`.
  * **Main (Contenido):** Fondo blanco `#ffffff`, texto negro `#000000`.
  * **Footer (Pie de página):** Fondo verde `#02874d`, texto blanco `#ffffff`.
* **Header (Común a todas las páginas):**
  * Centrado, color de fondo `#d65b33`.
  * Contiene la imagen `assets/img/logo.png` centrada.
  * **Regla de Fallback del Logo:** Si `logo.png` no existe o no carga, debe mostrarse automáticamente el texto `"Adventure Day 2026"` estilizado en blanco y negrita (usando el atributo `onerror` de la imagen para alternar la visibilidad con un elemento de texto).
* **Footer (Común a todas las páginas):**
  * Centrado, color de fondo `#02874d`.
  * Texto obligatorio: `Una ocurrencia de <a href="https://beaypepe.com" target="_blank" rel="noopener">BeayPepe</a>` (con el enlace claramente legible en blanco y subrayado/destacado).

---

## 3. Estructura de Archivos del Proyecto
Para evitar que los usuarios adivinen las URLs de las etapas cambiando números, cada etapa se alojará en una carpeta con un **identificador alfanumérico aleatorio** (que se definirá al crear cada etapa):

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
│   │   └── styles.css  # Estilos globales (Header, Footer, Reset, Layout móvil)
│   ├── js/
│   │   └── common.js   # Scripts compartidos (si fueran necesarios)
│   └── img/
│       ├── logo.png    # Logo del encabezado (600x160px aprox.)
│       └── puzzle.png  # Imagen cuadrada para el puzzle (600x600px)
├── [hash-etapa-1]/     # Etapa 1: Laberinto táctil de trazo (Canvas Touch)
│   └── index.html
├── [hash-etapa-2]/     # Etapa 2: Puzzle deslizante 3x3
│   └── index.html
├── [hash-etapa-3]/     # Etapa 3: Juego de memoria / parejas (Grid 5x4 - 20 cartas)
│   └── index.html
├── [hash-etapa-4]/     # Etapa 4: Sopa de letras táctil (3-4 palabras geocaching)
│   └── index.html
└── [hash-etapa-5]/     # Etapa 5: Mini-juego arcade (Recoger 26 logos y esquivar bombas)
    └── index.html
