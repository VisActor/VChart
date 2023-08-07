import React from 'react';
import { isNil, isEqual, pickWithout } from '@visactor/vutils';
import RootChartContext from '../context/chart';
import {
  REACT_TO_VCHART_EVENTS,
  EventsProps,
  findEventProps,
  COMMON_EVENTK_KEYS,
  VCHART_TO_REACT_EVENTS
} from '../eventsUtils';
import { uid } from '../util';

export interface BaseSeriesProps extends EventsProps {
  id?: string | number;
}

export const createSeries = <T extends BaseSeriesProps>(componentName: string, markNames: string[], type?: string) => {
  const ignoreKeys = ['id', 'updateId'];
  const notSpecKeys = COMMON_EVENTK_KEYS.concat(ignoreKeys);

  const Comp: React.FC<T & { updateId?: number }> = props => {
    const context = React.useContext(RootChartContext);

    const id = React.useRef<string | number>(isNil(props.id) ? uid(type ?? 'series') : props.id);

    const seriesSpec = React.useRef<Partial<T>>();
    const bindedEvents = React.useRef<Record<string, boolean>>({});
    const updateId = React.useRef<number>(props.updateId);

    const handleEvent = (e: any) => {
      const markIds = markNames.map(markName => `${id.current}-${markName}`);
      if (e?.mark && markIds.includes(e.mark.getUserId())) {
        props[VCHART_TO_REACT_EVENTS[e.event.type]](e);
      }
    };

    const addMarkEvent = (events: EventsProps) => {
      if (!events || !context.chart) {
        return;
      }

      if (bindedEvents) {
        Object.keys(bindedEvents).forEach(eventKey => {
          if (!events[eventKey]) {
            context.chart.off(REACT_TO_VCHART_EVENTS[eventKey], handleEvent);
          }
          bindedEvents.current[eventKey] = false;
        });
      }

      Object.keys(events).forEach(eventKey => {
        if (!bindedEvents?.[eventKey]) {
          context.chart.on(REACT_TO_VCHART_EVENTS[eventKey], handleEvent);

          if (!bindedEvents) {
            bindedEvents.current = {};
          }
          bindedEvents.current[eventKey] = true;
        }
      });
    };

    const removeMarkEvent = () => {
      addMarkEvent({});
    };

    const addMarkId = (spec: any) => {
      markNames.forEach(markName => {
        const defaultMarkId = `${id.current}-${markName}`;

        if (isNil(spec[markName])) {
          spec[markName] = { id: defaultMarkId };
        } else if (isNil(spec[markName].id)) {
          spec[markName].id = defaultMarkId;
        }
      });
    };

    const insertToContext = (props: Partial<T>) => {
      if (context.specFromChildren) {
        if (!context.specFromChildren.series) {
          context.specFromChildren.series = [];
        }

        const spec = isNil(type) ? { ...props, id: id.current } : { ...props, id: id.current, type };

        addMarkId(spec);
        context.specFromChildren.series.push(spec);
        context.isChildrenUpdated = true;
      }
    };

    const updateToContext = (props: Partial<T>) => {
      if (!context.specFromChildren) {
        return;
      }

      if (!context.specFromChildren.series) {
        insertToContext(props);
        return;
      }

      const series = context.specFromChildren.series;
      const index = series.findIndex((entry: any) => entry.id === id.current);

      if (index >= 0) {
        series[index] = isNil(type) ? { ...props, id: id.current } : { ...props, id: id.current, type };
        addMarkId(series[index]);
      } else {
        insertToContext(props);
      }
      context.isChildrenUpdated = true;
    };

    const deleteToContext = () => {
      if (!context.specFromChildren) {
        return;
      }
      const series = context.specFromChildren.series ?? [];
      const index = series.findIndex((entry: any) => entry.id === id.current);

      if (index >= 0) {
        const newSeries = series.slice(0, index - 1).concat(series.slice(index + 1));
        context.specFromChildren.series = newSeries;
        context.isChildrenUpdated = true;
      }
    };

    addMarkEvent(findEventProps(props));
    if (props.updateId !== updateId.current) {
      // chart render
      updateId.current = props.updateId;
    } else {
      const newSeriesSpec = pickWithout<T>(props, notSpecKeys);

      addMarkId(newSeriesSpec);
      if (!isEqual(newSeriesSpec, seriesSpec.current)) {
        seriesSpec.current = newSeriesSpec;
        updateToContext(newSeriesSpec);
      }
    }

    React.useEffect(() => {
      return () => {
        deleteToContext();
        removeMarkEvent();
      };
    }, []);

    return null;
  };

  Comp.displayName = componentName;
  return Comp;
};
