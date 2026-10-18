# Flujo de trabajo del equipo

> Este documento es el **modelo de trabajo propuesto** para la empresa del caso y el que usamos para construir DevHub.

## 1. Estrategia de ramas: GitHub Flow

```
main  ●───────●─────────●─────────●──────── (siempre funciona, protegida)
       \     /  \       /  \       /
        feat/16   feat/17    fix/25
```

| Regla | Por qué |
|---|---|
| Nadie hace push directo a `main` | Evita sobrescribir trabajo ajeno (pérdida de versiones) |
| Una rama corta por Issue | El cambio es pequeño, fácil de revisar y de revertir |
| Todo entra por Pull Request | Siempre hay una segunda mirada (Code Review) |
| PR solo se fusiona con CI en verde + 1 aprobación | Evita errores en producción |
| Tag de versión al cerrar milestone (`v0.1.0`, `v1.0.0`) | Se puede volver a cualquier versión estable |

### ¿Por qué no Git Flow?
| | Git Flow | GitHub Flow (elegido) |
|---|---|---|
| Ramas | main, develop, feature, release, hotfix | main + ramas cortas |
| Ideal para | Equipos grandes con versiones programadas | Equipos pequeños con entregas continuas |
| Con CI/CD | Más fusiones y conflictos | Natural: cada PR se prueba |
| Para 2 personas / 2 semanas | Burocracia innecesaria | ✅ |

GitHub Flow es muy cercano a **Trunk Based Development**: ramas que viven horas o pocos días y se integran seguido.

## 2. Convenciones

**Ramas:** `tipo/<n°issue>-descripcion` → `feat/16-editar-tareas`, `fix/25-token-expira`, `docs/20-informe`, `test/...`, `ci/...`

**Commits (Conventional Commits):**
```
feat(tareas): permitir reasignar responsable desde el kanban
fix(auth): devolver 401 cuando el usuario está desactivado
test(specs): probar RN-05 al editar una spec aprobada
docs: agregar sección de despliegue al README
ci: guardar la app compilada como artefacto
```

## 3. Ciclo de una funcionalidad (Spec Driven Development)

```
1. SPEC      → /speckit.specify  → specs/NNN-.../spec.md  (el líder la aprueba en DevHub)
2. PLAN      → /speckit.plan + /speckit.tasks
3. ISSUE     → aparece en el Kanban "Por hacer"
4. RAMA      → git switch -c feat/16-editar-tareas
5. TDD       → prueba primero (rojo) → código con Copilot (verde) → refactor
6. PR        → git push -u origin feat/16-editar-tareas → "Compare & pull request" → Closes #16
7. PIPELINE  → GitHub Actions: lint + pruebas + build + e2e
8. REVIEW    → el compañero revisa con la checklist de la plantilla
9. MERGE     → Squash and merge → el Issue se cierra solo → "Hecho"
```

## 4. Comandos del día a día

```bash
git switch main                       # ir a la rama principal
git pull                              # traer lo último del compañero
git switch -c feat/16-editar-tareas   # crear rama de trabajo
# ... programar y probar ...
git add .                             # preparar cambios
git commit -m "feat(tareas): editar responsable desde el kanban"
git push -u origin feat/16-editar-tareas
# en GitHub: Compare & pull request → asignar revisor → esperar CI verde → aprobar → Squash and merge
git switch main && git pull           # actualizar main
git branch -d feat/16-editar-tareas   # borrar la rama local
```

## 5. Code Review

- Revisar en menos de 24 h para no bloquear al compañero.
- Comentar el código, no a la persona: *"¿qué pasa si el token expira?"* en vez de *"esto está mal"*.
- **Request changes** solo si se rompe una regla, una prueba o un criterio de la spec.
- Usar la checklist de la plantilla del PR.

## 6. Reparto del equipo

| | Persona A | Persona B |
|---|---|---|
| Sistema | Auth, usuarios, specs, code review, integración GitHub | Proyectos, tareas/Kanban, dashboard, prompts, deploy |
| Revisa los PRs de | B | A |
| Informe | Bloques 1, 3, 5 + introducción | Bloques 2, 4, 6, 7 + conclusiones |
