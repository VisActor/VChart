import { isNil, last } from '@visactor/vutils';
import type { Layout } from './base-layout';
import type { ILayoutItem } from './interface';

function getPositionItems(items: ILayoutItem[]) {
  const startItems: ILayoutItem[] = [];
  const middleItems: ILayoutItem[] = [];
  const endItems: ILayoutItem[] = [];

  items.forEach(item => {
    if (isNil(item.getSpec().position) || item.getSpec().position === 'start') {
      startItems.push(item);
    } else if (item.getSpec().position === 'middle') {
      middleItems.push(item);
    } else if (item.getSpec().position === 'end') {
      endItems.push(item);
    }
  });

  return {
    startItems,
    endItems,
    middleItems
  };
}

function adjustItemsToCenter(allItems: ILayoutItem[][], isVertical: boolean, containerLength: number) {
  if (isVertical) {
    allItems.forEach(items => {
      const lastItem = last(items);
      const length =
        lastItem.getLayoutStartPoint().y + lastItem.getLayoutRect().height - items[0].getLayoutStartPoint().y;
      const centerY = (containerLength - length) / 2;

      items.forEach(item => {
        item.setLayoutStartPosition({
          x: item.getLayoutStartPoint().x,
          y: item.getLayoutStartPoint().y + centerY
        });
      });
    });
  } else {
    allItems.forEach(items => {
      const lastItem = last(items);
      const length =
        lastItem.getLayoutStartPoint().x + lastItem.getLayoutRect().width - items[0].getLayoutStartPoint().x;
      const centerX = (containerLength - length) / 2;

      items.forEach(item => {
        item.setLayoutStartPosition({
          x: item.getLayoutStartPoint().x + centerX,
          y: item.getLayoutStartPoint().y
        });
      });
    });
  }
}

function alignSelfOfItems(allItems: ILayoutItem[][], isVertical: boolean, maxSizes: number[], sign: number) {
  let maxSize: number;

  allItems.forEach((lineItems: ILayoutItem[], index: number) => {
    if (lineItems.length > 1) {
      maxSize = maxSizes[index];

      lineItems.forEach(item => {
        if (!item.alignSelf || item.alignSelf === 'start') {
          return;
        }

        const pos = item.getLayoutStartPoint();
        const ratio = item.alignSelf === 'middle' ? 0.5 : 1;
        const delta = isVertical
          ? maxSize - (item.getLayoutRect().width + item.layoutPaddingLeft + item.layoutPaddingRight)
          : maxSize - (item.getLayoutRect().height + item.layoutPaddingTop + item.layoutPaddingBottom);

        if (isVertical) {
          item.setLayoutStartPosition({
            x: pos.x + sign * delta * ratio,
            y: pos.y
          });
        } else {
          item.setLayoutStartPosition({
            x: pos.x,
            y: pos.y + sign * delta * ratio
          });
        }
      });
    }
  });
}

function layoutLeftRightStartOrMiddleItems(
  items: ILayoutItem[],
  layout: Layout,
  limitHeight: number,
  isMiddle: boolean,
  position: 'left' | 'right'
) {
  if (items.length) {
    let maxWidth = 0;
    const isRight = position === 'right';
    const xSign = isRight ? -1 : 1;
    let preX = isRight ? layout.rightCurrent : layout.leftCurrent;
    let preTop = layout.topCurrent;

    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    const maxWidths: number[] = [];
    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      const itemOffsetX = isRight ? -rect.width - item.layoutPaddingRight : item.layoutPaddingLeft;
      item.setLayoutStartPosition({
        x: preX + item.layoutOffsetX + itemOffsetX,
        y: preTop + item.layoutOffsetY + item.layoutPaddingTop
      });

      preTop += itemTotalHeight;
      if (preTop > limitHeight && singleLineItems.length) {
        maxWidths.push(maxWidth);
        preX += xSign * maxWidth;
        maxWidth = itemTotalWidth;
        preTop = layout.topCurrent + itemTotalHeight;

        item.setLayoutStartPosition({
          x: preX + item.layoutOffsetX + itemOffsetX,
          y: layout.topCurrent + item.layoutOffsetY + item.layoutPaddingTop
        });
        allItems.push(singleLineItems);
        singleLineItems = [item];
      } else {
        maxWidth = Math.max(maxWidth, itemTotalWidth);
        singleLineItems.push(item);
      }
    });
    maxWidths.push(maxWidth);
    allItems.push(singleLineItems);

    alignSelfOfItems(allItems, true, maxWidths, xSign);

    if (isMiddle) {
      adjustItemsToCenter(allItems, true, limitHeight);
    }

    if (isRight) {
      layout.rightCurrent = preX + xSign * maxWidth;
    } else {
      layout.leftCurrent = preX + xSign * maxWidth;
    }
  }
}

function layoutLeftRightEndItems(items: ILayoutItem[], layout: Layout, limitWidth: number, position: 'left' | 'right') {
  if (items.length) {
    let maxWidth = 0;
    const isRight = position === 'right';
    const xSign = isRight ? -1 : 1;
    let preX = isRight ? layout.rightCurrent : layout.leftCurrent;
    let preBottom = layout.bottomCurrent;

    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    const maxWidths: number[] = [];
    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      const itemOffsetX = isRight ? -rect.width - item.layoutPaddingRight : item.layoutPaddingLeft;

      if (preBottom < itemTotalHeight && singleLineItems.length) {
        maxWidths.push(maxWidth);
        preX += xSign * maxWidth;
        maxWidth = itemTotalWidth;
        preBottom = layout.bottomCurrent;

        item.setLayoutStartPosition({
          x: preX + item.layoutOffsetX + itemOffsetX,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        allItems.push(singleLineItems);
        singleLineItems = [item];
      } else {
        item.setLayoutStartPosition({
          x: preX + item.layoutOffsetX + itemOffsetX,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        maxWidth = Math.max(maxWidth, itemTotalWidth);
        preBottom -= itemTotalHeight;
        singleLineItems.push(item);
      }
    });
    maxWidths.push(maxWidth);
    allItems.push(singleLineItems);

    alignSelfOfItems(allItems, true, maxWidths, xSign);

    if (isRight) {
      layout.rightCurrent = preX + xSign * maxWidth;
    } else {
      layout.leftCurrent = preX + xSign * maxWidth;
    }
  }
}

function layoutTopBottomStartOrMiddleItems(
  items: ILayoutItem[],
  layout: Layout,
  limitWidth: number,
  isMiddle: boolean,
  position: 'top' | 'bottom'
) {
  if (items.length) {
    const isTop = position === 'top';
    const ySign = isTop ? 1 : -1;
    let maxHeight = 0;
    let preLeft = layout.leftCurrent;
    let preY = isTop ? layout.topCurrent : layout.bottomCurrent;
    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    const maxHeights: number[] = [];

    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      const itemOffsetY = isTop ? item.layoutPaddingTop : -rect.height - item.layoutPaddingBottom;
      item.setLayoutStartPosition({
        x: preLeft + item.layoutOffsetX + item.layoutPaddingLeft,
        y: preY + item.layoutOffsetY + itemOffsetY
      });

      preLeft += itemTotalWidth;
      if (preLeft > limitWidth && singleLineItems.length) {
        maxHeights.push(maxHeight);
        preLeft = layout.leftCurrent + itemTotalWidth;
        preY += ySign * maxHeight;
        maxHeight = itemTotalHeight;
        item.setLayoutStartPosition({
          x: layout.leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft,
          y: preY + item.layoutOffsetY + itemOffsetY
        });
        allItems.push(singleLineItems);
        singleLineItems = [item];
      } else {
        maxHeight = Math.max(maxHeight, itemTotalHeight);
        singleLineItems.push(item);
      }
    });
    maxHeights.push(maxHeight);
    allItems.push(singleLineItems);

    alignSelfOfItems(allItems, false, maxHeights, ySign);

    if (isMiddle) {
      adjustItemsToCenter(allItems, false, limitWidth);
    }

    if (isTop) {
      layout.topCurrent = preY + ySign * maxHeight;
    } else {
      layout.bottomCurrent = preY + ySign * maxHeight;
    }
  }
}

function layoutTopBottomEndItems(items: ILayoutItem[], layout: Layout, limitWidth: number, position: 'top' | 'bottom') {
  if (items.length) {
    const isTop = position === 'top';
    const ySign = isTop ? 1 : -1;
    let maxHeight = 0;
    let preRight = layout.rightCurrent;
    let preY = isTop ? layout.topCurrent : layout.bottomCurrent;

    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    const maxHeights: number[] = [];

    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      const itemOffsetY = isTop ? item.layoutPaddingTop : -rect.height - item.layoutPaddingBottom;

      if (preRight < itemTotalWidth && singleLineItems.length) {
        preRight = layout.rightCurrent;
        preY += ySign * maxHeight;
        maxHeight = itemTotalHeight;

        item.setLayoutStartPosition({
          x: layout.rightCurrent + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preY + item.layoutOffsetY + itemOffsetY
        });
        allItems.push(singleLineItems);
        singleLineItems = [item];
      } else {
        singleLineItems.push(item);
        item.setLayoutStartPosition({
          x: preRight + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preY + item.layoutOffsetY + itemOffsetY
        });
        maxHeight = Math.max(maxHeight, itemTotalHeight);
        preRight -= itemTotalWidth;
      }
    });
    maxHeights.push(maxHeight);
    allItems.push(singleLineItems);

    alignSelfOfItems(allItems, false, maxHeights, ySign);

    if (isTop) {
      layout.topCurrent = preY + ySign * maxHeight;
    } else {
      layout.bottomCurrent = preY + ySign * maxHeight;
    }
  }
}

export function layoutLeftInlineItems(items: ILayoutItem[], layout: Layout, limitHeight: number) {
  const { startItems, middleItems, endItems } = getPositionItems(items);
  if (startItems.length) {
    layoutLeftRightStartOrMiddleItems(startItems, layout, limitHeight, false, 'left');
  }

  if (middleItems.length) {
    layoutLeftRightStartOrMiddleItems(middleItems, layout, limitHeight, true, 'left');
  }

  if (endItems.length) {
    layoutLeftRightEndItems(endItems, layout, limitHeight, 'left');
  }
}

export function layoutRightInlineItems(items: ILayoutItem[], layout: Layout, limitHeight: number) {
  const { startItems, middleItems, endItems } = getPositionItems(items);

  if (startItems.length) {
    layoutLeftRightStartOrMiddleItems(startItems, layout, limitHeight, false, 'right');
  }

  if (middleItems.length) {
    layoutLeftRightStartOrMiddleItems(middleItems, layout, limitHeight, true, 'right');
  }

  if (endItems.length) {
    layoutLeftRightEndItems(endItems, layout, limitHeight, 'right');
  }
}

export function layoutTopInlineItems(items: ILayoutItem[], layout: Layout, limitWidth: number) {
  const { startItems, middleItems, endItems } = getPositionItems(items);

  if (startItems.length) {
    layoutTopBottomStartOrMiddleItems(startItems, layout, limitWidth, false, 'top');
  }

  if (middleItems.length) {
    layoutTopBottomStartOrMiddleItems(middleItems, layout, limitWidth, true, 'top');
  }

  if (endItems.length) {
    layoutTopBottomEndItems(endItems, layout, limitWidth, 'top');
  }
}

export function layoutBottomInlineItems(items: ILayoutItem[], layout: Layout, limitWidth: number) {
  const { startItems, middleItems, endItems } = getPositionItems(items);

  if (startItems.length) {
    layoutTopBottomStartOrMiddleItems(startItems, layout, limitWidth, false, 'bottom');
  }

  if (middleItems.length) {
    layoutTopBottomStartOrMiddleItems(middleItems, layout, limitWidth, true, 'bottom');
  }

  if (endItems.length) {
    layoutTopBottomEndItems(endItems, layout, limitWidth, 'bottom');
  }
}
