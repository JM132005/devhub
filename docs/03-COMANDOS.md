# 03 · Comandos de uso diario (chuleta)

> Tenlo abierto mientras trabajas. Todos funcionan en **PowerShell** salvo que diga "Git Bash".
> En PowerShell se separan varios comandos en una línea con `;` (en Git Bash con `&&`).

## Índice
1. [Arrancar el proyecto](#1-arrancar-el-proyecto)
2. [Git: lo básico](#2-git-lo-básico)
3. [Git: ramas y sincronizar](#3-git-ramas-y-sincronizar)
4. [Git: deshacer y emergencias](#4-git-deshacer-y-emergencias)
5. [npm: backend y frontend](#5-npm-backend-y-frontend)
6. [GitHub CLI (gh)](#6-github-cli-gh)
7. [MongoDB](#7-mongodb)
8. [Spec Kit y Copilot](#8-spec-kit-y-copilot)
9. [Windows / PowerShell útiles](#9-windows--powershell-útiles)
10. [Los 10 comandos que más vas a usar](#10-los-10-comandos-que-más-vas-a-usar)

---

## 1. Arrancar el proyecto

| Comando | Dónde | Qué hace |
|---|---|---|
| `npm run start:dev` | `backend/` | Enciende la API en http://localhost:3000/api (se reinicia sola al guardar) |
| `npm start` | `frontend/` | Enciende Angular en http://localhost:4200 |
| Abrir http://localhost:3000/api/salud | Navegador | Comprueba que la API y la BD respondan |
| `Ctrl + C` | Terminal | Apaga el servidor de esa terminal |

---

## 2. Git: lo básico

| Comando | Qué hace | Analogía |
|---|---|---|
| `git status` | Muestra en qué rama estás y qué archivos cambiaste | "¿Qué tengo pendiente?" |
| `git diff` | Muestra las líneas cambiadas (sin preparar) | Ver los tachones |
| `git add .` | Prepara **todos** los cambios para el commit | Meter todo en la caja |
| `git add ruta/archivo.ts` | Prepara solo ese archivo | Meter una sola cosa |
| `git commit -m "tipo(ámbito): mensaje"` | Guarda una versión con mensaje | Cerrar la caja y etiquetarla |
| `git log --oneline -10` | Últimos 10 commits, uno por línea | Ver el historial |
| `git log --oneline --graph --all` | Historial con dibujo de ramas | Ver el árbol |
| `git show <hash>` | Qué cambió en un commit concreto | Abrir una caja vieja |
| `git clone <url>` | Descargar un repo por primera vez | Fotocopiar el cuaderno |

### Mensajes de commit (Conventional Commits)

```
tipo(ámbito): descripción en minúsculas y en presente
```

| Tipo | Cuándo | Ejemplo |
|---|---|---|
| `feat` | Funcionalidad nueva | `feat(tareas): filtrar kanban por milestone` |
| `fix` | Corrección de error | `fix(esquemas): usar SchemaTypes.ObjectId en referencias` |
| `docs` | Solo documentación | `docs: agregar guía de instalación` |
| `test` | Solo pruebas | `test(specs): probar RN-05` |
| `ci` | Pipeline | `ci: agregar job de e2e con mongo` |
| `refactor` | Ordenar código sin cambiar comportamiento | `refactor(auth): extraer verificación del token` |
| `chore` | Mantenimiento (dependencias, config) | `chore: actualizar dependencias` |

---

## 3. Git: ramas y sincronizar

| Comando | Qué hace |
|---|---|
| `git branch` | Lista tus ramas locales (la actual con `*`) |
| `git branch -a` | Lista también las ramas remotas (GitHub) |
| `git switch main` | Cambiarse a `main` |
| `git switch -c feat/16-editar-tareas` | **Crear** una rama nueva y cambiarse a ella |
| `git switch feat/16-editar-tareas` | Cambiarse a una rama que ya existe |
| `git pull` | Traer y aplicar lo nuevo de GitHub en la rama actual |
| `git fetch` | Traer novedades sin aplicarlas (solo mirar) |
| `git push -u origin <rama>` | Subir una rama **por primera vez** (`-u` la enlaza) |
| `git push` | Subir más commits a una rama ya enlazada |
| `git merge main` | Traer lo último de `main` a tu rama (estando en tu rama) |
| `git branch -d <rama>` | Borrar una rama local ya fusionada |
| `git branch -D <rama>` | Borrar a la fuerza (necesario tras **Squash and merge**) |
| `git push origin --delete <rama>` | Borrar la rama en GitHub |
| `git fetch --prune` | Limpiar referencias a ramas borradas en GitHub |
| `git tag v1.0.0` + `git push origin v1.0.0` | Marcar y subir una versión |

### El ciclo completo de una tarea (copiar y pegar)

```powershell
git switch main                                   # 1. ir a main
git pull                                          # 2. traer lo último
git switch -c feat/17-filtrar-milestone           # 3. rama nueva para el Issue 17
# ... programar ...
cd backend; npm test; npm run lint; cd ..         # 4. probar antes de subir
git add .                                         # 5. preparar
git commit -m "feat(tareas): filtrar kanban por milestone"   # 6. guardar
git push -u origin feat/17-filtrar-milestone      # 7. subir
# 8. GitHub → Compare & pull request → "Closes #17" → revisor → CI verde → aprobación → Squash and merge
git switch main; git pull                         # 9. actualizar main
git branch -D feat/17-filtrar-milestone           # 10. borrar la rama local
```

### Si tu rama se quedó atrás de `main` (el PR dice "This branch is out-of-date")

```powershell
git switch feat/17-filtrar-milestone
git pull origin main          # trae main dentro de tu rama
# si hay conflictos: VS Code los marca → elegir "Accept Current/Incoming/Both" → guardar
git add .
git commit -m "chore: resolver conflictos con main"
git push
```
(O en GitHub el botón **Update branch**.)

---

## 4. Git: deshacer y emergencias

| Situación | Comando |
|---|---|
| Descartar cambios de un archivo (sin commit) | `git restore ruta/archivo` |
| Descartar **todos** los cambios sin commit | `git restore .` ⚠️ se pierden |
| Sacar un archivo del `git add` | `git restore --staged ruta/archivo` |
| Corregir el mensaje del último commit (sin push) | `git commit --amend -m "nuevo mensaje"` |
| Deshacer el último commit pero conservar los cambios | `git reset --soft HEAD~1` |
| Deshacer un commit ya subido (crea un commit inverso, seguro) | `git revert <hash>` |
| Guardar cambios a un lado para cambiar de rama | `git stash` → luego `git stash pop` |
| Hice commits en `main` por error (sin push) | `git switch -c feat/x` (se los lleva) → `git switch main` → `git reset --hard origin/main` |
| Ver qué archivos ignora Git | `git status --ignored` |
| Volver a la versión estable | `git switch --detach v0.1.0` (solo para mirar) |

> ❌ **Nunca** uses `git push --force` sobre `main` (además el ruleset lo bloquea).
> ❌ **Nunca** subas el archivo `.env` (contiene el secreto JWT).

---

## 5. npm: backend y frontend

### Backend (`cd backend`)
| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias (después de clonar o si cambió `package.json`) |
| `npm ci` | Instalación limpia exacta según `package-lock.json` (la usa el pipeline) |
| `npm run start:dev` | API en modo desarrollo |
| `npm test` | 34 pruebas unitarias (Vitest) |
| `npm run test:watch` | Pruebas que se repiten al guardar (ideal para TDD) |
| `npm run test:cov` | Pruebas + porcentaje de cobertura |
| `npm run test:e2e` | 16 pruebas end-to-end contra MongoDB (`devhub_test`) |
| `npm run lint` | Revisa errores y estilo (oxlint) |
| `npm run format` | Ordena el formato del código (prettier) |
| `npm run build` | Compila TypeScript → `dist/` |
| `npm run start:prod` | Ejecuta lo compilado (como en producción) |
| `npx vitest run src/modulos/tareas` | Ejecuta solo las pruebas de una carpeta |

### Frontend (`cd frontend`)
| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm start` | Servidor de desarrollo en :4200 |
| `npm run build` | Compila para producción → `dist/` (lo hace el pipeline) |
| `npx ng generate component Componentes/nombre` | Crea un componente nuevo |
| `npx ng generate service Servicios/nombre` | Crea un servicio nuevo |

### Reinstalar desde cero (cuando npm se pone raro)
```powershell
Remove-Item -Recurse -Force node_modules      # Git Bash: rm -rf node_modules
npm install
```

---

## 6. GitHub CLI (`gh`)

| Comando | Qué hace |
|---|---|
| `gh auth login` | Iniciar sesión (GitHub.com → HTTPS → Login with a web browser) — **solo una vez** |
| `gh auth status` | Ver si ya iniciaste sesión |
| `gh auth refresh -s project` | Dar permiso para manejar el tablero Projects |
| `gh repo view --web` | Abrir el repo en el navegador |
| `gh issue list` | Listar Issues abiertos |
| `gh issue view 16` | Ver un Issue |
| `gh issue create` | Crear un Issue (pregunta paso a paso) |
| `gh issue close 16 --comment "Hecho en #25"` | Cerrar un Issue con comentario |
| `gh pr create --fill` | Crear PR desde la rama actual (usa el commit como título) |
| `gh pr list` | Listar PRs abiertos |
| `gh pr checks` | Ver el estado del pipeline del PR actual |
| `gh pr review 22 --approve -b "Revisado"` | Aprobar un PR (lo hace el **compañero**) |
| `gh pr merge 22 --squash --delete-branch` | Fusionar con squash y borrar la rama |
| `gh run list` | Últimas ejecuciones del pipeline |
| `gh run watch` | Ver en vivo el pipeline |
| `gh run rerun <id>` | Volver a ejecutar un pipeline |

### Scripts del repo (en PowerShell se ejecutan con el bash de Git)
```powershell
& "C:\Program Files\Git\bin\bash.exe" scripts/crear-issues.sh            # etiquetas + milestones + Issues 1–21
& "C:\Program Files\Git\bin\bash.exe" scripts/crear-issues-faltantes.sh  # solo Issues 17–21
```
(En Git Bash directamente: `bash scripts/crear-issues.sh`.) ⚠️ Ya se ejecutaron: **no** los vuelvas a correr o se duplican los Issues.

> Si el comando es `sed` o `bash` y PowerShell dice "no se reconoce", es porque son comandos de Linux: usa Git Bash o la línea de arriba.

---

## 7. MongoDB

| Acción | Cómo |
|---|---|
| Ver los datos | Compass → `mongodb://localhost:27017` → base `devhub` |
| Recargar datos de prueba | Compass → `>_` → pegar todo `backend/scripts/seed.mongodb.js` → Enter |
| Encender/apagar el servicio | `Win + R` → `services.msc` → **MongoDB Server** |
| Encender desde PowerShell (como admin) | `net start MongoDB` |

Consultas útiles en la consola `>_` de Compass (mongosh):
```js
use devhub                                        // elegir la base
show collections                                  // listar colecciones
db.usuarios.find({}, { nombre: 1, rol: 1 })       // usuarios con nombre y rol
db.proyectos.find({}, { nombre: 1, estado: 1 })   // proyectos y su estado
db.specs.find({ estado: "EN_REVISION" })          // specs esperando aprobación
db.tareas.countDocuments({ estado: "HECHO" })     // cuántas tareas hechas
db.revisiones.find().pretty()                     // revisiones de PR
use devhub_test; db.dropDatabase()                // borrar la base de pruebas (si quedó algo)
```

---

## 8. Spec Kit y Copilot

### Instalar / ejecutar Spec Kit
```powershell
pip install uv                                    # instalador de herramientas de Python
python -m uv tool run --from git+https://github.com/github/spec-kit.git specify init --here --ai copilot
```
> Se usa `python -m uv` porque `uv` no queda en el PATH de Windows. `--here` = en la carpeta actual. Ya se hizo: crea `.specify/` y `.github/skills/`.

### Comandos en el chat de Copilot (VS Code, modo **Agent**)
| Comando | Qué produce |
|---|---|
| `/speckit.constitution` | Principios del proyecto → `.specify/memory/constitution.md` |
| `/speckit.specify <idea>` | Spec con historias y criterios → `specs/NNN-…/spec.md` |
| `/speckit.clarify` | Preguntas para aclarar lo ambiguo de la spec |
| `/speckit.plan <stack>` | Plan técnico → `plan.md` |
| `/speckit.tasks` | Lista de tareas → `tasks.md` (cada una puede ser un Issue) |
| `/speckit.implement` | Copilot programa siguiendo las tareas |

Ejemplo real para el Issue #17:
```
/speckit.specify Como líder quiero filtrar el tablero Kanban por milestone y poder cerrar un milestone cuando todas sus tareas estén en HECHO
```

---

## 9. Windows / PowerShell útiles

| Comando | Qué hace |
|---|---|
| `cd carpeta` · `cd ..` | Entrar / salir de carpeta |
| `ls` | Listar archivos |
| `Copy-Item origen destino` | Copiar (`cp` en Git Bash) |
| `Remove-Item -Recurse -Force carpeta` | Borrar carpeta (`rm -rf` en Git Bash) |
| `npx kill-port 3000` | Liberar un puerto ocupado |
| `code .` | Abrir la carpeta en VS Code |
| `Ctrl + C` | Detener el proceso de la terminal |
| `↑` | Repetir comandos anteriores |

---

## 10. Los 10 comandos que más vas a usar

```powershell
git switch main; git pull                 # 1-2. actualizarte
git switch -c feat/<n>-descripcion        # 3. rama nueva
npm run start:dev                         # 4. backend (en backend/)
npm start                                 # 5. frontend (en frontend/)
npm test                                  # 6. pruebas (en backend/)
git status                                # 7. qué cambié
git add .                                 # 8. preparar
git commit -m "feat(x): ..."              # 9. guardar
git push -u origin feat/<n>-descripcion   # 10. subir → crear PR
```
