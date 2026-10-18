# 01 · Qué es DevHub y qué se hizo

## 1. El problema (lo que pide el PDF)

Una empresa de software en Ecuador trabaja desordenada:

| Problema de la empresa | Ejemplo real |
|---|---|
| Pérdida de versiones | Juan y Ana tocan el mismo archivo y uno borra lo del otro |
| Desorganización | Nadie sabe quién hace qué ni cómo va cada tarea |
| Errores en producción | Se sube código sin revisar ni probar y el sistema se cae |
| Falta de documentación | Nadie escribe qué debe hacer cada función |
| Sin automatización | Todo se prueba y publica a mano |

**Nuestro papel:** somos consultores. Proponemos un **modelo de trabajo** con herramientas modernas y lo **demostramos construyendo un sistema** con ese mismo modelo.

## 2. La solución: DevHub

**DevHub** es una plataforma web interna para que la empresa organice su desarrollo:

> Cada funcionalidad se **especifica** y aprueba → se **asigna** como tarea en un Kanban → se **revisa** con un Pull Request → se **verifica** con pruebas automáticas.

**El truco de la presentación:** DevHub se construyó usando el mismo método que propone, y el proyecto "DevHub" está registrado **dentro de DevHub**.

| Problema | Cómo lo resuelve el modelo | Dónde se ve en DevHub |
|---|---|---|
| Pérdida de versiones | Git + ramas + `main` protegida | Cada tarea guarda su rama (`feat/5-login`) |
| Desorganización | Issues + Kanban + milestones | Pestaña Kanban y dashboard |
| Errores en producción | TDD + pipeline + Code Review obligatorio | Regla RN-03: sin PR aprobado no hay "Hecho" |
| Falta de documentación | Spec Driven Development (SDD) | Módulo de specs con aprobación e historial |
| Sin automatización | GitHub Actions + Copilot | Pipeline en cada PR + biblioteca de prompts |

## 3. Conceptos explicados con una analogía

Imagina que el equipo es **la cocina de un restaurante** y el software es **un plato**.

| Concepto | En la cocina | En el software |
|---|---|---|
| **Git** | Cuaderno que guarda cada versión de la receta | Programa que guarda el historial del código |
| **Commit** | Anotar "le agregué sal" | Guardar una versión con un mensaje |
| **Repositorio** | El cuaderno completo | La carpeta del proyecto con su historial |
| **GitHub** | El cuaderno en internet para todos | Donde se sube el repo y se trabaja en equipo |
| **Rama (branch)** | Probar tu variante en hoja aparte | Copia del código para trabajar sin dañar `main` |
| **main** | La receta oficial que se sirve | Rama principal: siempre debe funcionar |
| **Pull Request (PR)** | "Chef, ¿paso mi variante a la receta oficial?" | Pedir que tu rama se una a `main` |
| **Code Review** | El chef prueba antes de aprobar | El compañero revisa tu código |
| **Merge** | Pasar la variante a la receta oficial | Unir tu rama con `main` |
| **Spec (especificación)** | La receta escrita antes de cocinar | Documento que dice qué hará una función y cómo saber que funciona |
| **SDD** | "Nadie cocina sin receta aprobada" | Primero se especifica y aprueba, luego se programa |
| **Spec Kit** | Formato oficial de receta | Herramienta de GitHub para escribir specs con Copilot |
| **Prueba (test)** | Catador automático | Código que comprueba que otro código funciona |
| **TDD** | Escribir primero qué debe probar el catador | Prueba primero 🔴 → código 🟢 → ordenar 🔵 |
| **Pipeline** | Cinta de control de calidad | Pasos automáticos: lint → pruebas → compilar |
| **CI / CD** | Revisar cada plato / servirlo solo si pasa | Integración continua / despliegue continuo |
| **GitHub Actions** | La máquina de la cinta | Servicio de GitHub que ejecuta el pipeline |
| **Issue** | Comanda pendiente | Tarea registrada en GitHub |
| **Kanban** | Pizarra Por hacer → Hecho | Tablero de tareas por columnas |
| **Milestone** | Meta con fecha | Grupo de tareas con fecha límite |
| **Copilot** | Ayudante que sugiere pasos | IA que sugiere código |
| **Prompt** | La forma de pedirle algo al ayudante | Texto que se le escribe a la IA |

## 4. Cómo está construido DevHub

```
 📱 Navegador / celular
        │
        ▼
 ┌──────────────┐   HTTP + JSON + token JWT   ┌──────────────┐        ┌──────────┐
 │   Angular 21 │ ──────────────────────────▶ │   NestJS 12  │ ─────▶ │ MongoDB  │
 │  (frontend)  │ ◀────────────────────────── │  (API REST)  │ ◀───── │  devhub  │
 │ :4200        │                             │ :3000/api    │        │ :27017   │
 └──────────────┘                             └──────────────┘        └──────────┘
```

| Pieza | Analogía | Tecnología | Carpeta |
|---|---|---|---|
| Frontend | El mesero (lo que ve el cliente) | Angular 21, TypeScript | `frontend/` |
| Backend | La cocina (aplica las reglas) | NestJS 12, TypeScript | `backend/` |
| Base de datos | La despensa | MongoDB + Mongoose | (local, base `devhub`) |
| Pipeline | Control de calidad | GitHub Actions | `.github/workflows/ci.yml` |

### Estructura de carpetas

```
devhub/
├── .github/
│   ├── workflows/ci.yml           → PIPELINE (lint, pruebas, build, e2e)
│   ├── pull_request_template.md   → plantilla con checklist de Code Review
│   ├── ISSUE_TEMPLATE/            → plantillas de Issues
│   └── skills/                    → comandos /speckit.* para Copilot
├── .specify/                      → Spec Kit (constitución, plantillas)
├── backend/                       → API NestJS
│   ├── src/comun/                 → seguridad (guards JWT y roles), pipes, constantes
│   ├── src/modulos/
│   │   ├── auth/  usuarios/  proyectos/  specs/  tareas/
│   │   ├── revisiones/  metricas/  prompts/  salud/
│   │   └── (cada módulo) esquemas/ dto/ *.controller *.service *.module *.reglas *.reglas.spec
│   ├── test/flujo-sdd.e2e-spec.ts → prueba end-to-end del flujo completo
│   └── scripts/seed.mongodb.js    → datos de prueba
├── frontend/src/app/              → Angular
│   ├── Entidades/   Servicios/   Controlador/
│   ├── Componentes/ Formularios/ Paginas/   Utils/
├── specs/                         → especificaciones SDD (constitución + 001…006)
├── scripts/                       → crear Issues/milestones/etiquetas con GitHub CLI
└── docs/                          → esta documentación
```

### Qué hace cada archivo de un módulo del backend

| Archivo | Analogía | Qué hace |
|---|---|---|
| `esquemas/*.esquema.ts` | El molde | Define cómo se guarda el documento en MongoDB |
| `dto/*.dto.ts` | El formulario de pedido | Valida los datos que llegan (400 si están mal) |
| `*.controller.ts` | El mesero | Recibe la petición HTTP y la pasa al servicio |
| `*.service.ts` | El cocinero | Lógica y acceso a la base de datos |
| `*.reglas.ts` | El reglamento | Reglas de negocio puras (sin BD) → fáciles de probar |
| `*.reglas.spec.ts` | El catador | Pruebas TDD de las reglas |
| `*.module.ts` | La estación de cocina | Junta todo lo anterior |

## 5. Las 6 reglas de negocio (el corazón del sistema)

| ID | Regla | Qué problema del caso ataca |
|---|---|---|
| **RN-01** | Solo LÍDER o ADMIN aprueban specs | Control de calidad de la documentación |
| **RN-02** | No se crea una tarea sin una spec **aprobada** | Falta de documentación (obliga SDD) |
| **RN-03** | Una tarea no pasa a HECHO sin un PR **aprobado** | Errores en producción (obliga Code Review) |
| **RN-04** | Nadie revisa su propio PR | Revisión real por otra persona |
| **RN-05** | Editar una spec aprobada la regresa a revisión (nueva versión) | Pérdida de versiones / cambios sin control |
| **RN-06** | Un proyecto no pasa a PRODUCCIÓN con tareas pendientes | Entregas incompletas |

## 6. Dónde está cada cosa que pide el PDF

| El PDF pide | Dónde está | Cómo se demuestra |
|---|---|---|
| Repositorio en GitHub | https://github.com/JM132005/devhub | Enlace del repo |
| Proyecto Angular + base de datos | `frontend/` + MongoDB | Demo en vivo |
| Uso de ramas | Ramas `docs/…`, `feat/…` | Pestaña **Branches** / historial |
| Pull Requests | PR con plantilla y checklist | Pestaña **Pull requests** |
| Al menos 1 pipeline | `.github/workflows/ci.yml` | Pestaña **Actions** en verde |
| Especificaciones del sistema | `specs/001…006` + constitución | Archivos en GitHub |
| Flujo de trabajo usado | [04-FLUJO-DE-TRABAJO.md](04-FLUJO-DE-TRABAJO.md) | Informe |
| Bloque 1 · Git avanzado, Git Flow vs Trunk | Ramas cortas + `main` protegida + tags | Historial y ruleset |
| Bloque 2 · GitHub, PR, Code Review | PR + aprobación del compañero | PR fusionado |
| Bloque 3 · SDD, Spec Kit | `specs/` + `.specify/` + módulo Specs | Constitución + specs |
| Bloque 4 · CI/CD, GitHub Actions | `ci.yml` (+ Issue de deploy) | Actions en verde |
| Bloque 5 · Copilot, prompts | `/speckit.constitution` + pantalla Prompts | Captura del chat |
| Bloque 6 · TDD, pruebas en pipelines | 34 pruebas unitarias + 16 e2e | `npm test` + Actions |
| Bloque 7 · Issues, Kanban, Milestones | 21 Issues, 2 milestones, tablero | Pestañas Issues y Projects |

## 7. Estado actual del sistema

| Módulo | Estado |
|---|---|
| Login, roles, usuarios | ✅ Completo |
| Proyectos y milestones | ✅ Completo |
| Specs (SDD) con historial | ✅ Completo |
| Kanban de tareas | ✅ Completo |
| Code Review | ✅ Completo |
| Dashboard y prompts | ✅ Completo |
| Responsive (móvil) | ✅ Completo |
| Editar tareas desde el Kanban (#16) | ⏳ Pendiente (PR del compañero) |
| Filtrar Kanban por milestone (#17) | ⏳ Pendiente (PR de JM) |
| Deploy automático (#18) | ⏳ Opcional |
| Integración API de GitHub (#19) | ⏳ Opcional |
| Asistente IA de specs | 💡 Fase 2 (propuesta en el informe) |
