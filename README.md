# ⌘ DevHub

**Plataforma interna para organizar el desarrollo de software con Spec Driven Development.**
Cada funcionalidad se **especifica** y aprueba, se **asigna** como tarea en un Kanban, se **revisa** con Pull Request y se **verifica** con pruebas automáticas en GitHub Actions.

> Proyecto del Primer Parcial · Programación Móvil. DevHub se gestiona **a sí mismo**: sus propias specs, tareas y revisiones están dentro de DevHub.

| Capa | Tecnología |
|---|---|
| Frontend | Angular 21 (standalone + signals), responsive / móvil primero |
| Backend | NestJS 12 · API REST · JWT · class-validator |
| Base de datos | MongoDB + Mongoose (documentos embebidos + referencias) |
| Pruebas | Vitest (unitarias TDD) + Supertest (e2e contra MongoDB real) |
| CI | GitHub Actions |
| Metodología | Spec Driven Development (GitHub Spec Kit) · GitHub Flow |

---

## 🚀 Puesta en marcha

Requisitos: **Node.js 22.12+** (o 20.19+), **MongoDB** local encendido, Git.

```bash
# 1) Backend
cd backend
cp .env.example .env          # en PowerShell: Copy-Item .env.example .env
npm install
npm run start:dev             # → http://localhost:3000/api/salud

# 2) Frontend (otra terminal)
cd frontend
npm install
npm start                     # → http://localhost:4200
```

**Datos de prueba:** abre MongoDB Compass → conexión → `>_` y pega `backend/scripts/seed.mongodb.js`.

| Correo | Rol | Contraseña |
|---|---|---|
| admin@devhub.com | Administrador | `Devhub123*` |
| lider@devhub.com | Líder | `Devhub123*` |
| diego@devhub.com | Desarrollador | `Devhub123*` |
| ana@devhub.com | Desarrollador | `Devhub123*` |

## 🧪 Pruebas
```bash
cd backend
npm test            # 34 pruebas unitarias de reglas de negocio (no necesita MongoDB)
npm run test:e2e    # 16 pruebas del flujo SDD completo contra MongoDB (usa la base devhub_test y la borra)
npm run lint
```

## 📏 Reglas de negocio (probadas con TDD)
| ID | Regla | Dónde |
|---|---|---|
| RN-01 | Solo LIDER/ADMIN aprueban specs | `specs.reglas.ts` |
| RN-02 | No hay tarea sin spec APROBADA | `tareas.reglas.ts` |
| RN-03 | Una tarea no pasa a HECHO sin PR aprobado | `tareas.reglas.ts` |
| RN-04 | Nadie revisa su propio PR | `revisiones.reglas.ts` |
| RN-05 | Editar una spec aprobada la regresa a revisión (nueva versión) | `specs.reglas.ts` |
| RN-06 | No pasa a PRODUCCIÓN con tareas pendientes | `proyectos.reglas.ts` |

## 🗂️ Estructura
```
devhub/
├── backend/                       NestJS
│   ├── src/comun/                 guards (JWT, roles), decoradores, pipes, constantes
│   ├── src/modulos/
│   │   ├── auth/  usuarios/  proyectos/  specs/  tareas/  revisiones/  metricas/  prompts/  salud/
│   │   └── (cada uno) esquemas/ dto/ *.controller *.service *.module *.reglas *.reglas.spec
│   ├── test/flujo-sdd.e2e-spec.ts prueba end-to-end del flujo completo
│   └── scripts/seed.mongodb.js    datos de prueba
├── frontend/src/app/              Angular
│   ├── Entidades/  Servicios/  Controlador/  Componentes/  Formularios/  Paginas/  Utils/
├── specs/                         especificaciones SDD (constitución + 001…006)
├── docs/                          documentación completa (00–07)
├── scripts/crear-issues.sh        crea etiquetas, milestones e Issues en GitHub
└── .github/                       pipeline CI, plantilla de PR y de Issues
```

## 🔌 API (prefijo `/api`)
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión (público) |
| GET | `/salud` | Estado de la API (público) |
| GET · POST · PATCH | `/usuarios` · `/usuarios/:id` | Usuarios (crear/editar: ADMIN) |
| GET · POST | `/proyectos` | Mis proyectos / crear (LIDER, ADMIN) |
| GET · PATCH | `/proyectos/:id` | Detalle / editar o cambiar estado (RN-06) |
| POST | `/proyectos/:id/milestones` | Agregar milestone |
| GET · POST | `/proyectos/:id/specs` | Specs del proyecto |
| GET · PATCH | `/specs/:id` | Detalle / editar (RN-05) |
| POST | `/specs/:id/enviar` · `/aprobar` · `/devolver` · `/comentarios` | Flujo de aprobación (RN-01) |
| GET · POST | `/proyectos/:id/tareas` | Kanban / crear tarea (RN-02) |
| PATCH | `/tareas/:id` · `/tareas/:id/estado` | Editar / mover (RN-03) |
| GET | `/proyectos/:id/revisiones` | PRs del proyecto |
| POST | `/tareas/:id/revisiones` | Registrar PR (RN-04) |
| POST | `/revisiones/:id/aprobar` · `/solicitar-cambios` | Code Review |
| GET | `/proyectos/:id/metricas` · `/metricas/resumen` | Dashboard |
| GET · POST | `/prompts` · `/prompts/:id/votar` | Biblioteca de prompts |

## 📚 Documentación
| # | Documento |
|---|---|
| 00 | [Índice](docs/00-INDICE.md) |
| 01 | [Qué es DevHub y qué se hizo](docs/01-QUE-ES-DEVHUB.md) |
| 02 | [Instalación y comprobación](docs/02-INSTALACION.md) |
| 03 | [Comandos de uso diario](docs/03-COMANDOS.md) |
| 04 | [Flujo de trabajo del equipo](docs/04-FLUJO-DE-TRABAJO.md) |
| 05 | [Pruebas y guion de la demo](docs/05-PRUEBAS-Y-DEMO.md) |
| 06 | [Bitácora: problemas y soluciones](docs/06-BITACORA.md) |
| 07 | [Evidencias para el informe](docs/07-EVIDENCIAS.md) |

## 🤝 Cómo contribuir
Lee [`docs/04-FLUJO-DE-TRABAJO.md`](docs/04-FLUJO-DE-TRABAJO.md): rama por Issue → PR → CI verde → review → merge.
