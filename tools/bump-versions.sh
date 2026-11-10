#!/usr/bin/env bash
#
# bump-versions.sh — Marca de tiempo para saltar la caché del móvil.
#
# Añade o actualiza el parámetro ?v=AAAAAMMDDHHMMSS en todas las referencias
# locales a /adventureday2026/assets/... de los archivos .html del proyecto.
# Al cambiar la URL, el móvil se ve obligado a descargar la versión nueva en
# lugar de reutilizar la que tenía guardada.
#
# Úsalo antes de publicar cualquier cambio en assets/ (CSS, JS o imágenes):
#
#   tools/bump-versions.sh                  # fecha y hora actuales (UTC)
#   tools/bump-versions.sh 20261129103000   # fuerza una marca concreta
#
# Es idempotente: se puede ejecutar tantas veces como haga falta sin duplicar
# el parámetro. No toca nada más que el valor de ?v=.

set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v perl >/dev/null 2>&1; then
  echo "Error: hace falta perl (viene instalado por defecto en macOS y Linux)." >&2
  exit 1
fi

stamp="${1:-$(date -u +%Y%m%d%H%M%S)}"

if [[ ! "$stamp" =~ ^[0-9]{14}$ ]]; then
  echo "Error: la marca debe tener 14 dígitos (AAAAMMDDHHMMSS). Recibido: $stamp" >&2
  exit 1
fi

export STAMP="$stamp"

count=0
while IFS= read -r -d '' file; do
  perl -pi -e '
    my $v = $ENV{STAMP};
    # 1) Referencias que ya llevan ?v=... -> se actualiza el valor.
    s{(/adventureday2026/assets/[^"\x27?\s]+)\?v=[0-9]+}{$1 . "?v=" . $v}ge;
    # 2) Referencias locales todavía sin marca -> se añade al final.
    s{(/adventureday2026/assets/[^"\x27?\s]+)(?=["\x27])}{$1 . "?v=" . $v}ge;
  ' "$file"
  echo "· ${file#./}"
  count=$((count + 1))
done < <(find . -type f -name '*.html' -not -path './.git/*' -print0)

if [ "$count" -eq 0 ]; then
  echo "No se ha encontrado ningún archivo .html en el proyecto."
  exit 0
fi

echo "Marca de tiempo aplicada: v=$stamp ($count archivo(s) HTML revisado(s))"
