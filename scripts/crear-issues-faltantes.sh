#!/usr/bin/env bash
# crear-issues-faltantes.sh → crea los Issues que no alcanzó a crear el primer script.
# No usa --project porque el tablero los agrega solo (automatización "Item added").
set -e
M2="M2 · Completo"

gh issue create --title "Filtrar Kanban por milestone y cerrar milestones" --label "feat,tareas,media" --milestone "$M2" --assignee "JM132005" \
  --body "Selector de milestone sobre el tablero + botón 'Cerrar milestone' para el líder."

gh issue create --title "Deploy automático (CD)" --label "ci,media" --milestone "$M2" \
  --body "Backend en Render y frontend en Vercel/Netlify con deploy al hacer merge a main; MongoDB en Atlas."

gh issue create --title "HU-15 Integración con la API de GitHub" --label "feat,baja" --milestone "$M2" --assignee "JM132005" \
  --body "Mostrar últimos commits, PRs abiertos y estado del pipeline del repoGithub del proyecto."

gh issue create --title "Informe APA 7" --label "docs,alta" --milestone "$M2" \
  --body "Persona A: bloques 1, 3, 5 + introducción. Persona B: bloques 2, 4, 6, 7 + conclusiones. Juntos: análisis crítico y propuesta."

gh issue create --title "Presentación y reflexión final" --label "docs,alta" --milestone "$M2" \
  --body "Demo en vivo del flujo SDD completo dentro de DevHub."

echo "✅ Listo: Issues #17 a #21 creados."