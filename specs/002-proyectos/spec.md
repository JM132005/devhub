# SPEC 002 · Proyectos y milestones

**Estado:** Aprobada · **Issues:** #7, #12 · **Módulo:** `backend/src/modulos/proyectos`

## Contexto
La empresa no tiene un lugar central que diga qué proyectos existen, quién los lidera y en qué fase están.

## Historias de usuario
- **HU-03** Como líder, quiero crear un proyecto con nombre, descripción, repo de GitHub y equipo, para centralizar su información.
- **HU-04** Como desarrollador, quiero ver solo los proyectos donde participo.
- **HU-05** Como líder, quiero cambiar el estado del proyecto (Planificación → Desarrollo → Pruebas → Producción).
- **HU-11** Como líder, quiero agrupar el trabajo en milestones con fecha límite.

## Requisitos funcionales
| ID | Requisito |
|----|-----------|
| RF-07 | Solo LIDER o ADMIN crean proyectos; quien lo crea es su líder. |
| RF-08 | `repoGithub` tiene formato `usuario/repositorio`. |
| RF-09 | ADMIN ve todos los proyectos; los demás solo aquellos donde son líder o miembros. |
| RF-10 | Solo el líder del proyecto o un ADMIN lo editan. |
| RF-11 | Los milestones se guardan **embebidos** dentro del proyecto. |
| **RN-06** | Un proyecto **no pasa a PRODUCCION** si tiene tareas que no estén en HECHO. |

## Criterios de aceptación
- Dado un desarrollador que no es miembro, cuando abre el proyecto, entonces recibe **403**.
- Dado un proyecto con 3 tareas pendientes, cuando el líder lo pasa a PRODUCCION, entonces recibe **400** con el mensaje de RN-06.
- Dado un proyecto sin tareas pendientes, cuando pasa a PRODUCCION, entonces se guarda.
