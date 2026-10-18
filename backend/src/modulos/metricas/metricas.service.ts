// metricas.service.ts → números del dashboard (HU-14) usando el "aggregation pipeline" de MongoDB.

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tarea, TareaDocumento } from '../tareas/esquemas/tarea.esquema.js';
import { Spec, SpecDocumento } from '../specs/esquemas/spec.esquema.js';
import {
  Revision,
  RevisionDocumento,
} from '../revisiones/esquemas/revision.esquema.js';
import { ProyectosService } from '../proyectos/proyectos.service.js';
import type { UsuarioToken } from '../../comun/usuario-token.js';
import { ESTADOS_SPEC, ESTADOS_TAREA } from '../../comun/constantes.js';
import { mismoId } from '../../comun/utilidades.js';
import { porcentajeAvance } from './metricas.reglas.js';

@Injectable()
export class MetricasService {
  constructor(
    @InjectModel(Tarea.name)
    private readonly tareaModelo: Model<TareaDocumento>,
    @InjectModel(Spec.name) private readonly specModelo: Model<SpecDocumento>,
    @InjectModel(Revision.name)
    private readonly revisionModelo: Model<RevisionDocumento>,
    private readonly proyectosService: ProyectosService,
  ) {}

  // Cuenta documentos de una colección agrupados por "estado" → { BORRADOR: 1, APROBADA: 2, ... }
  private async contarPorEstado(
    modelo: Model<any>,
    filtro: object,
    estados: readonly string[],
  ) {
    // aggregate: procesa los documentos por etapas.
    //   $match → filtra  |  $group → agrupa por estado y cuenta con $sum: 1
    const grupos: { _id: string; total: number }[] = await modelo.aggregate([
      { $match: filtro },
      { $group: { _id: '$estado', total: { $sum: 1 } } },
    ]);
    // Object.fromEntries: crea un objeto con todos los estados en 0 y luego pone los conteos reales.
    const resultado: Record<string, number> = Object.fromEntries(
      estados.map((e) => [e, 0]),
    );
    grupos.forEach((g) => (resultado[g._id] = g.total));
    return resultado;
  }

  // GET /api/proyectos/:id/metricas
  async delProyecto(proyectoId: string, usuario: UsuarioToken) {
    const proyecto = await this.proyectosService.obtenerConAcceso(
      proyectoId,
      usuario,
    );
    // En aggregate el filtro NO convierte texto a ObjectId solo; por eso se crea el ObjectId.
    const id = new Types.ObjectId(proyectoId);

    const tareasPorEstado = await this.contarPorEstado(
      this.tareaModelo,
      { proyectoId: id },
      ESTADOS_TAREA,
    );
    const specsPorEstado = await this.contarPorEstado(
      this.specModelo,
      { proyectoId: id },
      ESTADOS_SPEC,
    );

    // Avance de cada milestone: total de tareas y cuántas están en HECHO.
    const tareas = await this.tareaModelo
      .find({ proyectoId: id })
      .select('estado milestoneId')
      .exec();
    const milestones = proyecto.milestones.map((m) => {
      const delMilestone = tareas.filter((t) => mismoId(t.milestoneId, m._id)); // filter: se queda con las que cumplen
      const hechas = delMilestone.filter((t) => t.estado === 'HECHO').length;
      return {
        _id: m._id,
        nombre: m.nombre,
        fechaLimite: m.fechaLimite,
        total: delMilestone.length,
        hechas,
        porcentaje: porcentajeAvance(delMilestone.length, hechas),
      };
    });

    const revisionesAbiertas = await this.revisionModelo.countDocuments({
      tareaId: { $in: tareas.map((t) => t._id) },
      estado: 'ABIERTO',
    });

    return {
      tareasPorEstado,
      specsPorEstado,
      milestones,
      revisionesAbiertas,
      avanceGeneral: porcentajeAvance(tareas.length, tareasPorEstado['HECHO']),
    };
  }

  // GET /api/metricas/resumen → lo que el usuario ve en su pantalla de inicio.
  async resumen(usuario: UsuarioToken) {
    const proyectos = await this.proyectosService.listar(usuario);
    const ids = proyectos.map((p) => p._id);

    // Tareas pendientes asignadas a mí.
    const misTareas = await this.tareaModelo
      .find({ asignadoId: usuario.sub, estado: { $ne: 'HECHO' } })
      .populate('proyectoId', 'nombre')
      .populate('specId', 'codigo')
      .sort({ updatedAt: -1 })
      .limit(10)
      .exec();

    // Specs por aprobar: solo para LIDER/ADMIN, de los proyectos que gestionan.
    const gestionados =
      usuario.rol === 'ADMIN'
        ? ids
        : proyectos
            .filter((p) =>
              mismoId((p.liderId as any)?._id ?? p.liderId, usuario.sub),
            )
            .map((p) => p._id);
    const specsPorAprobar =
      usuario.rol === 'DESARROLLADOR'
        ? []
        : await this.specModelo
            .find({ proyectoId: { $in: gestionados }, estado: 'EN_REVISION' })
            .select('codigo titulo proyectoId')
            .populate('proyectoId', 'nombre')
            .exec();

    // Pull Requests que me tocan revisar.
    const revisionesPendientes = await this.revisionModelo
      .find({ revisorId: usuario.sub, estado: 'ABIERTO' })
      .populate('tareaId', 'titulo proyectoId')
      .populate('autorId', 'nombre')
      .exec();

    return {
      totalProyectos: proyectos.length,
      misTareas,
      specsPorAprobar,
      revisionesPendientes,
    };
  }
}
