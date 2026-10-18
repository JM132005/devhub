// tareas.service.ts → lógica del tablero Kanban: crear (RN-02), mover (RN-03) y cerrar specs implementadas.

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tarea, TareaDocumento } from './esquemas/tarea.esquema.js';
import { Spec, SpecDocumento } from '../specs/esquemas/spec.esquema.js';
import {
  Revision,
  RevisionDocumento,
} from '../revisiones/esquemas/revision.esquema.js';
import { ProyectosService } from '../proyectos/proyectos.service.js';
import { puedeGestionar } from '../proyectos/proyectos.reglas.js';
import { CrearTareaDto } from './dto/crear-tarea.dto.js';
import { ActualizarTareaDto } from './dto/actualizar-tarea.dto.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { EstadoSpec, EstadoTarea } from '../../comun/constantes.js';
import { mismoId } from '../../comun/utilidades.js';
import {
  puedeCrearTarea,
  puedeMoverA,
  specCompletada,
} from './tareas.reglas.js';

@Injectable()
export class TareasService {
  constructor(
    @InjectModel(Tarea.name)
    private readonly tareaModelo: Model<TareaDocumento>,
    @InjectModel(Spec.name) private readonly specModelo: Model<SpecDocumento>,
    @InjectModel(Revision.name)
    private readonly revisionModelo: Model<RevisionDocumento>,
    private readonly proyectosService: ProyectosService,
  ) {}

  // Tareas del proyecto para el Kanban, con nombre del responsable y código de la spec.
  async listar(proyectoId: string, usuario: UsuarioToken) {
    await this.proyectosService.obtenerConAcceso(proyectoId, usuario);
    return this.tareaModelo
      .find({ proyectoId })
      .populate('asignadoId', 'nombre')
      .populate('specId', 'codigo titulo')
      .sort({ createdAt: 1 })
      .exec();
  }

  async crear(proyectoId: string, dto: CrearTareaDto, usuario: UsuarioToken) {
    const proyecto = await this.proyectosService.obtenerParaGestionar(
      proyectoId,
      usuario,
    );

    const spec = await this.specModelo.findById(dto.specId).exec();
    if (!spec || !mismoId(spec.proyectoId, proyecto._id)) {
      throw new BadRequestException('La spec no existe en este proyecto');
    }
    // RN-02: sin spec APROBADA no hay tarea.
    if (!puedeCrearTarea(spec.estado as EstadoSpec)) {
      throw new BadRequestException(
        `RN-02: la spec ${spec.codigo} está en ${spec.estado}; debe estar APROBADA`,
      );
    }
    // Si se indicó milestone, debe existir dentro del proyecto.
    if (
      dto.milestoneId &&
      !proyecto.milestones.some((m) => mismoId(m._id, dto.milestoneId))
    ) {
      throw new BadRequestException(
        'El milestone no pertenece a este proyecto',
      );
    }
    return this.tareaModelo.create({ ...dto, proyectoId, estado: 'POR_HACER' });
  }

  // Busca la tarea y comprueba que el usuario sea el responsable o quien gestiona el proyecto.
  private async obtenerParaModificar(id: string, usuario: UsuarioToken) {
    const tarea = await this.tareaModelo.findById(id).exec();
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    const proyecto = await this.proyectosService.obtenerConAcceso(
      tarea.proyectoId,
      usuario,
    );
    if (
      !puedeGestionar(proyecto, usuario) &&
      !mismoId(tarea.asignadoId, usuario.sub)
    ) {
      throw new ForbiddenException(
        'Solo el responsable de la tarea o el líder pueden modificarla',
      );
    }
    return tarea;
  }

  async actualizar(id: string, dto: ActualizarTareaDto, usuario: UsuarioToken) {
    const tarea = await this.obtenerParaModificar(id, usuario);
    Object.assign(tarea, dto);
    return tarea.save();
  }

  // Mover de columna en el Kanban (HU-10) aplicando RN-03.
  async cambiarEstado(id: string, estado: EstadoTarea, usuario: UsuarioToken) {
    const tarea = await this.obtenerParaModificar(id, usuario);
    // exists(): ¿hay alguna revisión APROBADA para esta tarea?
    const aprobada = Boolean(
      await this.revisionModelo.exists({
        tareaId: tarea._id,
        estado: 'APROBADO',
      }),
    );
    if (!puedeMoverA(estado, aprobada)) {
      throw new BadRequestException(
        'RN-03: la tarea no puede pasar a HECHO sin un Pull Request aprobado',
      );
    }
    tarea.estado = estado;
    await tarea.save();
    if (estado === 'HECHO') await this.revisarSpecImplementada(tarea.specId);
    return tarea;
  }

  // Lo llama RevisionesService cuando un PR se aprueba (como cuando un merge cierra el Issue).
  async marcarHecho(tareaId: Types.ObjectId) {
    const tarea = await this.tareaModelo
      .findByIdAndUpdate(
        tareaId,
        { estado: 'HECHO' },
        { returnDocument: 'after' },
      )
      .exec();
    if (tarea) await this.revisarSpecImplementada(tarea.specId);
  }

  // Lo llama RevisionesService al registrar o rechazar un PR.
  async moverSinValidar(tareaId: Types.ObjectId, estado: EstadoTarea) {
    await this.tareaModelo.findByIdAndUpdate(tareaId, { estado }).exec();
  }

  // Si todas las tareas de una spec están en HECHO, la spec pasa a IMPLEMENTADA.
  private async revisarSpecImplementada(specId: Types.ObjectId) {
    const tareas = await this.tareaModelo
      .find({ specId })
      .select('estado')
      .exec();
    // map(): convierte el arreglo de tareas en un arreglo solo con sus estados.
    if (specCompletada(tareas.map((t) => t.estado as EstadoTarea))) {
      await this.specModelo
        .updateOne(
          { _id: specId, estado: 'APROBADA' },
          { estado: 'IMPLEMENTADA' },
        )
        .exec();
    }
  }
}
