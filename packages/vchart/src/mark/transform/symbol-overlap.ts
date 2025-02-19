import type { ISymbolGraphicAttribute } from '@visactor/vrender-core';
import { PREFIX } from '../../constant/base';
import { isNil } from '@visactor/vutils';
import { Factory } from '../../core/factory';
import type { IMarkGraphic } from '../interface';
import { MarkTypeEnum } from '../interface';

export const OVERLAP_HIDE_KEY = `${PREFIX}_hide_`;

function reset(graphics: IMarkGraphic[]) {
  graphics.forEach(g => {
    const hide = g[OVERLAP_HIDE_KEY];

    if (hide) {
      g.setAttribute('visible', true);

      g[OVERLAP_HIDE_KEY] = false;
    }
  });
  return graphics;
}

function overlapX(graphics: IMarkGraphic[], delta: number, deltaMul: number, useRadius: boolean) {
  if (useRadius) {
    let lastX = -Infinity;
    let lastR = 0;
    const useDeltaMul = isNil(delta);
    let itemDelta = delta;

    graphics.forEach(g => {
      if (g.attribute.visible === false) {
        // skip hidden points
        return;
      }

      const r = ((g.attribute as ISymbolGraphicAttribute).size as number) / 2;
      const currentX = g.attribute.x;
      if (useDeltaMul) {
        itemDelta = (r + lastR) * deltaMul;
      }
      if (Math.abs(currentX - lastX) < itemDelta + lastR + r) {
        if (!(g.attribute as any).forceShow) {
          g[OVERLAP_HIDE_KEY] = true;
          g.setAttribute('visible', false);
        }
      } else {
        lastX = currentX;
      }

      lastR = r;
    });
  }
}

function overlapY(graphics: IMarkGraphic[], delta: number, deltaMul: number, useRadius: boolean) {
  if (useRadius) {
    let lastY = -Infinity;
    let lastR = 0;
    const useDeltaMul = isNil(delta);
    let itemDelta = delta;

    graphics.forEach(g => {
      if (g.attribute.visible === false) {
        // skip hidden points
        return;
      }

      const r = ((g.attribute as ISymbolGraphicAttribute).size as number) / 2;
      const currentY = g.attribute.y;
      if (useDeltaMul) {
        itemDelta = (r + lastR) * deltaMul;
      }
      if (Math.abs(currentY - lastY) < itemDelta + lastR + r) {
        if (!(g.attribute as any).forceShow) {
          g[OVERLAP_HIDE_KEY] = true;
          g.setAttribute('visible', false);
        }
      } else {
        lastY = currentY;
      }

      lastR = r;
    });
  }
}

function overlapXY(graphics: IMarkGraphic[], delta: number, deltaMul: number, useRadius: boolean) {
  if (useRadius) {
    const lastX = -Infinity;
    let lastY = -Infinity;
    let lastR = 0;
    let dis = 0;
    const useDeltaMul = isNil(delta);
    let itemDelta = delta;

    graphics.forEach(g => {
      if (g.attribute.visible === false) {
        // skip hidden points
        return;
      }

      const r = ((g.attribute as ISymbolGraphicAttribute).size as number) / 2;
      const { x: currentX, y: currentY } = g.attribute;

      if (useDeltaMul) {
        itemDelta = (r + lastR) * deltaMul;
      }
      dis = (lastX - currentX) ** 2 + (lastY - currentY) ** 2;
      if (dis < (itemDelta + lastR + r) ** 2) {
        if (!(g.attribute as any).forceShow) {
          g[OVERLAP_HIDE_KEY] = true;
          g.setAttribute('visible', false);
        }
      } else {
        lastY = currentY;
      }

      lastR = r;
    });
  }
}

/**
 * 针对mark的防重叠
 * @param {object} options - The parameters for this operator.
 * @param {data} [options.followMark]
 * @constructor
 */
export const transform = (
  options: {
    direction: number;
    delta?: number;
    deltaMul?: number;
    radius?: boolean;
    hideMode?: number;
    forceUpdate?: boolean;
    forceUpdateStamp?: number;
    groupBy?: string;
    sort?: boolean;
  },
  upstreamData: IMarkGraphic[]
) => {
  if (!upstreamData || upstreamData.length === 0) {
    return;
  }
  let { radius } = options;
  if (isNil(radius)) {
    if (upstreamData[0].type === MarkTypeEnum.symbol) {
      radius = true;
    }
  }

  const { direction, delta, deltaMul = 1, groupBy } = options;

  const handleOverlap = (graphics: IMarkGraphic[]) => {
    reset(graphics);

    const sortedgraphics = options.sort
      ? graphics.slice().sort((a, b) => {
          return a.getGraphicAttribute('x') - b.getGraphicAttribute('x');
        })
      : graphics;

    if (direction === 0) {
      overlapXY(sortedgraphics, delta, deltaMul, radius);
    } else if (direction === 1) {
      overlapX(sortedgraphics, delta, deltaMul, radius);
    } else {
      overlapY(sortedgraphics, delta, deltaMul, radius);
    }
  };

  if (!groupBy) {
    handleOverlap(upstreamData);
  } else {
    // 分组
    const map = upstreamData.reduce((res: { [key: string]: IMarkGraphic[] }, g: IMarkGraphic) => {
      const groupName = g.context.data?.[0]?.[groupBy];

      if (res[groupName]) {
        res[groupName].push(g);
      } else {
        res[groupName] = [g];
      }

      return res;
    }, {});

    Object.keys(map).forEach(key => {
      handleOverlap(map[key]);
    });
  }

  return upstreamData;
};

export const registerSymbolOverlapTransform = () => {
  Factory.registerGrammarTransform('symbolOverlap', {
    transform,
    isGraphic: true
  });
};
