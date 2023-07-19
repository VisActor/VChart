import { DataSet, DataView, geoJSONParser, simplify, topoJSONParser } from '@visactor/vdataset';
import { merge, warn } from '../../util';
import type { GeoSourceType } from '../../typings/geo';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../data/register';

export interface IGeoJsonOption {
  type: 'geojson';
  centroid?: boolean;
  simplify?: boolean;
  rewind?: // 逆时针回绕(Multi)LineString或(Multi)Polygon的外部环，内部环顺时针。默认 false
  | boolean
    | {
        reverse?: boolean; // 启用反向绕行，默认 false
      };
}

export interface ITopoJsonOption extends Omit<IGeoJsonOption, 'type'> {
  type: 'topojson';
  object: string;
}

export type GeoSourceOption = IGeoJsonOption | ITopoJsonOption;

export const geoSourceMap = new Map<string, DataView>();

let mapDataSet: DataSet | null;

function initMapDataSet() {
  if (mapDataSet) {
    return;
  }
  mapDataSet = new DataSet();
  registerDataSetInstanceParser(mapDataSet, 'geojson', geoJSONParser);
  registerDataSetInstanceParser(mapDataSet, 'topojson', topoJSONParser);
  registerDataSetInstanceTransform(mapDataSet, 'simplify', simplify);
}

/**
 * 1. 这个和mapSeries强绑定，后续可以考虑动态注册API
 * 2. 存成dataView而不是原始数据，是考虑减少parser的开销
 */
export function registerMapSource(
  key: string,
  source: GeoSourceType,
  option: GeoSourceOption = { type: 'geojson', centroid: true }
) {
  if (geoSourceMap.has(key)) {
    warn(`map type of '${key}' already exists, will be overwritten.`);
  }
  initMapDataSet();
  const dataView = new DataView(mapDataSet!);
  const options: GeoSourceOption = merge({}, { centroid: true, simplify: false }, option);
  if (option.type === 'topojson') {
    dataView.parse(source, {
      type: 'topojson',
      options
    });
  } else {
    dataView.parse(source, {
      type: 'geojson',
      options
    });
  }

  if (option.simplify === true) {
    dataView.transform({ type: 'simplify' });
  }

  geoSourceMap.set(key, dataView);
}

export function unregisterMapSource(key: string) {
  if (!geoSourceMap.has(key)) {
    warn(`map type of '${key}' does not exists.`);
    return;
  }
  geoSourceMap.delete(key);
}

export function getMapSource(type: string) {
  return geoSourceMap.get(type);
}

export function clearMapSource() {
  geoSourceMap.clear();
  mapDataSet = null;
}
