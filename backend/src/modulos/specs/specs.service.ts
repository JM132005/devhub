// specs.service.ts → lógica de las especificaciones: crear, editar con historial y flujo de aprobación.

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Spec, SpecDocumento } from './esquemas/spec.esquema.js';
import { CrearSpecDto } from './dto/crear-spec.dto.js';
import { ActualizarSpecDto } from './dto/actualizar-spec.dto.js';
import { ProyectosService } from '../proyectos/proyectos.service.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { EstadoSpec } from '../../comun/constantes.js';
import {
  AccionSpec,
  estadoTrasEditar,
  puedeAprobar,
  siguienteCodigo,
  siguienteEstado,
} from './specs.reglas.js';

@Injectable()
export class SpecsService {
  constructor(
    @InjectModel(Spec.name) private readonly specModelo: Model<SpecDocumento>,
    private readonly proyectosService: ProyectosService,
  ) {}

  // Lista las specs de un proyecto (sin el historial, para que la respuesta sea liviana).
  async listar(proyectoId: string, usuario: UsuarioToken) {
    await this.proyectosService.obtenerConAcceso(proyectoId, usuario);
    return this.specModelo
      .find({ proyectoId })
      .select('-historial') // "-campo" = excluir ese campo
      .populate('autorId', 'nombre')
      .sort({ codigo: 1 })
      .exec();
  }

  async crear(proyectoId: string, dto: CrearSpecDto, usuario: UsuarioToken) {
    await this.proyectosService.obtenerConAcceso(proyectoId, usuario);
    const existentes = await this.specModelo.countDocuments({ proyectoId });
    return this.specModelo.create({
      ...dto,
      proyectoId,
      codigo: siguienteCodigo(existentes), // SPEC-001, SPEC-002...
      estado: 'BORRADOR',
      version: 1,
      autorId: usuario.sub,
    });
  }

  // Busca la spec (sin populate) y comprueba acceso a su proyecto. Uso interno.
  private async obtener(id: string, usuario: UsuarioToken) {
    const spec = await this.specModelo.findById(id).exec();
    if (!spec) throw new NotFoundException('Spec no encontrada');
    await this.proyectosService.obtenerConAcceso(spec.proyectoId, usuario);
    return spec;
  }

  // Detalle completo con nombres de autor, aprobador y autores de comentarios/historial.
  async detalle(id: string, usuario: UsuarioToken) {
    await this.obtener(id, usuario);
    return this.specModelo
      .findById(id)
      .populate('autorId', 'nombre')
      .populate('aprobadaPorId', 'nombre')
      .populate('comentarios.autorId', 'nombre')
      .populate('historial.autorId', 'nombre')
      .exec();
  }

  // Editar: guarda la versión anterior en el historial, sube la versión y aplica RN-05.
  async actualizar(id: string, dto: ActualizarSpecDto, usuario: UsuarioToken) {
    const spec = await this.obtener(id, usuario);
    const nuevoEstado = estadoTrasEditar(spec.estado as EstadoSpec);
    if (!nuevoEstado)
      throw new BadRequestException(
        'Una spec IMPLEMENTADA ya no se puede editar',
      );

    // "Foto" del contenido antes del cambio.
    spec.historial.push({
      version: spec.version,
      cambio: dto.cambio ?? 'Edición',
      contenido: {
        titulo: spec.titulo,
        historia: spec.historia,
        requisitos: [...spec.requisitos], // [...arreglo] = copia del arreglo
        criteriosAceptacion: [...spec.criteriosAceptacion],
      },
      autorId: new Types.ObjectId(usuario.sub),
      fecha: new Date(),
    });

    // Desestructuración: separa "cambio" (no es un campo de la spec) del resto de datos.
    const { cambio: _cambio, ...contenido } = dto;
    Object.assign(spec, contenido);
    spec.version += 1;
    if (nuevoEstado !== spec.estado) {
      spec.estado = nuevoEstado; // RN-05: APROBADA → EN_REVISION
      spec.aprobadaPorId = null; // necesita una nueva aprobación
    }
    return spec.save();
  }

  // Ejecuta una acción del flujo (enviar, aprobar, devolver) validando la transición.
  async cambiarEstado(
    id: string,
    accion: AccionSpec,
    usuario: UsuarioToken,
    comentario?: string,
  ) {
    const spec = await this.obtener(id, usuario);

    // RN-01: aprobar y devolver son exclusivas de LIDER o ADMIN.
    if (accion !== 'enviar' && !puedeAprobar(usuario.rol)) {
      throw new ForbiddenException(
        'RN-01: solo un LIDER o ADMIN puede aprobar o devolver specs',
      );
    }
    const nuevo = siguienteEstado(spec.estado as EstadoSpec, accion);
    if (!nuevo)
      throw new BadRequestException(
        `No se puede "${accion}" una spec en estado ${spec.estado}`,
      );

    spec.estado = nuevo;
    if (accion === 'aprobar')
      spec.aprobadaPorId = new Types.ObjectId(usuario.sub);
    if (comentario) {
      spec.comentarios.push({
        autorId: new Types.ObjectId(usuario.sub),
        texto: comentario,
        fecha: new Date(),
      });
    }
    return spec.save();
  }

  // Agrega un comentario sin cambiar el estado.
  async comentar(id: string, texto: string, usuario: UsuarioToken) {
    const spec = await this.obtener(id, usuario);
    spec.comentarios.push({
      autorId: new Types.ObjectId(usuario.sub),
      texto,
      fecha: new Date(),
    });
    return spec.save();
  }
}
