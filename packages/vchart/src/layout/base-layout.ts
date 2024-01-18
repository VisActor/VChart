import type { utilFunctionCtx } from '../typings/params';
import type { IChart } from '../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { IBaseLayout, ILayoutItem } from './interface';
import type { IOrientType, IPadding, IRect } from '../typings/space';
import { error } from '../util/debug';
import { layoutBottomInlineItems, layoutLeftInlineItems, layoutRightInlineItems, layoutTopInlineItems } from './util';
import type { ILayoutRect } from '../typings/layout';

type LayoutSideType = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

type overlapInfo = {
  items: ILayoutItem[];
  rect: ILayoutRect;
};

export class Layout implements IBaseLayout {
  static type = 'base';

  leftCurrent: number = 0;
  topCurrent: number = 0;
  rightCurrent: number = 0;
  bottomCurrent: number = 0;

  _chartLayoutRect!: IRect;
  _chartViewBox!: IBoundsLike;

  protected _onError: (msg: string) => void;

  constructor(_spec?: unknown, ctx?: utilFunctionCtx) {
    this._onError = ctx?.onError;
  }

  layoutItems(_chart: IChart, items: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike): void {
    this._chartLayoutRect = chartLayoutRect;
    this._chartViewBox = chartViewBox;
    this.leftCurrent = chartLayoutRect.x;
    this.topCurrent = chartLayoutRect.y;
    this.rightCurrent = chartLayoutRect.x + chartLayoutRect.width;
    this.bottomCurrent = chartLayoutRect.height + chartLayoutRect.y;
    // 越大越先处理，进行排序调整，利用原地排序特性，排序会受 level 和传进来的数组顺序共同影响
    items.sort((a, b) => b.layoutLevel - a.layoutLevel);

    this.layoutNormalInlineItems(items.filter(x => x.layoutType === 'normal-inline'));
    this.layoutNormalItems(items.filter(x => x.layoutType === 'normal'));

    const layoutTemp: LayoutSideType = {
      left: this.leftCurrent,
      top: this.topCurrent,
      right: this.rightCurrent,
      bottom: this.bottomCurrent
    };
    const regionItems = items.filter(x => x.layoutType === 'region');
    const relativeItems = items.filter(x => x.layoutType === 'region-relative');
    const relativeOverlapItems = items.filter(x => x.layoutType === 'region-relative-overlap');
    // 有元素开启了自动缩进
    // TODO:目前只有普通占位布局下的 region-relative 元素支持
    // 主要考虑常规元素超出画布一般为用户个性设置，而且可以设置padding规避裁剪,不需要使用自动缩进
    this.layoutRegionItems(regionItems, relativeItems, relativeOverlapItems);
    if (relativeItems.some(i => i.autoIndent)) {
      // check auto indent
      const { top, bottom, left, right } = this._checkAutoIndent(relativeItems, layoutTemp);
      // 如果出现了需要自动缩进的场景 则基于缩进再次布局
      if (top || bottom || left || right) {
        // set outer bounds to padding
        this.topCurrent = layoutTemp.top + top;
        this.bottomCurrent = layoutTemp.bottom - bottom;
        this.leftCurrent = layoutTemp.left + left;
        this.rightCurrent = layoutTemp.right - right;
        // reLayout
        this.layoutRegionItems(regionItems, relativeItems, relativeOverlapItems);
      }
    }

    this.layoutAbsoluteItems(items.filter(x => x.layoutType === 'absolute'));
  }

  protected layoutNormalItems(normalItems: ILayoutItem[]): void {
    normalItems.forEach(item => {
      const layoutRect = this.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);

      if (item.layoutOrient === 'left') {
        item.setLayoutStartPosition({
          x: this.leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft,
          y: this.topCurrent + item.layoutOffsetY + item.layoutPaddingTop
        });
        this.leftCurrent += rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      } else if (item.layoutOrient === 'top') {
        item.setLayoutStartPosition({
          x: this.leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft,
          y: this.topCurrent + item.layoutOffsetY + item.layoutPaddingTop
        });
        this.topCurrent += rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      } else if (item.layoutOrient === 'right') {
        item.setLayoutStartPosition({
          x: this.rightCurrent + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: this.topCurrent + item.layoutOffsetY + item.layoutPaddingTop
        });
        this.rightCurrent -= rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      } else if (item.layoutOrient === 'bottom') {
        item.setLayoutStartPosition({
          x: this.leftCurrent + item.layoutOffsetX + item.layoutPaddingRight,
          y: this.bottomCurrent + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        this.bottomCurrent -= rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      }
    });
  }

  protected layoutNormalInlineItems(normalItems: ILayoutItem[]): void {
    const leftItems = normalItems.filter(item => item.layoutOrient === 'left');
    const rightItems = normalItems.filter(item => item.layoutOrient === 'right');
    const topItems = normalItems.filter(item => item.layoutOrient === 'top');
    const bottomItems = normalItems.filter(item => item.layoutOrient === 'bottom');
    const limitWidth = this._chartLayoutRect.width + this._chartLayoutRect.x;
    const limitHeight = this._chartLayoutRect.height + this._chartLayoutRect.y;

    // 同 normal，按照 left、top、right、bottom 的顺序进行布局
    // 各个方向上再按照 position 进行分组布局，顺序为 start middle end
    layoutLeftInlineItems(leftItems, this, limitHeight);
    layoutTopInlineItems(topItems, this, limitWidth);
    layoutRightInlineItems(rightItems, this, limitHeight);
    layoutBottomInlineItems(bottomItems, this, limitWidth);
  }

  /**
   *
   * 1. 补全 region-relative rect 和部分 layoutStartPoint
   * 2. 补全 region rect 和 layoutStartPoint
   *
   */
  protected layoutRegionItems(
    regionItems: ILayoutItem[],
    regionRelativeItems: ILayoutItem[],
    regionRelativeOverlapItems: ILayoutItem[]
  ): void {
    let regionRelativeTotalWidth = this.rightCurrent - this.leftCurrent;
    let regionRelativeTotalHeight = this.bottomCurrent - this.topCurrent;

    // 允许重叠元素 ，目前允许重叠元素认为是紧贴region的。最后布局
    const overlapItems: {
      [key in IOrientType]: overlapInfo;
    } = {
      left: { items: [], rect: { width: 0, height: 0 } },
      right: { items: [], rect: { width: 0, height: 0 } },
      top: { items: [], rect: { width: 0, height: 0 } },
      bottom: { items: [], rect: { width: 0, height: 0 } },
      z: { items: [], rect: { width: 0, height: 0 } }
    };
    regionRelativeOverlapItems.forEach(i => {
      overlapItems[i.layoutOrient].items.push(i);
    });

    regionRelativeItems
      .filter(x => x.layoutOrient === 'left' || x.layoutOrient === 'right')
      .forEach(item => {
        const layoutRect = this.getItemComputeLayoutRect(item);
        const rect = item.computeBoundsInRect(layoutRect);
        item.setLayoutRect({ width: rect.width });
        // 减少尺寸
        if (item.layoutOrient === 'left') {
          item.setLayoutStartPosition({
            x: this.leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
          this.leftCurrent += rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
        } else if (item.layoutOrient === 'right') {
          this.rightCurrent -= rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
          item.setLayoutStartPosition({
            x: this.rightCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
        }
      });

    ['left', 'right'].forEach(orient => {
      const info = overlapItems[orient];
      // 得到 max rect
      info.items.forEach((item: ILayoutItem) => {
        const layoutRect = this.getItemComputeLayoutRect(item);
        const rect = item.computeBoundsInRect(layoutRect);
        info.rect.width = Math.max(rect.width, info.rect.width);
        info.rect.height = Math.max(rect.height, info.rect.height);
      });

      // 统一设置rect和pos
      info.items.forEach((item: ILayoutItem) => {
        item.setLayoutRect(info.rect);
        if (orient === 'left') {
          item.setLayoutStartPosition({
            x: this.leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
        } else {
          item.setLayoutStartPosition({
            x: this.rightCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
        }
      });

      if (orient === 'left') {
        this.leftCurrent += info.rect.width;
      } else {
        this.rightCurrent -= info.rect.width;
      }
    });

    regionRelativeTotalWidth = this.rightCurrent - this.leftCurrent;

    regionRelativeItems
      .filter(x => x.layoutOrient === 'top' || x.layoutOrient === 'bottom')
      .forEach(item => {
        const layoutRect = this.getItemComputeLayoutRect(item);
        const rect = item.computeBoundsInRect(layoutRect);
        item.setLayoutRect({ height: rect.height });

        // 减少尺寸
        if (item.layoutOrient === 'top') {
          item.setLayoutStartPosition({
            y: this.topCurrent + item.layoutOffsetY + item.layoutPaddingTop
          });
          this.topCurrent += rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
        } else if (item.layoutOrient === 'bottom') {
          this.bottomCurrent -= rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
          item.setLayoutStartPosition({
            y: this.bottomCurrent + item.layoutOffsetY + item.layoutPaddingTop
          });
        }
      });

    ['top', 'bottom'].forEach(orient => {
      const info = overlapItems[orient];
      // 得到 max rect
      info.items.forEach((item: ILayoutItem) => {
        const layoutRect = this.getItemComputeLayoutRect(item);
        const rect = item.computeBoundsInRect(layoutRect);
        info.rect.width = Math.max(rect.width, info.rect.width);
        info.rect.height = Math.max(rect.height, info.rect.height);
      });

      // 统一设置rect和pos
      info.items.forEach((item: ILayoutItem) => {
        item.setLayoutRect(info.rect);
        if (orient === 'top') {
          item.setLayoutStartPosition({
            x: this.topCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
        } else {
          item.setLayoutStartPosition({
            x: this.bottomCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
        }
      });

      if (orient === 'left') {
        this.topCurrent += info.rect.height;
      } else {
        this.bottomCurrent -= info.rect.height;
      }
    });

    // 此时得到height
    regionRelativeTotalHeight = this.bottomCurrent - this.topCurrent;

    // region 处理
    const regionWidth = Math.max(
      Math.min(regionRelativeTotalWidth, ...regionItems.map(region => region.maxWidth ?? Number.MAX_VALUE)),
      0
    );
    const regionHeight = Math.max(
      Math.min(regionRelativeTotalHeight, ...regionItems.map(region => region.maxHeight ?? Number.MAX_VALUE)),
      0
    );
    regionItems.forEach(region => {
      region.setLayoutRect({
        width: regionWidth,
        height: regionHeight
      });

      region.setLayoutStartPosition({
        x: this.leftCurrent + region.layoutOffsetX + region.layoutPaddingLeft,
        y: this.topCurrent + region.layoutOffsetY + region.layoutPaddingTop
      });
    });

    // region-relative 特殊处理
    regionRelativeItems.concat(regionRelativeOverlapItems).forEach(item => {
      // 处理特殊元素的宽高
      if (['left', 'right'].includes(item.layoutOrient)) {
        // 用户有配置的话，已经处理过，不需要再次处理
        const relativeRegion = this.filterRegionsWithID(regionItems, item.layoutBindRegionID[0]);

        item.setLayoutRect({
          height: relativeRegion.layoutExcludeIndent.height
        });
        item.setLayoutStartPosition({
          y: relativeRegion.layoutExcludeIndent.y + item.layoutOffsetY + item.layoutPaddingTop
        });

        if (item.layoutOrient === 'right') {
          item.setLayoutStartPosition({
            x: item.getLayoutStartPoint().x + regionWidth - regionRelativeTotalWidth
          });
        }
      } else if (['top', 'bottom'].includes(item.layoutOrient)) {
        const relativeRegion = this.filterRegionsWithID(regionItems, item.layoutBindRegionID[0]);

        item.setLayoutRect({
          width: relativeRegion.layoutExcludeIndent.width
        });

        item.setLayoutStartPosition({
          x: relativeRegion.layoutExcludeIndent.x + item.layoutOffsetX + item.layoutPaddingLeft
        });

        if (item.layoutOrient === 'bottom') {
          item.setLayoutStartPosition({
            y: item.getLayoutStartPoint().y + regionHeight - regionRelativeTotalHeight
          });
        }
      }
    });
  }

  /**
   * 再找出对 absolute 元素，无需排序，在 compiler 层需要排序放置
   *
   * 重要：absolute 默认依据 region 进行相对依赖
   */
  protected layoutAbsoluteItems(absoluteItems: ILayoutItem[]) {
    absoluteItems.forEach(item => {
      // 设置盒子
      item.absoluteLayoutInRect(this._chartLayoutRect);
    });
  }

  // 对普通布局来说，只出一个 region 绑定
  filterRegionsWithID(items: ILayoutItem[], id: number): ILayoutItem {
    const target = items.find(x => x.getModelId() === id);
    if (!target) {
      (this._onError ?? error)('can not find target region item, invalid id');
    }
    return target as ILayoutItem;
  }

  /**
   * 工具方法 根据item属性获取给item提供的布局空间
   * @param item
   */
  getItemComputeLayoutRect(item: ILayoutItem) {
    const result = {
      width: this.rightCurrent - this.leftCurrent - item.layoutPaddingLeft - item.layoutPaddingRight,
      height: this.bottomCurrent - this.topCurrent - item.layoutPaddingTop - item.layoutPaddingBottom
    };
    return result;
  }

  protected _checkAutoIndent(
    items: ILayoutItem[],
    layoutTemp: {
      top: number;
      left: number;
      bottom: number;
      right: number;
    }
  ): IPadding {
    const result = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    };
    items.forEach(i => {
      if (!i.getModelVisible() || !i.autoIndent) {
        return;
      }
      const vOrH = i.layoutOrient === 'left' || i.layoutOrient === 'right';
      const itemOuter = i.getLastComputeOutBounds();
      const outer = this._getOutInLayout(itemOuter, i, layoutTemp);
      if (vOrH) {
        result.top = Math.max(result.top, outer.top);
        result.bottom = Math.max(result.bottom, outer.bottom);
      } else {
        result.left = Math.max(result.left, outer.left);
        result.right = Math.max(result.right, outer.right);
      }
    });
    return result;
  }

  private _getOutInLayout(itemOuter: IBoundsLike, i: ILayoutItem, tempBorder: LayoutSideType): LayoutSideType {
    const { x, y } = i.getLayoutStartPoint();
    const { width, height } = i.getLayoutRect();

    const result: LayoutSideType = {
      left: tempBorder.left - (x - itemOuter.x1),
      right: x + width + itemOuter.x2 - tempBorder.right,
      top: tempBorder.top - (y - itemOuter.y1),
      bottom: y + height + itemOuter.y2 - tempBorder.bottom
    };
    return result;
  }
}
