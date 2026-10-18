# 📚 Documentación de DevHub

> Lee los documentos **en orden**. Si eres el compañero que recién se une al proyecto, empieza por el 01 y sigue con el 02.

| # | Documento | Para qué sirve | ¿Quién lo lee? |
|---|---|---|---|
| 01 | [Qué es DevHub y qué se hizo](01-QUE-ES-DEVHUB.md) | Entender el proyecto, los conceptos (Git, PR, pipeline, SDD, TDD…) y dónde está cada cosa que pide el PDF | Los dos |
| 02 | [Instalación y comprobación](02-INSTALACION.md) | Instalar todo en tu PC paso a paso y comprobar que funciona | **Compañero** (y cualquiera que clone el repo) |
| 03 | [Comandos de uso diario](03-COMANDOS.md) | "Chuleta" de todos los comandos: Git, npm, GitHub CLI, MongoDB, Spec Kit | Los dos (tenerlo abierto siempre) |
| 04 | [Flujo de trabajo del equipo](04-FLUJO-DE-TRABAJO.md) | Cómo se trabaja: Issue → rama → PR → pipeline → review → merge | Los dos |
| 05 | [Pruebas y demo](05-PRUEBAS-Y-DEMO.md) | Cómo probar las 6 reglas de negocio y guion de la demo para la presentación | Los dos |
| 06 | [Bitácora del proyecto](06-BITACORA.md) | Qué se hizo, en qué orden, problemas que aparecieron y cómo se resolvieron | Los dos (sirve para el informe) |
| 07 | [Evidencias para el informe](07-EVIDENCIAS.md) | Lista de capturas que hay que tomar y dónde va cada una | Los dos |

## Enlaces rápidos

| Qué | Dónde |
|---|---|
| Repositorio | https://github.com/JM132005/devhub |
| Pipeline (Actions) | https://github.com/JM132005/devhub/actions |
| Issues | https://github.com/JM132005/devhub/issues |
| Tablero Kanban | Pestaña **Projects → DevHub** del repo |
| Especificaciones (SDD) | Carpeta [`specs/`](../specs) |
| Constitución (Spec Kit) | [`.specify/memory/constitution.md`](../.specify/memory/constitution.md) |
| Datos de prueba | [`backend/scripts/seed.mongodb.js`](../backend/scripts/seed.mongodb.js) |

## Usuarios de prueba (contraseña de todos: `Devhub123*`)

| Correo | Rol | Para probar… |
|---|---|---|
| `admin@devhub.com` | Administrador | Pantalla de usuarios |
| `lider@devhub.com` | Líder | Aprobar specs, crear tareas, cambiar estado del proyecto |
| `diego@devhub.com` | Desarrollador | Escribir specs, mover tareas, registrar PR |
| `ana@devhub.com` | Desarrolladora | Revisar PRs (checklist) |
