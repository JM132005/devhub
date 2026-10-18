# Guía de inicio (paso a paso)

## Paso 1 · Abrir el proyecto
1. Descomprime `devhub.zip` en una carpeta, por ejemplo `C:\Proyectos\devhub`.
2. Ábrela en VS Code: **Archivo → Abrir carpeta**.
3. Abre una terminal: **Terminal → Nueva terminal**.
4. Verifica Node: `node -v` → debe ser **v22.12 o mayor** (o v20.19+). Si es menor, instala la versión LTS de nodejs.org.

## Paso 2 · Encender el backend
```bash
cd backend
Copy-Item .env.example .env     # PowerShell (en Git Bash: cp .env.example .env)
npm install                     # descarga dependencias (tarda 1–2 min)
npm run start:dev               # deja esta terminal abierta
```
Abre http://localhost:3000/api/salud → debe decir `"estado": "ok"`.

> Si ya cargaste los datos de prueba en Compass, listo. Si no: Compass → `>_` → pega `backend/scripts/seed.mongodb.js`.

## Paso 3 · Encender el frontend
En **otra** terminal (botón `+`):
```bash
cd frontend
npm install
npm start
```
Abre http://localhost:4200 → botón **lider** → Iniciar sesión.

### Prueba el flujo completo (es la demo de la presentación)
1. **diego** → Proyectos → DevHub → Specs → *+ Nueva spec* → Enviar a revisión.
2. **lider** → Inicio → "Specs por aprobar" → Aprobar.
3. **lider** → Kanban → *+ Nueva tarea* (desde la spec aprobada) → asignar a Diego.
4. **diego** → mueve la tarea a "En progreso" → *Registrar PR* (revisor: Ana).
5. Intenta moverla a "Hecho" → ⚠️ aparece **RN-03**.
6. **ana** → Revisiones → *Revisar ahora* → marca la checklist → Aprobar → la tarea pasa a **Hecho**.

## Paso 4 · Subir a GitHub (solo UNA persona)
> ⚠️ Como `main` está protegida, primero hay que **desactivar la regla un momento**:
> repo → Settings → Rules → Rulesets → `proteger-main` → **Enforcement status: Disabled** → Save.

En la carpeta raíz `devhub` (no dentro de backend ni frontend):
```bash
git init                                   # crea el repositorio local
git add .                                  # prepara todos los archivos
git commit -m "chore: base del proyecto DevHub v0.1.0"
git branch -M main                         # nombra la rama principal "main"
git remote add origin https://github.com/TU_USUARIO/devhub.git
git push -u origin main --force            # --force solo esta vez (por si GitHub creó un README)
git tag v0.1.0                             # marca esta versión
git push origin v0.1.0
```

Luego:
1. Pestaña **Actions** → espera a que el pipeline **CI** termine en verde ✅.
2. Vuelve a **Settings → Rules → Rulesets → proteger-main**:
   - **Enforcement status: Active**
   - ✅ *Require status checks to pass* → **Add checks** → elige `Backend (lint · test · build · e2e)` y `Frontend (build Angular)`.
   - Save.

## Paso 5 · Crear Issues, milestones y etiquetas
```bash
winget install GitHub.cli        # si no tienes gh (cierra y abre la terminal después)
gh auth login                    # inicia sesión con tu cuenta
gh auth refresh -s project       # permiso para agregar Issues al tablero
bash scripts/crear-issues.sh     # en Git Bash
```
> Antes de ejecutarlo, abre el script y pon sus usuarios de GitHub en `PERSONA_A` y `PERSONA_B`.

## Paso 6 · Tu compañero
```bash
git clone https://github.com/TU_USUARIO/devhub.git
cd devhub
```
Y repite los pasos 2 y 3. También debe cargar el seed en su Compass.

## Paso 7 · El primer Pull Request (Issue "Inicializar Spec Kit")
```bash
git switch -c docs/3-spec-kit
pip install uv
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init --here --ai copilot
# en el chat de Copilot: /speckit.constitution  y pega specs/constitucion.md
git add .
git commit -m "docs: inicializar Spec Kit y constitución del proyecto"
git push -u origin docs/3-spec-kit
```
En GitHub: **Compare & pull request** → escribe `Closes #3` → asigna a tu compañero como revisor → cuando el CI esté verde y él apruebe → **Squash and merge**. 🎉

## Problemas comunes
| Problema | Solución |
|---|---|
| `npm install` falla con *ERESOLVE* o *edgesOut* | Ya está resuelto con el archivo `.npmrc` (`legacy-peer-deps=true`). Borra `node_modules` y repite. |
| La API dice *MongooseServerSelectionError* | MongoDB no está encendido: `services.msc` → MongoDB Server → Iniciar. |
| El login dice "No hay conexión con la API" | El backend no está corriendo (Paso 2). |
| `git push` rechazado por la regla | Desactiva el ruleset (Paso 4) o trabaja con rama + PR. |
| `ng` no se reconoce | Usa `npm start` (no necesitas Angular CLI global). |
