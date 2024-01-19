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

function layoutRightStartOrMiddleItems(items: ILayoutItem[], layout: Layout, limitHeight: number, isMiddle: boolean) {
  if (items.length) {
    let maxWidth = 0;
    let preRight = layout.rightCurrent;
    let preTop = layout.topCurrent;

    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      item.setLayoutStartPosition({
        x: preRight + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
        y: preTop + item.layoutOffsetY + item.layoutPaddingTop
      });

      maxWidth = Math.max(maxWidth, itemTotalWidth);
      preTop += itemTotalHeight;
      if (preTop > limitHeight && singleLineItems.length) {
        preRight -= maxWidth;
        maxWidth = itemTotalWidth;
        preTop = layout.topCurrent + itemTotalHeight;

        item.setLayoutStartPosition({
          x: preRight + item.layoutOffsetX - rect.width - item.layoutPaddingRight,
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

    layout.rightCurrent = preRight - maxWidth;
  }
}

function layoutLeftStartOrMiddleItems(items: ILayoutItem[], layout: Layout, limitHeight: number, isMiddle: boolean) {
  if (items.length) {
    let maxWidth = 0;
    let preLeft = layout.leftCurrent;
    let preTop = layout.topCurrent;
    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      item.setLayoutStartPosition({
        x: preLeft + item.layoutOffsetX + item.layoutPaddingLeft,
        y: preTop + item.layoutOffsetY + item.layoutPaddingTop
      });

      maxWidth = Math.max(maxWidth, itemTotalWidth);
      preTop += itemTotalHeight;
      if (preTop > limitHeight && singleLineItems.length) {
        preLeft += maxWidth;
        maxWidth = itemTotalWidth;
        preTop = layout.topCurrent + itemTotalHeight;

        item.setLayoutStartPosition({
          x: preLeft + item.layoutOffsetX + item.layoutPaddingLeft,
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

    layout.leftCurrent = preLeft + maxWidth;
  }
}

function layoutTopStartOrMiddleItems(items: ILayoutItem[], layout: Layout, limitWidth: number, isMiddle: boolean) {
  if (items.length) {
    let maxHeight = 0;
    let preLeft = layout.leftCurrent;
    let preTop = layout.topCurrent;
    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      item.setLayoutStartPosition({
        x: preLeft + item.layoutOffsetX + item.layoutPaddingLeft,
        y: preTop + item.layoutOffsetY + item.layoutPaddingTop
      });

      maxHeight = Math.max(maxHeight, itemTotalHeight);
      preLeft += itemTotalWidth;
      if (preLeft > limitWidth && singleLineItems.length) {
        preLeft = layout.leftCurrent + itemTotalWidth;
        preTop += maxHeight;
        maxHeight = itemTotalHeight;
        item.setLayoutStartPosition({
          x: layout.leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft,
          y: preTop + item.layoutOffsetY + item.layoutPaddingTop
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

    layout.topCurrent = preTop + maxHeight;
  }
}

function layoutBottomStartOrMiddleItems(items: ILayoutItem[], layout: Layout, limitWidth: number, isMiddle: boolean) {
  if (items.length) {
    let maxHeight = 0;
    let preLeft = layout.leftCurrent;
    let preBottom = layout.bottomCurrent;
    const allItems: ILayoutItem[][] = [];
    let singleLineItems: ILayoutItem[] = [];
    items.forEach(item => {
      const layoutRect = layout.getItemComputeLayoutRect(item);
      const rect = item.computeBoundsInRect(layoutRect);
      item.setLayoutRect(rect);
      const itemTotalHeight = rect.height + item.layoutPaddingTop + item.layoutPaddingBottom;
      const itemTotalWidth = rect.width + item.layoutPaddingLeft + item.layoutPaddingRight;
      item.setLayoutStartPosition({
        x: preLeft + item.layoutOffsetX + item.layoutPaddingLeft,
        y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
      });

      maxHeight = Math.max(maxHeight, itemTotalHeight);
      preLeft += itemTotalWidth;
      if (preLeft > limitWidth && singleLineItems.length) {
        allItems.push(singleLineItems);
        preLeft = layout.leftCurrent + itemTotalWidth;
        preBottom -= maxHeight;
        maxHeight = itemTotalHeight;
        item.setLayoutStartPosition({
          x: layout.leftCurrent + item.layoutOffsetX + item.layoutPaddingLeft,
          y: preBottom + item.layoutOffsetY - rect.height - item.layoutPaddingBottom
        });
        singleLineItems = [item];
      } else {
        singleLineItems.push(item);
      }
    });
    allItems.push(singleLineItems);
    if (isMiddle) {
      adjustItemsToCenter(allItems, false, limitWidth);
    }

    layout.bottomCurrent = preBottom - maxHeight;
  }
}

export function layoutLeftInlineItems(items: ILayoutItem[], layout: Layout, limitHeight: number) {
  const { startItems, middleItems, endItems } = getPositionItems(items);
  if (startItems.length) {
    layoutLeftStartOrMiddleItems(startItems, layout, limitHeight, false);
  }

  if (middleItems.length) {
    layoutLeftStartOrMiddleItems(middleItems, layout, limitHeight, true);
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
    layoutRightStartOrMiddleItems(startItems, layout, limitHeight, false);
  }

  if (middleItems.length) {
    layoutRightStartOrMiddleItems(middleItems, layout, limitHeight, true);
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
    layoutTopStartOrMiddleItems(startItems, layout, limitWidth, false);
  }

  if (middleItems.length) {
    layoutTopStartOrMiddleItems(middleItems, layout, limitWidth, true);
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
    layoutBottomStartOrMiddleItems(startItems, layout, limitWidth, false);
  }

  if (middleItems.length) {
    layoutBottomStartOrMiddleItems(middleItems, layout, limitWidth, true);
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
