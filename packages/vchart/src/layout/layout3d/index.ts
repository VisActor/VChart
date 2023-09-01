import type { IChart } from '../../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { ILayoutItem } from '../../model/interface';
import type { IRect } from '../../typings/space';
import type { IRegion } from '../../region/interface';
import type { IBaseLayout } from '../interface';
import { Layout } from '../base-layout';
import { isXAxis, isYAxis } from '../../component/axis/cartesian/util';

interface IOffset {
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
}

export class Layout3d extends Layout implements IBaseLayout {
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
    // 计算3d轴
    const absoluteItem = items.filter(x => x.layoutType === 'absolute');
    const zItems = absoluteItem.filter(i => {
      return i.layoutOrient === 'z';
    });

    // 计算z的宽高，让出一部分位置
    let extraWH = { width: 0, height: 0 };
    if (zItems.length) {
      const layoutRect = zItems[0].getLayoutRect();
      extraWH = layoutRect;
    }
    this._leftCurrent += extraWH.width / 8;
    this._rightCurrent -= extraWH.width / 8;
    this._topCurrent += extraWH.height / 8;
    this._bottomCurrent -= extraWH.height / 8;
    const offsetWH: IOffset = {
      offsetBottom: 0,
      offsetTop: 0,
      offsetLeft: 0,
      offsetRight: 0
    };

    // 有元素开启了自动缩进
    // TODO:目前只有普通占位布局下的 region-relative 元素支持
    // 主要考虑常规元素超出画布一般为用户个性设置，而且可以设置padding规避裁剪,不需要使用自动缩进
    this.layoutRegionItems(regionItems, relativeItems, offsetWH);
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

    // z轴以外的绝对定位
    const absoluteItemExceptZAxis = absoluteItem.filter(i => i.layoutOrient !== 'z');
    this.layoutAbsoluteItems(absoluteItemExceptZAxis);

    // 找到x轴
    const xAxis = relativeItems.filter(item => {
      return (item as any).specKey && (item as any).specKey === 'axes' && isXAxis(item.layoutOrient);
    })[0];
    const yAxis = relativeItems.filter(item => {
      return (item as any).specKey && (item as any).specKey === 'axes' && isYAxis(item.layoutOrient);
    })[0];
    if (xAxis && zItems.length) {
      const sp = xAxis.getLayoutStartPoint();
      const lr = xAxis.getLayoutRect();
      const zRect = {
        x: yAxis.layoutOrient === 'left' ? sp.x + lr.width : sp.x,
        y: sp.y,
        width: this._chartLayoutRect.width,
        height: this._chartLayoutRect.height
      };
      zItems[0].directionStr = yAxis.layoutOrient === 'left' ? 'r2l' : 'l2r';
      // 将长宽高信息传给所有的轴
      const xRect = xAxis.getLayoutRect();
      const yRect = yAxis.getLayoutRect();
      // const zRect = zItems[0].getLayoutRect();
      const box3d = {
        length: zItems[0].getLayoutRect().width,
        width: xRect.width,
        height: yRect.height
      };

      (xAxis as any).setLayout3dBox && (xAxis as any).setLayout3dBox(box3d);
      (yAxis as any).setLayout3dBox && (yAxis as any).setLayout3dBox(box3d);
      (zItems[0] as any).setLayout3dBox && (zItems[0] as any).setLayout3dBox(box3d);

      this.layoutZAxisItems(zItems, zRect);
    }
  }

  /**
   * 对z轴进行布局
   * @param zItems
   */
  protected layoutZAxisItems(zItems: ILayoutItem[], zRect: IRect) {
    zItems.forEach(item => {
      // 设置盒子
      item.absoluteLayoutInRect(zRect);
    });
  }

  /**
   *
   * 1. 补全 region-relative rect 和部分 layoutStartPoint
   * 2. 补全 region rect 和 layoutStartPoint
   *
   */
  protected layoutRegionItems(regionItems: IRegion[], regionRelativeItems: ILayoutItem[], extraOffset?: IOffset): void {
    let regionRelativeTotalWidth = this._rightCurrent - this._leftCurrent;
    let regionRelativeTotalHeight = this._bottomCurrent - this._topCurrent;

    if (!extraOffset) {
      extraOffset = { offsetLeft: 0, offsetRight: 0, offsetTop: 0, offsetBottom: 0 };
    }

    regionRelativeItems
      .filter(x => x.layoutOrient === 'left' || x.layoutOrient === 'right')
      .forEach(item => {
        const layoutRect = this.getItemComputeLayoutRect(item, extraOffset);
        const rect = item.computeBoundsInRect(layoutRect);
        item.setLayoutRect({ width: rect.width });
        // 减少尺寸
        if (item.layoutOrient === 'left') {
          item.setLayoutStartPosition({
            x: this._leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft + extraOffset.offsetLeft
          });
          this._leftCurrent += rect.width + item.layoutPaddingLeft + item.layoutPaddingRight + extraOffset.offsetLeft;
        } else if (item.layoutOrient === 'right') {
          this._rightCurrent -= rect.width + item.layoutPaddingLeft + item.layoutPaddingRight + extraOffset.offsetRight;
          item.setLayoutStartPosition({
            x: this._rightCurrent + item.layoutOffsetX + item.layoutPaddingLeft
          });
        }
      });

    regionRelativeTotalWidth = this._rightCurrent - this._leftCurrent;

    regionRelativeItems
      .filter(x => x.layoutOrient === 'top' || x.layoutOrient === 'bottom')
      .forEach(item => {
        const layoutRect = this.getItemComputeLayoutRect(item, extraOffset);
        const rect = item.computeBoundsInRect(layoutRect);
        item.setLayoutRect({ height: rect.height });

        // 减少尺寸
        if (item.layoutOrient === 'top') {
          item.setLayoutStartPosition({
            y: this._topCurrent + item.layoutOffsetY + item.layoutPaddingTop + extraOffset.offsetTop
          });
          this._topCurrent += rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
        } else if (item.layoutOrient === 'bottom') {
          this._bottomCurrent -=
            rect.height + item.layoutPaddingTop + item.layoutPaddingBottom + extraOffset.offsetBottom;
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
   * 工具方法 根据item属性获取给item提供的布局空间
   * @param item
   */
  protected getItemComputeLayoutRect(item: ILayoutItem, extraOffset?: IOffset) {
    if (!extraOffset) {
      extraOffset = { offsetLeft: 0, offsetRight: 0, offsetTop: 0, offsetBottom: 0 };
    }
    const result = {
      width:
        this._rightCurrent -
        this._leftCurrent -
        item.layoutPaddingLeft -
        item.layoutPaddingRight -
        (extraOffset.offsetLeft + extraOffset.offsetRight),
      height:
        this._bottomCurrent -
        this._topCurrent -
        item.layoutPaddingTop -
        item.layoutPaddingBottom -
        (extraOffset.offsetTop + extraOffset.offsetBottom)
    };
    return result;
  }
}
