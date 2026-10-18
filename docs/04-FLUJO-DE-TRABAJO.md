# 04 · Flujo de trabajo del equipo

> Este es el **modelo de trabajo propuesto** para la empresa del caso y el que usamos para construir DevHub.
> Resumen en una línea: **nadie programa sin spec, nadie sube a `main` sin PR, ningún PR entra sin pipeline verde y la aprobación del compañero.**

## 1. Vista general

```
 ┌─────────┐   ┌────────┐   ┌───────┐   ┌──────┐   ┌──────┐   ┌──────────┐   ┌────────┐   ┌────────┐
 │  SPEC   │──▶│ ISSUE  │──▶│ RAMA  │──▶│ TDD  │──▶│  PR  │──▶│ PIPELINE │──▶│ REVIEW │──▶│ MERGE  │
 │ aprobada│   │ Kanban │   │feat/N │   │🔴🟢🔵│   │Closes│   │ CI verde │   │compañero│  │ squash │
 └─────────┘   └────────┘   └───────┘   └──────┘   └──────┘   └──────────┘   └────────┘   └────────┘
   Bloque 3      Bloque 7     Bloque 1    Bloque 6   Bloque 2     Bloque 4       Bloque 2     Bloque 1
```

## 2. Estrategia de ramas: GitHub Flow

```
main  ●──────────●───────────●───────────●──────── (siempre funciona, protegida)
       \        /  \         /  \         /
        docs/3-spec-kit  feat/16-editar  feat/17-filtrar
```

| Regla | Por qué (problema del caso) |
|---|---|
| Nadie hace push directo a `main` | Evita sobrescribir trabajo ajeno → **pérdida de versiones** |
| Una rama corta por Issue | Cambios pequeños, fáciles de revisar y revertir |
| Todo entra por Pull Request | Siempre hay una segunda mirada → **errores en producción** |
| PR solo se fusiona con CI verde + 1 aprobación | Se aplica con el ruleset, no depende de la buena voluntad |
| Squash and merge | `main` queda con un commit limpio por funcionalidad |
| Tag al cerrar milestone (`v0.1.0`, `v1.0.0`) | Se puede volver a cualquier versión estable |

### Git Flow vs GitHub Flow vs Trunk Based (Bloque 1)

| | Git Flow | GitHub Flow (elegido) | Trunk Based |
|---|---|---|---|
| Ramas | main, develop, feature, release, hotfix | main + ramas cortas | Casi todo directo a main |
| Vida de las ramas | Semanas | Horas o días | Horas |
| Ideal para | Equipos grandes con versiones programadas | Equipos pequeños con entregas continuas | Equipos muy maduros con muchas pruebas |
| Con CI/CD | Más fusiones y conflictos | Natural: cada PR se prueba | Exige feature flags |
| Para la empresa del caso | Demasiada burocracia para empezar | ✅ Fácil de aprender y seguro | Riesgoso sin cultura de pruebas |

## 3. Protección de `main` (ruleset `proteger-main`)

Configurado en **Settings → Rules → Rulesets**:

| Regla activa | Efecto |
|---|---|
| Restrict deletions | Nadie puede borrar `main` |
| Block force pushes | Nadie puede reescribir el historial |
| Require a pull request before merging · 1 approval | Obliga Code Review |
| Require status checks: `Backend (lint · test · build · e2e)` y `Frontend (build Angular)` | Obliga pipeline verde |

> Por eso un PR muestra **"Merging is blocked — Review required"** hasta que el compañero aprueba. **Es el comportamiento correcto.**

## 4. Convenciones

**Ramas:** `tipo/<n°issue>-descripcion-corta`

| Ejemplo | Para |
|---|---|
| `feat/16-editar-tareas` | Funcionalidad del Issue 16 |
| `fix/25-token-expira` | Corrección |
| `docs/3-spec-kit` | Documentación |
| `test/30-pruebas-metricas` | Pruebas |
| `ci/18-deploy` | Pipeline |

**Commits:** Conventional Commits (ver [03-COMANDOS.md](03-COMANDOS.md#mensajes-de-commit-conventional-commits)).

**PR:** título igual al commit principal; en la descripción `Closes #N` (cierra el Issue al fusionar) y la checklist de la plantilla.

## 5. Ciclo de una funcionalidad paso a paso

### 1 · SPEC (Spec Driven Development)
- Escribir la spec en `specs/NNN-nombre/spec.md` (a mano o con `/speckit.specify` en Copilot).
- Formato: historia de usuario (*Como… quiero… para…*), requisitos numerados, criterios **Dado / Cuando / Entonces**.
- Dentro de DevHub: el desarrollador la crea → **Enviar a revisión** → el líder la **Aprueba** (RN-01).

### 2 · ISSUE
- Cada historia/tarea es un Issue con etiqueta (`feat`, `fix`…), milestone y responsable.
- Aparece en el tablero **Projects → DevHub** en "Todo".

### 3 · RAMA
```powershell
git switch main; git pull
git switch -c feat/16-editar-tareas
```
Mover la tarjeta del tablero a **In Progress**.

### 4 · TDD (Bloque 6)
1. 🔴 Escribir la prueba en `*.reglas.spec.ts` con el criterio de aceptación → `npm run test:watch` → falla.
2. 🟢 Escribir el mínimo código para que pase (se puede pedir ayuda a Copilot).
3. 🔵 Ordenar el código sin romper la prueba.

### 5 · PULL REQUEST
```powershell
npm test; npm run lint                      # en backend/, antes de subir
git add .
git commit -m "feat(tareas): editar responsable desde el kanban"
git push -u origin feat/16-editar-tareas
```
GitHub → **Compare & pull request** → completar plantilla → `Closes #16` → **Reviewers:** el compañero → **Create pull request**.

### 6 · PIPELINE (Bloque 4)
GitHub Actions ejecuta `.github/workflows/ci.yml` automáticamente:

| Job | Pasos |
|---|---|
| Backend | `npm ci` → `lint` → `test` (34) → `build` → `test:e2e` (16, con MongoDB en contenedor) |
| Frontend | `npm ci` → `build` → guarda la app compilada como artefacto |

Si algo sale ❌: abrir el detalle en **Actions**, corregir en la misma rama, `git push` → el pipeline se repite solo.

### 7 · CODE REVIEW (Bloque 2)
El compañero: **Files changed** → comentarios en líneas → **Review changes** → **Approve** o **Request changes**.

Checklist (está en la plantilla del PR):
- [ ] Pipeline en verde
- [ ] Cumple los criterios de la spec
- [ ] Tiene pruebas
- [ ] Código comentado y entendible
- [ ] No sube secretos (`.env`)

Buenas prácticas:
- Revisar en menos de 24 h.
- Comentar el código, no a la persona: *"¿qué pasa si el token expira?"* en vez de *"esto está mal"*.
- **Request changes** solo si se rompe una regla, una prueba o un criterio de la spec.

### 8 · MERGE
**Squash and merge** → **Confirm** → **Delete branch**. El Issue se cierra solo y la tarjeta pasa a **Done**.
```powershell
git switch main; git pull
git branch -D feat/16-editar-tareas
```

### 9 · VERSIÓN (al cerrar un milestone)
```powershell
git switch main; git pull
git tag v1.0.0 -m "M2 · Completo"
git push origin v1.0.0
```
Opcional: GitHub → **Releases → Draft a new release** con ese tag.

## 6. El mismo flujo dentro de DevHub

DevHub obliga a seguir el modelo en la propia aplicación:

| Paso del flujo | En DevHub | Regla |
|---|---|---|
| Spec aprobada | Pestaña Specs → Enviar → Aprobar | RN-01, RN-05 |
| Tarea | Kanban → + Nueva tarea (solo desde spec aprobada) | RN-02 |
| Rama | Campo "rama" de la tarea | — |
| PR | Botón *Registrar PR* con revisor | RN-04 |
| Review | Revisiones → checklist → Aprobar | RN-04 |
| Hecho | La tarea pasa a HECHO solo con PR aprobado | RN-03 |
| Producción | Estado del proyecto → PRODUCCIÓN solo sin pendientes | RN-06 |

## 7. Uso de Copilot (Bloque 5)

| Para | Cómo |
|---|---|
| Specs | `/speckit.specify`, `/speckit.clarify` |
| Plan y tareas | `/speckit.plan`, `/speckit.tasks` |
| Pruebas | Prompt "Generar pruebas desde criterios" (pantalla **Prompts** de DevHub) |
| Código | Sugerencias en línea + chat en modo Agent |
| Revisión | "Explica este cambio" sobre el diff antes de aprobar |

Reglas del equipo con IA (están en la constitución):
- El código generado **siempre** pasa por pruebas y Code Review humano.
- Nunca pegar secretos ni datos reales en el chat.
- Los prompts que funcionan bien se guardan en la biblioteca de **Prompts** de DevHub.

## 8. Reparto del equipo

| | JM (JM132005) | Compañero |
|---|---|---|
| Sistema | Auth, usuarios, specs, code review, Spec Kit, filtro por milestone (#17), integración GitHub (#19) | Proyectos, tareas/Kanban, dashboard, prompts, editar tareas (#16), deploy (#18) |
| Revisa los PRs de | Compañero | JM |
| Informe | Bloques 1, 3, 5 + introducción | Bloques 2, 4, 6, 7 + conclusiones |
| Juntos | Análisis crítico, propuesta, presentación | |

## 9. Excepción documentada: si el compañero no puede aprobar

Si hay una urgencia y el revisor no está disponible, **no se desactiva la regla en silencio**:
1. Settings → Rules → Rulesets → `proteger-main` → **Bypass list → Add bypass → Repository admin**.
2. Hacer el merge marcando *"Merge without waiting for requirements to be met"*.
3. **Quitar** inmediatamente el bypass.
4. Dejar un comentario en el PR explicando el motivo y pedir una revisión posterior.

> En el informe se presenta como **excepción controlada**: la regla existe, se registró el motivo y se restauró.
