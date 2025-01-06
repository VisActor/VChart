import { Datum } from '@visactor/vchart/src/typings';
import type { IRankingListSpec } from './interface';
import { CommonChartSpecTransformer } from '@visactor/vchart';
import { TextMeasure } from '@visactor/vutils';
import { defaultSpec } from './constant';
import { applyVisible, computeDataRange, mergeObjects } from './utils';
import { IAnimationParameters, IElement } from '@visactor/vgammar-core';

const DATA_KEY = 'dataKey';
const ORDER_KEY = 'VCHART_ORDER';
const SUPPLY_DATA_KEY = 'SUPPLY_DATA_KEY';
const NAME_LABEL_PADDING_RIGHT = 10;
const NAME_ORDER_PADDING_RIGHT = 5;
const NAME_SYMBOL_PADDING_RIGHT = 8;
const CHART_PADDING_LEFT = 5;
const CHART_PADDING_RIGHT = 5;
const VALUE_LABEL_PADDING_LEFT = 5;

const LABEL_PADDING_BOTTOM = 5;

export class RankingListChartSpecTransformer extends CommonChartSpecTransformer {
  protected nameLabelTextMeasure: TextMeasure<any>;
  protected valueLabelTextMeasure: TextMeasure<any>;
  protected orderLabelTextMeasure: TextMeasure<any>;
  protected originalData: Datum[];
  protected dataSpecs: any[];
  protected formatMap: { [key: string]: (text: string, ctx: any) => string } = {};

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    this.normalizeSpec(spec);
    this.upgradeTextMeasure(spec);
    this.upgradeFormatMap(spec);
    this.processData(spec);

    // rankingList spec -> vchart spec
    this.transformBaseSpec(spec);
    this.transformAnimationSpec(spec);
    this.transformAxesSpec(spec);

    spec.extensionMark = [
      // 柱图背景
      this.generateBarBackground(spec),
      // 辅助图标
      ...this.generateDecorateHaloIcons(spec),
      // 左侧图标
      this.generateRankingIcon(spec),
      // 左侧label
      this.generateNameLabel(spec),
      // 左侧序号label
      this.generateOrderLabel(spec),
      // 右侧label
      this.generateValueLabel(spec)
    ];

    this.transformPaddingSpec(spec);

    super.transformSpec(spec);
  }

  normalizeSpec(spec: any) {
    // 处理配置
    mergeObjects(spec, defaultSpec);
    applyVisible(spec, [
      'barBackground',
      'rankingIcon',
      'decorateHaloIcon',
      'orderLabel',
      'nameLabel',
      'valueLabel'
      // 'bar'
    ]);
  }

  upgradeTextMeasure(spec: any) {
    // 初始化文字测量
    this.nameLabelTextMeasure?.release();
    this.valueLabelTextMeasure?.release();
    this.orderLabelTextMeasure?.release();
    this.nameLabelTextMeasure = new TextMeasure({
      defaultFontParams: spec.nameLabel?.style ?? {}
    });
    this.valueLabelTextMeasure = new TextMeasure({
      defaultFontParams: spec.valueLabel?.style ?? {}
    });
    this.orderLabelTextMeasure = new TextMeasure({
      defaultFontParams: spec.orderLabel?.style ?? {}
    });
  }

  upgradeFormatMap(spec: any) {
    this.formatMap[spec.yField] = spec.nameLabel.formatMethod;
    this.formatMap[spec.xField] = spec.valueLabel.formatMethod;
    this.formatMap[ORDER_KEY] = spec.orderLabel.formatMethod;
  }

  processData(spec: any) {
    // ps: 如果updateSpec后, 同时执行2次processData会有问题, 在这里用比较hack的方式绕过第2次
    if (!spec.data[0]?.values) {
      this.dataSpecs = this.processRankingData(spec as unknown as IRankingListSpec);
      this.originalData = spec.data;
      spec.data = this.dataSpecs[0].data;
      // console.log('processdata');
    }
  }

  transformBaseSpec(spec: any) {
    spec.type = 'common';
    spec.dataKey = DATA_KEY;
    spec.series = [
      {
        type: 'bar',
        direction: 'horizontal',
        xField: spec.xField,
        yField: spec.yField,
        barWidth: spec.bar?.height ?? 10,
        bar: {
          ...spec.bar,
          style: {
            ...spec.bar?.style,
            x1: 0,
            visible: (datum: Datum) => {
              if (datum[SUPPLY_DATA_KEY]) {
                return false;
              }
              return spec.bar?.style ?? true;
            }
          }
        }
      }
    ];
  }

  transformAnimationSpec(spec: any) {
    const totalDuration = spec.animation.duration;

    if (spec.animation) {
      spec.player = {
        ...spec.player,
        specs: this.dataSpecs,
        auto: true,
        visible: false,
        interval: spec.animation.interval + spec.animation.duration / 2,
        loop: true
      };

      spec.animationExit = this.getAnimationExit(spec, totalDuration);
      spec.animationAppear = this.getAnimationEnter(spec, 'rect', totalDuration);
      spec.animationEnter = this.getAnimationEnter(spec, 'rect', totalDuration);
    }
  }

  transformAxesSpec(spec: any) {
    const { min, max } = computeDataRange(this.originalData, spec.xField);
    spec.axes = [
      {
        orient: 'left',
        type: 'band',
        visible: false,
        inverse: true
      },
      {
        orient: 'bottom',
        label: { visible: true },
        type: 'linear',
        visible: false,
        min,
        max
      }
    ];
  }

  generateBarBackground(spec: any) {
    const totalDuration = spec.animation.duration;
    return {
      type: spec.barBackground.type,
      dataId: 'data',
      visible: true,
      dataKey: DATA_KEY,
      zIndex: -99,
      state: spec.barBackground?.state,
      style: {
        x: (datum: Datum, ctx: any) =>
          spec.barBackground.type === 'symbol' ? ctx.getRegion().getLayoutRect().width / 2 : 0,
        y: (datum: Datum, ctx: any) => {
          return (
            ctx.valueToY([datum[spec.yField]]) +
            ctx.yBandwidth() / 2 -
            (spec.barBackground.type === 'symbol' ? 0 : spec.bar.height / 2)
          );
        },
        size: (datum: Datum, ctx: any) => [ctx.getRegion().getLayoutRect().width, spec.bar.height],
        width: (datum: Datum, ctx: any) => ctx.getRegion().getLayoutRect().width,
        height: spec.bar.height,
        ...spec.barBackground.style,
        visible: (datum: Datum) => {
          if (datum[SUPPLY_DATA_KEY]) {
            return false;
          }
          return spec.barBackground.style.visible;
        }
      },
      animation: Boolean(spec.animation),
      animationEnter: this.getAnimationEnter(spec, 'barBack', totalDuration),
      animationExit: this.getAnimationExit(spec, totalDuration),
      animationAppear: this.getAnimationEnter(spec, 'barBack', totalDuration)
    };
  }

  generateDecorateHaloIcons(spec: any) {
    const totalDuration = spec.animation.duration;
    return spec.decorateHaloIcons.map((decorateHaloIcon: any) => {
      return {
        type: 'symbol',
        dataId: 'data',
        visible: true,
        dataKey: DATA_KEY,
        state: decorateHaloIcon?.state,
        style: {
          x: (datum: Datum, ctx: any) => {
            if (datum[spec.xField] === undefined || datum[spec.xField] === null) {
              return undefined;
            }
            return ctx.valueToX([datum[spec.xField]]);
          },
          y: (datum: Datum, ctx: any) => {
            return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2;
          },
          ...decorateHaloIcon.style,
          visible: (datum: Datum) => {
            if (datum[SUPPLY_DATA_KEY]) {
              return false;
            }
            return decorateHaloIcon.style.visible;
          }
        },
        animation: Boolean(spec.animation),
        animationEnter: this.getAnimationEnter(spec, 'symbol', totalDuration),
        animationExit: this.getAnimationExit(spec, totalDuration),
        animationAppear: this.getAnimationEnter(spec, 'symbol', totalDuration)
      };
    });
  }

  generateRankingIcon(spec: any) {
    const totalDuration = spec.animation.duration;
    return {
      type: 'symbol',
      dataId: 'data',
      visible: true,
      dataKey: DATA_KEY,
      state: spec.rankingIcon.state,
      style: {
        x: (datum: Datum) => {
          if (spec.labelLayout === 'bothEnd') {
            return -(
              NAME_LABEL_PADDING_RIGHT +
              this.nameLabelTextMeasure.fullMeasure(this.formatDatum(spec.yField, datum)).width +
              (spec.orderLabel.style.visible
                ? NAME_ORDER_PADDING_RIGHT +
                  this.orderLabelTextMeasure.fullMeasure(this.formatDatum(ORDER_KEY, datum)).width
                : 0) +
              NAME_SYMBOL_PADDING_RIGHT
            );
          }
          return CHART_PADDING_LEFT;
        },
        y: (datum: Datum, ctx: any) => {
          if (spec.labelLayout === 'bothEnd') {
            return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2;
          }
          return (
            ctx.valueToY([datum[spec.yField]]) +
            ctx.yBandwidth() / 2 -
            spec.bar.height / 2 -
            LABEL_PADDING_BOTTOM -
            Math.max(
              this.nameLabelTextMeasure.fullMeasure(this.formatDatum(spec.yField, datum)).height,
              this.orderLabelTextMeasure.fullMeasure(this.formatDatum(ORDER_KEY, datum)).height
            ) /
              2
          );
        },
        ...spec.rankingIcon.style,
        lineWidth: 0,
        stroke: null,
        visible: (datum: Datum) => {
          if (datum[SUPPLY_DATA_KEY]) {
            return false;
          }
          return spec.rankingIcon.style.visible;
        }
      },
      animation: Boolean(spec.animation),
      animationEnter: this.getAnimationEnter(spec, 'text', totalDuration),
      animationExit: this.getAnimationExit(spec, totalDuration),
      animationAppear: this.getAnimationEnter(spec, 'text', totalDuration)
    };
  }

  generateNameLabel(spec: any) {
    const totalDuration = spec.animation.duration;
    return {
      type: 'text',
      dataId: 'data',
      dataKey: DATA_KEY,
      state: spec.nameLabel?.state,
      style: {
        text: (datum: Datum) => this.formatDatum(spec.yField, datum),
        x: () => {
          if (spec.labelLayout === 'bothEnd') {
            return -NAME_LABEL_PADDING_RIGHT;
          }
          return (
            (spec.rankingIcon.style.visible ? NAME_SYMBOL_PADDING_RIGHT + (spec.rankingIcon.style.size ?? 10) : 0) +
            (spec.orderLabel.style.visible
              ? NAME_ORDER_PADDING_RIGHT + this.getMaxDataLabelLens(spec, ORDER_KEY, this.orderLabelTextMeasure)
              : 0)
          );
        },
        y: (datum: Datum, ctx: any) => {
          if (spec.labelLayout === 'bothEnd') {
            return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2;
          }
          return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2 - spec.bar.height / 2 - LABEL_PADDING_BOTTOM;
        },
        ...spec.nameLabel.style,
        textAlign: spec.labelLayout === 'bothEnd' ? 'right' : 'left',
        textBaseline: spec.labelLayout === 'bothEnd' ? 'middle' : 'bottom',
        visible: (datum: Datum) => {
          if (datum[SUPPLY_DATA_KEY]) {
            return false;
          }
          return spec.nameLabel.style.visible;
        }
      },
      animation: Boolean(spec.animation),
      animationEnter: this.getAnimationEnter(spec, 'text', totalDuration),
      animationExit: this.getAnimationExit(spec, totalDuration),
      animationAppear: this.getAnimationEnter(spec, 'text', totalDuration)
    };
  }

  generateOrderLabel(spec: any) {
    const totalDuration = spec.animation.duration;
    return {
      type: 'text',
      dataId: 'data',
      dataKey: DATA_KEY,
      state: spec.orderLabel?.state,
      style: {
        text: (datum: Datum) => this.formatDatum(ORDER_KEY, datum),
        x: (datum: Datum) => {
          if (spec.labelLayout === 'bothEnd') {
            return -(
              NAME_LABEL_PADDING_RIGHT +
              this.nameLabelTextMeasure.fullMeasure(this.formatDatum(spec.yField, datum)).width +
              NAME_ORDER_PADDING_RIGHT
            );
          } else {
            return spec.rankingIcon.style.visible ? NAME_SYMBOL_PADDING_RIGHT + (spec.rankingIcon.style.size ?? 10) : 0;
          }
        },
        y: (datum: Datum, ctx: any) => {
          if (spec.labelLayout === 'bothEnd') {
            return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2;
          }
          return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2 - spec.bar.height / 2 - LABEL_PADDING_BOTTOM;
        },
        ...spec.orderLabel.style,
        textAlign: spec.labelLayout === 'bothEnd' ? 'right' : 'left',
        textBaseline: spec.labelLayout === 'bothEnd' ? 'middle' : 'bottom',
        visible: (datum: Datum) => {
          if (datum[SUPPLY_DATA_KEY]) {
            return false;
          }
          return spec.orderLabel.style.visible;
        }
      },
      animation: Boolean(spec.animation),
      animationEnter: this.getAnimationEnter(spec, 'text', totalDuration),
      animationExit: this.getAnimationExit(spec, totalDuration),
      animationAppear: this.getAnimationEnter(spec, 'text', totalDuration)
    };
  }

  generateValueLabel(spec: any) {
    const totalDuration = spec.animation.duration;
    return {
      type: 'text',
      dataId: 'data',
      visible: true,
      dataKey: DATA_KEY,
      state: {
        blur: {
          opacity: 0.2
        }
      },
      style: {
        text: (datum: Datum) => this.formatDatum(spec.xField, datum),
        x: (datum: Datum, ctx: any) => {
          if (spec.labelLayout === 'bothEnd') {
            return (
              ctx.getRegion().getLayoutRect().width +
              this.getMaxDataLabelLens(spec, spec.xField, this.nameLabelTextMeasure) +
              VALUE_LABEL_PADDING_LEFT
            );
          } else {
            return ctx.getRegion().getLayoutRect().width;
          }
        },
        y: (datum: Datum, ctx: any) => {
          if (spec.labelLayout === 'bothEnd') {
            return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2;
          }
          return ctx.valueToY([datum[spec.yField]]) + ctx.yBandwidth() / 2 - spec.bar.height / 2 - LABEL_PADDING_BOTTOM;
        },
        ...spec.valueLabel.style,
        textAlign: 'right',
        textBaseline: spec.labelLayout === 'bothEnd' ? 'middle' : 'bottom',
        visible: (datum: Datum) => {
          if (datum[SUPPLY_DATA_KEY]) {
            return false;
          }
          return spec.valueLabel.style.visible;
        }
      },
      animation: Boolean(spec.animation),
      animationEnter: this.getAnimationEnter(spec, 'text', totalDuration),
      animationExit: this.getAnimationExit(spec, totalDuration),
      animationAppear: this.getAnimationEnter(spec, 'text', totalDuration)
    };
  }

  transformPaddingSpec(spec: any) {
    const maxHaloIconSize = Math.max(...spec.decorateHaloIcons.map((icon: any) => icon.style.size ?? 18));
    spec.padding = {
      left:
        spec.labelLayout === 'bothEnd'
          ? NAME_LABEL_PADDING_RIGHT +
            this.getMaxDataLabelLens(spec, spec.yField, this.nameLabelTextMeasure) +
            (spec.orderLabel.style.visible
              ? NAME_ORDER_PADDING_RIGHT + this.getMaxDataLabelLens(spec, ORDER_KEY, this.orderLabelTextMeasure)
              : 0) +
            (spec.rankingIcon.style.visible ? NAME_SYMBOL_PADDING_RIGHT + (spec.rankingIcon.style.size ?? 10) : 0) +
            CHART_PADDING_LEFT
          : CHART_PADDING_LEFT + maxHaloIconSize / 2,
      right:
        spec.labelLayout === 'bothEnd'
          ? VALUE_LABEL_PADDING_LEFT +
            this.getMaxDataLabelLens(spec, spec.yField, this.valueLabelTextMeasure) +
            CHART_PADDING_RIGHT
          : CHART_PADDING_RIGHT + 10,
      top: 0,
      bottom: 0,
      ...spec.padding
    };
  }

  paginateDataArr = (spec: IRankingListSpec) => {
    const { data: arr, scrollSize = 1, pageSize = 5 } = spec;
    const result: { [key: string]: Datum[] } = {};
    let pageOrder = 0;
    for (let i = 0; i < arr.length; i += scrollSize) {
      pageOrder++;
      result[`page${pageOrder}`] = arr.slice(i, i + pageSize);
      if (i + pageSize - 1 >= arr.length - 1) {
        arr.push(
          ...Array.from({ length: i + pageSize - arr.length }, _ => {
            return {
              [spec.yField]: Math.random() * 100,
              [spec.xField]: null,
              [SUPPLY_DATA_KEY]: true
            };
          })
        );
        break;
      }
    }
    return {
      orderCount: pageOrder,
      result: result
    };
  };

  processRankingData = (spec: IRankingListSpec) => {
    const result: any[] = [];
    spec.data.forEach((datum, index) => (datum[ORDER_KEY] = index + 1 < 10 ? `0${index + 1}` : index + 1));
    const pagerData = this.paginateDataArr(spec).result;
    const orderCount = this.paginateDataArr(spec).orderCount;
    const supplyCount = spec.pageSize - pagerData[`page${orderCount}`].length;
    pagerData[`page${orderCount}`].push(
      ...Array.from({ length: supplyCount }, _ => {
        return {
          [spec.yField]: Math.random() * 100,
          [spec.xField]: null,
          [SUPPLY_DATA_KEY]: true
        };
      })
    );

    Object.keys(pagerData).forEach(order => {
      result.push({
        data: [
          {
            id: 'datas',
            values: pagerData[order].map((d, i) => {
              return { ...d, [DATA_KEY]: order + '_' + i + '_' + new Date().getTime() };
            })
          },
          {
            id: 'order',
            values: [
              {
                order
              }
            ]
          }
        ]
      });
    });

    // 只有1页时, player循环播放时, prePage和curPage data一致, 导致没有动画效果
    // 在此手动复制1页, 且prePage和curPage dataKey不一致, 保证动画效果
    if (result.length === 1) {
      result.push({
        data: [
          {
            id: 'datas',
            values: pagerData['page1'].map((d, i) => {
              return { ...d, [DATA_KEY]: 'page2' + '_' + i + '_' + new Date().getTime() };
            })
          },
          {
            id: 'order',
            values: [
              {
                order: 'page2'
              }
            ]
          }
        ]
      });
    }
    return result;
  };

  getMaxDataLabelLens(spec: IRankingListSpec, field: string, textMeasure: TextMeasure<any>) {
    const textWidths = this.originalData.map(datum =>
      datum[SUPPLY_DATA_KEY] ? 0 : textMeasure.fullMeasure(this.formatDatum(field, datum)).width
    );
    return Math.max(...textWidths);
  }

  formatDatum(field: string, datum: Datum) {
    // console.log('field', field, datum);
    if (this.formatMap?.[field]) {
      return this.formatMap[field](datum[field], datum);
    } else {
      return datum[field];
    }
  }

  getLabelWidth(padding: number, width: number) {
    return width + padding;
  }

  getAnimationExit(spec: IRankingListSpec, duration: number) {
    if (spec.animation.type === 'grow') {
      return {};
    }
    return {
      type: 'moveOut',
      options: {
        direction: 'y',
        orient: 'negative',
        point: (datum: Datum, element: IElement, opt: IAnimationParameters) => {
          const channelAttr = element.getGraphicAttribute('y');
          const barSpace = (spec.height / spec.pageSize - spec.bar.height) / 2;
          return { y: channelAttr - opt.height + barSpace };
        }
      },
      duration: spec.animation.type === 'both' ? duration / 2 : duration,
      easing: spec.animation.easing
    };
  }

  getAnimationEnter(spec: IRankingListSpec, markType: 'rect' | 'text' | 'symbol' | 'barBack', totalDuration: number) {
    const { animation } = spec;
    const { type: animationType, easing } = animation;
    const scrollDuration = animationType === 'both' ? totalDuration / 2 : totalDuration;
    const growDuration = animationType === 'grow' ? totalDuration : totalDuration / 2;
    const result = [];
    if (animationType === 'scroll' || animationType === 'both') {
      result.push({
        type: 'moveIn',
        options: {
          direction: 'y',
          orient: 'negative',
          excludeChannels: ['y'],
          point: (datum: Datum, element: IElement, opt: IAnimationParameters) => {
            const channelAttr = element.getGraphicAttribute('y');
            const barSpace = (spec.height / spec.pageSize - spec.bar.height) / 2;
            return { y: channelAttr + opt.height - barSpace };
          }
        },
        duration: scrollDuration,
        easing
      });
    }
    if ((animationType === 'grow' || animationType === 'both') && markType !== 'text' && markType !== 'barBack') {
      result.push({
        channel: {
          x: {
            from: 0,
            to: (datum: Datum, element: IElement) => {
              return element.getGraphicItem().attribute.x;
            }
          }
        },
        duration: growDuration,
        delay: animationType === 'both' ? scrollDuration : 0,
        easing
      });
    }
    return result;
  }
}
