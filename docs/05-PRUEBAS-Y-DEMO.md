# 05 · Pruebas y guion de la demo

> Antes de empezar: backend y frontend encendidos y el **seed recién cargado** (ver [02-INSTALACION.md](02-INSTALACION.md) pasos 3–5).
> Contraseña de todos los usuarios: **`Devhub123*`**.

## 1. Pruebas automáticas

```powershell
cd backend
npm test            # ✅ Test Files 8 passed · Tests 34 passed
npm run test:e2e    # ✅ Tests 16 passed (MongoDB encendido)
npm run lint        # ✅ 0 warnings, 0 errors
```

### 1.1 Pruebas unitarias (TDD) — 34 pruebas en 8 archivos

No necesitan base de datos: prueban **funciones puras** con las reglas.

| Archivo | Pruebas | Qué comprueba |
|---|---|---|
| `modulos/specs/specs.reglas.spec.ts` | 6 | RN-01 (quién aprueba) y RN-05 (editar aprobada → nueva versión) |
| `modulos/tareas/tareas.reglas.spec.ts` | 4 | RN-02 (spec aprobada) y RN-03 (HECHO con PR aprobado) |
| `modulos/proyectos/proyectos.reglas.spec.ts` | 4 | RN-06 (sin pendientes para PRODUCCIÓN) |
| `modulos/revisiones/revisiones.reglas.spec.ts` | 2 | RN-04 (revisor ≠ autor) y checklist completa |
| `modulos/metricas/metricas.reglas.spec.ts` | 2 | Cálculo de % de avance |
| `comun/guards/jwt.guard.spec.ts` | 3 | Sin token → 401, token válido pasa, usuario que ya no existe → 401 |
| `comun/esquemas.spec.ts` | 12 | Las referencias entre colecciones se guardan como `ObjectId` (regresión del error del líder) |
| `modulos/salud/salud.controller.spec.ts` | 1 | `GET /salud` responde ok |

### 1.2 Prueba end-to-end — `backend/test/flujo-sdd.e2e-spec.ts` (16 pruebas)

Levanta la API completa contra MongoDB (base `devhub_test`, que se borra al terminar) y recorre el flujo real con peticiones HTTP:

| # | Prueba |
|---|---|
| 1 | `GET /api/salud` es público |
| 2 | Sin token, las rutas protegidas responden 401 |
| 3 | Login con contraseña incorrecta → 401 |
| 4 | Login correcto devuelve token para cada usuario |
| 5 | El líder crea un proyecto con su equipo |
| 6 | Un desarrollador escribe una spec (BORRADOR, código SPEC-001) |
| 7 | **RN-02**: no se crea tarea desde una spec en BORRADOR |
| 8 | **RN-01**: un desarrollador no puede aprobar specs |
| 9 | El líder aprueba la spec |
| 10 | Con la spec APROBADA el líder crea y asigna la tarea |
| 11 | **RN-03**: la tarea no pasa a HECHO sin PR aprobado |
| 12 | **RN-04**: nadie se asigna como revisor de su propio PR |
| 13 | El autor registra su PR con otro revisor |
| 14 | No se aprueba con la checklist incompleta |
| 15 | El revisor aprueba → tarea HECHO y spec IMPLEMENTADA |
| 16 | Las métricas reflejan el avance |

## 2. Probar las 6 reglas a mano (en la app)

| Regla | Pasos | ✅ Resultado esperado |
|---|---|---|
| **RN-01** Solo líder/admin aprueban | Entra como **diego** → Proyectos → DevHub → Specs → SPEC-003 | **No** aparecen los botones Aprobar / Devolver. Como **lider** sí aparecen |
| **RN-02** Tarea solo desde spec aprobada | **lider** → DevHub → Kanban → **+ Nueva tarea** → abre el selector de spec | Solo aparecen SPEC-001 y SPEC-002 (aprobadas). SPEC-003 (en revisión) no aparece |
| **RN-03** HECHO solo con PR aprobado | **diego** → Kanban → tarea "API para mover tareas" (En progreso) → moverla a **Hecho** | Mensaje rojo: *"RN-03: la tarea no puede pasar a HECHO sin un Pull Request aprobado"* |
| **RN-04** Nadie revisa su propio PR | **diego** → *Registrar PR* en una tarea suya → abre la lista de revisores | Diego **no aparece** en la lista. (La API también lo rechaza: prueba e2e #12) |
| **RN-05** Editar spec aprobada → revisión | **diego** → SPEC-002 (Aprobada, v1) → **✏️ Editar** → cambia un requisito → Guardar | Pasa a **En revisión**, versión **2**, y en Historial aparece la versión 1 |
| **RN-06** No a PRODUCCIÓN con pendientes | **lider** → DevHub → selector de estado → **PRODUCCION** | Mensaje rojo: *"RN-06: quedan N tareas sin terminar; no puede pasar a PRODUCCION"* |

> Después de probar, **recarga el seed** para dejar los datos limpios antes de la presentación.

## 3. Probar la API sin interfaz (opcional)

En PowerShell:
```powershell
# 1. Login como diego y guardar el token
$r = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login `
     -ContentType "application/json" -Body '{"correo":"diego@devhub.com","contrasena":"Devhub123*"}'
$h = @{ Authorization = "Bearer $($r.token)" }

# 2. Ver mis proyectos
Invoke-RestMethod -Uri http://localhost:3000/api/proyectos -Headers $h

# 3. Sin token → error 401
Invoke-RestMethod -Uri http://localhost:3000/api/proyectos
```

## 4. Guion de la demo para la presentación (≈ 6 minutos)

**Preparación:** seed recién cargado · backend y frontend encendidos · una pestaña con DevHub y otra con GitHub (Actions + un PR fusionado) · zoom del navegador al 125 %.

| Min | Quién | Qué se hace | Qué se dice |
|---|---|---|---|
| 0:00 | Líder | Login → **Inicio** (dashboard) | "Este es el panel del líder: tareas por estado, avance de milestones y specs por aprobar. Resuelve la **desorganización**." |
| 0:45 | Diego | Proyectos → DevHub → Specs → **+ Nueva spec** (ej. *"Filtrar Kanban por milestone"*, con criterio Dado/Cuando/Entonces) → **Enviar a revisión** | "Nadie programa sin especificación: esto es **SDD**. Resuelve la **falta de documentación**." |
| 1:45 | Líder | Inicio → Specs por aprobar → **Aprobar** | "Solo el líder puede aprobar (**RN-01**)." |
| 2:15 | Líder | Kanban → **+ Nueva tarea** desde esa spec → asignar a Diego | "Una tarea solo nace de una spec aprobada (**RN-02**)." |
| 2:45 | Diego | Mover la tarea a **En progreso** → **Registrar PR** (revisora: Ana) → intentar moverla a **Hecho** | "¿Puedo saltarme la revisión? No: **RN-03** lo impide. Así se evitan **errores en producción**." |
| 3:30 | Ana | Revisiones → **Revisar ahora** → marcar checklist → **Aprobar** | "Revisa otra persona (**RN-04**) con una checklist. La tarea pasa sola a **Hecho**." |
| 4:15 | Líder | Inicio | "Las métricas se actualizan solas." |
| 4:45 | — | GitHub → **Actions** (pipeline verde) → un PR fusionado con su review | "Lo mismo que obliga DevHub lo obliga GitHub: PR, pipeline de lint, 34 pruebas unitarias, 16 e2e y build. Resuelve la **falta de automatización**." |
| 5:30 | — | Achicar el navegador / abrir en el celular | "Es responsive, se usa desde el móvil." |

**Plan B** si algo falla en vivo: tener capturas de cada paso (ver [07-EVIDENCIAS.md](07-EVIDENCIAS.md)) en las diapositivas.

### Para abrir DevHub en el celular (misma red Wi-Fi)
1. En la PC: `ipconfig` → anota la **Dirección IPv4** (ej. `192.168.1.20`).
2. Frontend: `npx ng serve --host 0.0.0.0`
3. En `frontend/src/app/Utils/config.ts` cambia `API_URL` a `http://192.168.1.20:3000/api` y en `backend/.env` `FRONTEND_URL=http://192.168.1.20:4200` (**no subas** estos cambios).
4. En el celular: `http://192.168.1.20:4200`. Si no carga, permite Node.js en el Firewall de Windows.
