import type { IVChart, EventCallback, EventParamsDefinition } from '@visactor/vchart';

export interface EventsProps {
  onPointerDown?: EventCallback<EventParamsDefinition['pointerdown']>;
  onPointerUp?: EventCallback<EventParamsDefinition['pointerup']>;
  onPointerUpOutside?: EventCallback<EventParamsDefinition['pointerupoutside']>;
  onPointerTap?: EventCallback<EventParamsDefinition['pointertap']>;
  onPointerOver?: EventCallback<EventParamsDefinition['pointerover']>;
  onPointerMove?: EventCallback<EventParamsDefinition['pointermove']>;
  onPointerEnter?: EventCallback<EventParamsDefinition['pointerenter']>;
  onPointerLeave?: EventCallback<EventParamsDefinition['pointerleave']>;
  onPointerOut?: EventCallback<EventParamsDefinition['pointerout']>;
  onMouseDown?: EventCallback<EventParamsDefinition['mousedown']>;
  onMouseUp?: EventCallback<EventParamsDefinition['mouseup']>;
  onMouseUpOutside?: EventCallback<EventParamsDefinition['mouseupoutside']>;
  onMouseMove?: EventCallback<EventParamsDefinition['mousemove']>;
  onMouseOver?: EventCallback<EventParamsDefinition['mouseover']>;
  onMouseOut?: EventCallback<EventParamsDefinition['mouseout']>;
  onMouseEnter?: EventCallback<EventParamsDefinition['mouseenter']>;
  onMouseLeave?: EventCallback<EventParamsDefinition['mouseleave']>;
  onPinch?: EventCallback<EventParamsDefinition['pinch']>;
  onPinchStart?: EventCallback<EventParamsDefinition['pinchstart']>;
  onPinchEnd?: EventCallback<EventParamsDefinition['pinchend']>;
  onPan?: EventCallback<EventParamsDefinition['pan']>;
  onPanStart?: EventCallback<EventParamsDefinition['panstart']>;
  onPanEnd?: EventCallback<EventParamsDefinition['panend']>;
  onDrag?: EventCallback<EventParamsDefinition['drag']>;
  onDragStart?: EventCallback<EventParamsDefinition['dragstart']>;
  onDragEnter?: EventCallback<EventParamsDefinition['dragenter']>;
  onDragLeave?: EventCallback<EventParamsDefinition['dragleave']>;
  onDragOver?: EventCallback<EventParamsDefinition['dragover']>;
  onDragEnd?: EventCallback<EventParamsDefinition['dragend']>;
  onRightDown?: EventCallback<EventParamsDefinition['rightdown']>;
  onRightUp?: EventCallback<EventParamsDefinition['rightup']>;
  onRightUpOutside?: EventCallback<EventParamsDefinition['rightupoutside']>;
  onTouchStart?: EventCallback<EventParamsDefinition['touchstart']>;
  onTouchEnd?: EventCallback<EventParamsDefinition['touchend']>;
  onTouchEndOutside?: EventCallback<EventParamsDefinition['touchendoutside']>;
  onTouchMove?: EventCallback<EventParamsDefinition['touchmove']>;
  onTouchCancel?: EventCallback<EventParamsDefinition['touchcancel']>;
  onPress?: EventCallback<EventParamsDefinition['press']>;
  onPressUp?: EventCallback<EventParamsDefinition['pressup']>;
  onPressEnd?: EventCallback<EventParamsDefinition['pressend']>;
  onSwipe?: EventCallback<EventParamsDefinition['swipe']>;
  onDrop?: EventCallback<EventParamsDefinition['drop']>;
  onWeel?: EventCallback<EventParamsDefinition['weel']>;
  onClick?: EventCallback<EventParamsDefinition['click']>;
  onDblClick?: EventCallback<EventParamsDefinition['dblclick']>;
}

export const REACT_TO_VCHART_EVENTS = {
  onPointerDown: 'pointerdown',
  onPointerUp: 'pointerup',
  onPointerUpOutside: 'pointerupoutside',
  onPointerTap: 'pointertap',
  onPointerOver: 'pointerover',
  onPointerMove: 'pointermove',
  onPointerEnter: 'pointerenter',
  onPointerLeave: 'pointerleave',
  onPointerOut: 'pointerout',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseUpOutside: 'mouseupoutside',
  onMouseMove: 'mousemove',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onPinch: 'pinch',
  onPinchStart: 'pinchstart',
  onPinchEnd: 'pinchend',
  onPan: 'pan',
  onPanStart: 'panstart',
  onPanEnd: 'panend',
  onDrag: 'drag',
  onDragStart: 'dragstart',
  onDragEnter: 'dragenter',
  onDragLeave: 'dragleave',
  onDragOver: 'dragover',
  onDragEnd: 'dragend',
  onRightDown: 'rightdown',
  onRightUp: 'rightup',
  onRightUpOutside: 'rightupoutside',
  onTouchStart: 'touchstart',
  onTouchEnd: 'touchend',
  onTouchEndOutside: 'touchendoutside',
  onTouchMove: 'touchmove',
  onTouchCancel: 'touchcancel',
  onPress: 'press',
  onPressUp: 'pressup',
  onPressEnd: 'pressend',
  onSwipe: 'swipe',
  onDrop: 'drop',
  onWeel: 'wheel',
  onClick: 'click',
  onDblClick: 'dblclick'
};

export const LEGEND_CUSTOMIZED_EVENTS = {
  onLegendItemHover: 'legendItemHover',
  onLegendItemUnHover: 'legendItemUnHover',
  onLegendItemClick: 'legendItemClick'
};

export const CHART_EVENTS = {
  ...LEGEND_CUSTOMIZED_EVENTS,
  ...REACT_TO_VCHART_EVENTS
};

export const CHART_EVENTS_KEYS = Object.keys(CHART_EVENTS);

export const COMMON_EVENTK_KEYS = Object.keys(REACT_TO_VCHART_EVENTS);

export const VCHART_TO_REACT_EVENTS = Object.keys(REACT_TO_VCHART_EVENTS).reduce((res, key) => {
  res[REACT_TO_VCHART_EVENTS[key]] = key;

  return res;
}, {});

export const findEventProps = <T extends EventsProps>(
  props: T,
  supportedEvents: Record<string, string> = REACT_TO_VCHART_EVENTS
): EventsProps => {
  const result: EventsProps = {};

  Object.keys(props).forEach(key => {
    if (supportedEvents[key]) {
      result[key] = props[key];
    }
  });

  return result;
};

export const bindEventsToChart = <T>(
  chart: IVChart,
  newProps?: T | null,
  prevProps?: T | null,
  supportedEvents: Record<string, string> = REACT_TO_VCHART_EVENTS
) => {
  if ((!newProps && !prevProps) || !chart) {
    return false;
  }

  const prevEventProps = prevProps ? findEventProps(prevProps, supportedEvents) : null;
  const newEventProps = newProps ? findEventProps(newProps, supportedEvents) : null;

  if (prevEventProps) {
    Object.keys(prevEventProps).forEach(eventKey => {
      if (!newEventProps || !newEventProps[eventKey] || newEventProps[eventKey] !== prevEventProps[eventKey]) {
        const res = chart.off(supportedEvents[eventKey], prevProps[eventKey]);
      }
    });
  }

  if (newEventProps) {
    Object.keys(newEventProps).forEach(eventKey => {
      if (!prevEventProps || !prevEventProps[eventKey] || prevEventProps[eventKey] !== newEventProps[eventKey]) {
        chart.on(supportedEvents[eventKey], newEventProps[eventKey]);
      }
    });
  }

  return true;
};
