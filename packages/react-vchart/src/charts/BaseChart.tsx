import type { IVChart, IData, IInitOption, ISpec, IVChartConstructor } from '@visactor/vchart';
import React, { useState, useEffect, useRef, useImperativeHandle, ReactNode } from 'react';
import withContainer, { ContainerProps } from '../containers/withContainer';
import RootChartContext, { ChartContextType } from '../context/chart';
import type { IView } from '@visactor/vgrammar-core';
import { isEqual, isNil, pickWithout } from '@visactor/vutils';
import ViewContext from '../context/view';
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
  const [view, setView] = useState<IView>(null);
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
    } else {
      spec = {
        ...prevSpec.current,
        ...specFromChildren.current
      } as ISpec;
    }

    spec.tooltip = initCustomTooltip(setTooltipNode, props, spec.tooltip);
    return spec;
  };

  const createChart = (props: Props) => {
    const cs = new props.vchartConstrouctor(parseSpec(props), {
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

      const newView = chartContext.current.chart.getCompiler().getVGrammarView();

      setUpdateId(updateId + 1);
      if (props.onReady) {
        props.onReady(chartContext.current.chart, updateId === 0);
      }
      setView(newView);
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
        eventsBinded.current = props;
        chartContext.current.chart.updateSpecSync(parseSpec(props), undefined, {
          morph: false,
          enableExitAnimation: false
        });
        handleChartRender();
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
      <ViewContext.Provider value={view}>
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
      </ViewContext.Provider>
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
