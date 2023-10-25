/* eslint-disable no-duplicate-imports */
import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IRectMark } from '../../mark/rect';
import type { ILinkPathMark } from '../../mark/link-path';
import type { ITextMark } from '../../mark/text';
import { registerSankeyTransforms } from '@visactor/vgrammar-sankey';
import type { Datum, IRectMarkSpec, ILinkPathMarkSpec, ITextMarkSpec } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { registerFadeInOutAnimation } from '../../animation/config';
import { registerDataSetInstanceTransform, registerDataSetInstanceParser } from '../../data/register';
import type { ISankeyOpt } from '../../data/transforms/sankey';
import { sankey } from '../../data/transforms/sankey';
import { sankeyNodes } from '../../data/transforms/sankey-nodes';
import { sankeyLinks } from '../../data/transforms/sankey-links';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import { DataView, DataSet, dataViewParser } from '@visactor/vdataset';
import { DEFAULT_DATA_INDEX, LayoutZIndex, AttributeLevel, Event_Bubble_Level, ChartEvent } from '../../constant';
import { SeriesData } from '../base/series-data';
import { addVChartProperty } from '../../data/transforms/add-property';
import { addDataKey, initKeyMap } from '../../data/transforms/data-key';
import { SankeySeriesTooltipHelper } from './tooltip-helper';
import type { IBounds } from '@visactor/vutils';
import { Bounds } from '@visactor/vutils';
import { registerSankeyAnimation, type ISankeyAnimationParams } from './animation';
import type { ISankeySeriesSpec } from './interface';
import type { ExtendEventParam } from '../../event/interface';
import type { IElement, IGlyphElement } from '@visactor/vgrammar-core';
import type { IMarkAnimateSpec } from '../../animation/spec';
import { array, isNil } from '../../util';
import { ColorOrdinalScale } from '../../scale/color-ordinal-scale';
import { RectMark } from '../../mark/rect';
import { TextMark } from '../../mark/text';
import { LinkPathMark } from '../../mark/link-path';
import { sankeySeriesMark } from './constant';
import { flatten } from '../../data/transforms/flatten';
import type { SankeyNodeElement } from '@visactor/vgrammar-sankey';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';
import { TransformLevel } from '../../data/initialize';

export class SankeySeries<T extends ISankeySeriesSpec = ISankeySeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.sankey;
  type = SeriesTypeEnum.sankey;

  static readonly mark: SeriesMarkMap = sankeySeriesMark;

  private _nodeMark: IRectMark;
  private _linkMark: ILinkPathMark;
  private _labelMark?: ITextMark;

  private _nodeLayoutZIndex = LayoutZIndex.Node;
  private _labelLayoutZIndex = LayoutZIndex.Label;
  private _labelLimit: number;

  protected _nodesSeriesData?: SeriesData;
  protected _linksSeriesData?: SeriesData;

  private _viewBox: IBounds = new Bounds();

  protected _categoryField!: string;
  getCategoryField() {
    return this._categoryField;
  }
  setCategoryField(f: string): string {
    this._categoryField = f;
    return this._categoryField;
  }

  protected _valueField!: string;
  getValueField() {
    return this._valueField;
  }
  setValueField(f: string): string {
    this._valueField = f;
    return this._valueField;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.setCategoryField(this._spec.categoryField);
    this.setValueField(this._spec.valueField);
    this.setSeriesField(this._spec.seriesField ?? this._spec.categoryField);
    this._labelLimit = this._spec.label?.limit ?? 100;
  }

  initData() {
    super.initData();

    if (this.getViewData()) {
      // 初始化桑基图数据
      registerDataSetInstanceTransform(this._dataSet, 'sankey', sankey);

      this.addViewDataFilter({
        type: 'sankey',
        options: {
          view: () => {
            return {
              x0: this._viewBox.x1,
              x1: this._viewBox.x2,
              y0: this._viewBox.y1,
              y1: this._viewBox.y2
            };
          },
          sourceField: this._spec.sourceField,
          targetField: this._spec.targetField,
          valueField: this._spec.valueField,
          direction: this._spec.direction,
          nodeAlign: this._spec.nodeAlign ?? 'justify',
          nodeGap: this._spec.nodeGap ?? 8,
          nodeWidth: this._spec.nodeWidth ?? 10,
          linkWidth: this._spec.linkWidth,
          minStepWidth: this._spec.minStepWidth,
          minNodeHeight: this._spec.minNodeHeight ?? 4,
          minLinkHeight: this._spec.minLinkHeight,
          iterations: this._spec.iterations,
          nodeKey: this._spec.nodeKey,
          linkSortBy: this._spec.linkSortBy,
          nodeSortBy: this._spec.nodeSortBy,
          setNodeLayer: this._spec.setNodeLayer
        } as ISankeyOpt,
        level: TransformLevel.sankeyLayout
      });

      const nodesDataSet = new DataSet();
      registerDataSetInstanceParser(nodesDataSet, 'dataview', dataViewParser);
      registerDataSetInstanceTransform(nodesDataSet, 'sankeyNodes', sankeyNodes);
      registerDataSetInstanceTransform(nodesDataSet, 'addVChartProperty', addVChartProperty);
      // 注册扁平化算法
      registerDataSetInstanceTransform(nodesDataSet, 'flatten', flatten);
      const nodesDataView = new DataView(nodesDataSet, { name: `sankey-node-${this.id}.data` });
      nodesDataView.parse([this.getViewData()], {
        type: 'dataview'
      });
      nodesDataView.transform({
        type: 'sankeyNodes'
      });
      // sankeyNode进行扁平化处理(针对层级数据)
      nodesDataView.transform({
        type: 'flatten',
        options: {
          callback: (node: SankeyNodeElement) => {
            if (node.datum) {
              const nodeData = node.datum[node.depth];
              return { ...node, ...nodeData };
            }
            return node;
          }
        },
        level: TransformLevel.sankeyFlatten
      });

      nodesDataView.transform(
        {
          type: 'addVChartProperty',
          options: {
            beforeCall: initKeyMap,
            call: addDataKey.bind(this)
          }
        },
        false
      );

      this._data?.getDataView().target.addListener('change', nodesDataView.reRunAllTransform);
      this._nodesSeriesData = new SeriesData(this._option, nodesDataView);

      const linksDataSet = new DataSet();
      registerDataSetInstanceParser(linksDataSet, 'dataview', dataViewParser);
      registerDataSetInstanceTransform(linksDataSet, 'sankeyLinks', sankeyLinks);
      registerDataSetInstanceTransform(linksDataSet, 'addVChartProperty', addVChartProperty);
      const linksDataView = new DataView(linksDataSet, { name: `sankey-link-${this.id}.data` });
      linksDataView.parse([this.getViewData()], {
        type: 'dataview'
      });
      linksDataView.transform({
        type: 'sankeyLinks'
      });

      linksDataView.transform(
        {
          type: 'addVChartProperty',
          options: {
            beforeCall: initKeyMap,
            call: addDataKey.bind(this)
          }
        },
        false
      );

      this._data?.getDataView().target.addListener('change', linksDataView.reRunAllTransform);
      this._linksSeriesData = new SeriesData(this._option, linksDataView);
    }
  }

  initMark(): void {
    const nodeMark = this._createMark(SankeySeries.mark.node, {
      isSeriesMark: true,
      key: DEFAULT_DATA_INDEX,
      dataView: this._nodesSeriesData.getDataView(),
      dataProductId: this._nodesSeriesData.getProductId()
    }) as IRectMark;
    if (nodeMark) {
      nodeMark.setZIndex(this._nodeLayoutZIndex);
      this._nodeMark = nodeMark;
    }

    const linkMark = this._createMark(SankeySeries.mark.link, {
      key: DEFAULT_DATA_INDEX,
      dataView: this._linksSeriesData.getDataView(),
      dataProductId: this._linksSeriesData.getProductId()
    }) as ILinkPathMark;
    if (linkMark) {
      this._linkMark = linkMark;
    }

    if (this._spec.label?.visible) {
      const labelMark = this._createMark(SankeySeries.mark.label, {
        key: DEFAULT_DATA_INDEX,
        dataView: this._nodesSeriesData.getDataView(),
        dataProductId: this._nodesSeriesData.getProductId()
      }) as ITextMark;
      if (labelMark) {
        this._labelMark = labelMark;
      }
    }
  }

  initMarkStyle(): void {
    this._initNodeMarkStyle();
    this._initLinkMarkStyle();
    this._initLabelMarkStyle();
  }

  protected _initNodeMarkStyle() {
    const nodeMark = this._nodeMark;
    if (!nodeMark) {
      return;
    }

    this.setMarkStyle<IRectMarkSpec>(
      nodeMark,
      {
        x: (datum: Datum) => {
          return datum.x0;
        },
        x1: (datum: Datum) => datum.x1,
        y: (datum: Datum) => datum.y0,
        y1: (datum: Datum) => datum.y1,
        fill: (datum: Datum) => {
          return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(this._getNodeNameFromData(datum));
        }
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Mark
    );
    this._trigger.registerMark(nodeMark);
  }

  protected _initLinkMarkStyle() {
    const linkMark = this._linkMark;
    if (!linkMark) {
      return;
    }
    this.setMarkStyle<ILinkPathMarkSpec>(
      linkMark,
      {
        x0: (datum: Datum) => datum.x0,
        x1: (datum: Datum) => datum.x1,
        y0: (datum: Datum) => datum.y0,
        y1: (datum: Datum) => datum.y1,
        thickness: (datum: Datum) => datum.thickness,
        fill: (datum: Datum) => {
          const sourceName =
            this._spec?.nodeKey || this._rawData.latestData[0]?.nodes?.[0]?.children
              ? datum.source
              : this.getNodeList()[datum.source];
          return this._spec.link?.style?.fill ?? this.getNodeOrdinalColorScale(sourceName);
        },
        direction: this._spec.direction ?? 'horizontal'
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
    this._trigger.registerMark(linkMark);
  }

  protected _initLabelMarkStyle() {
    if (!this._labelMark) {
      return;
    }
    if (this._spec.direction === 'vertical') {
      if (this._spec.label.position === 'inside-start') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => datum.x0,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: '#ffffff',
            text: (datum: Datum) => this._createText(datum),
            limit: (datum: Datum) => this._spec.label.limit ?? datum.x1 - datum.x0,
            textAlign: 'left',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else if (this._spec.label.position === 'inside-middle') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => (datum.x0 + datum.x1) / 2,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: '#ffffff',
            text: (datum: Datum) => this._createText(datum),
            limit: (datum: Datum) => this._spec.label.limit ?? datum.x1 - datum.x0,
            textAlign: 'center',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else if (this._spec.label.position === 'inside-end') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => datum.x1,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: '#ffffff',
            text: (datum: Datum) => this._createText(datum),
            limit: (datum: Datum) => this._spec.label.limit ?? datum.x1 - datum.x0,
            textAlign: 'right',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => (datum.x0 + datum.x1) / 2,
            y: (datum: Datum) => {
              if (datum.y1 >= this._viewBox.y2) {
                return datum.y0;
              }
              return datum.y1;
            },
            fill: (datum: Datum) => {
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(this._getNodeNameFromData(datum));
            },
            text: (datum: Datum) => this._createText(datum),
            limit: this._labelLimit,
            textAlign: 'center',
            textBaseline: (datum: Datum) => {
              if (datum.y1 >= this._viewBox.y2) {
                return 'bottom';
              }
              return 'top';
            }
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      }
    } else {
      if (this._spec.label.position === 'inside-start') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => datum.x0,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: '#ffffff',
            text: (datum: Datum) => this._createText(datum),
            limit: (datum: Datum) => this._spec.label.limit ?? datum.x1 - datum.x0,
            textAlign: 'left',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else if (this._spec.label.position === 'inside-middle') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => (datum.x0 + datum.x1) / 2,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: '#ffffff',
            text: (datum: Datum) => this._createText(datum),
            limit: (datum: Datum) => this._spec.label.limit ?? datum.x1 - datum.x0,
            textAlign: 'center',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else if (this._spec.label.position === 'inside-end') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => datum.x1,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: '#ffffff',
            text: (datum: Datum) => this._createText(datum),
            limit: (datum: Datum) => this._spec.label.limit ?? datum.x1 - datum.x0,
            textAlign: 'right',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else if (this._spec.label.position === 'left') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => datum.x0,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: (datum: Datum) => {
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(this._getNodeNameFromData(datum));
            },
            text: (datum: Datum) => this._createText(datum),
            limit: this._labelLimit,
            textAlign: 'right',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else if (this._spec.label.position === 'right') {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => datum.x1,
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: (datum: Datum) => {
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(this._getNodeNameFromData(datum));
            },
            text: (datum: Datum) => this._createText(datum),
            limit: this._labelLimit,
            textAlign: 'left',
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle<ITextMarkSpec>(
          this._labelMark,
          {
            x: (datum: Datum) => {
              if (datum.x1 >= this._viewBox.x2) {
                return datum.x0;
              }
              return datum.x1;
            },
            y: (datum: Datum) => (datum.y0 + datum.y1) / 2,
            fill: (datum: Datum) => {
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(this._getNodeNameFromData(datum));
            },
            text: (datum: Datum) => this._createText(datum),
            limit: this._labelLimit,
            textAlign: (datum: Datum) => {
              if (datum.x1 >= this._viewBox.x2) {
                return 'right';
              }
              return 'left';
            },
            textBaseline: 'middle'
          },
          STATE_VALUE_ENUM.STATE_NORMAL,
          AttributeLevel.Series
        );
      }
    }

    this._labelMark.setZIndex(this._labelLayoutZIndex);
    this._trigger.registerMark(this._labelMark);
  }

  private _createText(datum: Datum) {
    if (isNil(datum) || isNil(datum.datum)) {
      return '';
    }
    let text = datum.datum[this._spec.categoryField] || '';
    if (this._spec.label?.formatMethod) {
      text = this._spec.label.formatMethod(text, datum.datum);
    }
    return text;
  }

  initAnimation() {
    const animationParams: ISankeyAnimationParams = {
      direction: this.direction,
      growFrom: () =>
        this.direction === 'horizontal'
          ? this._xAxisHelper?.getScale(0).scale(0)
          : this._yAxisHelper?.getScale(0).scale(0)
    };
    const appearPreset = (this._spec?.animationAppear as IMarkAnimateSpec<string>)?.preset;
    if (this._nodeMark) {
      this._nodeMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('sankeyNode')?.(animationParams, appearPreset),
          userAnimationConfig(SeriesMarkNameEnum.node, this._spec)
        )
      );
    }
    if (this._linkMark) {
      this._linkMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('sankeyLinkPath')?.(animationParams, appearPreset),
          userAnimationConfig(SeriesMarkNameEnum.link, this._spec)
        )
      );
    }
    if (this._labelMark) {
      this._labelMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('fadeInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.label, this._spec)
        )
      );
    }
  }

  protected initEvent(): void {
    super.initEvent();

    this._nodesSeriesData.getDataView()?.target.addListener('change', this.nodesSeriesDataUpdate.bind(this));
    this._linksSeriesData.getDataView()?.target.addListener('change', this.linksSeriesDataUpdate.bind(this));

    if (this._spec.emphasis?.enable && this._spec.emphasis?.effect === 'adjacency') {
      if (this._spec.emphasis?.trigger === 'hover') {
        // 浮动事件
        this.event.on('pointerover', { level: Event_Bubble_Level.chart }, this._handleAdjacencyClick);
      } else {
        // this._spec.emphasis?.trigger === 'click'
        // 点击事件
        this.event.on('pointerdown', { level: Event_Bubble_Level.chart }, this._handleAdjacencyClick);
      }
    }

    if (this._spec.emphasis?.enable && this._spec.emphasis?.effect === 'related') {
      if (this._spec.emphasis?.trigger === 'hover') {
        // 浮动事件
        this.event.on('pointerover', { level: Event_Bubble_Level.chart }, this._handleRelatedClick);
      } else {
        // this._spec.emphasis?.trigger === 'click'
        // 点击事件
        this.event.on('pointerdown', { level: Event_Bubble_Level.chart }, this._handleRelatedClick);
      }
    }
  }

  private nodesSeriesDataUpdate() {
    this.event.emit(ChartEvent.legendFilter, { model: this });
    this._nodesSeriesData.updateData();
  }

  private linksSeriesDataUpdate() {
    this.event.emit(ChartEvent.legendFilter, { model: this });
    this._linksSeriesData.updateData();
  }

  protected _handleAdjacencyClick = (params: ExtendEventParam) => {
    const element = params.item;
    if (element && element.mark.id().includes('node')) {
      this._handleNodeAdjacencyClick(element);
    } else if (element && element.mark.id().includes('link')) {
      this._handleLinkAdjacencyClick(element);
    } else {
      this._handleClearEmpty();
    }
  };

  protected _handleRelatedClick = (params: ExtendEventParam) => {
    const element = params.item;
    if (element && element.mark.id().includes('node')) {
      this._handleNodeRelatedClick(element);
    } else if (element && element.mark.id().includes('link')) {
      this._handleLinkRelatedClick(element);
    } else {
      this._handleClearEmpty();
    }
  };

  protected _handleClearEmpty = () => {
    const nodeVGrammarMark = this._nodeMark.getProduct();

    if (!nodeVGrammarMark || !nodeVGrammarMark.elements || !nodeVGrammarMark.elements.length) {
      return;
    }
    const allNodeElements = nodeVGrammarMark.elements;

    const linkVGrammarMark = this._linkMark.getProduct();

    if (!linkVGrammarMark || !linkVGrammarMark.elements || !linkVGrammarMark.elements.length) {
      return;
    }
    const allLinkElements = linkVGrammarMark.elements;

    const labelVGrammarMark = this._labelMark.getProduct();

    if (!labelVGrammarMark || !labelVGrammarMark.elements || !labelVGrammarMark.elements.length) {
      return;
    }
    const allLabelElements = labelVGrammarMark.elements;

    allNodeElements.forEach(el => {
      el.clearStates();
    });
    allLinkElements.forEach(el => {
      el.clearStates();
    });
    allLabelElements.forEach(el => {
      el.clearStates();
    });
  };

  protected _handleNodeAdjacencyClick = (element: IElement) => {
    const nodeDatum = element.getDatum();
    const highlightNodes: string[] = [nodeDatum.key];

    if (this._linkMark) {
      const vGrammarMark = this._linkMark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLinkElements = vGrammarMark.elements;

      allLinkElements.forEach((linkEl: IElement, i: number) => {
        linkEl.clearStates();
        const linkDatum = linkEl.getDatum();
        const father = linkDatum?.parents ? 'parents' : 'source';
        if (array(linkDatum[father]).includes(nodeDatum.key)) {
          // 下游link
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
          }

          if (!highlightNodes.includes(linkDatum.target)) {
            highlightNodes.push(linkDatum.target);
          }

          let ratio;
          if (father === 'parents') {
            const originalDatum = linkDatum.datum;
            const val = originalDatum
              ? originalDatum
                  .filter((entry: any) => entry.parents.some((par: any) => par.key === nodeDatum.key))
                  .reduce((sum: number, d: any) => {
                    return (sum += d.value);
                  }, 0)
              : 0;
            ratio = val / linkDatum.value;
          }

          linkEl.addState('selected', { ratio });
        } else if (linkDatum.target === nodeDatum.key) {
          // 上游link
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
          }
        } else {
          linkEl.useStates(['blur']);
        }
      });
    }

    if (this._nodeMark) {
      const vGrammarMark = this._nodeMark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allNodeElements = vGrammarMark.elements;

      allNodeElements.forEach(el => {
        el.clearStates();
        if (highlightNodes.includes(el.getDatum().key)) {
          //
        } else {
          el.useStates(['blur']);
        }
      });
    }

    if (this._labelMark) {
      const vGrammarMark = this._labelMark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLabelElements = vGrammarMark.elements;

      allLabelElements.forEach(el => {
        el.clearStates();
        if (highlightNodes.includes(el.getDatum().key)) {
          //
        } else {
          el.useStates(['blur']);
        }
      });
    }
  };

  protected _handleLinkAdjacencyClick = (element: IGlyphElement) => {
    const curLinkDatum = element.getDatum();
    const highlightNodes: string[] = [curLinkDatum.source, curLinkDatum.target];

    if (this._linkMark) {
      const vGrammarMark = this._linkMark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLinkElements = vGrammarMark.elements;

      allLinkElements.forEach(linkEl => {
        linkEl.clearStates();

        if (linkEl === element) {
          linkEl.addState('selected', { ratio: 1 });
        } else {
          linkEl.useStates(['blur']);
        }
      });
    }

    if (this._nodeMark) {
      const vGrammarMark = this._nodeMark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allNodeElements = vGrammarMark.elements;

      allNodeElements.forEach(el => {
        el.clearStates();
        if (highlightNodes.includes(el.getDatum().key)) {
          //
        } else {
          el.useStates(['blur']);
        }
      });
    }

    if (this._labelMark) {
      const vGrammarMark = this._labelMark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLabelElements = vGrammarMark.elements;

      allLabelElements.forEach(el => {
        el.clearStates();
        if (highlightNodes.includes(el.getDatum().key)) {
          //
        } else {
          el.useStates(['blur']);
        }
      });
    }
  };

  protected _handleNodeRelatedClick = (element: IElement) => {
    const nodeDatum = element.getDatum();
    const nodeVGrammarMark = this._nodeMark.getProduct();

    if (!nodeVGrammarMark || !nodeVGrammarMark.elements || !nodeVGrammarMark.elements.length) {
      return;
    }
    const allNodeElements = nodeVGrammarMark.elements;

    const linkVGrammarMark = this._linkMark.getProduct();

    if (!linkVGrammarMark || !linkVGrammarMark.elements || !linkVGrammarMark.elements.length) {
      return;
    }
    const allLinkElements = linkVGrammarMark.elements;

    const father = allLinkElements[0].getDatum()?.parents ? 'parents' : 'source';

    if (father === 'source') {
      // node-link 型数据
      const highlightNodes: string[] = [nodeDatum.key];
      const highlightLinks: string[] = [];

      allLinkElements.forEach((linkEl: IElement, i: number) => {
        linkEl.clearStates();
        const linkDatum = linkEl.getDatum();
        const father = linkDatum?.parents ? 'parents' : 'source';

        if (array(linkDatum[father]).includes(nodeDatum.key)) {
          // 下游link
          if (!highlightLinks.includes(linkDatum.key ?? linkDatum.index)) {
            highlightLinks.push(linkDatum.key ?? linkDatum.index);
          }
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
          }

          if (!highlightNodes.includes(linkDatum.target)) {
            highlightNodes.push(linkDatum.target);
            // 下游link的目标节点
            const targetNode = allNodeElements.find(nodeElement => {
              return nodeElement.data[0].key === linkDatum.target;
            });

            // 以下游link的目标节点为起点的links
            let targetNodeSourceLinks: any[] = targetNode.data[0].sourceLinks as any[];
            while (targetNodeSourceLinks?.length > 0) {
              const newTargetNodeSourceLinks: any[] = [];
              targetNodeSourceLinks.forEach((targetNodeSourceLinkDatum: any) => {
                if (!highlightLinks.includes(targetNodeSourceLinkDatum.key ?? targetNodeSourceLinkDatum.index)) {
                  highlightLinks.push(targetNodeSourceLinkDatum.key ?? targetNodeSourceLinkDatum.index);
                  // 该links的目标节点
                  if (!highlightNodes.includes(targetNodeSourceLinkDatum.target)) {
                    highlightNodes.push(targetNodeSourceLinkDatum.target);
                    const sourceNodeTemp = allNodeElements.find(nodeElement => {
                      return nodeElement.data[0].key === targetNodeSourceLinkDatum.target;
                    });
                    // 以该目标节点为起点的links
                    newTargetNodeSourceLinks.push(sourceNodeTemp.data[0].targetLinks as any[]);
                  } else {
                    return;
                  }
                } else {
                  return;
                }
              });
              targetNodeSourceLinks = newTargetNodeSourceLinks;
              return;
            }
          }
        } else if (linkDatum.target === nodeDatum.key) {
          // 上游link
          if (!highlightLinks.includes(linkDatum.key ?? linkDatum.index)) {
            highlightLinks.push(linkDatum.key ?? linkDatum.index);
          }
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
            const sourceNode = allNodeElements.find(nodeElement => {
              return nodeElement.data[0].key === linkDatum.source;
            });
            let sourceNodeTargetLinks: any[] = sourceNode.data[0].targetLinks as any;
            while (sourceNodeTargetLinks?.length > 0) {
              const newSourceNodeTargetLinks: any[] = [];
              sourceNodeTargetLinks.forEach((sourceNodeTargetLinkDatum: any) => {
                if (!highlightLinks.includes(sourceNodeTargetLinkDatum.key ?? sourceNodeTargetLinkDatum.index)) {
                  highlightLinks.push(sourceNodeTargetLinkDatum.key ?? sourceNodeTargetLinkDatum.index);
                  if (!highlightNodes.includes(sourceNodeTargetLinkDatum.source)) {
                    highlightNodes.push(sourceNodeTargetLinkDatum.source);
                    const sourceNodeTemp = allNodeElements.find(nodeElement => {
                      return nodeElement.data[0].key === sourceNodeTargetLinkDatum.source;
                    });
                    newSourceNodeTargetLinks.push(sourceNodeTemp.data[0].targetLinks as any[]);
                  } else {
                    return;
                  }
                } else {
                  return;
                }
              });
              sourceNodeTargetLinks = newSourceNodeTargetLinks;
              return;
            }
          }
        }
      });

      if (this._linkMark) {
        const vGrammarMark = this._linkMark.getProduct();

        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allLinkElements = vGrammarMark.elements;

        allLinkElements.forEach((linkEl: IElement, i: number) => {
          linkEl.clearStates();
          if (highlightLinks.includes(linkEl.getDatum().key ?? linkEl.getDatum().index)) {
            linkEl.useStates(['selected']);
          } else {
            linkEl.useStates(['blur']);
          }
        });
      }

      if (this._nodeMark) {
        const vGrammarMark = this._nodeMark.getProduct();

        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allNodeElements = vGrammarMark.elements;

        allNodeElements.forEach(el => {
          el.clearStates();
          if (highlightNodes.includes(el.getDatum().key)) {
            //
          } else {
            el.useStates(['blur']);
          }
        });
      }

      if (this._labelMark) {
        const vGrammarMark = this._labelMark.getProduct();

        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allLabelElements = vGrammarMark.elements;

        allLabelElements.forEach(el => {
          el.clearStates();
          if (highlightNodes.includes(el.getDatum().key)) {
            //
          } else {
            el.useStates(['blur']);
          }
        });
      }
    } else {
      // 层级型数据
      const highlightNodes: string[] = [nodeDatum.key];

      const upstreamLinks = nodeDatum.targetLinks.reduce((res: any[], link: any) => {
        const dividedLinks = array((link as any).datum);

        dividedLinks.forEach(dividedLink => {
          const parents = dividedLink.parents;
          const len = parents.length;

          for (let i = 0; i < len; i++) {
            const source = parents[i].key;
            const target = parents[i + 1] ? parents[i + 1].key : nodeDatum.key;
            const value = dividedLink.value;

            // 检查 res 数组中是否已存在相同的 source 和 target
            const existingItem = res.find(item => item.source === source && item.target === target);

            if (existingItem) {
              // 如果存在相同的项，则对其 value 进行累加
              existingItem.value += value;
            } else {
              // 如果不存在相同的项，则添加新的项到 res 数组中
              res.push({ source, target, value });
            }
          }
        });
        return res;
      }, []);

      allLinkElements.forEach((linkEl: IElement, i: number) => {
        linkEl.clearStates();
        const linkDatum = linkEl.getDatum();
        const father = linkDatum?.parents ? 'parents' : 'source';
        const originalDatum = linkDatum.datum;
        const selectedDatum = originalDatum
          ? originalDatum.filter((entry: any) => entry[father].some((par: any) => par.key === nodeDatum.key))
          : null;

        const upSelectedLink = upstreamLinks.find(
          (upLink: any) => upLink.source === linkDatum.source && upLink.target === linkDatum.target
        );

        if (selectedDatum && selectedDatum.length) {
          // 下游link
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
          }

          if (!highlightNodes.includes(linkDatum.target)) {
            highlightNodes.push(linkDatum.target);
          }

          const val = selectedDatum.reduce((sum: number, d: any) => {
            return (sum += d.value);
          }, 0);
          const ratio = val / linkDatum.value;

          linkEl.useStates(['selected']);
          linkEl.addState('selected', { ratio });

          return;
        }

        if (upSelectedLink) {
          // 上游link
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
          }

          if (!highlightNodes.includes(linkDatum.target)) {
            highlightNodes.push(linkDatum.target);
          }

          linkEl.useStates(['selected']);
          linkEl.addState('selected', { ratio: upSelectedLink.value / linkDatum.value });

          return;
        }

        linkEl.useStates(['blur']);

        return;
      });

      if (this._nodeMark) {
        const vGrammarMark = this._nodeMark.getProduct();

        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allNodeElements = vGrammarMark.elements;

        allNodeElements.forEach(el => {
          el.clearStates();
          if (highlightNodes.includes(el.getDatum().key)) {
            //
          } else {
            el.useStates(['blur']);
          }
        });
      }

      if (this._labelMark) {
        const vGrammarMark = this._labelMark.getProduct();

        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allLabelElements = vGrammarMark.elements;

        allLabelElements.forEach(el => {
          el.clearStates();
          if (highlightNodes.includes(el.getDatum().key)) {
            //
          } else {
            el.useStates(['blur']);
          }
        });
      }
    }
  };

  protected _handleLinkRelatedClick = (element: IGlyphElement) => {
    const nodeVGrammarMark = this._nodeMark.getProduct();

    if (!nodeVGrammarMark || !nodeVGrammarMark.elements || !nodeVGrammarMark.elements.length) {
      return;
    }
    const allNodeElements = nodeVGrammarMark.elements;

    const linkVGrammarMark = this._linkMark.getProduct();

    if (!linkVGrammarMark || !linkVGrammarMark.elements || !linkVGrammarMark.elements.length) {
      return;
    }
    const allLinkElements = linkVGrammarMark.elements;

    const father = element.getDatum()?.parents ? 'parents' : 'source';
    if (father === 'source') {
      if (this._linkMark) {
        const vGrammarMark = this._linkMark.getProduct();
        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allLinkElements = vGrammarMark.elements;
        allLinkElements.forEach(linkEl => {
          linkEl.clearStates();
        });
      }

      if (this._nodeMark) {
        const vGrammarMark = this._nodeMark.getProduct();
        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allNodeElements = vGrammarMark.elements;
        allNodeElements.forEach(el => {
          el.clearStates();
        });
      }

      if (this._labelMark) {
        const vGrammarMark = this._labelMark.getProduct();
        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allLabelElements = vGrammarMark.elements;
        allLabelElements.forEach(el => {
          el.clearStates();
        });
      }
    } else {
      const curLinkDatum = element.getDatum();
      const highlightNodes: string[] = [curLinkDatum.source, curLinkDatum.target];
      const upstreamLinks: Array<{ source: string; target: string; value: number }> = [];

      const dividedLinks = array((curLinkDatum as any).datum);

      dividedLinks.forEach(dividedLink => {
        const parents = (dividedLink as any).parents;
        const len = parents.length;
        for (let i = 0; i < len - 1; i++) {
          const source = parents[i].key;
          const target = parents[i + 1].key;
          const value = dividedLink.value;

          // 检查 upstreamLinks 数组中是否已存在相同的 source 和 target
          const existingItem = upstreamLinks.find(item => item.source === source && item.target === target);
          upstreamLinks.push({
            source: parents[i].key,
            target: parents[i + 1].key,
            value: dividedLink.value
          });

          if (existingItem) {
            // 如果存在相同的项，则对其 value 进行累加
            existingItem.value += value;
          } else {
            // 如果不存在相同的项，则添加新的项到 upstreamLinks 数组中
            upstreamLinks.push({ source, target, value });
          }
        }
      });

      allLinkElements.forEach(linkEl => {
        linkEl.clearStates();
        const linkDatum = linkEl.getDatum();
        const originalDatum = linkDatum.datum;

        if (linkDatum.source === curLinkDatum.source && linkDatum.target === curLinkDatum.target) {
          // 自身
          linkEl.useStates(['selected']);
          linkEl.addState('selected', { ratio: 1 });
          return;
        }

        const selectedDatum = originalDatum
          ? originalDatum.filter((entry: any) => {
              const parentKeysList = entry.parents.map((item: any) => item.key);
              return parentKeysList.includes(curLinkDatum.source) && parentKeysList.includes(curLinkDatum.target);
            })
          : null;

        if (selectedDatum && selectedDatum.length) {
          // 下游link
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
          }

          if (!highlightNodes.includes(linkDatum.target)) {
            highlightNodes.push(linkDatum.target);
          }

          const val = selectedDatum
            .filter((entry: any) => {
              return entry.parents.some((par: any, index: number) => {
                return par.key === curLinkDatum.source && entry.parents[index + 1]?.key === curLinkDatum.target;
              });
            })
            .reduce((sum: number, d: any) => {
              return (sum += d.value);
            }, 0);
          const ratio = val / linkDatum.value;

          linkEl.useStates(['selected']);
          linkEl.addState('selected', { ratio });

          return;
        }

        const upSelectedLink = upstreamLinks.find(
          (upLink: any) => upLink.source === linkDatum.source && upLink.target === linkDatum.target
        );

        if (upSelectedLink) {
          // 点击节点的上游一层的节点
          if (!highlightNodes.includes(linkDatum.source)) {
            highlightNodes.push(linkDatum.source);
          }
          if (!highlightNodes.includes(linkDatum.target)) {
            highlightNodes.push(linkDatum.target);
          }
          linkEl.useStates(['selected']);
          linkEl.addState('selected', { ratio: upSelectedLink.value / linkDatum.value });

          return;
        }
        linkEl.useStates(['blur']);

        return;
      });

      allNodeElements.forEach(el => {
        el.clearStates();
        if (highlightNodes.includes(el.getDatum().key)) {
          //
        } else {
          el.useStates(['blur']);
        }
      });

      if (this._labelMark) {
        const vGrammarMark = this._labelMark.getProduct();

        if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
          return;
        }
        const allLabelElements = vGrammarMark.elements;

        allLabelElements.forEach(el => {
          el.clearStates();
          if (highlightNodes.includes(el.getDatum().key)) {
            //
          } else {
            el.useStates(['blur']);
          }
        });
      }
    }
  };

  protected initTooltip() {
    this._tooltipHelper = new SankeySeriesTooltipHelper(this);
    this._nodeMark && this._tooltipHelper.activeTriggerSet.mark.add(this._nodeMark);
    this._linkMark && this._tooltipHelper.activeTriggerSet.mark.add(this._linkMark);
    this._labelMark && this._tooltipHelper.activeTriggerSet.mark.add(this._labelMark);
  }

  getNodeOrdinalColorScale(item: string) {
    if (!isNil((this._option?.globalScale?.getScale('color') as any)?._specified)) {
      const specified = (this._option.globalScale.getScale('color') as any)._specified;
      const colorDomain: string[] = [];
      const colorRange: string[] = [];

      for (const key in specified) {
        colorDomain.push(key);
        colorRange.push(specified[key]);
      }
      const ordinalScale = new ColorOrdinalScale();

      ordinalScale.domain(colorDomain).range?.(colorRange);

      return ordinalScale.scale(item);
    }
    const colorDomain = !isNil(this._option.globalScale.getScale('color')?.domain()?.[0])
      ? this._option.globalScale.getScale('color').domain()
      : this.getNodeList();

    let colorRange = this._option.globalScale.getScale('color')?.range() ?? this._getDataScheme();

    if (
      this._option.globalScale.getScale('color')?.domain().length === 0 ||
      isNil(this._option.globalScale.getScale('color').domain()[0])
    ) {
      if (colorDomain.length > 10) {
        colorRange = (this._getDataScheme()[1] as any)?.scheme;
      }
    }

    const ordinalScale = new ColorOrdinalScale();

    ordinalScale.domain(colorDomain).range?.(colorRange);

    return ordinalScale.scale(item);
  }

  getNodeList() {
    const nodeList = this._rawData.latestData[0]?.nodes
      ? this._rawData.latestData[0].nodes[0]?.children
        ? Array.from(this.extractNamesFromTree(this._rawData.latestData[0].nodes, this._spec.categoryField))
        : this._rawData.latestData[0].nodes.map((datum: Datum, index: number) => {
            return datum[this._spec.categoryField];
          })
      : this._rawData.latestData[0]?.values.map((datum: Datum, index: number) => {
          return datum[this._spec.categoryField];
        });

    return nodeList;
  }

  _getNodeNameFromData(datum: Datum) {
    return datum?.datum ? datum?.datum[this._spec.categoryField] : datum[this._spec.categoryField];
  }

  extractNamesFromTree(tree: any, categoryName: string) {
    // Set 用于存储唯一的 name 值
    const uniqueNames = new Set();

    // 遍历当前节点的子节点
    tree.forEach((node: any) => {
      // 将当前节点的 name 值添加到 Set 中
      uniqueNames.add(node[categoryName]);

      // 如果当前节点还有子节点，则递归调用该函数继续遍历子节点
      if (node.children) {
        const childNames = this.extractNamesFromTree(node.children, categoryName);
        childNames.forEach(name => uniqueNames.add(name));
      }
    });

    return uniqueNames;
  }

  getDimensionField() {
    return [this._spec.categoryField];
  }

  getMeasureField(): string[] {
    return [this._valueField];
  }

  getSeriesKeys(): string[] {
    if (this._seriesField) {
      const keyArray: any[] = [];
      this._nodesSeriesData?.getDataView()?.latestData.forEach((datum: { [x: string]: any }) => {
        keyArray.push(datum[this._seriesField] ?? datum.datum[this._seriesField]);
      });
      return keyArray;
    }
    return [];
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this._viewBox.set(0, 0, this._region.getLayoutRect().width, this._region.getLayoutRect().height);
    this._rawData.reRunAllTransform();
    this.getViewData().reRunAllTransform();
    this._nodesSeriesData.updateData();
    this._linksSeriesData.updateData();
  }

  getDefaultShapeType(): string {
    return 'square';
  }

  // make sure this function fast
  protected _noAnimationDataKey(datum: Datum, index: number): unknown | undefined {
    return undefined;
  }

  getActiveMarks(): IMark[] {
    return [this._nodeMark, this._linkMark];
  }
}

export const registerSankeySeries = () => {
  registerSankeyTransforms();
  Factory.registerMark(RectMark.type, RectMark);
  Factory.registerMark(LinkPathMark.type, LinkPathMark);
  Factory.registerMark(TextMark.type, TextMark);
  Factory.registerSeries(SankeySeries.type, SankeySeries);
  registerSankeyAnimation();
  registerFadeInOutAnimation();
};
