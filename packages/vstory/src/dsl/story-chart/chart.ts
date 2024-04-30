import type { Datum } from '../types/Datum';
import type { StoryComponent } from './component/base';
import { IInitOption, ISpec, IVChart, VChart } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultAdd } from './default/add';
import { StoryElement } from './element';
import { MarkPoint } from './component/markPoint';
import { CreateMarkPointAction } from '../types/chart/createComponent';
import { ChartAction, ChartActionNode } from '../types';
import { getComponentById } from '../../util/vchart-api';
import { StoryChartType } from '../constant';
import { IChartAddAction, IChartAddPayload } from '../types/chart/add';

/**
 * 1. 禁用一些图表默认的基础操作。如 tooltip/crosshair
 */
export abstract class StoryChart extends StoryElement {
  public declare storyChartType: StoryChartType;
  private snapshots: ChartAction[];
  private instance: IVChart;

  private components: Map<number, StoryComponent>;
  getComponent(id: number) {
    return this.components.get(id);
  }

  constructor(spec?: ISpec, option?: IInitOption) {
    super();
    this.snapshots = [];
    this.components = new Map();
    if (spec && option) {
      this.instance = new VChart(spec, option);
    }
  }

  public getInstance() {
    return this.instance;
  }

  public setInstance(instance: IVChart) {
    this.instance = instance;
    return this;
  }

  public snapshot(node: ChartActionNode) {
    this.snapshots.push(node);
  }

  public exportSnapshot() {
    return this.snapshots;
  }

  public add(payload: Partial<IChartAddPayload>) {
    const editNode: IChartAddAction = merge(
      { action: 'add', payload: defaultAdd },
      { payload },
      { elementType: this.storyChartType, elementId: this.uid }
    );
    this.snapshot(editNode);
  }

  public updateStyle() {
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
    this.snapshot(componentNode as any);
    return markPoint;
  }

  protected createComponent(component: StoryComponent) {
    this.components.set(component.uid, component);
  }
}
