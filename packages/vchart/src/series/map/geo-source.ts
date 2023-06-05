import { DataSet, DataView, geoJSONParser, simplify, topoJSONParser } from '@visactor/vdataset';
import { merge, warn } from '../../util';
import type { GeoSourceType } from '../../typings/geo';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../data/register';

export interface IGeoJsonOption {
  type: 'geojson';
  centroid?: boolean;
  simplify?: boolean;
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

export function getMapSource(type: string) {
  return geoSourceMap.get(type);
}

export function clearMapSource() {
  geoSourceMap.clear();
  mapDataSet = null;
}
