# 06 · Bitácora del proyecto

> Registro de **qué se hizo, en qué orden, con qué comandos** y **qué problemas aparecieron y cómo se resolvieron**.
> Sirve para el informe (análisis crítico) y para que el compañero entienda por qué algunas cosas están como están.

## Parte A · Cronología

### Fase 1 · Análisis y diseño
| Qué | Resultado |
|---|---|
| Lectura del caso del PDF | 5 problemas: versiones, desorganización, errores en producción, sin documentación, sin automatización |
| Elección del sistema | **DevHub** (plataforma de gestión SDD). La idea de cacao (CacaoTrack) queda para el 2.º hemisemestre |
| Stack | Angular 21 + NestJS 12 + MongoDB (Mongoose 9) |
| Reglas de negocio | RN-01 a RN-06 (ver [01](01-QUE-ES-DEVHUB.md#5-las-6-reglas-de-negocio-el-corazón-del-sistema)) |
| Especificaciones | `specs/constitucion.md` + `specs/001…006/spec.md` |

### Fase 2 · Construcción del sistema
| Qué | Dónde |
|---|---|
| Backend con 9 módulos (auth, usuarios, proyectos, specs, tareas, revisiones, métricas, prompts, salud) | `backend/src/modulos/` |
| Seguridad global: JWT + roles con guards | `backend/src/comun/guards/` |
| Reglas puras + pruebas TDD | `*.reglas.ts` / `*.reglas.spec.ts` |
| Prueba e2e del flujo completo | `backend/test/flujo-sdd.e2e-spec.ts` |
| Frontend responsive separado en Entidades / Servicios / Controlador / Componentes / Formularios / Paginas / Utils | `frontend/src/app/` |
| Datos de prueba | `backend/scripts/seed.mongodb.js` |
| Pipeline CI | `.github/workflows/ci.yml` |
| Plantillas de PR e Issues | `.github/` |

### Fase 3 · Puesta en marcha local
```powershell
# Base de datos: Compass → >_ → pegar seed.mongodb.js
cd backend;  Copy-Item .env.example .env; npm install; npm run start:dev
cd frontend; npm install; npm start
```
Se probó el flujo completo de la demo y las 6 reglas ✅.

### Fase 4 · Subida a GitHub y protección de `main`
```powershell
git init
git add .
git commit -m "chore: base del proyecto DevHub v0.1.0"
git branch -M main
git remote add origin https://github.com/JM132005/devhub.git
git push -u origin main
git tag v0.1.0
git push origin v0.1.0
```
- Repositorio **público** (ver problema P6).
- Ruleset `proteger-main`: PR obligatorio + 1 aprobación + 2 checks de CI + bloquear force push y borrado.
- Compañero invitado: Settings → Collaborators → Add people.
- Pipeline **CI** en verde ✅.

### Fase 5 · Gestión del proyecto en GitHub (Bloque 7)
```powershell
winget install GitHub.cli
gh auth login
gh auth refresh -s project
& "C:\Program Files\Git\bin\bash.exe" scripts/crear-issues.sh
& "C:\Program Files\Git\bin\bash.exe" scripts/crear-issues-faltantes.sh
```
| Resultado | Cantidad |
|---|---|
| Etiquetas | 14 (`feat`, `fix`, `docs`, `test`, `ci`, módulos, prioridades) |
| Milestones | `M1 · Base` (24-oct-2026) y `M2 · Completo` (31-oct-2026) |
| Issues | 21 → 14 cerrados (ya resueltos por el código base) y 7 abiertos (#3, #16–#21) |
| Tablero | Projects → **DevHub** (Kanban con auto-add de Issues) |

### Fase 6 · Spec Kit + Copilot (Bloques 3 y 5) — primer PR
```powershell
git switch main; git pull
git switch -c docs/3-spec-kit
pip install uv
python -m uv tool run --from git+https://github.com/github/spec-kit.git specify init --here --ai copilot
```
- En Copilot Chat (modo Agent): `/speckit.constitution` con el contenido de `specs/constitucion.md` → genera `.specify/memory/constitution.md` v1.0.0 con 5 principios.
- Se corrigió el `TODO` de la fecha de ratificación → `2026-10-18`.
```powershell
git add .
git commit -m "docs: inicializar Spec Kit y constitución del proyecto"
git push -u origin docs/3-spec-kit
```
- PR creado con `Closes #3` → **checks en verde** ✅ → **"Review required"** (esperando al compañero). ⏳

### Fase 7 · Documentación (este PR)
- Carpeta `docs/` reorganizada en 00–07.

## Parte B · Problemas y soluciones

| # | Problema (síntoma) | Causa | Solución | Lección para el informe |
|---|---|---|---|---|
| P1 | Angular CLI 22 no instalaba | Pide Node ≥ 22.22.3 | Usar **Angular 21 LTS** | Elegir versiones LTS en proyectos de equipo |
| P2 | `npm install` fallaba con error `edgesOut` / conflicto de *peer deps* | Bug de npm con dependencias de pares | Archivo `.npmrc` con `legacy-peer-deps=true` en backend y frontend | La configuración del entorno también se versiona |
| P3 | Error TS1272 en parámetros con decoradores | El tipo se importaba como valor | `import type { UsuarioToken }` | El compilador estricto detecta errores temprano |
| P4 | Mongoose avisaba que `new: true` está obsoleto | Cambio de API en Mongoose 9 | `{ returnDocument: 'after' }` | Leer las notas de versión |
| P5 | **El líder iniciaba sesión pero no veía ningún proyecto** | En Mongoose 9, `@Prop({ type: Types.ObjectId })` se guarda como tipo **Mixed**, así que la búsqueda por `liderId` comparaba un ObjectId con otra cosa y no encontraba nada | Cambiar a `SchemaTypes.ObjectId` en los 5 esquemas + prueba de regresión `comun/esquemas.spec.ts` (12 casos) + recargar el seed | Ante un error, primero **reproducirlo**, luego **probarlo** y dejar una prueba para que no vuelva |
| P5b | Tras recargar el seed, la sesión vieja seguía "abierta" pero sin datos | El token tenía el `_id` de un usuario borrado | El `JwtGuard` ahora verifica que el usuario exista y esté activo; si no → 401 y el frontend cierra sesión | Los tokens deben validarse contra el estado real |
| P6 | Actions: *"The job was not started because your account is locked due to a billing issue"* | Restricción de facturación de la cuenta para repos privados | Hacer el repo **público** (Settings → Danger Zone → Change visibility) → **Re-run jobs** | En repos públicos los minutos de Actions son gratis |
| P7 | VS Code marcaba `Expected 2 arguments` en `esquemas.spec.ts` (aunque las pruebas pasaban) | `it.each` no podía inferir el tipo del arreglo | Tipar como `[string, Schema, string][]` | El editor y el compilador también son "pruebas" |
| P8 | PowerShell: `sed` / `bash` no se reconoce | Son comandos de Linux | `& "C:\Program Files\Git\bin\bash.exe" scripts/...` (o usar Git Bash) | Documentar comandos por sistema operativo |
| P9 | El script se detuvo con `GraphQL: Content already exists in this project` | El tablero tenía **auto-add**: los Issues ya se habían agregado solos | Script `crear-issues-faltantes.sh` sin `--project` para #17–#21 | Los scripts deben ser *idempotentes* (poder repetirse) |
| P10 | `uv` no se reconoce tras `pip install uv` | La carpeta de scripts de Python no está en el PATH | `python -m uv tool run …` | Alternativa sin tocar el PATH |
| P11 | `gh auth login` se ejecutó dos veces y quedó esperando | Ya había sesión iniciada | `Ctrl + C` y `gh auth status` | Comprobar antes de repetir |
| P12 | El PR muestra **"Merging is blocked — Review required"** | El ruleset exige 1 aprobación y el autor no puede aprobarse | Esperar al compañero (o GitHub Mobile). Si es urgente: bypass temporal documentado (ver [04](04-FLUJO-DE-TRABAJO.md#9-excepción-documentada-si-el-compañero-no-puede-aprobar)) | **No es un error**: es la protección funcionando |
| P13 | `scripts/crear-issues.sh` aparece como modificado (`M`) en `git status` | Cambio de saltos de línea CRLF/LF en Windows | `git restore scripts/crear-issues.sh` o `git config --global core.autocrlf true` | Configurar Git igual en todo el equipo |

## Parte C · Estado y pendientes (al 18-oct-2026)

| Tarea | Responsable | Estado |
|---|---|---|
| Aprobar y fusionar PR de Spec Kit (#3) | Compañero aprueba, JM fusiona | ⏳ |
| PR de documentación (este) | JM | ⏳ |
| #16 Editar y reasignar tareas desde el Kanban | Compañero | ⏳ (su PR propio) |
| #17 Filtrar Kanban por milestone | JM | ⏳ (su PR propio) |
| #18 Deploy automático (CD) | Compañero | Opcional |
| #19 Integración con la API de GitHub | JM | Opcional |
| #20 Informe APA 7 | Los dos | ⏳ |
| #21 Presentación y reflexión | Los dos | ⏳ |
| Tag `v1.0.0` al cerrar M2 | JM | ⏳ |
