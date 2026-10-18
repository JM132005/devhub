// proyectos.service.ts → lógica de proyectos y milestones.
// Además ofrece obtenerConAcceso(), que los demás módulos usan para comprobar permisos.

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proyecto, ProyectoDocumento } from './esquemas/proyecto.esquema.js';
import { Tarea, TareaDocumento } from '../tareas/esquemas/tarea.esquema.js';
import { CrearProyectoDto } from './dto/crear-proyecto.dto.js';
import { ActualizarProyectoDto } from './dto/actualizar-proyecto.dto.js';
import { CrearMilestoneDto } from './dto/crear-milestone.dto.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import {
  puedeGestionar,
  puedePasarAProduccion,
  tieneAcceso,
} from './proyectos.reglas.js';

// Campos del usuario que se devuelven al hacer populate (nunca el hash).
const CAMPOS_USUARIO = 'nombre correo rol';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectModel(Proyecto.name)
    private readonly proyectoModelo: Model<ProyectoDocumento>,
    // Se inyecta también el modelo de tareas para validar la regla RN-06.
    @InjectModel(Tarea.name)
    private readonly tareaModelo: Model<TareaDocumento>,
  ) {}

  // Lista los proyectos que el usuario puede ver (HU-04).
  listar(usuario: UsuarioToken) {
    // $or: el usuario es líder O está en el arreglo de miembros. El ADMIN no tiene filtro.
    const filtro =
      usuario.rol === 'ADMIN'
        ? {}
        : { $or: [{ liderId: usuario.sub }, { miembros: usuario.sub }] };
    return this.proyectoModelo
      .find(filtro)
      .populate('liderId', CAMPOS_USUARIO) // populate: reemplaza el id por los datos del usuario
      .sort({ createdAt: -1 })
      .exec();
  }

  // Crea un proyecto; el líder es quien lo crea (o el que indique el ADMIN).
  crear(dto: CrearProyectoDto, usuario: UsuarioToken) {
    const liderId =
      usuario.rol === 'ADMIN' && dto.liderId ? dto.liderId : usuario.sub;
    return this.proyectoModelo.create({ ...dto, liderId });
  }

  // Busca el proyecto y verifica que el usuario tenga acceso. Lo usan specs, tareas, métricas...
  async obtenerConAcceso(id: string | Types.ObjectId, usuario: UsuarioToken) {
    const proyecto = await this.proyectoModelo.findById(id).exec();
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    if (!tieneAcceso(proyecto, usuario))
      throw new ForbiddenException('No perteneces a este proyecto');
    return proyecto;
  }

  // Verifica que el usuario sea líder del proyecto o ADMIN.
  async obtenerParaGestionar(
    id: string | Types.ObjectId,
    usuario: UsuarioToken,
  ) {
    const proyecto = await this.obtenerConAcceso(id, usuario);
    if (!puedeGestionar(proyecto, usuario)) {
      throw new ForbiddenException(
        'Solo el líder del proyecto o un ADMIN pueden hacer esto',
      );
    }
    return proyecto;
  }

  // Detalle completo con nombres del líder y de los miembros.
  async detalle(id: string, usuario: UsuarioToken) {
    await this.obtenerConAcceso(id, usuario);
    return this.proyectoModelo
      .findById(id)
      .populate('liderId', CAMPOS_USUARIO)
      .populate('miembros', CAMPOS_USUARIO)
      .exec();
  }

  async actualizar(
    id: string,
    dto: ActualizarProyectoDto,
    usuario: UsuarioToken,
  ) {
    const proyecto = await this.obtenerParaGestionar(id, usuario);

    // RN-06: para pasar a PRODUCCION no deben quedar tareas sin terminar.
    if (dto.estado === 'PRODUCCION') {
      // countDocuments: cuenta tareas del proyecto cuyo estado NO ($ne) es HECHO.
      const pendientes = await this.tareaModelo.countDocuments({
        proyectoId: proyecto._id,
        estado: { $ne: 'HECHO' },
      });
      if (!puedePasarAProduccion(pendientes)) {
        throw new BadRequestException(
          `RN-06: quedan ${pendientes} tareas sin terminar; no puede pasar a PRODUCCION`,
        );
      }
    }
    // Object.assign: copia los campos del dto sobre el documento; save() guarda en Mongo.
    Object.assign(proyecto, dto);
    return proyecto.save();
  }

  async agregarMilestone(
    id: string,
    dto: CrearMilestoneDto,
    usuario: UsuarioToken,
  ) {
    const proyecto = await this.obtenerParaGestionar(id, usuario);
    // push(): agrega el milestone al arreglo embebido.
    proyecto.milestones.push({
      nombre: dto.nombre,
      fechaLimite: new Date(dto.fechaLimite),
      cerrado: false,
    } as never);
    return proyecto.save();
  }
}
