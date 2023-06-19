import type { DataView } from '@visactor/vdataset';
import type { IGlobalScale } from './interface';
import { isArray, isEqual, isNil } from '@visactor/vutils';
import type { IBaseScale } from '@visactor/vscale';
import { isContinuous } from '@visactor/vscale';
import type { IChart } from '../chart/interface';
import type { IChartSpec } from '../typings/spec';
import { createScale, isDataDomainSpec, mergeFields } from '../util';
import type { IVisualScale, IVisualSpecScale } from '../typings';
import type { StatisticOperations } from '../data/transforms/dimension-statistics';

export class GlobalScale implements IGlobalScale {
  private _scaleSpecMap: Map<string, IVisualSpecScale<unknown, unknown>> = new Map();
  private _scaleMap: Map<string, IBaseScale> = new Map();
  private _modelScaleSpecMap: Map<string, IVisualSpecScale<unknown, unknown>> = new Map();
  private _markAttributeScaleMap: Map<string, (IVisualScale & { dataStatistics: DataView; markScale: IBaseScale })[]> =
    new Map();
  private _spec: IChartSpec['scales'] = null;
  private readonly _chart: IChart = null;
  constructor(spec: IChartSpec['scales'], chart: IChart) {
    this._spec = spec;
    this._chart = chart;
    this._setAttrFromSpec();
  }

  private _createFromSpec(s: IVisualSpecScale<unknown, unknown>): IBaseScale {
    if (!s.id) {
      return null;
    }
    let scale = this._scaleMap.get(s.id);
    if (!scale) {
      if (s.type === 'ordinal' && s.id === 'color') {
        scale = createScale('colorOrdinal'); // 全局颜色色板的特殊逻辑
      } else {
        scale = createScale(s.type);
      }
    }
    if (!scale) {
      return null;
    }
    if (isArray(s.range)) {
      scale.range(s.range);
    }
    if (isArray(s.domain)) {
      if (!isDataDomainSpec(s.domain)) {
        scale.domain(s.domain);
      }
    }
    return scale;
  }

  private _setAttrFromSpec() {
    if (!this._spec?.length) {
      return;
    }
    const newScaleMap: Map<string, IBaseScale> = new Map();
    const newScaleSpecMap: Map<string, IVisualSpecScale<unknown, unknown>> = new Map();
    this._spec.forEach(s => {
      const scale = this._createFromSpec(s);
      if (!scale) {
        return;
      }
      newScaleMap.set(s.id, scale);
      newScaleSpecMap.set(s.id, s);
    });
    this._modelScaleSpecMap.forEach(s => {
      const scale = this._createFromSpec(s);
      if (!scale) {
        return;
      }
      newScaleMap.set(s.id, scale);
      newScaleSpecMap.set(s.id, s);
    });

    this._scaleSpecMap = newScaleSpecMap;
    this._scaleMap = newScaleMap;
  }

  updateSpec(spec: IChartSpec['scales']) {
    const result = {
      change: false,
      reMake: false,
      reRender: false,
      reSize: false,
      reCompile: false
    };
    if (isEqual(spec, this._spec)) {
      return result;
    }
    result.change = true;
    this._spec = spec;
    this._setAttrFromSpec();
    return result;
  }

  registerModelScale(spec: IVisualSpecScale<unknown, unknown>) {
    const scale = this._createFromSpec(spec);
    if (!scale) {
      return;
    }
    this._modelScaleSpecMap.set(spec.id, spec);
    this._scaleSpecMap.set(spec.id, spec);
    this._scaleMap.set(spec.id, scale);
  }

  removeModelScale(filter: (spec: IVisualSpecScale<unknown, unknown>) => boolean) {
    this._modelScaleSpecMap.forEach(spec => {
      if (filter(spec)) {
        this._modelScaleSpecMap.delete(spec.id);
        this._scaleSpecMap.delete(spec.id);
        this._scaleMap.delete(spec.id);
      }
    });
  }

  getScale(user_id: string): IBaseScale | null {
    return this._scaleMap.get(user_id);
  }

  getScaleSpec(user_id: string): IVisualSpecScale<unknown, unknown> | null {
    return this._scaleSpecMap.get(user_id);
  }

  getStatisticalFields = (
    dataId: string
  ): {
    key: string;
    operations: StatisticOperations;
  }[] => {
    const result: {
      key: string;
      operations: StatisticOperations;
    }[] = [];
    this._scaleSpecMap.forEach((v, k) => {
      if (!isDataDomainSpec(v.domain)) {
        return;
      }
      v.domain.forEach(spec => {
        if (spec.dataId === dataId) {
          spec.fields.forEach(key => {
            mergeFields(result, [
              {
                key,
                operations: isContinuous(v.type) ? ['max', 'min'] : ['values']
              }
            ]);
          });
        }
      });
    });
    this._markAttributeScaleMap.forEach((specList, scaleName) => {
      const scale = this.getScale(scaleName);
      specList.forEach(spec => {
        if (spec.dataStatistics?.rawData[0].name === dataId && spec.field) {
          mergeFields(result, [
            {
              key: spec.field,
              operations: isContinuous(scale.type) ? ['max', 'min'] : ['values']
            }
          ]);
        }
      });
    });
    return result;
  };

  private _getStatistics(id: string) {
    const series = this._chart.getAllSeries();
    for (let i = 0; i < series.length; i++) {
      const s = series[i];
      if (s.getRawData().name === id) {
        return s.getRawDataStatistics();
      }
    }
    return null;
  }

  updateScaleDomain(defaultDomain: unknown[]) {
    this._scaleSpecMap.forEach((scaleSpec, id) => {
      const scale = this._scaleMap.get(id);
      if (!scale) {
        return;
      }
      if (!isDataDomainSpec(scaleSpec.domain)) {
        if (!scaleSpec.domain || scaleSpec.domain.length === 0) {
          scale.domain(defaultDomain);
        }
        this._updateMarkScale(id, scale, [...scale.domain()]);
        return;
      }
      let domain: unknown[] | Set<string>;
      if (isContinuous(scaleSpec.type)) {
        domain = [null, null];
      } else {
        domain = new Set();
      }
      scaleSpec.domain.forEach(spec => {
        const statistics = this._getStatistics(spec.dataId);
        if (!statistics) {
          return;
        }
        spec.fields.forEach(key => {
          if (isContinuous(scaleSpec.type)) {
            if (isNil(domain[0])) {
              domain[0] = statistics.latestData[key].min;
            } else {
              domain[0] = Math.min(statistics.latestData[key].min, domain[0]);
            }
            if (isNil(domain[1])) {
              domain[1] = statistics.latestData[key].max;
            } else {
              domain[1] = Math.max(statistics.latestData[key].max, domain[1]);
            }
          } else {
            statistics.latestData[key].values.forEach((value: string) => {
              (domain as Set<string>).add(value);
            });
          }
        });
      });

      const scaleDomain = domain;
      if (!isContinuous(scaleSpec.type)) {
        domain = Array.from(domain);
      }
      scale.domain(domain as unknown[]);
      this._updateMarkScale(id, scale, scaleDomain);
    });
  }

  private _updateMarkScale(id: string, scale: IBaseScale, domain: any[] | Set<string>) {
    const list = this._markAttributeScaleMap.get(id);
    if (!list || list.length === 0) {
      return;
    }
    list.forEach(info => {
      if (!info.field || !info.markScale || info.markScale === scale) {
        return;
      }
      if (
        isNil(info.changeDomain) ||
        info.changeDomain === 'none' ||
        !info.dataStatistics ||
        !info.dataStatistics.latestData[info.field]
      ) {
        isContinuous(scale.type) ? info.markScale.domain(domain as any[]) : scale.domain(Array.from(domain));
        return;
      }

      if (info.changeDomain === 'expand') {
        if (isContinuous(scale.type)) {
          domain[0] = Math.min(domain[0], info.dataStatistics.latestData[info.field].min);
          domain[1] = Math.max(domain[1], info.dataStatistics.latestData[info.field].max);
        } else {
          info.dataStatistics.latestData[info.field].values.forEach((value: string) => {
            (domain as Set<string>).add(value);
          });
          domain = Array.from(domain);
        }
        info.markScale.domain(domain as any[]);
        return;
      }
      if (info.changeDomain === 'replace') {
        if (isContinuous(scale.type)) {
          info.markScale.domain([
            info.dataStatistics.latestData[info.field].min,
            info.dataStatistics.latestData[info.field].max
          ]);
        } else {
          info.markScale.domain(info.dataStatistics.latestData[info.field].values);
        }
        return;
      }
    });
  }

  registerMarkAttributeScale(spec: IVisualScale, dataStatistics: DataView): IBaseScale {
    const scale = this._scaleMap.get(spec.scale);
    let list = this._markAttributeScaleMap.get(spec.scale);
    if (!list) {
      list = [];
      this._markAttributeScaleMap.set(spec.scale, list);
    }
    let markScale = scale;
    if (isNil(spec.field) || !(isNil(spec.changeDomain) || spec.changeDomain === 'none' || isNil(dataStatistics))) {
      markScale = scale.clone();
    }
    list.push({
      ...spec,
      dataStatistics,
      markScale
    });
    return markScale;
  }
}
