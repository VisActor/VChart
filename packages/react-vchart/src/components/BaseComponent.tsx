import React, { useContext, useEffect } from 'react';
import { isNil, pickWithout } from '@visactor/vutils';

import RootChartContext, { ChartContextType } from '../context/chart';
import { bindEventsToChart } from '../eventsUtils';
import { uid } from '../util';

export interface BaseComponentProps {
  id?: string | number;
}

type ComponentProps = BaseComponentProps & { updateId?: number };

export const createComponent = <T extends ComponentProps>(
  componentName: string,
  specName: string,
  supportedEvents?: Record<string, string> | null,
  isSingle?: boolean
) => {
  const ignoreKeys = ['id', 'updateId'];
  const notSpecKeys = supportedEvents ? Object.keys(supportedEvents).concat(ignoreKeys) : ignoreKeys;

  const Comp: React.FC<T> = (props: T) => {
    const context = useContext(RootChartContext);
    const id = React.useRef<string | number>(isNil(props.id) ? uid(specName) : props.id);

    const eventsBinded = React.useRef<T>(null);
    const updateId = React.useRef<number>(props.updateId);

    const componentSpec: Partial<T> = pickWithout<T>(props, notSpecKeys);

    if (props.updateId !== updateId.current) {
      // update triggered by chart when chart is rendered
      updateId.current = props.updateId;

      // rebind events after chart render
      const hasPrevEventsBinded = supportedEvents
        ? bindEventsToChart(context.chart, props, eventsBinded.current, supportedEvents)
        : false;
      if (hasPrevEventsBinded) {
        eventsBinded.current = props;
      }
    } else {
      updateToContext(context, id.current, specName, isSingle, componentSpec);
    }

    useEffect(() => {
      return () => {
        if (supportedEvents) {
          bindEventsToChart(context.chart, null, eventsBinded.current, supportedEvents);
        }
        deleteToContext(context, id.current, specName, isSingle);
      };
    }, []);

    return null;
  };

  Comp.displayName = componentName;
  return Comp;
};

const updateToContext = (
  context: ChartContextType,
  id: string | number,
  specName: string,
  isSingle: boolean,
  props: Partial<ComponentProps>
) => {
  if (!context.specFromChildren) {
    return;
  }

  if (isSingle) {
    context.specFromChildren[specName] = { ...props };
  } else {
    if (!context.specFromChildren[specName]) {
      context.specFromChildren[specName] = [];
    }

    const comps = context.specFromChildren[specName];
    const index = comps.findIndex((entry: any) => entry.id === id);

    if (index >= 0) {
      comps[index] = {
        id,
        ...props
      };
    } else {
      context.specFromChildren[specName].push({
        id,
        ...props
      });
    }
  }
  context.isChildrenUpdated = true;
};

const deleteToContext = (context: ChartContextType, id: string | number, specName: string, isSingle: boolean) => {
  if (!context.specFromChildren) {
    return;
  }

  if (isSingle) {
    context.specFromChildren[specName] = null;
  } else {
    const comps = context.specFromChildren[specName] ?? [];
    const index = comps.findIndex((entry: any) => entry.id === id);

    if (index >= 0) {
      const newComps = comps.slice(0, index - 1).concat(comps.slice(index + 1));

      context.specFromChildren[specName] = newComps;
      context.isChildrenUpdated = true;
    }
  }
};
