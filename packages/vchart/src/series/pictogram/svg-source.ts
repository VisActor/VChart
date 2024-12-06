import { DataSet, DataView, svgParser } from '@visactor/vdataset';
import type { ISVGSourceOption } from '@visactor/vdataset';
import { registerDataSetInstanceParser } from '../../data/register';
import { warn } from '../../util';

export const svgSourceMap = new Map<string, DataView>();

let svgDataSet: DataSet | null;

function initSVGDataSet() {
  if (svgDataSet) {
    return;
  }
  svgDataSet = new DataSet();
  registerDataSetInstanceParser(svgDataSet, 'svg', svgParser);
}

export function registerSVGSource(key: string, source: ISVGSourceOption) {
  if (svgSourceMap.has(key)) {
    warn(`svg source key of '${key}' already exists, will be overwritten.`);
  }
  initSVGDataSet();
  const dataView = new DataView(svgDataSet!);
  dataView.parse(source, {
    type: 'svg'
  });

  svgSourceMap.set(key, dataView);
}

export function unregisterSVGSource(key: string) {
  if (!svgSourceMap.has(key)) {
    warn(`map type of '${key}' does not exists.`);
    return;
  }
  svgSourceMap.delete(key);
}

export function getSVGSource(type: string) {
  return svgSourceMap.get(type);
}

export function clearSVGSource() {
  svgSourceMap.clear();
  svgDataSet = null;
}
