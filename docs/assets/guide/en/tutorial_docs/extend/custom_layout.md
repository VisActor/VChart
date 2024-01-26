# Custom Layout

VChart supports user-defined layouts, and all layout elements of the chart can be set to any position. Here's a detailed introduction on how to use it.

## Configuration

Currently, VChart supports customizing layouts by configuring the `layout` property on the chart's initialization parameters during initialization. Its type definition is as follows:

```ts
export type LayoutFunction = (chart: VChart, item: LayoutItem[], chartLayoutRect: BBox, chartViewBox: BBox) => void;
```

## Layout Elements

During the layout process, the chart will call the custom layout function given above and pass in a `LayoutItem[]` array. Each element in the array is a layout element, with its type defined as follows:

```ts
type ILayoutType = 'region-relative' | 'region' | 'normal' | 'absolute';

export interface ILayoutItem {
  /** Layout type */
  layoutType: ILayoutType;
  // The larger the value, the higher the priority for processing
  layoutLevel: number;
  /** Get the current layout starting point of the element */
  getLayoutStartPoint: () => ILayoutPoint;
  /** Get the current layout size of the element */
  getLayoutRect: () => ILayoutRect;
  /** Update the layoutRect size of the element layout to update the specified layout space */
  setLayoutRect: (rect: Partial<ILayoutRect>, levelMap?: Partial<ILayoutRectLevel>) => void;
  /** Calculate the occupied space based on the internal logic of the element, rect represents the available space, and returns the actual size of the element */
  computeBoundsInRect: (rect: ILayoutRect) => ILayoutRect;
  /** Update the starting point position of the element layout */
  setLayoutStartPosition: (pos: Partial<IPoint>) => void;
  /** Update the position information of the absolutely positioned layout element */
  absoluteLayoutInRect: (rect: IRect) => void;
  /** Update the internal layout information of the element */
  updateLayoutAttribute: () => void;
}
```

During the layout process, these methods can be used to manipulate layout elements.

> Note: After the layout elements are manipulated, call the updateLayoutAttribute method to notify the element to update its specific attributes according to the layout information.

## Layout Example

Below is an example of a custom layout. Its effect is to arrange 12 pie charts in the position of clock time.

```javascript livedemo
const spec = {
  type: 'common',
  padding: 0,
  region: [],
  series: []
};

// 随机生成 12 组
for (let i = 0; i < 12; i++) {
  spec.region.push({ id: 'clock' + i });
  const series = {
    regionId: 'clock' + i,
    type: 'pie',
    valueField: 'value',
    categoryField: 'type',
    seriesField: 'type',
    label: {
      style: {
        visible: false
      }
    }
  };
  series.data = {
    id: 'data' + i,
    values: []
  };
  for (let d = 0; d < 4; d++) {
    series.data.values.push({ value: Math.random() * 100, type: 'type' + d });
  }
  spec.series.push(series);
}

const vchart = new VChart(spec, {
  dom: CONTAINER_ID,
  layout: (chart, item, chartLayoutRect, chartViewBox) => {
    /**
     * chart: 图表对象
     * item: 参与布局的图表模块
     * chartLayoutRect: 图表减去padding后的可用布局空间
     * chartViewBox: 图表在画布中的位置，包含图表的padding。
     */
    const radius = Math.min(chartLayoutRect.width / 2, chartLayoutRect.height / 2);
    const center = { x: chartLayoutRect.width / 2, y: chartLayoutRect.height / 2 };
    const regionSize = radius * 0.2;
    const regionPosRadius = radius - regionSize * 0.5 * 1.415;
    // 使用布局元素的属性和提供的方法完成布局
    item.forEach((i, index) => {
      const angle = (index / 12) * Math.PI * 2;
      // 设置位置
      i.setLayoutStartPosition({
        x: center.x + Math.sin(angle) * regionPosRadius - regionSize * 0.5,
        y: center.y + Math.cos(angle) * regionPosRadius - regionSize * 0.5
      });
      // 设置大小
      i.setLayoutRect({ width: regionSize, height: regionSize });
      // 更新属性
      i.updateLayoutAttribute();
    });
  }
});
vchart.renderSync();
```
