import { isValid } from '@visactor/vutils';
import { IComponentMatch } from './../../dsl-interface';
export function ChartSpecMatch(rawSpec: any, index: number, matchInfo: IComponentMatch) {
  if (!matchInfo) {
    return false;
  }
  if (isValid(matchInfo.usrId)) {
    return rawSpec.id === matchInfo.usrId;
  } else if (isValid(matchInfo.specIndex)) {
    return matchInfo.specIndex === 'all' || index === matchInfo.specIndex;
  }

  return false;
}
