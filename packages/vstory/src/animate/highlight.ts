import { Dict, isArray } from '@visactor/vutils';
import type { Template } from '../template/base-template';
import { Data, MaybeArray } from '../type/common';
import { getAllSeriesMarksWithoutRoot } from '../util/vchart-api';
import { GraphicAnimate } from './animate';
import { Action } from '../scene/action';

export function highlight(template: Template, data: MaybeArray<Data>, style: Dict<any>) {
  if (!data || !template) {
    return null;
  }
  const highlight = new HighLight(template, data, style);
  return new Action(highlight, highlight => {
    highlight.run();
  });
}

class HighLight extends GraphicAnimate {
  type = 'highlight';

  protected _duration: number;
  protected _dataList: Data[];
  protected _template: Template;
  protected _style: any;

  constructor(target: Template, data: MaybeArray<Data>, style: any, duration?: number) {
    super(null);
    this._duration = duration;
    this._dataList = isArray(data) ? data : [data];
    this._template = target;
    this._style = style;
  }

  run() {
    if (this._dataList.length) {
      const { _dataList, _style } = this;
      const vchart = this._template.vchartInstance();
      if (vchart) {
        const marks = getAllSeriesMarksWithoutRoot(vchart);
        if (marks && marks.length) {
          marks.forEach(mark => {
            mark.getProduct().encodeState('highlight', _style);
          });
          vchart.updateState({
            highlight: {
              filter: { datums: _dataList, dataKeys: undefined }
            }
          });
        }
      }
    }
  }
}
