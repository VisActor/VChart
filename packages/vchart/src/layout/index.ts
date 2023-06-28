import type { IChart } from '../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { ILayoutItem } from '../model/interface';
import type { IBaseLayout } from './interface';
import type { IPadding, IRect } from '../typings/space';
import type { IRegion } from '../region/interface';

export class Layout implements IBaseLayout {
  protected _leftCurrent: number = 0;
  protected _topCurrent: number = 0;
  protected _rightCurrent: number = 0;
  protected _bottomCurrent: number = 0;

  _chartLayoutRect!: IRect;
  _chartViewBox!: IBoundsLike;

  layoutItems(_chart: IChart, items: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike): void {
    this._chartLayoutRect = chartLayoutRect;
    this._chartViewBox = chartViewBox;
    this._leftCurrent = chartLayoutRect.x;
    this._topCurrent = chartLayoutRect.y;
    this._rightCurrent = chartLayoutRect.x + chartLayoutRect.width;
    this._bottomCurrent = chartLayoutRect.height + chartLayoutRect.y;

    // 越大越先处理，进行排序调整，利用原地排序特性，排序会受 level 和传进来的数组顺序共同影响
    items.sort((a, b) => b.layoutLevel - a.layoutLevel);

    this.layoutNormalItems(items.filter(x => x.layoutType === 'normal'));

    const layoutTemp = {
      _leftCurrent: this._leftCurrent,
      _topCurrent: this._topCurrent,
      _rightCurrent: this._rightCurrent,
      _bottomCurrent: this._bottomCurrent
    };
    const regionItems = items.filter(x => x.layoutType === 'region') as IRegion[];
    const relativeItems = items.filter(x => x.layoutType === 'region-relative');
    // 有元素开启了自动缩进
    // TODO:目前只有普通占位布局下的 region-relative 元素支持
    // 主要考虑常规元素超出画布一般为用户个性设置，而且可以设置padding规避裁剪,不需要使用自动缩进
    this.layoutRegionItems(regionItems, relativeItems);
    if (relativeItems.some(i => i.getAutoIndent())) {
      // check auto indent
      const { top, bottom, left, right } = this._checkAutoIndent(relativeItems);
      // 如果出现了需要自动缩进的场景 则基于缩进再次布局
      if (top || bottom || left || right) {
        // set outer bounds to padding
        this._topCurrent = layoutTemp._topCurrent + top;
        this._bottomCurrent = layoutTemp._bottomCurrent - bottom;
        this._leftCurrent = layoutTemp._leftCurrent + left;
        this._rightCurrent = layoutTemp._rightCurrent - right;
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
          x: this._leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft,
          y: this._topCurrent + item.layoutOffsetY + item.layoutPaddingTop
        });
        this._leftCurrent += rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      } else if (item.layoutOrient === 'top') {
        item.setLayoutStartPosition({
          x: this._leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft,
          y: this._topCurrent + item.layoutOffsetY + item.layoutPaddingTop
        });
        this._topCurrent += rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      } else if (item.layoutOrient === 'right') {
        item.setLayoutStartPosition({
          x: this._rightCurrent + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: this._topCurrent + item.layoutOffsetY + item.layoutPaddingTop
        });
        this._rightCurrent -= rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      } else if (item.layoutOrient === 'bottom') {
        item.setLayoutStartPosition({
          x: this._leftCurrent + item.layoutOffsetX + item.layoutPaddingRight,
          y: this._bottomCurrent + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        this._bottomCurrent -= rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      }
    });
  }

  /**
   *
   * 1. 补全 region-relative rect 和部分 layoutStartPoint
   * 2. 补全 region rect 和 layoutStartPoint
   *
   */
  protected layoutRegionItems(regionItems: IRegion[], regionRelativeItems: ILayoutItem[]): void {
    let regionRelativeTotalWidth = this._rightCurrent - this._leftCurrent;
    let regionRelativeTotalHeight = this._bottomCurrent - this._topCurrent;

    regionRelativeItems
      .filter(x => x.layoutOrient === 'left' || x.layoutOrient === 'right')
      .forEach(item => {
        const layoutRect = this.getItemComputeLayoutRect(item);
        const rect = item.computeBoundsInRect(layoutRect);
        item.setLayoutRect({ width: rect.width });
        // 减少尺寸
        if (item.layoutOrient === 'left') {
          item.setLayoutStartPosition({
            x: this._leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
          this._leftCurrent += rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
        } else if (item.layoutOrient === 'right') {
          this._rightCurrent -= rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
          item.setLayoutStartPosition({
            x: this._rightCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
        }
      });

    regionRelativeTotalWidth = this._rightCurrent - this._leftCurrent;

    regionRelativeItems
      .filter(x => x.layoutOrient === 'top' || x.layoutOrient === 'bottom')
      .forEach(item => {
        const layoutRect = this.getItemComputeLayoutRect(item);
        const rect = item.computeBoundsInRect(layoutRect);
        item.setLayoutRect({ height: rect.height });

        // 减少尺寸
        if (item.layoutOrient === 'top') {
          item.setLayoutStartPosition({
            y: this._topCurrent + item.layoutOffsetY + item.layoutPaddingTop
          });
          this._topCurrent += rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
        } else if (item.layoutOrient === 'bottom') {
          this._bottomCurrent -= rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
          item.setLayoutStartPosition({
            y: this._bottomCurrent + item.layoutOffsetY + item.layoutPaddingTop
          });
        }
      });
    // 此时得到height
    regionRelativeTotalHeight = this._bottomCurrent - this._topCurrent;

    // region 处理
    regionItems.forEach(region => {
      region.setLayoutRect({
        width: regionRelativeTotalWidth,
        height: regionRelativeTotalHeight
      });

      region.setLayoutStartPosition({
        x: this._leftCurrent + region.layoutOffsetX + region.layoutPaddingLeft,
        y: this._topCurrent + region.layoutOffsetY + region.layoutPaddingTop
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
      } else if (['top', 'bottom'].includes(item.layoutOrient)) {
        const relativeRegion = this.filterRegionsWithID(regionItems, item.layoutBindRegionID[0]);

        item.setLayoutRect({
          width: relativeRegion.getLayoutRect().width
        });

        item.setLayoutStartPosition({
          x: relativeRegion.getLayoutStartPoint().x + item.layoutOffsetX + item.layoutPaddingLeft
        });
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
  filterRegionsWithID(regions: IRegion[], id: number): ILayoutItem {
    const target = regions.find(x => x.id === id);
    if (!target) {
      throw Error('can not find target region item, invalid id');
    }
    return target;
  }

  /**
   * 工具方法 根据item属性获取给item提供的布局空间
   * @param item
   */
  protected getItemComputeLayoutRect(item: ILayoutItem) {
    const result = {
      width: this._rightCurrent - this._leftCurrent - item.layoutPaddingLeft - item.layoutPaddingRight,
      height: this._bottomCurrent - this._topCurrent - item.layoutPaddingTop - item.layoutPaddingBottom
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
    const rightCurrent = this._chartViewBox.x2 - this._chartViewBox.x1 - this._rightCurrent;
    const bottomCurrent = this._chartViewBox.y2 - this._chartViewBox.y1 - this._bottomCurrent;
    items.filter;
    items.forEach(i => {
      if (!i.getAutoIndent()) {
        return;
      }
      const vOrH = i.layoutOrient === 'left' || i.layoutOrient === 'right';
      const outer = i.getLastComputeOutBounds();
      if (vOrH) {
        result.top = Math.max(result.top, outer.y1 - this._topCurrent);
        result.bottom = Math.max(result.bottom, outer.y2 - bottomCurrent);
      } else {
        result.left = Math.max(result.left, outer.x1 - this._leftCurrent);
        result.right = Math.max(result.right, outer.x2 - rightCurrent);
      }
    });
    return result;
  }
}
