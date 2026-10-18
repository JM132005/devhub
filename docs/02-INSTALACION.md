# 02 · Instalación y comprobación (para el compañero)

> **Objetivo:** que en ~30 minutos tengas DevHub funcionando en tu PC y puedas comprobar que todo lo que se hizo está bien.
> Cada paso termina con una **✅ comprobación**. Si no ves lo esperado, mira la tabla **❌ Si falla** de ese paso.
>
> Todos los comandos son para **PowerShell** (la terminal de VS Code en Windows). Cuando un comando sea distinto en Git Bash, se indica.

---

## Paso 0 · Aceptar la invitación al repositorio

1. Revisa tu correo (o https://github.com/notifications): **"JM132005 invited you to collaborate on devhub"**.
2. Clic en **Accept invitation**.

✅ **Comprobación:** al abrir https://github.com/JM132005/devhub ves la pestaña **Settings** o puedes crear ramas (eres colaborador).

---

## Paso 1 · Instalar los programas (una sola vez)

| Programa | Para qué | Descarga / comando | Comprobar con |
|---|---|---|---|
| **Git** | Control de versiones (incluye Git Bash) | https://git-scm.com/download/win | `git --version` |
| **Node.js 22 LTS** | Ejecutar backend y frontend | https://nodejs.org (botón LTS) | `node -v` → **v22.12 o mayor** |
| **MongoDB Community Server** | Base de datos local | https://www.mongodb.com/try/download/community (marca "Install as a Service") | Servicio "MongoDB" corriendo |
| **MongoDB Compass** | Ver la base de datos con ventanas | Se instala junto a MongoDB (o desde la misma página) | Abre y conecta a `mongodb://localhost:27017` |
| **VS Code** | Editor | https://code.visualstudio.com | — |
| **GitHub CLI** (opcional) | Manejar Issues/PRs desde la terminal | `winget install GitHub.cli` | `gh --version` |
| **Python 3** (opcional) | Solo para Spec Kit | https://python.org | `python --version` |

Configura tu nombre en Git (una sola vez, con TU nombre y TU correo de GitHub):

```powershell
git config --global user.name "Tu Nombre"          # nombre que aparece en los commits
git config --global user.email "tucorreo@ejemplo.com"  # el mismo correo de tu cuenta GitHub
git config --global core.autocrlf true             # evita problemas de saltos de línea en Windows
```

✅ **Comprobación:**
```powershell
git --version     # git version 2.x
node -v           # v22.x.x
npm -v            # 10.x.x
```

> 💡 Después de instalar algo, **cierra y vuelve a abrir VS Code** para que la terminal reconozca el comando nuevo.

---

## Paso 2 · Clonar el repositorio

"Clonar" = descargar el proyecto **con todo su historial** y ya conectado a GitHub.

```powershell
cd $HOME\Desktop                                   # ir al Escritorio (o la carpeta que prefieras)
git clone https://github.com/JM132005/devhub.git   # descarga el repo en la carpeta "devhub"
cd devhub                                          # entrar a la carpeta
code .                                             # abrir en VS Code
```

La primera vez, Git puede abrir una ventana del navegador para iniciar sesión en GitHub → **Sign in with your browser** → Authorize.

✅ **Comprobación:**
```powershell
git status        # On branch main · Your branch is up to date with 'origin/main'
git log --oneline -5   # ves los últimos commits del proyecto
```

En VS Code deberías ver las carpetas `backend`, `frontend`, `specs`, `docs`, `.github`.

---

## Paso 3 · Cargar los datos de prueba en MongoDB

1. Abre **MongoDB Compass** → **Add new connection** → URI `mongodb://localhost:27017` → **Save & Connect**.
2. Abajo a la izquierda (o en la conexión) haz clic en el ícono **`>_`** → se abre **MongoDB Shell (mongosh)**.
3. En VS Code abre `backend/scripts/seed.mongodb.js`, **selecciona todo (Ctrl+A)**, copia (Ctrl+C).
4. Pégalo en la consola `>_` de Compass y presiona **Enter**.

✅ **Comprobación:** al final la consola imprime:
```
usuarios: 4
proyectos: 2
specs: 4
tareas: 5
revisiones: 2
prompts: 4
```
Y en Compass (botón ↻ de refrescar) aparece la base **`devhub`** con esas 6 colecciones.

| ❌ Si falla | Solución |
|---|---|
| Compass no conecta | El servicio MongoDB está apagado: `Win + R` → `services.msc` → **MongoDB Server** → Iniciar |
| `SyntaxError: Identifier has already been declared` | Estás usando una versión vieja del seed con `const`. Haz `git pull`; la versión actual usa `var` y se puede pegar varias veces |

> ⚠️ El seed **borra y vuelve a crear** los datos de `devhub`. Úsalo cuando quieras volver a dejar todo "como nuevo". Después de recargarlo, **cierra sesión en DevHub y vuelve a entrar** (los `_id` cambian).

---

## Paso 4 · Encender el backend (API NestJS)

En VS Code: **Terminal → Nueva terminal**.

```powershell
cd backend                         # entrar a la carpeta del backend
Copy-Item .env.example .env        # crear tu archivo de configuración (Git Bash: cp .env.example .env)
npm install                        # descargar dependencias (1–3 min, solo la primera vez)
npm run start:dev                  # encender la API en modo desarrollo (se reinicia sola al guardar)
```

> El archivo `.env` es **solo tuyo**: no se sube a GitHub (está en `.gitignore`). Los valores por defecto ya funcionan.
> `.npmrc` (ya incluido) tiene `legacy-peer-deps=true` para evitar un error de npm con dependencias.

✅ **Comprobación:**
- La terminal muestra `Nest application successfully started` y **no** muestra errores rojos de MongoDB.
- Abre http://localhost:3000/api/salud → ves algo como `{"estado":"ok", ... }`.

**Deja esta terminal abierta.**

| ❌ Si falla | Solución |
|---|---|
| `MongooseServerSelectionError` / `ECONNREFUSED 27017` | MongoDB no está encendido (ver paso 3) |
| `EADDRINUSE :::3000` | Ya hay otra API encendida. Cierra la otra terminal o: `npx kill-port 3000` |
| `npm ERR! ... edgesOut` / `ERESOLVE` | Verifica que exista `backend/.npmrc` con `legacy-peer-deps=true`, borra `node_modules` y repite `npm install` |
| `node: bad option` o error de versión | Tu Node es viejo. Instala Node 22 LTS |

---

## Paso 5 · Encender el frontend (Angular)

Abre **otra** terminal (botón **+** en el panel de terminal):

```powershell
cd frontend          # entrar a la carpeta del frontend
npm install          # descargar dependencias (solo la primera vez)
npm start            # compilar y servir Angular en http://localhost:4200
```

Si pregunta *"Would you like to share pseudonymous usage data…"* responde **N**.

✅ **Comprobación:**
- La terminal dice `Local: http://localhost:4200/`.
- Abre http://localhost:4200 → aparece la pantalla de **login de DevHub** con botones de usuarios de prueba.

| ❌ Si falla | Solución |
|---|---|
| `Port 4200 is already in use` | Responde **Y** para usar otro puerto, o cierra la otra terminal |
| Login dice "No se pudo conectar con el servidor" | El backend (paso 4) no está encendido |

---

## Paso 6 · Comprobar que el sistema funciona

Contraseña de todos: **`Devhub123*`**

| # | Haz esto | ✅ Debes ver |
|---|---|---|
| 1 | Entra como **lider@devhub.com** | Inicio con tarjetas de métricas y la sección "Specs por aprobar" (SPEC-003) |
| 2 | Menú **Proyectos** | 2 proyectos: **DevHub** (Desarrollo) y **App Farmacia** (Planificación) |
| 3 | Entra a **DevHub** → pestaña **Kanban** | 5 tareas repartidas en Por hacer / En progreso / En revisión / Hecho |
| 4 | Pestaña **Specs** → SPEC-001 | Versión 2, estado Aprobada, con historial de la versión 1 |
| 5 | Cierra sesión → entra como **admin@devhub.com** → **Usuarios** | Los 4 usuarios |
| 6 | Achica la ventana del navegador (o F12 → icono de celular) | El menú y el Kanban se adaptan a pantalla de móvil |

Para probar las **6 reglas de negocio** y el flujo completo de la demo, sigue [05-PRUEBAS-Y-DEMO.md](05-PRUEBAS-Y-DEMO.md).

| ❌ Si falla | Solución |
|---|---|
| El líder no ve proyectos | Haz `git pull` (se corrigió un error de tipos en los esquemas), recarga el seed (paso 3), cierra sesión y vuelve a entrar |
| "Tu sesión ya no es válida" | Normal tras recargar el seed: vuelve a iniciar sesión |

---

## Paso 7 · Correr las pruebas automáticas

Abre una **tercera** terminal (el backend puede seguir encendido):

```powershell
cd backend
npm test             # pruebas unitarias (no necesitan MongoDB)
npm run lint         # revisión de estilo (oxlint)
npm run test:e2e     # pruebas end-to-end (necesitan MongoDB encendido)
npm run build        # compilar el backend
```

✅ **Comprobación:**
| Comando | Resultado esperado |
|---|---|
| `npm test` | `Test Files 8 passed (8)` · `Tests 34 passed (34)` |
| `npm run lint` | `Found 0 warnings and 0 errors` |
| `npm run test:e2e` | `Tests 16 passed (16)` (usa la base `devhub_test` y la borra al final; **no toca** tus datos de `devhub`) |
| `npm run build` | Termina sin errores y crea la carpeta `dist/` |

Y el frontend:
```powershell
cd ..\frontend
npm run build        # debe terminar con "Application bundle generation complete"
```

> Estos son **exactamente los mismos pasos** que ejecuta el pipeline en GitHub Actions. Si pasan en tu PC, pasarán en el PR.

---

## Paso 8 · Comprobar lo que hay en GitHub

| Dónde (en https://github.com/JM132005/devhub) | ✅ Debes ver |
|---|---|
| Pestaña **Code** | Carpetas `backend`, `frontend`, `specs`, `docs`, `.github`, `.specify` y el README |
| Pestaña **Actions** | Ejecuciones del workflow **CI** con ✅ verde |
| Pestaña **Issues** | Issues #1–#21 (los abiertos son lo que falta hacer) |
| **Issues → Milestones** | `M1 · Base` (24-oct) y `M2 · Completo` (31-oct) con su % de avance |
| Pestaña **Projects → DevHub** | Tablero Kanban con los Issues en columnas |
| Pestaña **Pull requests** | El PR de Spec Kit esperando **tu aprobación** |
| **Settings → Rules → Rulesets → proteger-main** | Reglas: PR obligatorio, 1 aprobación, checks de CI, sin force push |
| Carpeta `specs/` | `constitucion.md` y las specs 001 a 006 |

---

## Paso 9 · Tu primera tarea: aprobar el PR de Spec Kit (Code Review)

Esto es **evidencia obligatoria** del Bloque 2 (Code Review). JM no puede aprobar su propio PR: lo tienes que hacer tú.

1. GitHub → **Pull requests** → abre el PR `docs: inicializar Spec Kit…` (rama `docs/3-spec-kit`).
2. Pestaña **Files changed** → revisa los archivos (`.specify/`, `.github/skills/`).
3. Si quieres, deja un comentario en una línea (botón **+** azul al pasar el mouse) — suma evidencia.
4. Arriba a la derecha **Review changes** → escribe un comentario (ej.: *"Revisado: constitución coherente con specs/constitucion.md, checks en verde"*) → marca **Approve** → **Submit review**.
5. JM (o tú) pulsa **Squash and merge** → **Confirm**.

✅ **Comprobación:** el PR aparece como **Merged** (morado) y el Issue #3 se cierra solo.

> 📱 También puedes aprobar desde la app **GitHub Mobile** (Pull requests → el PR → Review → Approve).

Luego, en tu PC:
```powershell
git switch main      # volver a main
git pull             # traer el merge
```

---

## Paso 10 · Tu primer PR propio

Cada integrante debe tener **al menos un PR propio**. El tuyo es el **Issue #16 · Editar y reasignar tareas desde el Kanban**. Sigue el ciclo de [04-FLUJO-DE-TRABAJO.md](04-FLUJO-DE-TRABAJO.md):

```powershell
git switch main
git pull
git switch -c feat/16-editar-tareas      # rama para el Issue 16
# ... programar, probar con npm test ...
git add .
git commit -m "feat(tareas): editar responsable, prioridad y milestone desde el kanban"
git push -u origin feat/16-editar-tareas
```
En GitHub → **Compare & pull request** → en la descripción escribe `Closes #16` → asigna a **JM132005** como revisor → espera CI verde → JM aprueba → **Squash and merge**.

---

## Resumen: arrancar el proyecto cada día

```powershell
# Terminal 1
cd backend;  npm run start:dev
# Terminal 2
cd frontend; npm start
# Navegador → http://localhost:4200
```
(MongoDB queda encendido solo como servicio de Windows.)
