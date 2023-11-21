import type { utilFunctionCtx } from '../typings/params';
import type { IChart } from '../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { IBaseLayout, ILayoutItem } from './interface';
import type { IPadding, IRect } from '../typings/space';
import { error } from '../util/debug';
import { layoutBottomInlineItems, layoutLeftInlineItems, layoutRightInlineItems, layoutTopInlineItems } from './util';

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

    const layoutTemp = {
      leftCurrent: this.leftCurrent,
      topCurrent: this.topCurrent,
      rightCurrent: this.rightCurrent,
      bottomCurrent: this.bottomCurrent
    };
    const regionItems = items.filter(x => x.layoutType === 'region');
    const relativeItems = items.filter(x => x.layoutType === 'region-relative');
    // 有元素开启了自动缩进
    // TODO:目前只有普通占位布局下的 region-relative 元素支持
    // 主要考虑常规元素超出画布一般为用户个性设置，而且可以设置padding规避裁剪,不需要使用自动缩进
    this.layoutRegionItems(regionItems, relativeItems);
    if (relativeItems.some(i => i.autoIndent)) {
      // check auto indent
      const { top, bottom, left, right } = this._checkAutoIndent(relativeItems);
      // 如果出现了需要自动缩进的场景 则基于缩进再次布局
      if (top || bottom || left || right) {
        // set outer bounds to padding
        this.topCurrent = layoutTemp.topCurrent + top;
        this.bottomCurrent = layoutTemp.bottomCurrent - bottom;
        this.leftCurrent = layoutTemp.leftCurrent + left;
        this.rightCurrent = layoutTemp.rightCurrent - right;
        // reLayout
        this.layoutRegionItems(regionItems, relativeItems);
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
  protected layoutRegionItems(regionItems: ILayoutItem[], regionRelativeItems: ILayoutItem[]): void {
    let regionRelativeTotalWidth = this.rightCurrent - this.leftCurrent;
    let regionRelativeTotalHeight = this.bottomCurrent - this.topCurrent;

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
    // 此时得到height
    regionRelativeTotalHeight = this.bottomCurrent - this.topCurrent;

    // region 处理
    const regionWidth = Math.min(
      regionRelativeTotalWidth,
      ...regionItems.map(region => region.maxWidth ?? Number.MAX_VALUE)
    );
    const regionHeight = Math.min(
      regionRelativeTotalHeight,
      ...regionItems.map(region => region.maxHeight ?? Number.MAX_VALUE)
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
    regionRelativeItems.forEach(item => {
      // 处理特殊元素的宽高
      if (['left', 'right'].includes(item.layoutOrient)) {
        // 用户有配置的话，已经处理过，不需要再次处理
        const relativeRegion = this.filterRegionsWithID(regionItems, item.layoutBindRegionID[0]);

        item.setLayoutRect({
          height: relativeRegion.getLayoutRect().height
        });
        item.setLayoutStartPosition({
          y: relativeRegion.getLayoutStartPoint().y + item.layoutOffsetY + item.layoutPaddingTop
        });

        if (item.layoutOrient === 'right') {
          item.setLayoutStartPosition({
            x: item.getLayoutStartPoint().x + regionWidth - regionRelativeTotalWidth
          });
        }
      } else if (['top', 'bottom'].includes(item.layoutOrient)) {
        const relativeRegion = this.filterRegionsWithID(regionItems, item.layoutBindRegionID[0]);

        item.setLayoutRect({
          width: relativeRegion.getLayoutRect().width
        });

        item.setLayoutStartPosition({
          x: relativeRegion.getLayoutStartPoint().x + item.layoutOffsetX + item.layoutPaddingLeft
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

  protected _checkAutoIndent(items: ILayoutItem[]): IPadding {
    const result = {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    };
    const rightCurrent = this._chartViewBox.x2 - this._chartViewBox.x1 - this.rightCurrent;
    const bottomCurrent = this._chartViewBox.y2 - this._chartViewBox.y1 - this.bottomCurrent;
    items.forEach(i => {
      if (!i.getModelVisible() || !i.autoIndent) {
        return;
      }
      const vOrH = i.layoutOrient === 'left' || i.layoutOrient === 'right';
      const outer = i.getLastComputeOutBounds();
      if (vOrH) {
        result.top = Math.max(result.top, outer.y1 - this.topCurrent);
        result.bottom = Math.max(result.bottom, outer.y2 - bottomCurrent);
      } else {
        result.left = Math.max(result.left, outer.x1 - this.leftCurrent);
        result.right = Math.max(result.right, outer.x2 - rightCurrent);
      }
    });
    return result;
  }
}
