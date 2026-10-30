import {
  DataView,
  type IVChart,
  type IData,
  type IInitOption,
  type ISpec,
  type IVChartConstructor
} from '@visactor/vchart';
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

const isDataId = (id: unknown): id is string | number => {
  return (typeof id === 'string' || typeof id === 'number') && id !== '';
};

const toDataList = (data?: IData | null) => {
  if (!isValid(data)) {
    return [];
  }
  return (Array.isArray(data) ? data : [data]) as unknown[];
};

/**
 * `updateFullDataSync` looks up `d.id` and parses `d.values`.
 * A DataView is keyed by `name` and has no `values`, so it is not compatible.
 */
const getDataValuesId = (item: unknown) => {
  if (!item || typeof item !== 'object' || item instanceof DataView) {
    return null;
  }
  const id = (item as { id?: unknown }).id;
  return isDataId(id) ? id : null;
};

/** Data already on the spec may be the original values or a bound DataView (`name`). */
const getSpecDataId = (item: unknown) => {
  if (!item || typeof item !== 'object') {
    return null;
  }
  const id = item instanceof DataView ? item.name : (item as { id?: unknown }).id;
  return isDataId(id) ? id : null;
};

const collectDataIds = (data: IData | null | undefined, readId: (item: unknown) => string | number | null) => {
  const list = toDataList(data);
  if (!list.length) {
    return null;
  }

  const ids: Array<string | number> = [];
  for (let i = 0; i < list.length; i++) {
    const id = readId(list[i]);
    if (id === null) {
      return null;
    }
    ids.push(id);
  }

  return ids;
};

const isSameDataIdOrder = (currentIds: Array<string | number> | null, incomingIds: Array<string | number> | null) => {
  if (!currentIds || !incomingIds || currentIds.length !== incomingIds.length) {
    return false;
  }
  for (let i = 0; i < incomingIds.length; i++) {
    if (currentIds[i] !== incomingIds[i]) {
      return false;
    }
  }
  return true;
};

const containsDataView = (data?: IData | null) => {
  return toDataList(data).some(item => item instanceof DataView);
};

/** Same DataView instances, including a new array wrapped around an unchanged view. */
const isSameDataViewList = (prev?: IData | null, next?: IData | null) => {
  const prevList = toDataList(prev);
  const nextList = toDataList(next);
  if (!nextList.length || prevList.length !== nextList.length) {
    return false;
  }
  for (let i = 0; i < nextList.length; i++) {
    if (!(nextList[i] instanceof DataView) || prevList[i] !== nextList[i]) {
      return false;
    }
  }
  return true;
};

const getDataValuesStructure = (item: unknown) => {
  if (!item || typeof item !== 'object' || item instanceof DataView) {
    return null;
  }
  const data = item as {
    transforms?: unknown;
    fromDataId?: unknown;
    fromDataIndex?: unknown;
  };
  return {
    transforms: data.transforms,
    fromDataId: data.fromDataId,
    fromDataIndex: data.fromDataIndex
  };
};

const isSameTransformChain = (prev: unknown, next: unknown) => {
  if (prev === next) {
    return true;
  }
  if (!isEqual(prev, next)) {
    return false;
  }

  const prevList = Array.isArray(prev) ? prev : prev ? [prev] : [];
  const nextList = Array.isArray(next) ? next : next ? [next] : [];
  if (prevList.length !== nextList.length) {
    return false;
  }
  for (let i = 0; i < nextList.length; i++) {
    const prevCallback = (prevList[i] as { options?: { callback?: unknown } } | undefined)?.options?.callback;
    const nextCallback = (nextList[i] as { options?: { callback?: unknown } } | undefined)?.options?.callback;
    if (prevCallback !== nextCallback) {
      return false;
    }
  }
  return true;
};

/**
 * `updateDataViewInData` only replaces fields / values / parser.
 * transforms, fromDataId, and fromDataIndex have to be re-parsed.
 */
const hasDataValuesStructureChange = (prev?: IData | null, next?: IData | null) => {
  const prevList = toDataList(prev);
  const nextList = toDataList(next);
  if (prevList.length !== nextList.length) {
    return true;
  }
  for (let i = 0; i < nextList.length; i++) {
    const prevStruct = getDataValuesStructure(prevList[i]);
    const nextStruct = getDataValuesStructure(nextList[i]);
    if (!prevStruct || !nextStruct) {
      return true;
    }
    if (prevStruct.fromDataId !== nextStruct.fromDataId || prevStruct.fromDataIndex !== nextStruct.fromDataIndex) {
      return true;
    }
    if (!isSameTransformChain(prevStruct.transforms, nextStruct.transforms)) {
      return true;
    }
  }
  return false;
};

/**
 * `updateFullDataSync` only replaces values on datasets that already exist
 * under the same id, in the same order. It never reorders, never installs
 * transforms, and never removes missing ids. Use it only for compatible
 * `IDataValues` whose membership, order, and structure are unchanged.
 */
const canUpdateFullDataByExistingId = (chart: IVChart, data?: IData, prevData?: IData) => {
  const incomingIds = collectDataIds(data, getDataValuesId);
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

  const currentIds = collectDataIds(chart.getSpec()?.data as IData | undefined, getSpecDataId);
  if (!isSameDataIdOrder(currentIds, incomingIds)) {
    return false;
  }

  const baseline = isValid(prevData) ? prevData : (chart.getSpec()?.data as IData | undefined);
  if (hasDataValuesStructureChange(baseline, data)) {
    return false;
  }

  return true;
};

/**
 * Full data-prop replacement (DataView instance, dataset order, or transform
 * chain) is not a values-only update. Remaking re-runs data parsing so the
 * chart matches a fresh mount of the same effective spec.
 */
const needsDataRebind = (chart: IVChart, prevData?: IData, nextData?: IData) => {
  if (containsDataView(nextData)) {
    return !isSameDataViewList(prevData, nextData);
  }
  if (containsDataView(prevData) && isValid(nextData)) {
    return true;
  }
  if (!isValid(nextData)) {
    return false;
  }

  const incomingIds = collectDataIds(nextData, getDataValuesId);
  const currentIds = collectDataIds(chart.getSpec()?.data as IData | undefined, getSpecDataId);
  if (incomingIds && currentIds && !isSameDataIdOrder(currentIds, incomingIds)) {
    return true;
  }

  const baseline = isValid(prevData) ? prevData : (chart.getSpec()?.data as IData | undefined);
  return hasDataValuesStructureChange(baseline, nextData);
};

/**
 * `updateData` ignores DataView items, and `updateFullData` cannot see `DataView.name`.
 * Remaking the chart re-runs data parsing, which installs replacement views,
 * dataset order, and transform chains.
 */
const DATA_VIEW_REBIND = {
  reMake: true,
  change: true
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
      const prevProps = eventsBinded.current;
      const specChanged = !isEqual(prevProps.spec, props.spec, { skipFunction: skipFunctionDiff });
      const dataChanged = prevProps.data !== props.data;

      if (!specChanged && !dataChanged) {
        return;
      }

      // Same DataView instances wrapped in a new array are not a data change.
      if (!specChanged && isSameDataViewList(prevProps.data, props.data)) {
        handleChartRender();
        eventsBinded.current = props;
        return;
      }

      const chart = chartContext.current.chart;
      // Compute the effective spec once, then choose values-only vs reparse.
      // Rebind is decided from the data itself so a simultaneous spec change
      // (e.g. width) cannot skip DataView / order / transform replacement.
      if (!specChanged && canUpdateFullDataByExistingId(chart, props.data, prevProps.data)) {
        chart.updateFullDataSync(props.data as any);
      } else {
        const nextSpec = parseSpec(props);
        const rebind = needsDataRebind(chart, prevProps.data, props.data);
        chart.updateSpecSync(nextSpec, undefined, SPEC_UPDATE_MORPH, rebind ? DATA_VIEW_REBIND : undefined);
      }
      handleChartRender();
      eventsBinded.current = props;
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
