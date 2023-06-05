import { merge } from '@visactor/vutils';
import type { IMark } from '../interface';

/** 跟随 mark 一起存储的信息 */
export interface IMarkInfo {
  /** 样式和 seriesField 有关 */
  styleWithSeriesField?: boolean;
}

export class MarkSet {
  protected _children: IMark[] = [];
  protected readonly _infoMap = new Map<IMark, IMarkInfo>();
  static readonly defaultMarkInfo: IMarkInfo = {};

  addMark(mark: IMark, markInfo?: IMarkInfo) {
    this._children.push(mark);
    this._infoMap.set(mark, merge({}, MarkSet.defaultMarkInfo, markInfo));
  }

  removeMark(markId: number): void {
    const index = this._children.findIndex(m => m.id === markId);
    if (index >= 0) {
      this._infoMap.delete(this._children[index]);
      this._children.splice(index, 1);
    }
  }

  clear() {
    this._children = [];
    this._infoMap.clear();
  }

  forEach(callbackfn: (value: IMark, index: number, array: IMark[]) => void) {
    this._children.forEach(callbackfn);
  }

  includes(mark: IMark, fromIndex?: number) {
    return this._children.includes(mark, fromIndex);
  }

  get(index: number) {
    return this._children[index];
  }

  getMarks() {
    return [...this._children];
  }

  getMarksInType(type: string): IMark[] {
    return this._children.filter(m => m.type === type);
  }

  getMarkInName(name: string): IMark | undefined {
    return this._children.find(m => m.name === name);
  }

  getMarkInId(markId: number): IMark | undefined {
    return this._children.find(m => m.id === markId);
  }

  /**
   * 获取满足某 info 的所有 mark
   * @param info
   * @returns
   */
  getMarkWithInfo(info: Partial<IMarkInfo>) {
    return this._children.find(mark => {
      return Object.keys(info).every(key => info[key] === this._infoMap.get(mark)[key]);
    });
  }
}
