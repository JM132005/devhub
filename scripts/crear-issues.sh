#!/usr/bin/env bash
# ============================================================================
#  crear-issues.sh → crea en GitHub las ETIQUETAS, MILESTONES e ISSUES de DevHub.
#
#  Requisitos (una sola vez):
#    1. Instalar GitHub CLI:  https://cli.github.com  (en Windows: winget install GitHub.cli)
#    2. Iniciar sesión:       gh auth login
#    3. Permiso de Projects:  gh auth refresh -s project
#
#  Uso (desde la carpeta del repo, en Git Bash):
#    bash scripts/crear-issues.sh
#
#  Los Issues que YA resuelve el código base (v0.1.0) se crean y se cierran con un comentario,
#  así el tablero muestra el historial completo. Los pendientes quedan abiertos.
# ============================================================================

set -e  # si un comando falla, el script se detiene

# ---------- Configuración (cámbiala si quieres) ----------
M1="M1 · Base"
M2="M2 · Completo"
FECHA_M1="2026-10-24T23:59:59Z"   # fin de la semana 1
FECHA_M2="2026-10-31T23:59:59Z"   # fecha de entrega
PROYECTO="DevHub"                  # nombre del tablero en GitHub Projects ("" para no usarlo)
PERSONA_A="JM132005"               # usuario de GitHub de la Persona A (ej: "jm-dev"); "" = sin asignar
PERSONA_B=""                       # usuario de GitHub de la Persona B

echo "📌 Repositorio: $(gh repo view --json nameWithOwner -q .nameWithOwner)"

# ---------- 1. Etiquetas ----------
# gh label create NOMBRE --color HEX --description TEXTO --force (force = si existe, la actualiza)
echo "🏷️  Creando etiquetas..."
etiqueta() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null; }
etiqueta feat       1d76db "Nueva funcionalidad"
etiqueta fix        d73a4a "Corrección de error"
etiqueta docs       0075ca "Documentación"
etiqueta test       5319e7 "Pruebas"
etiqueta ci         fbca04 "Pipeline / DevOps"
etiqueta auth       c5def5 "Módulo autenticación"
etiqueta proyectos  c5def5 "Módulo proyectos"
etiqueta specs      c5def5 "Módulo especificaciones"
etiqueta tareas     c5def5 "Módulo tareas/Kanban"
etiqueta review     c5def5 "Módulo code review"
etiqueta dashboard  c5def5 "Módulo métricas"
etiqueta alta       b60205 "Prioridad alta"
etiqueta media      e99695 "Prioridad media"
etiqueta baja       f9d0c4 "Prioridad baja"

# ---------- 2. Milestones ----------
# gh api: llama directo a la API REST de GitHub. {owner}/{repo} se reemplaza solo.
echo "🎯 Creando milestones..."
gh api "repos/{owner}/{repo}/milestones" -f title="$M1" -f due_on="$FECHA_M1" -f description="Base: repo, CI, login, proyectos, specs, tareas" >/dev/null 2>&1 || echo "   ($M1 ya existía)"
gh api "repos/{owner}/{repo}/milestones" -f title="$M2" -f due_on="$FECHA_M2" -f description="Completo: kanban, code review, dashboard, deploy, informe" >/dev/null 2>&1 || echo "   ($M2 ya existía)"

# ---------- 3. Issues ----------
# issue TITULO ETIQUETAS MILESTONE RESPONSABLE ESTADO CUERPO
#   ESTADO = "cerrado" si ya lo resuelve el código base, "abierto" si falta hacerlo.
issue() {
  local titulo="$1" etiquetas="$2" milestone="$3" responsable="$4" estado="$5" cuerpo="$6"
  local extra=()
  [ -n "$PROYECTO" ] && extra+=(--project "$PROYECTO")
  [ -n "$responsable" ] && extra+=(--assignee "$responsable")
  # gh issue create devuelve la URL del Issue creado
  local url
  url=$(gh issue create --title "$titulo" --label "$etiquetas" --milestone "$milestone" --body "$cuerpo" "${extra[@]}")
  if [ "$estado" = "cerrado" ]; then
    gh issue close "$url" --comment "✅ Incluido en el código base v0.1.0 (commit inicial)." >/dev/null
    echo "   ✔ $titulo (cerrado)"
  else
    echo "   ○ $titulo"
  fi
}

echo "📝 Creando Issues de $M1..."
issue "Configurar repo, protección de main y tablero"        "ci,alta"              "$M1" "$PERSONA_A" cerrado "Ruleset en main: PR obligatorio + 1 aprobación + CI en verde. Tablero Kanban en Projects."
issue "Pipeline CI: lint, test, build, e2e"                  "ci,alta"              "$M1" "$PERSONA_B" cerrado "Ver .github/workflows/ci.yml"
issue "Inicializar Spec Kit y cargar la constitución"        "docs,alta"            "$M1" "$PERSONA_A" abierto $'1. `specify init --here --ai copilot`\n2. Pegar specs/constitucion.md en /speckit.constitution\n3. Generar plan.md y tasks.md de una spec con /speckit.plan y /speckit.tasks'
issue "Cascarón Angular + NestJS + MongoDB"                  "feat,alta"            "$M1" "$PERSONA_A" cerrado "Estructura base del proyecto."
issue "HU-01 Login con JWT y roles"                          "feat,auth,alta"       "$M1" "$PERSONA_A" cerrado "Spec: specs/001-autenticacion/spec.md"
issue "HU-02 Gestión de usuarios (ADMIN)"                    "feat,auth,media"      "$M1" "$PERSONA_A" cerrado "Spec: specs/001-autenticacion/spec.md"
issue "HU-03/04/05 Proyectos y estados (RN-06)"              "feat,proyectos,alta"  "$M1" "$PERSONA_B" cerrado "Spec: specs/002-proyectos/spec.md"
issue "HU-06/07 Specs: crear, enviar, aprobar, devolver (RN-01)" "feat,specs,alta"  "$M1" "$PERSONA_A" cerrado "Spec: specs/003-especificaciones/spec.md"
issue "HU-08 Historial de versiones de spec (RN-05)"         "feat,specs,media"     "$M1" "$PERSONA_A" cerrado "Spec: specs/003-especificaciones/spec.md"
issue "HU-09 Tareas desde spec aprobada (RN-02)"             "feat,tareas,alta"     "$M1" "$PERSONA_B" cerrado "Spec: specs/004-tareas-kanban/spec.md"
issue "Pruebas TDD de RN-01 a RN-06"                         "test,alta"            "$M1" "$PERSONA_B" cerrado "Archivos *.reglas.spec.ts + test/flujo-sdd.e2e-spec.ts"

echo "📝 Creando Issues de $M2..."
issue "HU-10/11 Kanban: mover tareas y milestones (RN-03)"   "feat,tareas,alta"     "$M2" "$PERSONA_B" cerrado "Spec: specs/004-tareas-kanban/spec.md"
issue "HU-12/13 Registrar y revisar PRs (RN-04)"             "feat,review,alta"     "$M2" "$PERSONA_A" cerrado "Spec: specs/005-code-review/spec.md"
issue "HU-14 Dashboard de métricas"                          "feat,dashboard,media" "$M2" "$PERSONA_B" cerrado "Spec: specs/006-dashboard/spec.md"
issue "HU-16 Biblioteca de prompts"                          "feat,baja"            "$M2" "$PERSONA_B" cerrado "Spec: specs/006-dashboard/spec.md"
issue "Editar y reasignar tareas desde el Kanban"            "feat,tareas,media"    "$M2" "$PERSONA_B" abierto "Como líder quiero cambiar responsable, prioridad y milestone de una tarea desde su tarjeta. La API ya existe: PATCH /api/tareas/:id"
issue "Filtrar Kanban por milestone y cerrar milestones"     "feat,tareas,media"    "$M2" "$PERSONA_A" abierto "Selector de milestone sobre el tablero + botón 'Cerrar milestone' para el líder."
issue "Deploy automático (CD)"                               "ci,media"             "$M2" "$PERSONA_B" abierto "Backend en Render y frontend en Vercel/Netlify con deploy al hacer merge a main; MongoDB en Atlas."
issue "HU-15 Integración con la API de GitHub"               "feat,baja"            "$M2" "$PERSONA_A" abierto "Mostrar últimos commits, PRs abiertos y estado del pipeline del repoGithub del proyecto."
issue "Informe APA 7"                                        "docs,alta"            "$M2" ""           abierto "Persona A: bloques 1, 3, 5 + introducción. Persona B: bloques 2, 4, 6, 7 + conclusiones. Juntos: análisis crítico y propuesta."
issue "Presentación y reflexión final"                       "docs,alta"            "$M2" ""           abierto "Demo en vivo del flujo SDD completo dentro de DevHub."

echo ""
echo "✅ Listo. Revisa la pestaña Issues y tu tablero en Projects."
