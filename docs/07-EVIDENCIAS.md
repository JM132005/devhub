# 07 · Evidencias para el informe y la presentación

> Toma las capturas con **Win + Shift + S**, guárdalas con el nombre de la columna "Archivo" en una carpeta `evidencias/` **fuera del repo** (o en OneDrive), y márcalas aquí cuando las tengas.
> Consejo: zoom del navegador al 110–125 % y ocultar pestañas/datos personales.

## GitHub (Bloques 1, 2, 4, 7)

| ✔ | Archivo | Qué capturar | Dónde | Bloque |
|---|---|---|---|---|
| ☐ | `01-repo.png` | Página principal del repo con carpetas y README | Pestaña **Code** | Parte práctica |
| ☐ | `02-ramas.png` | Lista de ramas (`main`, `docs/3-spec-kit`, `feat/…`) | **Branches** (o `git log --oneline --graph --all`) | 1 |
| ☐ | `03-ruleset.png` | Reglas de `proteger-main` | Settings → Rules → Rulesets | 1, 2 |
| ☐ | `04-historial.png` | Historial con Conventional Commits | Pestaña **Commits** | 1 |
| ☐ | `05-tag.png` | Tag `v0.1.0` (y `v1.0.0` al final) | **Tags / Releases** | 1 |
| ☐ | `06-pr-bloqueado.png` | PR con "Review required · Merging is blocked" | PR de Spec Kit (antes de aprobar) | 2 |
| ☐ | `07-pr-review.png` | Review del compañero con **Approved** y comentario | PR → Conversation | 2 |
| ☐ | `08-pr-files.png` | Comentario en una línea de código | PR → Files changed | 2 |
| ☐ | `09-pr-merged.png` | PR fusionado (morado) con "Closes #3" | PR | 2 |
| ☐ | `10-pr-plantilla.png` | Checklist de la plantilla del PR | Descripción del PR | 2 |
| ☐ | `11-actions-lista.png` | Lista de ejecuciones del CI en verde | Pestaña **Actions** | 4 |
| ☐ | `12-actions-detalle.png` | Detalle de los 2 jobs con sus pasos | Clic en una ejecución | 4 |
| ☐ | `13-ci-yml.png` | Archivo del pipeline | `.github/workflows/ci.yml` | 4 |
| ☐ | `14-actions-rojo.png` | (Opcional) Un pipeline fallido y luego corregido | Actions | 4, 6 |
| ☐ | `15-issues.png` | Lista de Issues con etiquetas y responsables | Pestaña **Issues** | 7 |
| ☐ | `16-milestones.png` | Milestones con % de avance | Issues → Milestones | 7 |
| ☐ | `17-kanban.png` | Tablero Kanban | Projects → DevHub | 7 |
| ☐ | `18-issue-detalle.png` | Un Issue cerrado por un PR | Issue #3 | 7 |

## Spec Kit, Copilot y TDD (Bloques 3, 5, 6)

| ✔ | Archivo | Qué capturar | Dónde | Bloque |
|---|---|---|---|---|
| ☐ | `19-specs-carpeta.png` | Carpeta `specs/` con 001–006 | GitHub o VS Code | 3 |
| ☐ | `20-spec-ejemplo.png` | Una spec con historia, requisitos y Dado/Cuando/Entonces | `specs/004-tareas-kanban/spec.md` | 3 |
| ☐ | `21-specify-init.png` | Terminal con `specify init` terminado | PowerShell | 3 |
| ☐ | `22-constitucion.png` | `.specify/memory/constitution.md` | VS Code | 3 |
| ☐ | `23-copilot-constitution.png` | Chat de Copilot ejecutando `/speckit.constitution` | VS Code | 5 |
| ☐ | `24-copilot-codigo.png` | Copilot sugiriendo código o pruebas | VS Code | 5 |
| ☐ | `25-prompts-devhub.png` | Pantalla **Prompts** de DevHub | App | 5 |
| ☐ | `26-npm-test.png` | `Tests 34 passed (34)` | `cd backend; npm test` | 6 |
| ☐ | `27-npm-e2e.png` | `Tests 16 passed (16)` | `npm run test:e2e` | 6 |
| ☐ | `28-tdd-rojo.png` | (Opcional) Una prueba fallando antes de programar | `npm run test:watch` | 6 |
| ☐ | `29-prueba-codigo.png` | Código de `tareas.reglas.spec.ts` | VS Code | 6 |

## Aplicación DevHub (parte práctica)

| ✔ | Archivo | Qué capturar | Usuario |
|---|---|---|---|
| ☐ | `30-login.png` | Pantalla de login | — |
| ☐ | `31-dashboard.png` | Inicio con métricas y specs por aprobar | lider |
| ☐ | `32-proyectos.png` | Lista de proyectos | lider |
| ☐ | `33-spec-detalle.png` | Spec con historial de versiones | lider |
| ☐ | `34-kanban-app.png` | Kanban de DevHub | lider |
| ☐ | `35-rn03.png` | Mensaje de error de RN-03 | diego |
| ☐ | `36-revision.png` | Checklist de revisión | ana |
| ☐ | `37-rn06.png` | Mensaje de error de RN-06 | lider |
| ☐ | `38-usuarios.png` | Gestión de usuarios | admin |
| ☐ | `39-movil.png` | Vista en celular (F12 → modo dispositivo, o celular real) | cualquiera |
| ☐ | `40-compass.png` | Base `devhub` con sus 6 colecciones en Compass | — |

## Dónde va cada evidencia en el informe

| Sección del informe | Evidencias |
|---|---|
| Bloque 1 · Git avanzado y estrategias de ramas | 02, 03, 04, 05 |
| Bloque 2 · GitHub, PR y Code Review | 06, 07, 08, 09, 10 |
| Bloque 3 · SDD y Spec Kit | 19, 20, 21, 22, 33 |
| Bloque 4 · CI/CD y GitHub Actions | 11, 12, 13, 14 |
| Bloque 5 · Copilot y prompts | 23, 24, 25 |
| Bloque 6 · TDD y pruebas en pipelines | 26, 27, 28, 29, 35, 37 |
| Bloque 7 · Issues, Kanban y milestones | 15, 16, 17, 18, 34 |
| Propuesta / parte práctica | 01, 30–40 |
