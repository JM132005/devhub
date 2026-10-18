// panel-metricas.ts → COMPONENTE del dashboard del proyecto (HU-14): avance, conteos y milestones.

import { Component, input } from '@angular/core';
// DatePipe: formatea fechas en la plantilla → {{ fecha | date: 'dd/MM/yyyy' }}
import { DatePipe } from '@angular/common';
import { MetricasProyecto } from '../../Entidades/metricas';
import { COLUMNAS_KANBAN, etiqueta } from '../../Utils/etiquetas';

@Component({
  selector: 'app-panel-metricas',
  imports: [DatePipe],
  templateUrl: './panel-metricas.html',
  styleUrl: './panel-metricas.css',
})
export class PanelMetricas {
  readonly metricas = input.required<MetricasProyecto>();
  protected readonly columnas = COLUMNAS_KANBAN;
  protected readonly estadosSpec = ['BORRADOR', 'EN_REVISION', 'APROBADA', 'IMPLEMENTADA'];
  protected readonly etiqueta = etiqueta;
}
