import VChart, { IData, IInitOption, IChartSpec } from '@visactor/vchart';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import withContainer, { ContainerProps } from '../containers/withContainer';
import RootChartContext, { ChartContextType } from '../context/chart';
import type { IView } from '@visactor/vgrammar';
import { isEqual, pickWithout } from '@visactor/vutils';
import ViewContext from '../context/view';
import { toArray } from '../util';
import { REACT_PRIVATE_PROPS } from '../constants';
import { IMarkElement } from '../components';
import { bindEventsToChart, EventsProps, CHART_EVENTS_KEYS, CHART_EVENTS } from '../eventsUtils';

export type ChartOptions = Omit<IInitOption, 'dom'>;

export interface BaseChartProps extends EventsProps {
  type?: string;
  /** 上层container */
  container?: HTMLDivElement;
  /**
   * used only by <VChart />
   */
  spec?: IChartSpec;
  /** 数据 */
  data?: IData;
  /** 画布宽度 */
  width?: number;
  /** 画布高度 */
  height?: number;
  /** 图表配置 */
  options?: ChartOptions;

  /** 图表渲染完成事件 */
  onReady?: (instance: VChart, isInitial: boolean) => void;
  /** throw error when chart run into an error */
  onError?: () => void;
}

type Props = React.PropsWithChildren<BaseChartProps>;

const notSpecKeys = [
  ...REACT_PRIVATE_PROPS,
  ...CHART_EVENTS_KEYS,
  'onError',
  'onReady',
  'spec',
  'container',
  'options'
];

const BaseChart: React.FC<Props> = React.forwardRef((props, ref) => {
  const [updateId, setUpdateId] = useState<number>(0);
  const chartContext = useRef<ChartContextType>({
    specFromChildren: {}
  });
  useImperativeHandle(ref, () => chartContext.current.chart);
  const hasSpec = !!props.spec;
  const [view, setView] = useState<IView>(null);
  const isUnmount = useRef<boolean>(false);
  const prevSpec = useRef(pickWithout(props, notSpecKeys));
  const eventsBinded = React.useRef<BaseChartProps>(null);

  const parseSpec = (props: Props) => {
    if (hasSpec && props.spec) {
      return props.spec;
    }

    return {
      ...prevSpec.current,
      ...chartContext.current.specFromChildren
    };
  };

  const createChart = (props: Props) => {
    const cs = new VChart(parseSpec(props), {
      ...props.options,
      autoFit: true,
      mode: 'desktop-browser',
      dom: props.container
    });
    chartContext.current = { ...chartContext.current, chart: cs };
  };

  const handleChartRender = () => {
    // rebind events after render
    bindEventsToChart(chartContext.current.chart, props, eventsBinded.current, CHART_EVENTS);

    const newView = chartContext.current.chart.getCompiler().getVGrammarView();
    if (!isUnmount.current) {
      setUpdateId(updateId + 1);
      if (props.onReady) {
        props.onReady(chartContext.current.chart, updateId === 0);
      }
    }
    setView(newView);
  };

  const renderChart = () => {
    if (chartContext.current.chart) {
      // eslint-disable-next-line promise/catch-or-return
      const renderPromise = chartContext.current.chart.renderAsync().then(handleChartRender);

      if (props.onError) {
        renderPromise.catch(props.onError);
      }
    }
  };

  useEffect(() => {
    if (!chartContext.current.chart) {
      createChart(props);
      renderChart();
      bindEventsToChart(chartContext.current.chart, props, null, CHART_EVENTS);
      chartContext.current = {
        ...chartContext.current,
        isChildrenUpdated: false
      };
      eventsBinded.current = props;
      return;
    }

    if (hasSpec) {
      if (!isEqual(eventsBinded.current.spec, props.spec)) {
        // eslint-disable-next-line promise/catch-or-return
        const updatePromise = chartContext.current.chart
          .updateSpec(parseSpec(props), undefined, { morph: false }) // morph临时关掉
          .then(handleChartRender);

        if (props.onError) {
          updatePromise.catch(props.onError);
        }
      }
      return;
    }

    const newSpec = pickWithout(props, notSpecKeys);

    if (!isEqual(newSpec, prevSpec.current) || chartContext.current.isChildrenUpdated) {
      prevSpec.current = newSpec;
      // eslint-disable-next-line promise/catch-or-return
      const updatePromise = chartContext.current.chart
        .updateSpec(parseSpec(props), undefined, { morph: false }) // morph临时关掉
        .then(handleChartRender);

      if (props.onError) {
        updatePromise.catch(props.onError);
      }
    }
    chartContext.current = {
      ...chartContext.current,
      isChildrenUpdated: false
    };
  }, [props]);

  useEffect(() => {
    return () => {
      if (chartContext) {
        if (chartContext.current.chart) {
          chartContext.current.chart.release();
        }
        chartContext.current = null;
      }
      isUnmount.current = true;
    };
  }, []);

  return (
    <RootChartContext.Provider value={chartContext.current}>
      <ViewContext.Provider value={view}>
        {toArray(props.children).map((child, index) => {
          return (
            <React.Fragment key={(child as any)?.props?.id ?? (child as any)?.id ?? `child-${index}`}>
              {React.cloneElement(child as IMarkElement, {
                updateId: updateId
              })}
            </React.Fragment>
          );
        })}
      </ViewContext.Provider>
    </RootChartContext.Provider>
  );
});

export const createChart = <T extends Props>(componentName: string, type?: string, callback?: (props: T) => T) => {
  const Com = withContainer<ContainerProps, T>(BaseChart as any, componentName, (props: T) => {
    props.type = type;

    if (callback) {
      return callback(props);
    }

    if (type) {
      return { ...props, type };
    }
    return props;
  });
  Com.displayName = componentName;
  return Com;
};
