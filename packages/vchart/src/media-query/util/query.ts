import { isValid } from '@visactor/vutils';
import type { IVChart } from '../../core';
import type { IMediaInfo, IMediaQueryCondition } from '../interface';

/** 判断是否满足媒体查询条件 */
export const checkMediaQuery = (query: IMediaQueryCondition, mediaInfo: IMediaInfo, globalInstance: IVChart) => {
  for (const conditionKey in query) {
    switch (conditionKey as keyof IMediaQueryCondition) {
      case 'mode':
      case 'themeMode':
        if (isValid(query[conditionKey]) && mediaInfo[conditionKey] !== query[conditionKey]) {
          return false;
        }
        break;
      case 'maxHeight':
        if (isValid(query.maxHeight) && mediaInfo.height > query.maxHeight) {
          return false;
        }
        break;
      case 'minHeight':
        if (isValid(query.minHeight) && mediaInfo.height < query.minHeight) {
          return false;
        }
        break;
      case 'maxWidth':
        if (isValid(query.maxWidth) && mediaInfo.width > query.maxWidth) {
          return false;
        }
        break;
      case 'minWidth':
        if (isValid(query.minWidth) && mediaInfo.width < query.minWidth) {
          return false;
        }
        break;
      case 'onResize':
        if (
          isValid(query.onResize) &&
          !query.onResize(
            {
              width: mediaInfo.width,
              height: mediaInfo.height
            },
            globalInstance
          )
        ) {
          return false;
        }
        break;
      case 'onUpdateSpec':
        if (isValid(query.onUpdateSpec) && !query.onUpdateSpec(globalInstance.getChart().getSpec(), globalInstance)) {
          return false;
        }
        break;
    }
  }
  return true;
};
