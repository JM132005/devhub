// esquemas.spec.ts → prueba de REGRESIÓN: comprueba que todas las referencias entre colecciones
// se guarden como ObjectId. Si alguien escribe "type: Types.ObjectId" (que Mongoose 9 toma como
// "Mixed"), las búsquedas por id dejan de funcionar en silencio; esta prueba lo detecta en el pipeline.

import { ProyectoEsquema } from '../modulos/proyectos/esquemas/proyecto.esquema.js';
import { SpecEsquema } from '../modulos/specs/esquemas/spec.esquema.js';
import { TareaEsquema } from '../modulos/tareas/esquemas/tarea.esquema.js';
import { RevisionEsquema } from '../modulos/revisiones/esquemas/revision.esquema.js';
import { PromptEsquema } from '../modulos/prompts/esquemas/prompt.esquema.js';
// Schema: tipo general de un esquema de Mongoose (sirve para cualquiera de los anteriores).
import type { Schema } from 'mongoose';

// Arreglo de tuplas [nombre, esquema, campo] a revisar.
// Se declara el tipo para que TypeScript trate a todos los esquemas como "Schema" genérico.
const referencias: [string, Schema, string][] = [
  ['Proyecto', ProyectoEsquema, 'liderId'],
  ['Spec', SpecEsquema, 'proyectoId'],
  ['Spec', SpecEsquema, 'autorId'],
  ['Spec', SpecEsquema, 'aprobadaPorId'],
  ['Tarea', TareaEsquema, 'proyectoId'],
  ['Tarea', TareaEsquema, 'specId'],
  ['Tarea', TareaEsquema, 'milestoneId'],
  ['Tarea', TareaEsquema, 'asignadoId'],
  ['Revision', RevisionEsquema, 'tareaId'],
  ['Revision', RevisionEsquema, 'autorId'],
  ['Revision', RevisionEsquema, 'revisorId'],
  ['Prompt', PromptEsquema, 'autorId'],
];

describe('Esquemas de MongoDB', () => {
  // it.each: ejecuta la misma prueba una vez por cada fila del arreglo.
  it.each(referencias)(
    '%s.%s se guarda como ObjectId',
    (_nombre, esquema, campo) => {
      expect(esquema.path(campo).instance).toBe('ObjectId');
    },
  );
});