# SPEC 005 · Code Review (Pull Requests)

**Estado:** Aprobada · **Issue:** #13 · **Módulo:** `backend/src/modulos/revisiones`

## Contexto
Los "errores frecuentes en producción" ocurren porque el código se sube sin que nadie lo revise.

## Historias de usuario
- **HU-12** Como desarrollador, quiero registrar el Pull Request de mi tarea y elegir revisor.
- **HU-13** Como revisor, quiero aprobar o pedir cambios usando una checklist.

## Requisitos funcionales
| ID | Requisito |
|----|-----------|
| RF-21 | Solo el responsable de la tarea registra su PR; la tarea pasa a EN_REVISION. |
| RF-22 | El revisor debe pertenecer al proyecto. |
| RF-23 | Para aprobar, la checklist debe estar completa: pipeline verde, cumple spec, tiene pruebas, código comentado. |
| RF-24 | Al aprobar, la tarea pasa a HECHO (equivale al merge que cierra el Issue). |
| RF-25 | Al pedir cambios (con comentario), la tarea vuelve a EN_PROGRESO. |
| **RN-04** | **Nadie revisa su propio Pull Request.** |

## Criterios de aceptación
- Dado un autor que se elige como revisor, entonces recibe **400** (RN-04).
- Dada una checklist con un punto sin marcar, cuando se aprueba, entonces recibe **400**.
- Dada una aprobación válida, entonces la tarea queda en HECHO.
