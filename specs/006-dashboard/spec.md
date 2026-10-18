# SPEC 006 · Dashboard y biblioteca de prompts

**Estado:** Aprobada · **Issues:** #14, #19 · **Módulos:** `metricas`, `prompts`

## Historias de usuario
- **HU-14** Como líder, quiero ver tareas por estado, specs pendientes y avance de milestones.
- **HU-16** Como desarrollador, quiero guardar y buscar prompts útiles para Copilot.

## Requisitos funcionales
| ID | Requisito |
|----|-----------|
| RF-26 | Conteo de tareas y specs por estado con el *aggregation pipeline* de MongoDB (`$match`, `$group`). |
| RF-27 | Avance por milestone = tareas HECHO / total × 100, redondeado. |
| RF-28 | Inicio personal: mis tareas pendientes, specs por aprobar (líder) y PRs que debo revisar. |
| RF-29 | Prompts con categoría (TESTING, DOCUMENTACION, REFACTOR, CODIGO), búsqueda, copiar y votar. |

## Criterios de aceptación
- Dado un milestone con 2 de 4 tareas en HECHO, entonces muestra **50 %**.
- Dado un milestone sin tareas, entonces muestra **0 %** (sin dividir entre cero).
