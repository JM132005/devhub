// flujo-sdd.e2e-spec.ts → prueba END-TO-END del flujo completo de DevHub contra un MongoDB REAL:
//   spec → aprobación → tarea → Pull Request → revisión → HECHO → spec IMPLEMENTADA
// y verifica que se cumplan las reglas RN-01, RN-02, RN-03 y RN-04.
//
// Se ejecuta con:  npm run test:e2e
// ⚠️ Usa la base "devhub_test" (NO la base "devhub" de desarrollo) y la borra al empezar y terminar.
// En GitHub Actions MongoDB corre como "service container" (ver .github/workflows/ci.yml).

import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// getConnectionToken: permite obtener la conexión de Mongoose para preparar datos de prueba.
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
// supertest: hace peticiones HTTP reales contra la app sin abrir un navegador.
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { AppModule } from '../src/app.module.js';

// Forzamos una base SOLO para pruebas (process.env se lee al crear la app, no antes).
process.env.MONGO_URI =
  process.env.MONGO_URI_TEST ?? 'mongodb://localhost:27017/devhub_test';

describe('Flujo SDD completo (e2e)', () => {
  let app: INestApplication;
  let conexion: Connection;
  // Variables compartidas entre pruebas (se ejecutan en orden).
  const ids: Record<string, string> = {};
  const tokens: Record<string, string> = {};

  // Atajo: devuelve el servidor HTTP para supertest.
  const http = () => request(app.getHttpServer());
  // Atajo: cabecera de autorización con el token de un usuario.
  const auth = (quien: string) => ({
    Authorization: `Bearer ${tokens[quien]}`,
  });

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modulo.createNestApplication();
    app.setGlobalPrefix('api'); // igual que en main.ts
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    conexion = app.get<Connection>(getConnectionToken());
    await conexion.dropDatabase(); // base limpia

    // Usuarios de prueba insertados directo en la colección (contraseña cifrada con bcrypt).
    const hash = await bcrypt.hash('Clave123*', 10);
    const r = await conexion.collection('usuarios').insertMany([
      {
        nombre: 'Líder',
        correo: 'lider@test.com',
        contrasenaHash: hash,
        rol: 'LIDER',
        activo: true,
      },
      {
        nombre: 'Dev Uno',
        correo: 'dev1@test.com',
        contrasenaHash: hash,
        rol: 'DESARROLLADOR',
        activo: true,
      },
      {
        nombre: 'Dev Dos',
        correo: 'dev2@test.com',
        contrasenaHash: hash,
        rol: 'DESARROLLADOR',
        activo: true,
      },
    ]);
    ids.lider = String(r.insertedIds[0]);
    ids.dev1 = String(r.insertedIds[1]);
    ids.dev2 = String(r.insertedIds[2]);
  });

  afterAll(async () => {
    await conexion?.dropDatabase();
    await app?.close();
  });

  // ---------------- Seguridad ----------------
  it('GET /api/salud es público', async () => {
    await http().get('/api/salud').expect(200);
  });

  it('sin token las rutas protegidas responden 401', async () => {
    await http().get('/api/proyectos').expect(401);
  });

  it('login con contraseña incorrecta responde 401', async () => {
    await http()
      .post('/api/auth/login')
      .send({ correo: 'lider@test.com', contrasena: 'mala' })
      .expect(401);
  });

  it('login correcto devuelve un token para cada usuario', async () => {
    for (const quien of ['lider', 'dev1', 'dev2']) {
      const res = await http()
        .post('/api/auth/login')
        .send({ correo: `${quien}@test.com`, contrasena: 'Clave123*' })
        .expect(200);
      expect(res.body.token).toBeTruthy();
      tokens[quien] = res.body.token;
    }
  });

  // ---------------- Proyecto y spec ----------------
  it('el líder crea un proyecto con su equipo', async () => {
    const res = await http()
      .post('/api/proyectos')
      .set(auth('lider'))
      .send({
        nombre: 'Proyecto Test',
        repoGithub: 'equipo/test',
        miembros: [ids.dev1, ids.dev2],
      })
      .expect(201);
    ids.proyecto = res.body._id;
  });

  it('un desarrollador escribe una spec (nace en BORRADOR con código SPEC-001)', async () => {
    const res = await http()
      .post(`/api/proyectos/${ids.proyecto}/specs`)
      .set(auth('dev1'))
      .send({
        titulo: 'Login',
        historia: 'Como usuario quiero entrar',
        requisitos: ['JWT'],
        criteriosAceptacion: ['Da token'],
      })
      .expect(201);
    expect(res.body.codigo).toBe('SPEC-001');
    expect(res.body.estado).toBe('BORRADOR');
    ids.spec = res.body._id;
  });

  it('RN-02: no se crea una tarea desde una spec en BORRADOR', async () => {
    await http()
      .post(`/api/proyectos/${ids.proyecto}/tareas`)
      .set(auth('lider'))
      .send({ specId: ids.spec, titulo: 'API login' })
      .expect(400);
  });

  it('RN-01: un desarrollador no puede aprobar specs', async () => {
    await http()
      .post(`/api/specs/${ids.spec}/enviar`)
      .set(auth('dev1'))
      .expect(200);
    await http()
      .post(`/api/specs/${ids.spec}/aprobar`)
      .set(auth('dev1'))
      .expect(403);
  });

  it('el líder aprueba la spec', async () => {
    const res = await http()
      .post(`/api/specs/${ids.spec}/aprobar`)
      .set(auth('lider'))
      .expect(200);
    expect(res.body.estado).toBe('APROBADA');
  });

  // ---------------- Tarea y Code Review ----------------
  it('con la spec APROBADA el líder crea la tarea y la asigna', async () => {
    const res = await http()
      .post(`/api/proyectos/${ids.proyecto}/tareas`)
      .set(auth('lider'))
      .send({ specId: ids.spec, titulo: 'API login', asignadoId: ids.dev1 })
      .expect(201);
    ids.tarea = res.body._id;
  });

  it('RN-03: la tarea no pasa a HECHO sin PR aprobado', async () => {
    await http()
      .patch(`/api/tareas/${ids.tarea}/estado`)
      .set(auth('dev1'))
      .send({ estado: 'HECHO' })
      .expect(400);
  });

  it('RN-04: nadie se asigna como revisor de su propio PR', async () => {
    await http()
      .post(`/api/tareas/${ids.tarea}/revisiones`)
      .set(auth('dev1'))
      .send({
        urlPr: 'https://github.com/equipo/test/pull/1',
        revisorId: ids.dev1,
      })
      .expect(400);
  });

  it('el autor registra su PR con otro revisor', async () => {
    const res = await http()
      .post(`/api/tareas/${ids.tarea}/revisiones`)
      .set(auth('dev1'))
      .send({
        urlPr: 'https://github.com/equipo/test/pull/1',
        revisorId: ids.dev2,
      })
      .expect(201);
    ids.revision = res.body._id;
  });

  it('no se aprueba con la checklist incompleta', async () => {
    await http()
      .post(`/api/revisiones/${ids.revision}/aprobar`)
      .set(auth('dev2'))
      .send({
        checklist: {
          pipelineVerde: true,
          cumpleSpec: true,
          tienePruebas: false,
          codigoComentado: true,
        },
      })
      .expect(400);
  });

  it('el revisor aprueba → la tarea pasa a HECHO y la spec a IMPLEMENTADA', async () => {
    await http()
      .post(`/api/revisiones/${ids.revision}/aprobar`)
      .set(auth('dev2'))
      .send({
        checklist: {
          pipelineVerde: true,
          cumpleSpec: true,
          tienePruebas: true,
          codigoComentado: true,
        },
      })
      .expect(200);

    const tareas = await http()
      .get(`/api/proyectos/${ids.proyecto}/tareas`)
      .set(auth('dev1'))
      .expect(200);
    expect(tareas.body[0].estado).toBe('HECHO');

    const spec = await http()
      .get(`/api/specs/${ids.spec}`)
      .set(auth('dev1'))
      .expect(200);
    expect(spec.body.estado).toBe('IMPLEMENTADA');
  });

  it('las métricas reflejan el avance del proyecto', async () => {
    const res = await http()
      .get(`/api/proyectos/${ids.proyecto}/metricas`)
      .set(auth('lider'))
      .expect(200);
    expect(res.body.tareasPorEstado.HECHO).toBe(1);
    expect(res.body.avanceGeneral).toBe(100);
  });
});
