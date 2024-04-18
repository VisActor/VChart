import type { Datum } from '../types/Datum';
import type { AddAction, AddOption, AddPayload } from './../types/Add';
import type { StoryComponent } from './component/base';
import type { IInitOption, ISpec, VChart } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultAdd } from './default/add';
import { UpdateStyleOption } from '../types/UpdateStyle';
import { defaultUpdateStyle } from './default/updateStyle';
import { StoryElement } from './element';
import { MarkPoint } from './component/markPoint';
import { CreateMarkPointAction } from '../types/CreateComponent';
import { ActionNode } from '../types';
import { getComponentById } from '../../util/vchart-api';
import { StoryChartType } from '../constant';

/**
 * 1. 禁用一些图表默认的基础操作。如 tooltip/crosshair
 */
export abstract class StoryChart extends StoryElement {
  public declare storyChartType: StoryChartType;
  private snapshots: ActionNode[];

  private components: Map<number, StoryComponent>;
  getComponent(id: number) {
    return this.components.get(id);
  }

  constructor(spec?: ISpec, option?: IInitOption) {
    super();
    this.snapshots = [];
    this.components = new Map();
  }

  public snapshot(node: ActionNode) {
    this.snapshots.push(node);
  }

  public exportSnapshot() {
    return this.snapshots;
  }
  public add(payload: Partial<AddPayload>, option?: Partial<AddOption>) {
    const editNode: AddAction = merge(
      { action: 'add', option: defaultAdd },
      { payload, option },
      { elementType: this.storyChartType, elementId: this.uid }
    );
    this.snapshot(editNode);
  }

  public updateStyle(data: Datum, option?: Partial<UpdateStyleOption>) {
    // TODO:
    // const editNode: AddAction = merge(
    //   {
    //     action: 'updateStyle',
    //     data
    //   },
    //   defaultUpdateStyle,
    //   { payload: option, elementType: this.storyChartType, elementId: this.uid }
    // );
    // this.snapshot(editNode);
  }

  public createMarkPoint(data: Datum, option?: Partial<CreateMarkPointAction['payload']>) {
    const markPoint = new MarkPoint(this.snapshot.bind(this));
    const componentNode: CreateMarkPointAction = merge(
      { action: 'createMarkPoint', data },
      { payload: option, elementId: markPoint.uid, elementType: this.storyChartType }
    );

    componentNode.callback = (chartInstance: VChart) => {
      const vchartMarkPoint = getComponentById(chartInstance, markPoint.uid);
      if (vchartMarkPoint) {
        markPoint.setComponentInstance(vchartMarkPoint as any);
      }
    };
    this.createComponent(markPoint);
    this.snapshot(componentNode);
    return markPoint;
  }

  protected createComponent(component: StoryComponent) {
    this.components.set(component.uid, component);
  }
}
