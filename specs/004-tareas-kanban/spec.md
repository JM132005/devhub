# SPEC 004 · Tareas y tablero Kanban

**Estado:** Aprobada · **Issues:** #10, #12 · **Módulo:** `backend/src/modulos/tareas`

## Contexto
Nadie sabe quién hace qué ni en qué estado está cada cosa. El tablero lo hace visible.

## Historias de usuario
- **HU-09** Como líder, quiero crear tareas a partir de una spec aprobada y asignarlas.
- **HU-10** Como desarrollador, quiero mover mis tareas entre columnas para mostrar mi avance.

## Requisitos funcionales
| ID | Requisito |
|----|-----------|
| RF-16 | Columnas: POR_HACER → EN_PROGRESO → EN_REVISION → HECHO. |
| RF-17 | Solo LIDER o ADMIN crean tareas. |
| RF-18 | Solo el responsable o el líder mueven una tarea. |
| RF-19 | La rama sigue la convención `feat|fix|docs|test|ci/<n°>-descripcion`. |
| RF-20 | Cuando todas las tareas de una spec están en HECHO, la spec pasa a IMPLEMENTADA. |
| **RN-02** | **No se crea una tarea si su spec no está APROBADA.** |
| **RN-03** | **Una tarea no pasa a HECHO sin un Pull Request APROBADO.** |

## Criterios de aceptación
- Dada una spec en BORRADOR, cuando el líder crea una tarea, entonces recibe **400** (RN-02).
- Dada una tarea sin PR aprobado, cuando se mueve a HECHO, entonces recibe **400** (RN-03).
- Dada la última tarea de una spec, cuando pasa a HECHO, entonces la spec queda IMPLEMENTADA.
