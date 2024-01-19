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

      maxWidth = Math.max(maxWidth, itemTotalWidth);
      preTop += itemTotalHeight;
      if (preTop > limitHeight && singleLineItems.length) {
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
        singleLineItems.push(item);
      }
    });
    allItems.push(singleLineItems);

    if (isMiddle) {
      adjustItemsToCenter(allItems, true, limitHeight);
    }

    layout.rightCurrent = preX + xSign * maxWidth;
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

      maxHeight = Math.max(maxHeight, itemTotalHeight);
      preLeft += itemTotalWidth;
      if (preLeft > limitWidth && singleLineItems.length) {
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
        singleLineItems.push(item);
      }
    });
    allItems.push(singleLineItems);
    if (isMiddle) {
      adjustItemsToCenter(allItems, false, limitWidth);
    }

    layout.topCurrent = preLeft + ySign * maxHeight;
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
    let maxWidth = 0;
    let preLeft = layout.leftCurrent;
    let preBottom = layout.bottomCurrent;
    endItems.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;

      if (preBottom < itemTotalHeight) {
        preLeft += maxWidth;
        maxWidth = itemTotalWidth;
        preBottom = layout.bottomCurrent;
        item.setLayoutStartPosition({
          x: preLeft + item.layoutOffsetX + item.layoutPaddingLeft,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
      } else {
        item.setLayoutStartPosition({
          x: preLeft + item.layoutOffsetX + item.layoutPaddingLeft,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        maxWidth = Math.max(maxWidth, itemTotalWidth);
        preBottom -= itemTotalHeight;
      }
    });
    layout.leftCurrent = preLeft + maxWidth;
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
    let maxWidth = 0;
    let preRight = layout.rightCurrent;
    let preBottom = layout.bottomCurrent;
    endItems.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      if (preBottom < itemTotalHeight) {
        preRight -= maxWidth;
        maxWidth = itemTotalWidth;
        preBottom = layout.bottomCurrent;
        item.setLayoutStartPosition({
          x: preRight + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
      } else {
        item.setLayoutStartPosition({
          x: preRight + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        maxWidth = Math.max(maxWidth, itemTotalWidth);
        preBottom -= itemTotalHeight;
      }
    });
    layout.rightCurrent = preRight - maxWidth;
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
    let maxHeight = 0;

    let preTop = layout.topCurrent;
    let preRight = layout.rightCurrent;
    endItems.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      if (preRight < itemTotalWidth) {
        preRight = layout.rightCurrent;
        preTop += maxHeight;
        maxHeight = itemTotalHeight;

        item.setLayoutStartPosition({
          x: layout.rightCurrent + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preTop + item.layoutOffsetY + item.layoutPaddingTop
        });
      } else {
        item.setLayoutStartPosition({
          x: preRight + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preTop + item.layoutOffsetY + item.layoutPaddingTop
        });
        maxHeight = Math.max(maxHeight, itemTotalHeight);
        preRight -= itemTotalWidth;
      }
    });
    layout.topCurrent = preTop + maxHeight;
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
    let maxHeight = 0;
    let preBottom = layout.bottomCurrent;
    let preRight = layout.rightCurrent;
    // 末尾的，从右往左布局
    endItems.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      if (preRight < itemTotalWidth) {
        preRight = layout.rightCurrent;
        preBottom -= maxHeight;
        maxHeight = itemTotalHeight;

        item.setLayoutStartPosition({
          x: layout.rightCurrent + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
      } else {
        item.setLayoutStartPosition({
          x: preRight + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        maxHeight = Math.max(maxHeight, itemTotalHeight);
        preRight -= itemTotalWidth;
      }
    });
    layout.bottomCurrent = preBottom - maxHeight;
  }
}
