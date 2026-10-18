// ============================================================
//  seed.mongodb.js → DATOS DE PRUEBA para DevHub
//  Cómo usarlo: MongoDB Compass → conexión → ícono >_ (MongoDB shell)
//  → copia TODO este archivo, pégalo y presiona Enter.
//  Contraseña de TODOS los usuarios de prueba: Devhub123*
//  ⚠️ Borra y vuelve a crear los datos de la base "devhub".
// ============================================================

use devhub

db.usuarios.deleteMany({}); db.proyectos.deleteMany({}); db.specs.deleteMany({});
db.tareas.deleteMany({});   db.revisiones.deleteMany({}); db.prompts.deleteMany({});

// Hash bcrypt de "Devhub123*"
const HASH = "$2b$10$VLS4zrsN7hufMH7kQiAOJuJcG8tet4pm3YkAvJ.QJgX6h3p7gpv3.";

// Se crean los _id antes para poder relacionar documentos
const uAdmin = new ObjectId(), uLider = new ObjectId(), uDiego = new ObjectId(), uAna = new ObjectId();
const pDevhub = new ObjectId(), pFarmacia = new ObjectId();
const m1 = new ObjectId(), m2 = new ObjectId(), m3 = new ObjectId();
const s1 = new ObjectId(), s2 = new ObjectId(), s3 = new ObjectId(), s4 = new ObjectId();
const t1 = new ObjectId(), t2 = new ObjectId(), t3 = new ObjectId(), t4 = new ObjectId(), t5 = new ObjectId();

// 1. USUARIOS
db.usuarios.insertMany([
  { _id: uAdmin, nombre: "Administrador DevHub", correo: "admin@devhub.com", contrasenaHash: HASH, rol: "ADMIN",         activo: true, createdAt: new Date("2026-10-01") },
  { _id: uLider, nombre: "Laura Líder",          correo: "lider@devhub.com", contrasenaHash: HASH, rol: "LIDER",         activo: true, createdAt: new Date("2026-10-01") },
  { _id: uDiego, nombre: "Diego Dev",            correo: "diego@devhub.com", contrasenaHash: HASH, rol: "DESARROLLADOR", activo: true, createdAt: new Date("2026-10-02") },
  { _id: uAna,   nombre: "Ana Dev",              correo: "ana@devhub.com",   contrasenaHash: HASH, rol: "DESARROLLADOR", activo: true, createdAt: new Date("2026-10-02") }
]);

// 2. PROYECTOS (milestones embebidos)
db.proyectos.insertMany([
  { _id: pDevhub, nombre: "DevHub", descripcion: "Plataforma interna para gestionar specs, tareas y revisiones (se construye con DevHub)",
    cliente: "Interno", repoGithub: "equipo/devhub", estado: "DESARROLLO", liderId: uLider, miembros: [uDiego, uAna],
    milestones: [
      { _id: m1, nombre: "Sprint 1 · Base",   fechaLimite: new Date("2026-10-24"), cerrado: false },
      { _id: m2, nombre: "Sprint 2 · Extras", fechaLimite: new Date("2026-10-31"), cerrado: false }
    ], createdAt: new Date("2026-10-03") },
  { _id: pFarmacia, nombre: "App Farmacia", descripcion: "App de pedidos a domicilio para una farmacia de El Oro",
    cliente: "Farmacia El Oro", repoGithub: "equipo/app-farmacia", estado: "PLANIFICACION", liderId: uLider, miembros: [uAna],
    milestones: [ { _id: m3, nombre: "MVP", fechaLimite: new Date("2026-11-15"), cerrado: false } ], createdAt: new Date("2026-10-10") }
]);

// 3. SPECS (comentarios e historial embebidos)
db.specs.insertMany([
  { _id: s1, proyectoId: pDevhub, codigo: "SPEC-001", titulo: "Inicio de sesión con roles",
    historia: "Como usuario quiero iniciar sesión con correo y contraseña para acceder a mis proyectos",
    requisitos: ["Correo y contraseña obligatorios", "Contraseña cifrada con bcrypt", "Devolver token JWT válido por 8 horas"],
    criteriosAceptacion: ["Dado un correo y contraseña correctos, cuando inicio sesión, entonces recibo un token",
                          "Dada una contraseña incorrecta, cuando inicio sesión, entonces recibo error 401"],
    estado: "APROBADA", version: 2, autorId: uDiego, aprobadaPorId: uLider,
    comentarios: [ { autorId: uLider, texto: "Agrega el caso de contraseña incorrecta", fecha: new Date("2026-10-05") } ],
    historial: [ { version: 1, cambio: "Versión inicial sin caso de error", contenido: {}, autorId: uDiego, fecha: new Date("2026-10-04") } ],
    createdAt: new Date("2026-10-04") },
  { _id: s2, proyectoId: pDevhub, codigo: "SPEC-002", titulo: "Tablero Kanban de tareas",
    historia: "Como desarrollador quiero mover mis tareas entre columnas para mostrar mi avance",
    requisitos: ["Columnas: POR_HACER, EN_PROGRESO, EN_REVISION, HECHO", "Solo el asignado mueve su tarea"],
    criteriosAceptacion: ["Dada una tarea sin PR aprobado, cuando la muevo a HECHO, entonces el sistema lo impide"],
    estado: "APROBADA", version: 1, autorId: uAna, aprobadaPorId: uLider, comentarios: [], historial: [], createdAt: new Date("2026-10-06") },
  { _id: s3, proyectoId: pDevhub, codigo: "SPEC-003", titulo: "Dashboard de métricas",
    historia: "Como líder quiero ver tareas por estado y avance de milestones para tomar decisiones",
    requisitos: ["Conteo de tareas por estado", "Porcentaje de avance por milestone"],
    criteriosAceptacion: ["Dado un milestone con 2 de 4 tareas HECHO, entonces muestra 50 %"],
    estado: "EN_REVISION", version: 1, autorId: uDiego, aprobadaPorId: null, comentarios: [], historial: [], createdAt: new Date("2026-10-12") },
  { _id: s4, proyectoId: pFarmacia, codigo: "SPEC-001", titulo: "Catálogo de medicamentos",
    historia: "Como cliente quiero ver el catálogo con precios para elegir mis productos",
    requisitos: ["Buscar por nombre", "Mostrar stock disponible"],
    criteriosAceptacion: ["Dado un producto sin stock, entonces aparece como agotado"],
    estado: "BORRADOR", version: 1, autorId: uAna, aprobadaPorId: null, comentarios: [], historial: [], createdAt: new Date("2026-10-14") }
]);

// 4. TAREAS (solo de specs APROBADAS → RN-02)
db.tareas.insertMany([
  { _id: t1, proyectoId: pDevhub, specId: s1, milestoneId: m1, titulo: "API de login con JWT",      asignadoId: uDiego, estado: "HECHO",       prioridad: "ALTA",  rama: "feat/1-login-api",  createdAt: new Date("2026-10-06") },
  { _id: t2, proyectoId: pDevhub, specId: s1, milestoneId: m1, titulo: "Pantalla de login Angular", asignadoId: uAna,   estado: "EN_REVISION", prioridad: "ALTA",  rama: "feat/2-login-ui",   createdAt: new Date("2026-10-07") },
  { _id: t3, proyectoId: pDevhub, specId: s2, milestoneId: m1, titulo: "API para mover tareas",     asignadoId: uDiego, estado: "EN_PROGRESO", prioridad: "MEDIA", rama: "feat/3-kanban-api", createdAt: new Date("2026-10-08") },
  { _id: t4, proyectoId: pDevhub, specId: s2, milestoneId: m2, titulo: "Vista Kanban responsive",   asignadoId: uAna,   estado: "POR_HACER",   prioridad: "MEDIA", rama: null,                createdAt: new Date("2026-10-08") },
  { _id: t5, proyectoId: pDevhub, specId: s2, milestoneId: m2, titulo: "Pruebas TDD regla RN-03",   asignadoId: uDiego, estado: "POR_HACER",   prioridad: "BAJA",  rama: null,                createdAt: new Date("2026-10-09") }
]);

// 5. REVISIONES (revisor ≠ autor → RN-04)
db.revisiones.insertMany([
  { tareaId: t1, urlPr: "https://github.com/equipo/devhub/pull/1", autorId: uDiego, revisorId: uAna, estado: "APROBADO",
    checklist: { pipelineVerde: true, cumpleSpec: true, tienePruebas: true, codigoComentado: true },
    comentario: "Todo correcto, buen manejo del error 401", createdAt: new Date("2026-10-09") },
  { tareaId: t2, urlPr: "https://github.com/equipo/devhub/pull/2", autorId: uAna, revisorId: uDiego, estado: "ABIERTO",
    checklist: { pipelineVerde: true, cumpleSpec: false, tienePruebas: false, codigoComentado: true },
    comentario: "", createdAt: new Date("2026-10-15") }
]);

// 6. PROMPTS
db.prompts.insertMany([
  { titulo: "Generar pruebas desde criterios", categoria: "TESTING",       contenido: "Actúa como experto en TDD. A partir de estos criterios de aceptación escribe pruebas con Vitest para NestJS, una prueba por criterio: <criterios>", etiquetas: ["tdd", "vitest", "nestjs"], autorId: uDiego, votos: 8 },
  { titulo: "Spec desde una idea",            categoria: "DOCUMENTACION", contenido: "Convierte esta idea en una spec con historia de usuario, requisitos numerados y criterios Dado/Cuando/Entonces: <idea>", etiquetas: ["sdd", "spec-kit"], autorId: uLider, votos: 6 },
  { titulo: "Refactorizar con comentarios",   categoria: "REFACTOR",      contenido: "Refactoriza este código separando responsabilidades y comenta cada método explicando qué hace, sin cambiar su comportamiento: <código>", etiquetas: ["clean-code"], autorId: uAna, votos: 4 },
  { titulo: "Crear DTO con validaciones",     categoria: "CODIGO",        contenido: "Genera un DTO de NestJS con class-validator para estos campos y explica cada decorador: <campos>", etiquetas: ["nestjs", "dto"], autorId: uDiego, votos: 3 }
]);

// Índices (los mismos que crea NestJS)
db.usuarios.createIndex({ correo: 1 }, { unique: true });
db.specs.createIndex({ proyectoId: 1, codigo: 1 }, { unique: true });
db.tareas.createIndex({ proyectoId: 1, estado: 1 });

["usuarios","proyectos","specs","tareas","revisiones","prompts"].forEach(c => print(c + ": " + db[c].countDocuments()));
