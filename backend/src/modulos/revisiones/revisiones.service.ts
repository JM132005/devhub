// revisiones.service.ts → Code Review: registrar PR, aprobar (RN-04 + checklist) o pedir cambios.

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Revision, RevisionDocumento } from './esquemas/revision.esquema.js';
import { Tarea, TareaDocumento } from '../tareas/esquemas/tarea.esquema.js';
import { ProyectosService } from '../proyectos/proyectos.service.js';
import { TareasService } from '../tareas/tareas.service.js';
import { puedeGestionar } from '../proyectos/proyectos.reglas.js';
import { RegistrarRevisionDto } from './dto/registrar-revision.dto.js';
import { AprobarRevisionDto } from './dto/aprobar-revision.dto.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { mismoId } from '../../comun/utilidades.js';
import { checklistCompleta, revisorValido } from './revisiones.reglas.js';

@Injectable()
export class RevisionesService {
  constructor(
    @InjectModel(Revision.name)
    private readonly revisionModelo: Model<RevisionDocumento>,
    @InjectModel(Tarea.name)
    private readonly tareaModelo: Model<TareaDocumento>,
    private readonly proyectosService: ProyectosService,
    private readonly tareasService: TareasService,
  ) {}

  // Revisiones de todas las tareas de un proyecto (más recientes primero).
  async listarPorProyecto(proyectoId: string, usuario: UsuarioToken) {
    await this.proyectosService.obtenerConAcceso(proyectoId, usuario);
    // distinct('_id'): arreglo con los _id de las tareas del proyecto.
    const idsTareas = await this.tareaModelo
      .find({ proyectoId })
      .distinct('_id');
    return this.revisionModelo
      .find({ tareaId: { $in: idsTareas } }) // $in: el tareaId está dentro del arreglo
      .populate('tareaId', 'titulo rama')
      .populate('autorId', 'nombre')
      .populate('revisorId', 'nombre')
      .sort({ createdAt: -1 })
      .exec();
  }

  // El responsable de la tarea registra su PR y elige revisor (HU-12).
  async registrar(
    tareaId: string,
    dto: RegistrarRevisionDto,
    usuario: UsuarioToken,
  ) {
    const tarea = await this.tareaModelo.findById(tareaId).exec();
    if (!tarea) throw new NotFoundException('Tarea no encontrada');
    const proyecto = await this.proyectosService.obtenerConAcceso(
      tarea.proyectoId,
      usuario,
    );

    if (!mismoId(tarea.asignadoId, usuario.sub)) {
      throw new ForbiddenException(
        'Solo el responsable de la tarea registra su Pull Request',
      );
    }
    // RN-04: nadie se revisa a sí mismo.
    if (!revisorValido(usuario.sub, dto.revisorId)) {
      throw new BadRequestException(
        'RN-04: no puedes ser revisor de tu propio Pull Request',
      );
    }
    // El revisor debe ser parte del equipo del proyecto.
    const esDelEquipo =
      mismoId(proyecto.liderId, dto.revisorId) ||
      proyecto.miembros.some((m) => mismoId(m, dto.revisorId));
    if (!esDelEquipo)
      throw new BadRequestException('El revisor debe pertenecer al proyecto');

    const revision = await this.revisionModelo.create({
      ...dto,
      tareaId,
      autorId: usuario.sub,
      estado: 'ABIERTO',
    });
    await this.tareasService.moverSinValidar(tarea._id, 'EN_REVISION'); // la tarjeta pasa a "En revisión"
    return revision;
  }

  // Busca la revisión ABIERTA y comprueba que quien actúa sea el revisor asignado.
  private async obtenerParaRevisar(id: string, usuario: UsuarioToken) {
    const revision = await this.revisionModelo.findById(id).exec();
    if (!revision) throw new NotFoundException('Revisión no encontrada');
    const tarea = await this.tareaModelo.findById(revision.tareaId).exec();
    const proyecto = await this.proyectosService.obtenerConAcceso(
      tarea!.proyectoId,
      usuario,
    );

    const esRevisor = mismoId(revision.revisorId, usuario.sub);
    if (!esRevisor && !puedeGestionar(proyecto, usuario)) {
      throw new ForbiddenException(
        'Solo el revisor asignado puede responder esta revisión',
      );
    }
    if (!revisorValido(revision.autorId, usuario.sub)) {
      throw new BadRequestException(
        'RN-04: el autor no puede revisar su propio Pull Request',
      );
    }
    if (revision.estado !== 'ABIERTO')
      throw new BadRequestException(`La revisión ya está ${revision.estado}`);
    return revision;
  }

  // Aprobar (HU-13): exige checklist completa y deja la tarea en HECHO (RN-03).
  async aprobar(id: string, dto: AprobarRevisionDto, usuario: UsuarioToken) {
    const revision = await this.obtenerParaRevisar(id, usuario);
    // Spread {...}: convierte la instancia del DTO en objeto simple para la regla.
    if (!checklistCompleta({ ...dto.checklist })) {
      throw new BadRequestException(
        'Para aprobar, todos los puntos de la checklist deben cumplirse',
      );
    }
    revision.estado = 'APROBADO';
    revision.checklist = dto.checklist;
    revision.comentario = dto.comentario ?? '';
    await revision.save();
    await this.tareasService.marcarHecho(revision.tareaId); // como un merge que cierra el Issue
    return revision;
  }

  // Pedir cambios: la tarea regresa a EN_PROGRESO para que el autor corrija.
  async solicitarCambios(
    id: string,
    comentario: string,
    usuario: UsuarioToken,
  ) {
    const revision = await this.obtenerParaRevisar(id, usuario);
    revision.estado = 'CAMBIOS_SOLICITADOS';
    revision.comentario = comentario;
    await revision.save();
    await this.tareasService.moverSinValidar(revision.tareaId, 'EN_PROGRESO');
    return revision;
  }
}
