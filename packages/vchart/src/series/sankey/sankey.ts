import { CartesianSeries } from '../cartesian/cartesian';
import { SeriesTypeEnum } from '../interface';
import { MarkTypeEnum } from '../../mark/interface';
import type { IRectMark } from '../../mark/rect';
import type { ILinkPathMark } from '../../mark/linkPath';
import type { ITextMark } from '../../mark/text';
import { registerSankeyTransforms } from '@visactor/vgrammar-sankey';
import type { Datum, IRectMarkSpec, ILinkPathMarkSpec, ITextMarkSpec } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import { registerDataSetInstanceTransform, registerDataSetInstanceParser } from '../../data/register';
import type { ISankeyOpt } from '../../data/transforms/sankey';
// eslint-disable-next-line no-duplicate-imports
import { sankey } from '../../data/transforms/sankey';
import { sankeyNodes } from '../../data/transforms/sankey-nodes';
import { sankeyLinks } from '../../data/transforms/sankey-links';
import { STATE_VALUE_ENUM } from '../../compile/mark';
import { DataView, DataSet, dataViewParser } from '@visactor/vdataset';
import { DEFAULT_DATA_INDEX, LayoutZIndex, AttributeLevel, Event_Bubble_Level } from '../../constant';
import { SeriesData } from '../base/series-data';
import { addVChartProperty } from '../../data/transforms/add-property';
import { addDataKey, initKeyMap } from '../../data/transforms/data-key';
import { getDataScheme } from '../../theme/color-scheme/util';
import { SankeySeriesTooltipHelper } from './tooltip-helper';
import type { IBounds } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { Bounds } from '@visactor/vutils';
import type { ISankeyAnimationParams } from './animation';
import type { ISankeySeriesSpec } from './interface';
import type { ExtendEventParam } from '../../event/interface';
import type { IElement, IGlyphElement } from '@visactor/vgrammar';
import type { IMarkAnimateSpec } from '../../animation/spec';
import { array } from '../../util';
import { ColorOrdinalScale } from '../../scale/color-ordinal-scale';

registerSankeyTransforms();

export class SankeySeries extends CartesianSeries<any> {
  static readonly type: string = SeriesTypeEnum.sankey;
  type = SeriesTypeEnum.sankey;

  protected declare _spec: ISankeySeriesSpec;

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

    if (this._viewDataFilter) {
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
          direction: this._spec.direction,
          nodeAlign: this._spec.nodeAlign,
          nodeGap: this._spec.nodeGap,
          nodeWidth: this._spec.nodeWidth,
          linkWidth: this._spec.linkWidth,
          minStepWidth: this._spec.minStepWidth,
          minNodeHeight: this._spec.minNodeHeight,
          minLinkHeight: this._spec.minLinkHeight,
          iterations: this._spec.iterations,
          nodeKey: this._spec.nodeKey,
          linkSortBy: this._spec.linkSortBy,
          nodeSortBy: this._spec.nodeSortBy,
          setNodeLayer: this._spec.setNodeLayer
        } as ISankeyOpt
      });

      const nodesDataSet = new DataSet();
      registerDataSetInstanceParser(nodesDataSet, 'dataview', dataViewParser);
      registerDataSetInstanceTransform(nodesDataSet, 'sankeyNodes', sankeyNodes);
      registerDataSetInstanceTransform(nodesDataSet, 'addVChartProperty', addVChartProperty);
      const nodesDataView = new DataView(nodesDataSet);
      nodesDataView.parse([this.getViewData()], {
        type: 'dataview'
      });
      nodesDataView.transform({
        type: 'sankeyNodes'
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

      this._nodesSeriesData = new SeriesData(this._option, nodesDataView);

      const linksDataSet = new DataSet();
      registerDataSetInstanceParser(linksDataSet, 'dataview', dataViewParser);
      registerDataSetInstanceTransform(linksDataSet, 'sankeyLinks', sankeyLinks);
      registerDataSetInstanceTransform(linksDataSet, 'addVChartProperty', addVChartProperty);
      const linksDataView = new DataView(linksDataSet);
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

      this._linksSeriesData = new SeriesData(this._option, linksDataView);
    }
  }

  initMark(): void {
    const nodeMark = this._createMark(MarkTypeEnum.rect, 'node', {
      isSeriesMark: true,
      key: DEFAULT_DATA_INDEX,
      dataView: this._nodesSeriesData.getDataView(),
      dataProductId: this._nodesSeriesData.getProductId()
    }) as IRectMark;
    if (nodeMark) {
      nodeMark.setZIndex(this._nodeLayoutZIndex);
      this._nodeMark = nodeMark;
    }

    const linkMark = this._createMark(MarkTypeEnum.linkPath, 'link', {
      key: DEFAULT_DATA_INDEX,
      dataView: this._linksSeriesData.getDataView(),
      dataProductId: this._linksSeriesData.getProductId()
    }) as ILinkPathMark;
    if (linkMark) {
      this._linkMark = linkMark;
    }

    if (this._spec.label?.visible) {
      const labelMark = this._createMark(MarkTypeEnum.text, 'label', {
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
          return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(datum.key);
        }
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Mark
    );
    this._trigger.registerMark(nodeMark);
    this._tooltipHelper?.activeTriggerSet.mark.add(nodeMark);
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
          return this._spec.link?.style?.fill ?? this.getNodeOrdinalColorScale(datum.source);
        },
        fillOpacity: this._spec.link?.style?.fillOpacity ?? 0.15,
        direction: this._spec.direction ?? 'horizontal',
        round: this._spec.link?.style?.round ?? true,
        ratio: this._spec.link?.style?.ratio,
        align: this._spec.link?.style?.align,
        curvature: this._spec.link?.style?.curvature,
        endArrow: this._spec.link?.style?.endArrow,
        startArrow: this._spec.link?.style?.startArrow,
        backgroundStyle: this._spec.link?.style?.backgroundStyle
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
    this._trigger.registerMark(linkMark);
    this._tooltipHelper?.activeTriggerSet.mark.add(linkMark);
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
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(datum.key);
            },
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(datum.key);
            },
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(datum.key);
            },
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
              return this._spec.node?.style?.fill ?? this.getNodeOrdinalColorScale(datum.key);
            },
            text: (datum: Datum) => {
              return datum?.datum ? datum.datum[this._spec.categoryField] : '';
            },
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
    this._tooltipHelper?.activeTriggerSet.mark.add(this._labelMark);
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
          DEFAULT_MARK_ANIMATION.sankeyNode(animationParams, appearPreset),
          userAnimationConfig(this._nodeMark.name, this._spec)
        )
      );
    }
    if (this._linkMark) {
      this._linkMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.sankeyLinkPath(), userAnimationConfig(this._linkMark.name, this._spec))
      );
    }
    if (this._labelMark) {
      this._labelMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.label(), userAnimationConfig(this._labelMark.name, this._spec))
      );
    }
  }

  protected initEvent(): void {
    super.initEvent();
    if (this._spec.emphasis?.enable && this._spec.emphasis?.effect === 'adjacency') {
      if (this._spec.emphasis?.trigger === 'hover') {
        // 浮动事件
        this.event.on('pointerover', { level: Event_Bubble_Level.mark }, this._handleAdjacencyClick);
      } else {
        // this._spec.emphasis?.trigger === 'click'
        // 点击事件
        this.event.on('pointerdown', { level: Event_Bubble_Level.mark }, this._handleAdjacencyClick);
      }
    }

    if (this._spec.emphasis?.enable && this._spec.emphasis?.effect === 'related') {
      if (this._spec.emphasis?.trigger === 'hover') {
        // 浮动事件
        this.event.on('pointerover', { level: Event_Bubble_Level.mark }, this._handleRelatedClick);
      } else {
        // this._spec.emphasis?.trigger === 'click'
        // 点击事件
        this.event.on('pointerdown', { level: Event_Bubble_Level.mark }, this._handleRelatedClick);
      }
    }
  }

  protected _handleAdjacencyClick = (params: ExtendEventParam) => {
    const element = params.item;
    if (element && element.mark.id().includes('node')) {
      this._handleNodeAdjacencyClick(element);
    } else if (element && element.mark.id().includes('link')) {
      this._handleLinkAdjacencyClick(element);
    }
  };

  protected _handleRelatedClick = (params: ExtendEventParam) => {
    const element = params.item;
    if (element && element.mark.id().includes('node')) {
      this._handleNodeRelatedClick(element);
    } else if (element && element.mark.id().includes('link')) {
      this._handleLinkRelatedClick(element);
    }
  };

  protected _handleNodeAdjacencyClick = (element: IElement) => {
    const nodeDatum = element.getDatum();
    const highlightNodes: string[] = [nodeDatum.key];

    [this._linkMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

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
              .filter((entry: any) => entry.parents.some((par: any) => par.key === nodeDatum.key))
              .reduce((sum: number, d: any) => {
                return (sum += d.value);
              }, 0);
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
    });

    [this._nodeMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

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
    });

    [this._labelMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

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
    });
  };

  protected _handleLinkAdjacencyClick = (element: IGlyphElement) => {
    const curLinkDatum = element.getDatum();
    const highlightNodes: string[] = [curLinkDatum.source, curLinkDatum.target];

    [this._linkMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLinkElements = vGrammarMark.elements;

      allLinkElements.forEach(linkEl => {
        linkEl.clearStates();
        const linkDatum = linkEl.getDatum();
        const father = linkDatum?.parents ? 'parents' : 'source';
        if (
          linkDatum.source === curLinkDatum.target ||
          (array(linkDatum[father]).includes(curLinkDatum.source) &&
            array(linkDatum[father]).includes(curLinkDatum.target))
        ) {
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
              .filter((entry: any) =>
                entry.parents.some(
                  (par: any, index: number) =>
                    par.key === curLinkDatum.source && entry.parents[index + 1]?.key === curLinkDatum.target
                )
              )
              .reduce((sum: number, d: any) => {
                return (sum += d.value);
              }, 0);
            ratio = val / linkDatum.value;
          }

          linkEl.addState('selected', { ratio });
        } else if (linkEl === element) {
          // linkEl.addState('selected', { ratio: 1 });
        } else {
          linkEl.useStates(['blur']);
        }
      });
    });

    [this._nodeMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

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
    });

    [this._labelMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

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
    });
  };

  protected _handleNodeRelatedClick = (element: IElement) => {
    const nodeDatum = element.getDatum();
    const highlightNodes: string[] = [nodeDatum.key];
    const highlightLinks: string[] = [];

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

    [this._linkMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLinkElements = vGrammarMark.elements;

      allLinkElements.forEach((linkEl: IElement, i: number) => {
        linkEl.clearStates();
        if (highlightLinks.includes(linkEl.getDatum().key ?? linkEl.getDatum().index)) {
          const linkDatum = linkEl.getDatum();
          const father = linkDatum?.parents ? 'parents' : 'source';
          let ratio;
          if (father === 'parents') {
            const originalDatum = linkDatum.datum;
            const val = originalDatum
              .filter((entry: any) => entry.parents.some((par: any) => par.key === nodeDatum.key))
              .reduce((sum: number, d: any) => {
                return (sum += d.value);
              }, 0);
            ratio = val / linkDatum.value;
          }
          linkEl.addState('selected', { ratio });
        } else {
          linkEl.useStates(['blur']);
        }
      });
    });

    [this._nodeMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

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
    });

    [this._labelMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();

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
    });
  };

  protected _handleLinkRelatedClick = (element: IGlyphElement) => {
    [this._linkMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();
      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLinkElements = vGrammarMark.elements;
      allLinkElements.forEach(linkEl => {
        linkEl.clearStates();
      });
    });
    [this._nodeMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();
      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allNodeElements = vGrammarMark.elements;
      allNodeElements.forEach(el => {
        el.clearStates();
      });
    });
    [this._labelMark].forEach(mark => {
      const vGrammarMark = mark.getProduct();
      if (!vGrammarMark || !vGrammarMark.elements || !vGrammarMark.elements.length) {
        return;
      }
      const allLabelElements = vGrammarMark.elements;
      allLabelElements.forEach(el => {
        el.clearStates();
      });
    });
  };

  protected initTooltip() {
    this._tooltipHelper = new SankeySeriesTooltipHelper(this);
  }

  getNodeOrdinalColorScale(item: string) {
    const colorDomain = this._nodesSeriesData.getDataView().latestData.map((datum: Datum) => {
      return datum.key;
    });
    const colorRange =
      this._option.globalScale.color?.range() ?? getDataScheme(this._option.getTheme().colorScheme, this.type as any);
    const ordinalScale = new ColorOrdinalScale();
    ordinalScale.domain(colorDomain).range?.(colorRange);
    return ordinalScale.scale(item);
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
      this._nodesSeriesData?.getDataView().latestData.forEach((datum: { [x: string]: any }) => {
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
}
