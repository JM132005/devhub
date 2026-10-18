# SPEC 003 · Especificaciones (SDD)

**Estado:** Aprobada · **Issues:** #8, #9 · **Módulo:** `backend/src/modulos/specs`

## Contexto
El problema de "falta de documentación" del caso se resuelve obligando a **escribir y aprobar** qué hará cada funcionalidad antes de programarla.

## Historias de usuario
- **HU-06** Como desarrollador, quiero escribir una spec con historia, requisitos y criterios de aceptación.
- **HU-07** Como líder, quiero aprobar o devolver una spec con comentarios.
- **HU-08** Como usuario, quiero ver el historial de versiones de una spec.

## Ciclo de vida
```
BORRADOR ──enviar──▶ EN_REVISION ──aprobar──▶ APROBADA ──(todas sus tareas HECHO)──▶ IMPLEMENTADA
    ▲                     │                       │
    └────devolver─────────┘                       └──editar──▶ EN_REVISION (versión +1)
```

## Requisitos funcionales
| ID | Requisito |
|----|-----------|
| RF-12 | Código automático y único por proyecto: `SPEC-001`, `SPEC-002`… |
| RF-13 | Al menos 1 requisito y 1 criterio de aceptación. |
| RF-14 | Comentarios e historial se guardan **embebidos** en la spec. |
| RF-15 | Devolver exige comentario. |
| **RN-01** | Solo LIDER o ADMIN aprueban o devuelven specs. |
| **RN-05** | Editar una spec APROBADA la regresa a EN_REVISION, sube la versión y guarda la anterior en el historial. Una spec IMPLEMENTADA no se edita. |

## Criterios de aceptación
- Dada una spec en BORRADOR, cuando se intenta aprobar, entonces recibe **400**.
- Dado un DESARROLLADOR, cuando intenta aprobar, entonces recibe **403** (RN-01).
- Dada una spec APROBADA v1, cuando se edita, entonces queda EN_REVISION v2 y el historial tiene la v1 (RN-05).
