// proyecto-detalle.ts → PANTALLA principal de un proyecto. Pestañas: Resumen · Specs · Kanban · Revisiones.
// Esta pantalla actúa como "controlador": pide datos a los servicios y reparte a los componentes.

import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// forkJoin: lanza varias peticiones a la vez y espera TODAS. switchMap: encadena una petición tras otra.
import { forkJoin, switchMap } from 'rxjs';
import { ProyectosService } from '../../Servicios/proyectos.service';
import { SpecsService } from '../../Servicios/specs.service';
import { TareasService } from '../../Servicios/tareas.service';
import { RevisionesService } from '../../Servicios/revisiones.service';
import { AuthService } from '../../Servicios/auth.service';
import { EstadoProyecto, Proyecto } from '../../Entidades/proyecto';
import { DatosSpec, Spec } from '../../Entidades/spec';
import { EstadoTarea, NuevaTarea, Tarea } from '../../Entidades/tarea';
import { Checklist, Revision } from '../../Entidades/revision';
import { MetricasProyecto } from '../../Entidades/metricas';
import { Usuario } from '../../Entidades/usuario';
import { InsigniaEstado } from '../../Componentes/insignia-estado/insignia-estado';
import { PanelMetricas } from '../../Componentes/panel-metricas/panel-metricas';
import { TableroKanban } from '../../Componentes/tablero-kanban/tablero-kanban';
import { ListaRevisiones } from '../../Componentes/lista-revisiones/lista-revisiones';
import { FormularioSpec } from '../../Formularios/formulario-spec/formulario-spec';
import { FormularioTarea } from '../../Formularios/formulario-tarea/formulario-tarea';
import { FormularioRevision } from '../../Formularios/formulario-revision/formulario-revision';
import { mensajeError } from '../../Utils/errores';
import { etiqueta } from '../../Utils/etiquetas';
import { idDe, nombreDe } from '../../Utils/ids';

type Pestana = 'resumen' | 'specs' | 'kanban' | 'revisiones';

@Component({
  selector: 'app-proyecto-detalle',
  imports: [
    RouterLink, FormsModule, InsigniaEstado, PanelMetricas, TableroKanban, ListaRevisiones,
    FormularioSpec, FormularioTarea, FormularioRevision,
  ],
  templateUrl: './proyecto-detalle.html',
})
export class ProyectoDetalle implements OnInit {
  // Llegan desde la URL gracias a withComponentInputBinding (app.config.ts):
  readonly id = input.required<string>(); // /proyectos/:id
  readonly pestana = input<Pestana>(); // ?pestana=revisiones

  private readonly proyectosService = inject(ProyectosService);
  private readonly specsService = inject(SpecsService);
  private readonly tareasService = inject(TareasService);
  private readonly revisionesService = inject(RevisionesService);
  protected readonly auth = inject(AuthService);
  protected readonly etiqueta = etiqueta;
  protected readonly nombreDe = nombreDe;

  // ---------- Estado de la pantalla (signals) ----------
  protected readonly proyecto = signal<Proyecto | null>(null);
  protected readonly specs = signal<Spec[]>([]);
  protected readonly tareas = signal<Tarea[]>([]);
  protected readonly revisiones = signal<Revision[]>([]);
  protected readonly metricas = signal<MetricasProyecto | null>(null);
  protected readonly activa = signal<Pestana>('resumen');
  protected readonly formulario = signal<'spec' | 'tarea' | null>(null);
  protected readonly tareaParaPr = signal<Tarea | null>(null);
  protected readonly error = signal('');
  protected readonly exito = signal('');

  // Campos del mini-formulario de milestone.
  protected nuevoMilestone = { nombre: '', fecha: '' };
  protected readonly estadosProyecto: EstadoProyecto[] = ['PLANIFICACION', 'DESARROLLO', 'PRUEBAS', 'PRODUCCION'];

  // ---------- Valores calculados ----------
  protected readonly usuarioId = computed(() => this.auth.usuario()?._id ?? '');

  // ¿Puedo gestionar este proyecto? → ADMIN o su líder.
  protected readonly esGestor = computed(() => {
    const p = this.proyecto();
    return this.auth.tieneRol('ADMIN') || (p !== null && idDe(p.liderId) === this.usuarioId());
  });

  // Equipo completo (líder + miembros) como objetos Usuario.
  protected readonly equipo = computed<Usuario[]>(() => {
    const p = this.proyecto();
    if (!p) return [];
    // filter con "type guard": se queda solo con los que llegaron como objeto (populate).
    return [p.liderId, ...p.miembros].filter((u): u is Usuario => typeof u === 'object');
  });

  protected readonly specsAprobadas = computed(() => this.specs().filter((s) => s.estado === 'APROBADA'));
  // Revisores posibles: el equipo menos yo (RN-04).
  protected readonly revisores = computed(() => this.equipo().filter((u) => u._id !== this.usuarioId()));

  ngOnInit(): void {
    const p = this.pestana();
    if (p) this.activa.set(p);
    this.cargarTodo();
  }

  // Carga todo en paralelo.
  cargarTodo(): void {
    forkJoin({
      proyecto: this.proyectosService.detalle(this.id()),
      specs: this.specsService.listar(this.id()),
      tareas: this.tareasService.listar(this.id()),
      revisiones: this.revisionesService.listar(this.id()),
      metricas: this.proyectosService.metricas(this.id()),
    }).subscribe({
      next: (r) => {
        this.proyecto.set(r.proyecto);
        this.specs.set(r.specs);
        this.tareas.set(r.tareas);
        this.revisiones.set(r.revisiones);
        this.metricas.set(r.metricas);
      },
      error: (e) => this.mostrarError(e),
    });
  }

  // ---------- Mensajes ----------
  private mostrarError(e: unknown): void {
    this.exito.set('');
    this.error.set(mensajeError(e));
  }

  // Muestra un mensaje de éxito, cierra formularios y recarga los datos.
  private listo(mensaje: string): void {
    this.error.set('');
    this.exito.set(mensaje);
    this.formulario.set(null);
    this.tareaParaPr.set(null);
    this.cargarTodo();
  }

  // ---------- Acciones ----------
  crearSpec(datos: DatosSpec): void {
    this.specsService.crear(this.id(), datos).subscribe({
      next: (s) => this.listo(`${s.codigo} creada en BORRADOR. Envíala a revisión cuando esté lista.`),
      error: (e) => this.mostrarError(e),
    });
  }

  crearTarea(datos: NuevaTarea): void {
    this.tareasService.crear(this.id(), datos).subscribe({
      next: () => this.listo('Tarea creada en "Por hacer".'),
      error: (e) => this.mostrarError(e),
    });
  }

  moverTarea(evento: { tarea: Tarea; estado: EstadoTarea }): void {
    this.tareasService.cambiarEstado(evento.tarea._id, evento.estado).subscribe({
      next: () => this.listo(`"${evento.tarea.titulo}" → ${etiqueta(evento.estado)}`),
      error: (e) => this.mostrarError(e), // aquí aparece el mensaje de RN-03
    });
  }

  // Guarda la rama en la tarea y luego registra el PR (dos peticiones encadenadas con switchMap).
  registrarPr(datos: { urlPr: string; revisorId: string; rama: string }): void {
    const tarea = this.tareaParaPr();
    if (!tarea) return;
    this.tareasService
      .actualizar(tarea._id, { rama: datos.rama })
      .pipe(switchMap(() => this.revisionesService.registrar(tarea._id, datos.urlPr, datos.revisorId)))
      .subscribe({
        next: () => this.listo('Pull Request registrado. La tarea pasó a "En revisión".'),
        error: (e) => this.mostrarError(e),
      });
  }

  aprobarRevision(e: { revision: Revision; checklist: Checklist; comentario: string }): void {
    this.revisionesService.aprobar(e.revision._id, e.checklist, e.comentario).subscribe({
      next: () => this.listo('PR aprobado ✔ La tarea pasó a "Hecho".'),
      error: (err) => this.mostrarError(err),
    });
  }

  pedirCambios(e: { revision: Revision; comentario: string }): void {
    this.revisionesService.solicitarCambios(e.revision._id, e.comentario).subscribe({
      next: () => this.listo('Se pidieron cambios. La tarea volvió a "En progreso".'),
      error: (err) => this.mostrarError(err),
    });
  }

  cambiarEstadoProyecto(estado: EstadoProyecto): void {
    this.proyectosService.actualizar(this.id(), { estado }).subscribe({
      next: () => this.listo(`Proyecto en ${etiqueta(estado)}.`),
      error: (e) => {
        this.mostrarError(e); // aquí aparece RN-06
        this.cargarTodo(); // regresa el selector al estado real
      },
    });
  }

  agregarMilestone(): void {
    const { nombre, fecha } = this.nuevoMilestone;
    if (!nombre || !fecha) return;
    this.proyectosService.agregarMilestone(this.id(), nombre, fecha).subscribe({
      next: () => {
        this.nuevoMilestone = { nombre: '', fecha: '' };
        this.listo('Milestone agregado.');
      },
      error: (e) => this.mostrarError(e),
    });
  }
}
