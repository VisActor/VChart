# Event

The VChart instance provides methods related to event monitoring, and developers can monitor events to meet business needs. In addition to basic dom events, the events provided on VChart also include component events, TTL events, etc.

Below is a simple monitor diagram `click` Examples of events:

```ts
vchart.on('click', params => {
  console.log('Hooray, You are captured');
});
```

## Event API

The registration and uninstallation methods of events are provided on the VChart instance:

- Register an event

```ts
on(event: string, callback: (params: EventParams) => void): void;
on(event: string, query: EventQuery, callback: (params: EventParams) => void): void;
```

- Uninstall event

```ts
off(event: string, callback: (params: EventParams) => void): void;
```

Example:

```ts
vchart.on('pointerdown', e => {
  console.log('Hooray, You are captured');
}); // bind event
vchart.on('pointerdown', { level: 'model', type: 'axis' }, e => {
  console.log('Hooray, You are captured');
}); // bind axis `pointerdown` event
vchart.off('pointerdown', callback); // off event
```

### event parameters

All events provide parameters of the following structure:

```ts
type EventParams = {
  /**
   * event object
   */
  event: SuperEvent;
  /**
   * For different events to store the data expected to be carried
   */
  value?: any;
  /**
   * The mark of the event source
   */
  mark?: IMark;
  /**
   * The model of the event source
   */
  model?: IModel;
  /**
   * The chart of the event source
   */
  chart?: IChart;
  /**
   * The data of the primitive picked up by the event
   */
  datum?: Datum;
  /**
   * Picked graphics node
   */
  node?: INode;
};

type SuperEvent = Event & {
  [key: string]: any;
};
```

### event filtering

If you need to listen to events in a certain part of the chart, you can use the built-in query rules to configure. At present, we provide filtering rules in the following ways:

1.  `source`, filtering according to the event source, that is, listening to the event of the window or the chart itself.

```ts
// 监听 window 上的 pointerdown 事件
vchart.on('pointerdown', { source: 'window' }, () => {});
```

2.  `level`, filtered according to the event bubbling level, the bubbling order of the events is: 'mark' - > 'model' - > 'chart' - > 'vchart'.

```ts
// 监听 bar 图元 上的 pointerdown 事件
vchart.on('pointerdown', { level: 'mark', type: 'bar' }, () => {});
```

3.  `nodeName`, filter according to the picked graph node names. Inside vchart, some component names will be built into some components for user identification.

```ts
// 监听坐标轴文本上的 pointerdown 事件
vchart.on('pointerdown', { nodeName: 'axis-label' }, () => {});
```

4.  `markName`, filter according to the name of the mark primitive.

```ts
// 监听 bar 图元 上的 pointerdown 事件
vchart.on('pointerdown', { markName: 'bar' }, () => {});
```

5.  `type`, only used in scenarios where the level is'mark 'or'model', used to filter mark type or diagram constituent element model type

```ts
// 监听坐标轴上的 pointerdown 事件
vchart.on('pointerdown', { level: 'model', type: 'axis' }, () => {});
```

6.  `id`, filter according to the id configured by the user for the chart widget on the spec

```ts
// 监听 id 为 'axis-left' 的组件事件
vchart.on('pointerdown', { id: 'axis-left' }, () => {});
```

7.  `filter`, when none of the above filtering configurations meet the requirements, you can filter through a custom filtering function

```ts
vchart.on('pointerdown', { filter: ({model} => model.id === 45) }, () => {});
```

## Event classification

### base event

VChart supports the following basic events:

- PointerEvent Pointer event
  - `'pointerdown'`
  - `'pointerup'`
  - `'pointerupoutside'`: The graph is not triggered at the same time when the pointer is raised and pressed
  - `'pointertap'`: click event under pointerEvent
  - `'pointerover'`
  - `'pointermove'`
  - `'pointerenter'`: will not bubble
  - `'pointerleave'`: will not bubble
  - `'pointerout'`
- MouseEvent Mouse event
  - Left button operation
    - `'mousedown'`
    - `'mouseup'`
    - `'mouseupoutside'`: The graphics are not triggered at the same time when the mouse is raised and pressed
  - Right click operation
    - `'rightdown'`
    - `'rightup'`
    - `'rightupoutside'`: The graphics are not triggered at the same time when the mouse is raised and pressed
  - `'click'`
  - `'dblclick'`
  - `'mousemove'`
  - `'mouseover'`
  - `'mouseout'`
  - `'mouseenter'`: will not bubble
  - `'mouseleave'`: will not bubble
  - `'wheel'` Roller event
- TouchEvent Touch event
  - `'touchstart'`
  - `'touchend'`
  - `'touchendoutside'`
  - `'touchmove'`
  - `'touchcancel'`
  - `'tap'`: click event under touchEvent
- Drag event
  - `'dragstart'`
  - `'dragend'`
  - `'drag'`
  - `'dragenter'`
  - `'dragleave'`
  - `'dragover'`
  - `'drop'`
- Gesture event
  - `'pan'`: translation
  - `'panstart'`: translation start
  - `'panend'`: end of translation
  - `'press'`: Long press
  - `'pressup'`: Long press to lift
  - `'pressend'`: Long press to end
  - `'pinch'`: zoom
  - `'pinchstart'`: zoom start
  - `'pinchend'`: zoom end
  - `'swipe'`: quick sweep

### combined event

- `dimensionHover`: Dimension hovering event
- `dimensionClick`: Dimension click event

### Component event

#### DataZoom

- `'dataZoomChange'`

Events fired after DataZoom filtering.

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** The data carried by the event */
  value: {
    /** Whether to perform data filtering */
    filterData: boolean;
    /** Current starting value, percentage value, 0 - 1 */
    start: number;
    /** Current end value, percentage value, 0 - 1 */
    end: number;
    /** Current start value, original value */
    startValue: number;
    /** Current end value, original value */
    endValue: number;
    /** Current value range */
    newDomain: any[];
  }
}
```

#### ScrollBar

- `'scrollBarChange'`

Event triggered after ScrollBar scrolls.

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** The data carried by the event */
  value: {
    /** Whether to perform data filtering */
    filterData: boolean;
    /** Current starting value, percentage value, 0 - 1 */
    start: number;
    /** Current end value, percentage value, 0 - 1 */
    end: number;
    /** Current start value, original value */
    startValue: number;
    /** Current end value, original value */
    endValue: number;
    /** Current value range */
    newDomain: any[];
  }
}
```

#### Brush

- `'brushStart'`

Brush The event triggered the box starts to select.

- `'brushChange'`

Brush The event triggered after the box is selected.

- `'brushEnd'`

Brush The event triggered the box selected has been finished.

- `'brushClear'`

Brush The event triggered the box selected has been finished.

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** The data carried by the event */
  value: {
    /** operation type */
    operateType: string;
    /** The region being operated on */
    operateRegion: IRegion;
    // element data inside the marquee
    inBrushData: any[];
    // element data outside the marquee
    outOfBrushData: any[];
    // in the linked series: element data inside the marquee
    linkInBrushData: any[];
    // in the linked series: element data outside the marquee
    linkOutOfBrushData: any[];
    /** vgrammar elements inside the marquee */
    inBrushElementsMap: { [brushName: string]: { [elementKey: string]: IElement } };
    /** vgrammar elements outside the marquee */
    outOfBrushElementsMap: { [elementKey: string]: IElement };
    /** In linked series: vgrammar elements inside marquee */
    linkedInBrushElementsMap: { [brushName: string]: { [elementKey: string]: IElement } };
    /** In linked series: vgrammar elements outside the marquee */
    linkedOutOfBrushElementsMap: { [elementKey: string]: IElement };
  }
}
```

#### Drill

The chart of the hierarchical data structure supports the drilling function and the events triggered after drilling. At present, the built-in charts in VChart support drilling: CirclePacking, Sunburst, and Treemap.

- `'drill'`

Drill events triggered after drilling.

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** The data carried by the event */
  value: {
    /** Drill type, drillDown: drill down, drillUp: drill up */
    type: 'drillDown' | 'drillUp';
    /** Drill path */
    path: string[];
  }
}
```

#### Legend

Legend related events.

- `'legendItemClick'` **discrete type**Legend click event

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** Currently selected legend item data */
  value: string[];
}
```

- `'legendItemHover'` **discrete type**Legend hover event

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** The data carried by the event */
  value: {
    /** The currently selected legend item as a whole, the VRender graphics object */
    item: VRenderGroup;
    /** The data of the current legend item */
    data: Object;
    /** Whether the current legend item is selected */
    selected: boolean;
    /** All selected legend items in the current legend */
    currentSelectedItems: VRenderGroup[];
    /** Data of all selected legend items in the current legend */
    currentSelected: string[];
  }
}
```

- `'legendItemUnHover'` **discrete type**Legend unhover event

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** The data carried by the event */
  value: {
    /** The currently selected legend item as a whole, the VRender graphics object */
    item: VRenderGroup;
    /** The data of the current legend item */
    data: Object;
    /** Whether the current legend item is selected */
    selected: boolean;
    /** All selected legend items in the current legend */
    currentSelectedItems: VRenderGroup[];
    /** Data of all selected legend items in the current legend */
    currentSelected: string[];
  }
}
```

- `'legendFilter'` **Continuous type**Legend Filter Event

The event parameters are as follows:

```ts
{
  /** The Model instance of the event source */
  model: IModel;
  /** The data range filtered by the current legend */
  value: [number, number];
}
```

### TTL event

- `'initialized'` Chart instance initialization completion event

- `'rendered'` Triggered when the chart rendering method is called, indicating that the chart has already executed the rendering logic and will only be triggered once.

- `'renderFinished'` Supported since `1.2.0` version, , the event triggered every time the canvas is rendered, excluding the end of the animation

- `'animationFinished'` Supported since `1.2.0` version, event fired when the chart animation ends

- `'layoutStart'` Layout start event

- `'layoutEnd'` Layout end event
