import type { EditorChart } from './chart';
import { EventEmitter, isNil } from '@visactor/vutils';
import type { VRenderPointerEvent } from '../interface';
import { isModelMatchModelInfo } from '../../utils/spec';
import { BoxSelectionMaskName, TransformComponentName } from '../../core/const';
import { EditorActionMode } from '../../core/enum';

export class ChartEvent {
  emitter: EventEmitter = new EventEmitter();

  protected _chart: EditorChart;

  constructor(chart: EditorChart) {
    this._chart = chart;
  }

  initWithVChart(): void {
    this._chart.option.layer.getStage().addEventListener('pointermove', this._overEvent as any);
    this._chart.option.layer.getStage().addEventListener('pointerdown', this._downEvent as any);
  }

  private _checkEditorStateEnable() {
    const editor = this._chart.option.layer.getEditor(); // 获取编辑器
    return editor.state.actionMode !== EditorActionMode.addTool;
  }

  private _checkPickChart(e: VRenderPointerEvent) {
    if (!this._chart.pickable) {
      return false;
    }
    if (e.target?.name === BoxSelectionMaskName) {
      return false;
    }
    if (e.target?.name === TransformComponentName && e.target.pickable) {
      return false;
    }
    return true;
  }

  private _overEvent = (e: VRenderPointerEvent) => {
    if (!this._checkEditorStateEnable()) {
      return false;
    }
    if (!this._chart.overAble) {
      return false;
    }
    const info = this._getPickModel(e);
    if (info && this._checkEventEnable(e)) {
      this._chart.option.layer.isInActive = true;
      this.emitter.emit('overModel', info, e);
    } else {
      this.emitter.emit('unOverChart', e);
    }
    return true;
  };

  tryPick = (e: VRenderPointerEvent) => {
    const lastPickable = this._chart.pickable;
    this._chart.pickable = true;
    this._downEvent(e);
    this._chart.pickable = lastPickable;
  };

  private _downEvent = (e: VRenderPointerEvent) => {
    if (!this._checkEditorStateEnable()) {
      return;
    }
    if (!this._checkPickChart(e)) {
      return;
    }
    if (this._isPickLayoutComponent(e)) {
      return;
    }
    if (!this._checkEventEnable(e)) {
      this.emitter.emit('unPickModel', e);
      return;
    }
    const info = this._getPickModel(e);
    if (info) {
      this._chart.option.layer.isInActive = true;
      this.emitter.emit('pickModel', info, e);
    } else {
      this.emitter.emit('unPickModel', e);
    }
  };

  private _checkEventEnable(e: VRenderPointerEvent) {
    if (!e.target) {
      return true;
    }
    if (e.target.type === 'rect' && (isNil(e.target.name) || e.target.name.startsWith('regionBackground'))) {
      return true;
    }
    if (e.target.type === 'group' && e.target.name && e.target.name === 'root') {
      return true;
    }
    if (e.target.type === 'group' && e.target.name && e.target.name.startsWith('axis-grid')) {
      return true;
    }
    if (this._isPartOfCommonModel(e)) {
      return true;
    }
    return false;
  }

  private _isPartOfCommonModel(e: VRenderPointerEvent) {
    let node = e.target;
    while (node) {
      if (
        node.type === 'group' &&
        node.name &&
        (node.name === 'axis-container' ||
          node.name === 'legend' ||
          node.name === 'title-container' ||
          node.name.startsWith('seriesGroup'))
      ) {
        return true;
      }
      if (node.parent) {
        node = node.parent;
      } else {
        return false;
      }
    }

    return false;
  }

  private _isPickLayoutComponent(e: VRenderPointerEvent) {
    let node = e.target;
    while (node) {
      if (node.type === 'group' && node.name === 'TransformComponent2') {
        return true;
      }
      if (node.parent) {
        node = node.parent;
      } else {
        return false;
      }
    }

    return false;
  }

  protected _getPickModel(e: PointerEvent) {
    const point = { x: e.x, y: e.y };
    const chart = this._chart;
    const layoutMeta = chart.layout.getOverModel(point, this._chart.option.layer);
    if (!layoutMeta) {
      return null;
    }
    const regions = chart.vchart.getChart().getAllRegions() as any[];
    const items = regions.concat(chart.vchart.getChart().getAllComponents());
    const model = items.find(item => isModelMatchModelInfo(item, layoutMeta));
    return { model, layoutMeta };
  }

  release() {
    this._chart.option.layer.getStage().removeEventListener('pointermove', this._overEvent as any);
    this._chart.option.layer.getStage().removeEventListener('pointerdown', this._downEvent as any);
    this.emitter.removeAllListeners();
    this.emitter = null;
  }
}
