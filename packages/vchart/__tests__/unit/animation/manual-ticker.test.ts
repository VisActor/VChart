import VChart, {
  ManualTicker,
  type IBarChartSpec,
  type IChart,
  type IMark,
  type IMarkGraphic,
  type ISeries
} from '../../../src';
import { createDiv, removeDom } from '../../util/dom';

type AnimatedGraphic = IMarkGraphic & {
  attribute: Record<string, any>;
  baseAttributes?: Record<string, any>;
  finalAttribute?: Record<string, any>;
  getFinalAttribute?: () => Record<string, any> | undefined;
};

type TraversableGraphic = AnimatedGraphic & {
  type?: string;
  name?: string;
  parent?: TraversableGraphic;
  forEachChildren?: (cb: (child: TraversableGraphic) => void | boolean) => void;
};

const APPEAR_DURATION = 300;
const UPDATE_DURATION = 300;
const COLOR_BY_SERIES: Record<string, string> = {
  'east-利润profit': '#8D72F6',
  'east-销售量sales': '#5766EC',
  'north of east-利润profit': '#66A3FE',
  'north of east-销售量sales': '#51D5E6'
};

const createChartContainer = () => {
  const container = createDiv();
  const dom = createDiv(container);

  container.style.position = 'fixed';
  container.style.width = '500px';
  container.style.height = '500px';
  container.style.top = '0px';
  container.style.left = '0px';

  return { container, dom };
};

const createManualTicker = () => {
  const ticker = new ManualTicker();

  ticker.autoStop = false;

  return ticker;
};

const getGraphicFinalAttribute = (graphic: AnimatedGraphic) =>
  graphic.finalAttribute ?? graphic.getFinalAttribute?.() ?? {};

const expectClose = (actual: number, expected: number) => {
  expect(actual).toBeCloseTo(expected, 6);
};

const expectBarYLayout = (graphic: AnimatedGraphic, expected: { y: number; y1: number }) => {
  expectClose(graphic.attribute.y, expected.y);
  expectClose(graphic.attribute.y1, expected.y1);
  expectClose(graphic.baseAttributes?.y, expected.y);
  expectClose(graphic.baseAttributes?.y1, expected.y1);
  expectClose(getGraphicFinalAttribute(graphic).y, expected.y);
  expectClose(getGraphicFinalAttribute(graphic).y1, expected.y1);
};

const getBarGraphics = (chart: VChart) => {
  const model = chart.getChart() as IChart;
  const barSeries = model.getAllSeries().find((series: ISeries) => series.type === 'bar');

  expect(barSeries).toBeDefined();
  if (!barSeries) {
    throw new Error('Expected bar series to exist');
  }

  const barMark = barSeries.getMarks().find((mark: IMark) => mark.name === 'bar');

  expect(barMark).toBeDefined();
  if (!barMark) {
    throw new Error('Expected bar mark to exist');
  }

  return barMark.getGraphics() as AnimatedGraphic[];
};

const walkGraphics = (root: TraversableGraphic, visitor: (graphic: TraversableGraphic) => void) => {
  visitor(root);
  root.forEachChildren?.((child: TraversableGraphic) => {
    walkGraphics(child, visitor);
  });
};

const getAnimatedLabelTexts = (chart: VChart) => {
  const texts: TraversableGraphic[] = [];

  walkGraphics(chart.getStage() as unknown as TraversableGraphic, graphic => {
    if (graphic.type === 'text' && graphic.baseAttributes && getGraphicFinalAttribute(graphic).x !== undefined) {
      texts.push(graphic);
    }
  });

  return texts;
};

const getLabelTextByFill = (chart: VChart, fill: string) => {
  const label = getAnimatedLabelTexts(chart).find(graphic => graphic.attribute.fill === fill);

  expect(label).toBeDefined();
  if (!label) {
    throw new Error(`Expected label with fill ${fill} to exist`);
  }

  return label;
};

const getVisibleBarByFill = (chart: VChart, fill: string) => {
  const bar = getBarGraphics(chart).find(
    graphic => graphic.attribute.fill === fill && graphic.attribute.visible !== false
  );

  expect(bar).toBeDefined();
  if (!bar) {
    throw new Error(`Expected visible bar with fill ${fill} to exist`);
  }

  return bar;
};

const getBarCenterX = (graphic: AnimatedGraphic) => {
  const attrs = getGraphicFinalAttribute(graphic);

  return attrs.x + attrs.width / 2;
};

const expectStaticXLayout = (graphic: AnimatedGraphic, expectedX: number) => {
  expectClose(graphic.baseAttributes?.x, expectedX);
  expectClose(getGraphicFinalAttribute(graphic).x, expectedX);
};

const expectStaticRectLayout = (
  graphic: AnimatedGraphic,
  expected: { x: number; width: number; y: number; y1: number }
) => {
  expectClose(graphic.attribute.x, expected.x);
  expectClose(graphic.attribute.width, expected.width);
  expectClose(graphic.attribute.y, expected.y);
  expectClose(graphic.attribute.y1, expected.y1);
  expectClose(graphic.baseAttributes?.x, expected.x);
  expectClose(graphic.baseAttributes?.width, expected.width);
  expectClose(graphic.baseAttributes?.y, expected.y);
  expectClose(graphic.baseAttributes?.y1, expected.y1);
  expectClose(getGraphicFinalAttribute(graphic).x, expected.x);
  expectClose(getGraphicFinalAttribute(graphic).width, expected.width);
  expectClose(getGraphicFinalAttribute(graphic).y, expected.y);
  expectClose(getGraphicFinalAttribute(graphic).y1, expected.y1);
};

const getBarMarkProduct = (chart: VChart) => {
  const model = chart.getChart() as IChart;
  const barSeries = model.getAllSeries().find((series: ISeries) => series.type === 'bar');

  expect(barSeries).toBeDefined();
  if (!barSeries) {
    throw new Error('Expected bar series to exist');
  }

  const barMark = barSeries.getMarks().find((mark: IMark) => mark.name === 'bar') as IMark & {
    getProduct?: () => AnimatedGraphic;
  };

  expect(barMark).toBeDefined();
  if (!barMark?.getProduct) {
    throw new Error('Expected bar mark product to exist');
  }

  return barMark.getProduct();
};

const getBarClipPathRects = (chart: VChart) =>
  ((getBarMarkProduct(chart).attribute.path ?? []) as AnimatedGraphic[]).map(
    path => path.baseAttributes ?? path.attribute
  );

const getBarClipPathGraphics = (chart: VChart) => (getBarMarkProduct(chart).attribute.path ?? []) as AnimatedGraphic[];

const clickLegendItem = (chart: VChart, index: number) => {
  const legendModel = chart.getComponents().find((component: any) => component.type === 'discreteLegend') as any;
  const legendComponent = legendModel?._legendComponent;
  const legendItem = legendComponent?._itemsContainer?.getChildren?.()[index];

  if (!legendComponent?._onClick || !legendItem) {
    throw new Error(`Expected legend item ${index} to exist`);
  }

  legendComponent._onClick({
    target: legendItem
  });
};

const createStackCornerLegendSpec = () =>
  ({
    type: 'bar',
    direction: 'vertical',
    width: 500,
    height: 300,
    xField: ['date', '__DimGroup__'],
    yField: '__MeaValue__',
    seriesField: '__DimGroupID__',
    padding: 0,
    region: [
      {
        clip: true
      }
    ],
    animation: true,
    animationAppear: {
      duration: APPEAR_DURATION,
      easing: 'linear'
    },
    animationUpdate: {
      duration: UPDATE_DURATION,
      easing: 'linear'
    },
    stackCornerRadius: [4, 4, 0, 0],
    color: {
      type: 'ordinal',
      domain: Object.keys(COLOR_BY_SERIES),
      range: Object.values(COLOR_BY_SERIES),
      specified: {}
    },
    data: {
      values: [
        {
          date: '2019',
          region: 'east',
          __OriginalData__: {
            date: '2019',
            region: 'east',
            profit: 10,
            sales: 20
          },
          profit: 10,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          __MeaValue__: 10,
          __DimGroup__: 'east-利润',
          __DimGroupID__: 'east-利润profit'
        },
        {
          date: '2019',
          region: 'east',
          __OriginalData__: {
            date: '2019',
            region: 'east',
            profit: 10,
            sales: 20
          },
          sales: 20,
          __MeaId__: 'sales',
          __MeaName__: '销售量',
          __MeaValue__: 20,
          __DimGroup__: 'east-销售量',
          __DimGroupID__: 'east-销售量sales'
        },
        {
          date: '2019',
          region: 'north of east',
          __OriginalData__: {
            date: '2019',
            region: 'north of east',
            profit: 10,
            sales: 20
          },
          profit: 10,
          __MeaId__: 'profit',
          __MeaName__: '利润',
          __MeaValue__: 10,
          __DimGroup__: 'north of east-利润',
          __DimGroupID__: 'north of east-利润profit'
        },
        {
          date: '2019',
          region: 'north of east',
          __OriginalData__: {
            date: '2019',
            region: 'north of east',
            profit: 10,
            sales: 20
          },
          sales: 20,
          __MeaId__: 'sales',
          __MeaName__: '销售量',
          __MeaValue__: 20,
          __DimGroup__: 'north of east-销售量',
          __DimGroupID__: 'north of east-销售量sales'
        }
      ]
    },
    label: {
      visible: true,
      animationUpdate: {
        duration: UPDATE_DURATION,
        easing: 'linear'
      }
    },
    legends: {
      type: 'discrete',
      visible: true,
      maxCol: 1,
      maxRow: 1,
      autoPage: true,
      orient: 'right',
      position: 'start',
      item: {
        focus: true,
        background: {
          state: {
            selectedHover: {
              fill: '#646A73',
              fillOpacity: 0.05
            }
          }
        }
      }
    }
  } as unknown as IBarChartSpec);

describe('manual ticker animation regressions', () => {
  it('keeps default bar appear starts out of static truth', () => {
    const { container, dom } = createChartContainer();
    const ticker = createManualTicker();
    const chart = new VChart(
      {
        type: 'bar',
        width: 400,
        height: 300,
        data: [
          {
            id: 'barData',
            values: [{ month: 'Monday', sales: 22 }]
          }
        ],
        xField: 'month',
        yField: 'sales',
        axes: [
          { orient: 'left', visible: false },
          { orient: 'bottom', visible: false }
        ],
        animationAppear: {
          duration: APPEAR_DURATION,
          easing: 'linear'
        }
      } as IBarChartSpec,
      {
        dom,
        ticker,
        animation: true
      }
    );

    chart.renderSync();

    try {
      const barGraphic = getBarGraphics(chart)[0];
      const expectedFinalLayout = {
        y: getGraphicFinalAttribute(barGraphic).y,
        y1: getGraphicFinalAttribute(barGraphic).y1
      };

      expect(expectedFinalLayout.y).not.toBe(expectedFinalLayout.y1);
      expect(barGraphic.baseAttributes?.y).toBe(expectedFinalLayout.y);
      expect(barGraphic.baseAttributes?.y1).toBe(expectedFinalLayout.y1);

      ticker.tickAt(APPEAR_DURATION / 2);

      expect(barGraphic.attribute.y).not.toBe(barGraphic.attribute.y1);
      expect(barGraphic.baseAttributes?.y).toBe(expectedFinalLayout.y);
      expect(barGraphic.baseAttributes?.y1).toBe(expectedFinalLayout.y1);
      expect(getGraphicFinalAttribute(barGraphic).y).toBe(expectedFinalLayout.y);
      expect(getGraphicFinalAttribute(barGraphic).y1).toBe(expectedFinalLayout.y1);

      ticker.tickAt(APPEAR_DURATION + 50);

      expectBarYLayout(barGraphic, expectedFinalLayout);
      expect(barGraphic.attribute.y).not.toBe(barGraphic.attribute.y1);
    } finally {
      chart.release();
      ticker.release();
      removeDom(container);
    }
  });

  it('keeps data label update final x at the filtered bar position', () => {
    const { container, dom } = createChartContainer();
    const ticker = createManualTicker();
    const chart = new VChart(
      {
        type: 'bar',
        direction: 'vertical',
        width: 500,
        height: 300,
        xField: ['date', '__DimGroup__'],
        yField: '__MeaValue__',
        seriesField: '__DimGroupID__',
        padding: 0,
        region: [
          {
            clip: true
          }
        ],
        animation: true,
        animationAppear: {
          duration: APPEAR_DURATION,
          easing: 'linear'
        },
        animationUpdate: {
          duration: UPDATE_DURATION,
          easing: 'linear'
        },
        stackCornerRadius: [4, 4, 0, 0],
        color: {
          type: 'ordinal',
          domain: Object.keys(COLOR_BY_SERIES),
          range: Object.values(COLOR_BY_SERIES),
          specified: {}
        },
        data: {
          values: [
            {
              date: '2019',
              region: 'east',
              __OriginalData__: {
                date: '2019',
                region: 'east',
                profit: 10,
                sales: 20
              },
              profit: 10,
              __MeaId__: 'profit',
              __MeaName__: '利润',
              __MeaValue__: 10,
              __DimGroup__: 'east-利润',
              __DimGroupID__: 'east-利润profit'
            },
            {
              date: '2019',
              region: 'east',
              __OriginalData__: {
                date: '2019',
                region: 'east',
                profit: 10,
                sales: 20
              },
              sales: 20,
              __MeaId__: 'sales',
              __MeaName__: '销售量',
              __MeaValue__: 20,
              __DimGroup__: 'east-销售量',
              __DimGroupID__: 'east-销售量sales'
            },
            {
              date: '2019',
              region: 'north of east',
              __OriginalData__: {
                date: '2019',
                region: 'north of east',
                profit: 10,
                sales: 20
              },
              profit: 10,
              __MeaId__: 'profit',
              __MeaName__: '利润',
              __MeaValue__: 10,
              __DimGroup__: 'north of east-利润',
              __DimGroupID__: 'north of east-利润profit'
            },
            {
              date: '2019',
              region: 'north of east',
              __OriginalData__: {
                date: '2019',
                region: 'north of east',
                profit: 10,
                sales: 20
              },
              sales: 20,
              __MeaId__: 'sales',
              __MeaName__: '销售量',
              __MeaValue__: 20,
              __DimGroup__: 'north of east-销售量',
              __DimGroupID__: 'north of east-销售量sales'
            }
          ]
        },
        label: {
          visible: true,
          animationUpdate: {
            duration: UPDATE_DURATION,
            easing: 'linear'
          }
        },
        legends: {
          type: 'discrete',
          visible: true,
          maxCol: 1,
          maxRow: 1,
          autoPage: true,
          orient: 'right',
          position: 'start',
          item: {
            focus: true,
            background: {
              state: {
                selectedHover: {
                  fill: '#646A73',
                  fillOpacity: 0.05
                }
              }
            }
          }
        }
      } as unknown as IBarChartSpec,
      {
        dom,
        ticker,
        animation: true
      }
    );

    chart.renderSync();

    try {
      ticker.tickAt(APPEAR_DURATION + 50);

      const retainedSeries = Object.keys(COLOR_BY_SERIES).slice(0, 3);
      const initialXBySeries = retainedSeries.reduce<Record<string, number>>((result, seriesName) => {
        result[seriesName] = getLabelTextByFill(chart, COLOR_BY_SERIES[seriesName]).attribute.x;
        return result;
      }, {});

      chart.setLegendSelectedDataByIndex(0, retainedSeries);
      chart.renderSync();

      const updateStart = ticker.getTime();
      const expectedXBySeries = retainedSeries.reduce<Record<string, number>>((result, seriesName) => {
        result[seriesName] = getBarCenterX(getVisibleBarByFill(chart, COLOR_BY_SERIES[seriesName]));
        return result;
      }, {});

      expect(retainedSeries.some(seriesName => initialXBySeries[seriesName] !== expectedXBySeries[seriesName])).toBe(
        true
      );

      retainedSeries.forEach(seriesName => {
        expectStaticXLayout(getLabelTextByFill(chart, COLOR_BY_SERIES[seriesName]), expectedXBySeries[seriesName]);
      });

      ticker.tickAt(updateStart + UPDATE_DURATION / 2);

      retainedSeries.forEach(seriesName => {
        const label = getLabelTextByFill(chart, COLOR_BY_SERIES[seriesName]);
        const startX = initialXBySeries[seriesName];
        const finalX = expectedXBySeries[seriesName];

        if (startX !== finalX) {
          expect(label.attribute.x).toBeGreaterThanOrEqual(Math.min(startX, finalX));
          expect(label.attribute.x).toBeLessThanOrEqual(Math.max(startX, finalX));
        }
        expectStaticXLayout(label, finalX);
      });

      ticker.tickAt(updateStart + UPDATE_DURATION + 50);

      retainedSeries.forEach(seriesName => {
        const label = getLabelTextByFill(chart, COLOR_BY_SERIES[seriesName]);
        const finalX = expectedXBySeries[seriesName];

        expectClose(label.attribute.x, finalX);
        expectStaticXLayout(label, finalX);
      });
    } finally {
      chart.release();
      ticker.release();
      removeDom(container);
    }
  });

  it('keeps stack corner clip paths aligned after interrupted legend update animations', () => {
    const { container, dom } = createChartContainer();
    const ticker = createManualTicker();
    const chart = new VChart(createStackCornerLegendSpec(), {
      dom,
      ticker,
      animation: true
    });

    chart.renderSync();

    try {
      ticker.tickAt(APPEAR_DURATION + 50);

      const allSeries = Object.keys(COLOR_BY_SERIES);
      const retainedSeries = allSeries.slice(0, 3);

      chart.setLegendSelectedDataByIndex(0, retainedSeries);
      chart.renderSync();

      const firstUpdate = ticker.getTime();

      ticker.tickAt(firstUpdate + UPDATE_DURATION / 2);

      chart.setLegendSelectedDataByIndex(0, allSeries);
      chart.renderSync();

      const secondUpdate = ticker.getTime();

      ticker.tickAt(secondUpdate + UPDATE_DURATION / 2);

      chart.setLegendSelectedDataByIndex(0, retainedSeries);
      chart.renderSync();

      const thirdUpdate = ticker.getTime();
      const expectedRects = retainedSeries.map(seriesName => {
        const graphic = getVisibleBarByFill(chart, COLOR_BY_SERIES[seriesName]);
        const finalAttribute = getGraphicFinalAttribute(graphic);

        return {
          x: finalAttribute.x,
          width: finalAttribute.width,
          y: finalAttribute.y,
          y1: finalAttribute.y1
        };
      });
      const clipPathRects = getBarClipPathRects(chart);

      expect(clipPathRects.length).toBe(retainedSeries.length);
      clipPathRects.forEach((clipPathRect, index) => {
        expectClose(clipPathRect.x, expectedRects[index].x);
        expectClose(clipPathRect.width, expectedRects[index].width);
        expectClose(clipPathRect.y, expectedRects[index].y);
        expectClose(clipPathRect.y1, expectedRects[index].y1);
      });

      ticker.tickAt(thirdUpdate + UPDATE_DURATION + 50);

      const finalClipPathRects = getBarClipPathRects(chart);

      expect(finalClipPathRects.length).toBe(retainedSeries.length);
      retainedSeries.forEach((seriesName, index) => {
        expectStaticRectLayout(getVisibleBarByFill(chart, COLOR_BY_SERIES[seriesName]), expectedRects[index]);
        expectClose(finalClipPathRects[index].x, expectedRects[index].x);
        expectClose(finalClipPathRects[index].width, expectedRects[index].width);
        expectClose(finalClipPathRects[index].y, expectedRects[index].y);
        expectClose(finalClipPathRects[index].y1, expectedRects[index].y1);
      });
    } finally {
      chart.release();
      ticker.release();
      removeDom(container);
    }
  });

  it('keeps stack corner clip paths synced during quick legend reselect update animations', () => {
    const { container, dom } = createChartContainer();
    const ticker = createManualTicker();
    const chart = new VChart(createStackCornerLegendSpec(), {
      dom,
      ticker,
      animation: true
    });

    chart.renderSync();

    try {
      ticker.tickAt(APPEAR_DURATION + 50);

      const allSeries = Object.keys(COLOR_BY_SERIES);
      const retainedSeries = allSeries.slice(0, 3);

      clickLegendItem(chart, 3);
      chart.renderSync();

      const hideUpdate = ticker.getTime();

      ticker.tickAt(hideUpdate + UPDATE_DURATION / 10);

      clickLegendItem(chart, 3);
      chart.renderSync();

      const showUpdate = ticker.getTime();

      ticker.tickAt(showUpdate + UPDATE_DURATION / 15);

      const clipPaths = getBarClipPathGraphics(chart);
      const isAnimatingBackToAll = retainedSeries.some(seriesName => {
        const graphic = getVisibleBarByFill(chart, COLOR_BY_SERIES[seriesName]);
        const finalAttribute = getGraphicFinalAttribute(graphic);

        return graphic.attribute.x !== finalAttribute.x || graphic.attribute.width !== finalAttribute.width;
      });

      expect(clipPaths.length).toBe(allSeries.length);
      expect(isAnimatingBackToAll).toBe(true);

      retainedSeries.forEach((seriesName, index) => {
        const graphic = getVisibleBarByFill(chart, COLOR_BY_SERIES[seriesName]);
        const clipPath = clipPaths[index];

        expectClose(clipPath.attribute.x, graphic.attribute.x);
        expectClose(clipPath.attribute.width, graphic.attribute.width);
        expectClose(clipPath.attribute.y, graphic.attribute.y);
        expectClose(clipPath.attribute.y1, graphic.attribute.y1);
      });
    } finally {
      chart.release();
      ticker.release();
      removeDom(container);
    }
  });
});
