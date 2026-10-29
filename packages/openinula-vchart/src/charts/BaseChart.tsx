import type { IVChart, IData, IInitOption, ISpec, IVChartConstructor } from '@visactor/vchart';
import React, { useState, useEffect, useRef, useImperativeHandle, ReactNode } from 'openinula';
import withContainer, { ContainerProps } from '../containers/withContainer';
import RootChartContext, { ChartContextType } from '../context/chart';
import { isEqual, isNil, isValid, pickWithout } from '@visactor/vutils';
import { toArray } from '../util';
import { REACT_PRIVATE_PROPS } from '../constants';
import {
  bindEventsToChart,
  EventsProps,
  CHART_EVENTS_KEYS,
  CHART_EVENTS,
  LegendEventProps,
  ScrollBarEventProps,
  BrushEventProps,
  DataZoomEventProps,
  PlayerEventProps,
  DimensionEventProps,
  HierarchyEventProps,
  ChartLifeCycleEventProps
} from '../eventsUtils';
import { IReactTooltipProps } from '../components/tooltip/interface';
import { initCustomTooltip } from '../components/tooltip/util';

export type ChartOptions = Omit<IInitOption, 'dom'>;

export interface BaseChartProps
  extends EventsProps,
    LegendEventProps,
    ScrollBarEventProps,
    BrushEventProps,
    DataZoomEventProps,
    PlayerEventProps,
    DimensionEventProps,
    HierarchyEventProps,
    ChartLifeCycleEventProps,
    IReactTooltipProps {
  vchartConstructor?: IVChartConstructor;
  /** @deprecated 请使用 vchartConstructor */
  vchartConstrouctor?: IVChartConstructor;
  type?: string;
  /** 上层container */
  container?: HTMLDivElement;
  /**
   * used only by <VChart />
   */
  spec?: ISpec;
  /** 数据 */
  data?: IData;
  /** 画布宽度 */
  width?: number;
  /** 画布高度 */
  height?: number;
  /** 图表配置 */
  options?: ChartOptions;
  /** skip function diff when component update */
  skipFunctionDiff?: boolean;
  /** 图表渲染完成事件 */
  onReady?: (instance: IVChart, isInitial: boolean) => void;
  /** throw error when chart run into an error */
  onError?: (err: Error) => void;
  /**
   * use sync render
   *
   * @since 1.8.3
   * @deprecated 1.9.0
   **/
  useSyncRender?: boolean;
}

type Props = React.PropsWithChildren<BaseChartProps>;

const notSpecKeys = [
  ...REACT_PRIVATE_PROPS,
  ...CHART_EVENTS_KEYS,
  'vchartConstructor',
  'vchartConstrouctor',
  'useSyncRender',
  'skipFunctionDiff',
  'onError',
  'onReady',
  'spec',
  'container',
  'options'
];

const getComponentId = (child: React.ReactNode, index: number) => {
  const componentName = child && (child as any).type && ((child as any).type.displayName || (child as any).type.name);
  return `${componentName}-${index}`;
};

const getDataItemId = (item: { id?: unknown; name?: unknown } | null | undefined) => {
  const id = item?.id ?? item?.name;
  if ((typeof id === 'string' || typeof id === 'number') && id !== '') {
    return id;
  }
  return null;
};

const collectDataIds = (data?: IData | null) => {
  if (!isValid(data)) {
    return null;
  }

  const list = Array.isArray(data) ? data : [data];
  if (!list.length) {
    return null;
  }

  const ids = new Set<string | number>();
  for (let i = 0; i < list.length; i++) {
    const id = getDataItemId(list[i] as { id?: unknown; name?: unknown } | null);
    if (id === null) {
      return null;
    }
    ids.add(id);
  }

  return ids;
};

/**
 * `updateFullDataSync` only replaces datasets that already exist under the same id
 * and never removes missing ones. Use it only when every incoming dataset already
 * exists and the effective spec data membership is unchanged.
 */
const canUpdateFullDataByExistingId = (chart: IVChart, data?: IData) => {
  const incomingIds = collectDataIds(data);
  if (!incomingIds) {
    return false;
  }

  const dataSet = chart.getDataSet();
  if (!dataSet) {
    return false;
  }

  for (const id of incomingIds) {
    if (!dataSet.getDataView(id)) {
      return false;
    }
  }

  const currentIds = collectDataIds(chart.getSpec()?.data as IData | undefined);
  if (!currentIds || currentIds.size !== incomingIds.size) {
    return false;
  }

  for (const id of incomingIds) {
    if (!currentIds.has(id)) {
      return false;
    }
  }

  return true;
};

const SPEC_UPDATE_MORPH = {
  morph: false,
  enableExitAnimation: false
};

const parseSpecFromChildren = (props: Props) => {
  const specFromChildren: Omit<ISpec, 'type' | 'data' | 'width' | 'height'> = {};

  toArray(props.children).map((child, index) => {
    const parseSpec = child && (child as any).type && (child as any).type.parseSpec;

    if (parseSpec && (child as any).props) {
      const childProps = isNil((child as any).props.componentId)
        ? {
            ...(child as any).props,
            componentId: getComponentId(child, index)
          }
        : (child as any).props;

      const specResult = parseSpec(childProps);

      if (specResult.isSingle) {
        specFromChildren[specResult.specName] = specResult.spec;
      } else {
        if (!specFromChildren[specResult.specName]) {
          specFromChildren[specResult.specName] = [];
        }

        specFromChildren[specResult.specName].push(specResult.spec);
      }
    }
  });

  return specFromChildren;
};

const BaseChart: React.FC<Props> = React.forwardRef((props, ref) => {
  const [updateId, setUpdateId] = useState<number>(0);
  const chartContext = useRef<ChartContextType>({});
  useImperativeHandle(ref, () => chartContext.current?.chart);
  const hasSpec = !!props.spec;
  const isUnmount = useRef<boolean>(false);
  const prevSpec = useRef(pickWithout(props, notSpecKeys));
  const specFromChildren = useRef<Omit<ISpec, 'type' | 'data' | 'width' | 'height'>>(null);
  const eventsBinded = React.useRef<BaseChartProps>(null);
  const skipFunctionDiff = !!props.skipFunctionDiff;
  const [tooltipNode, setTooltipNode] = useState<ReactNode>(null);

  const parseSpec = (props: Props) => {
    let spec: ISpec = undefined;

    if (hasSpec && props.spec) {
      spec = props.spec;

      if (isValid(props.data)) {
        spec = {
          ...props.spec,
          data: props.data
        } as ISpec;
      }
    } else {
      spec = {
        ...prevSpec.current,
        ...specFromChildren.current
      } as ISpec;
    }

    const tooltipSpec = initCustomTooltip(setTooltipNode, props, spec.tooltip);
    if (tooltipSpec) {
      spec.tooltip = tooltipSpec;
    }
    return spec;
  };

  const createChart = (props: Props) => {
    const cs = new (props.vchartConstructor ?? (props as any).vchartConstrouctor)(parseSpec(props), {
      ...props.options,
      onError: props.onError,
      autoFit: true,
      dom: props.container
    });
    chartContext.current = { ...chartContext.current, chart: cs };
    isUnmount.current = false;
  };

  const handleChartRender = () => {
    // rebind events after render
    if (!isUnmount.current) {
      if (!chartContext.current || !chartContext.current.chart) {
        return;
      }

      bindEventsToChart(chartContext.current.chart, props, eventsBinded.current, CHART_EVENTS);

      setUpdateId(updateId + 1);
      if (props.onReady) {
        props.onReady(chartContext.current.chart, updateId === 0);
      }
    }
  };

  const renderChart = () => {
    if (chartContext.current.chart) {
      chartContext.current.chart.renderSync({
        reuse: false
      });
      handleChartRender();
    }
  };

  useEffect(() => {
    const newSpecFromChildren = hasSpec ? null : parseSpecFromChildren(props);

    if (!chartContext.current?.chart) {
      if (!hasSpec) {
        specFromChildren.current = newSpecFromChildren;
      }

      createChart(props);
      renderChart();
      eventsBinded.current = props;
      return;
    }

    if (hasSpec) {
      if (!isEqual(eventsBinded.current.spec, props.spec, { skipFunction: skipFunctionDiff })) {
        chartContext.current.chart.updateSpecSync(parseSpec(props), undefined, SPEC_UPDATE_MORPH);
        handleChartRender();
        eventsBinded.current = props;
      } else if (eventsBinded.current.data !== props.data) {
        // updateFullDataSync is id-keyed and never drops datasets. Keep it only
        // when membership is unchanged; otherwise re-parse the effective spec
        // (no-id data, removed ids, or removing the optional data prop).
        if (canUpdateFullDataByExistingId(chartContext.current.chart, props.data)) {
          chartContext.current.chart.updateFullDataSync(props.data as any);
        } else {
          chartContext.current.chart.updateSpecSync(parseSpec(props), undefined, SPEC_UPDATE_MORPH);
        }
        handleChartRender();
        eventsBinded.current = props;
      }
      return;
    }

    const newSpec = pickWithout(props, notSpecKeys);

    if (
      !isEqual(newSpec, prevSpec.current, { skipFunction: skipFunctionDiff }) ||
      !isEqual(newSpecFromChildren, specFromChildren.current)
    ) {
      prevSpec.current = newSpec;
      specFromChildren.current = newSpecFromChildren;

      chartContext.current.chart.updateSpecSync(parseSpec(props), undefined, {
        morph: false,
        enableExitAnimation: false
      });
      handleChartRender();
    }
  }, [props]);

  useEffect(() => {
    return () => {
      if (chartContext) {
        if (chartContext.current && chartContext.current.chart) {
          chartContext.current.chart.release();
          chartContext.current.chart = null;
        }
      }
      eventsBinded.current = null;
      isUnmount.current = true;
    };
  }, []);

  return (
    <RootChartContext.Provider value={chartContext.current}>
      {toArray(props.children).map((child, index) => {
        if (typeof child === 'string') {
          return;
        }

        const childId = getComponentId(child, index);

        return (
          <React.Fragment key={childId}>
            {React.cloneElement(child as React.ReactElement<any, React.JSXElementConstructor<any>>, {
              updateId: updateId,
              componentId: childId
            })}
          </React.Fragment>
        );
      })}
      {tooltipNode}
    </RootChartContext.Provider>
  );
});

export const createChart = <T extends Props>(
  componentName: string,
  defaultProps?: Partial<T>,
  callback?: (props: T, defaultProps?: Partial<T>) => T
) => {
  const Com = withContainer<ContainerProps, T>(BaseChart as any, componentName, (props: T) => {
    if (callback) {
      return callback(props, defaultProps);
    }

    if (defaultProps) {
      return Object.assign(props, defaultProps);
    }
    return props;
  });
  Com.displayName = componentName;
  return Com;
};
