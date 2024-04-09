import { isValidNumber, isNil, isValid, isFunction } from '@visactor/vutils';
import type { LinearScale } from '@visactor/vscale';
import { maxInArr, minInArr } from '../../../util/array';
import { getLinearAxisSpecDomain } from '../util';
import type { IAxisLocationCfg, ITick } from '../interface';
import { ChartEvent } from '../../../constant';
import type { IEvent } from '../../../event/interface';
import { isXAxis } from '../cartesian/util/common';
import type { IOrientType } from '../../../typings/space';
import type { IComponentOption } from '../../interface/common';
import type { StringOrNumber } from '../../../typings';

export const e10 = Math.sqrt(50);
export const e5 = Math.sqrt(10);
export const e2 = Math.sqrt(2);
const DEFAULT_TICK_COUNT = 5;

export interface LinearAxisMixin {
  _scale: LinearScale;
  _scales: LinearScale[];
  _spec: any;
  _nice: boolean;
  _zero: boolean;
  /**
   * spec中申明的min,max
   */
  _domain: { min?: number; max?: number };
  /**
   * 记录一下解析spec后，获取到的domain，
   * 用于在插件（如0值对齐等功能）中使用
   */
  _domainAfterSpec: [number, number];
  _expand?: { max?: number; min?: number };
  _tick: ITick | undefined;
  isSeriesDataEnable: any;
  computeDomain: any;
  collectData: (depth?: number) => { min: number; max: number; values: any[] }[];
  event: IEvent;
  _orient: IOrientType;
  _option: IComponentOption;
  niceLabelFormatter: (value: StringOrNumber) => StringOrNumber;
}

export class LinearAxisMixin {
  protected _extend: { [key: string]: number } = {};

  niceLabelFormatter: (value: StringOrNumber) => StringOrNumber = null;

  setExtraAttrFromSpec() {
    isValid(this._spec.nice) && (this._nice = this._spec.nice);
    isValid(this._spec.zero) && (this._zero = this._spec.zero);
    this._expand = this._spec.expand;
    this._domain = getLinearAxisSpecDomain(this._spec);
  }
  transformScaleDomain() {
    this.setScaleNice();
  }

  setLinearScaleNice() {
    let tickCount: number = DEFAULT_TICK_COUNT;
    const tick = this._spec.tick || {};

    if (isValidNumber(tick.forceTickCount)) {
      tickCount = tick.forceTickCount;
    } else if (isFunction(tick.tickCount)) {
      const range = this._scale.range();
      let rangeSize = Math.abs(range[range.length - 1] - range[0]);

      if (rangeSize === 1 && this._option) {
        // TODO: need to be optimized, when the range is not updated, use the size of view
        const isX = isXAxis(this._orient);
        rangeSize = isX ? this._option.getChartViewRect().width : this._option.getChartViewRect().height;
      }

      // tickCount需要一致，不然会导致效果不一致, fix #2050
      tickCount = tick.tickCount({
        rangeSize,
        labelStyle: this._spec.label && this._spec.label.style
      });
    } else if (isValidNumber(tick.tickCount)) {
      tickCount = tick.tickCount;
    } else {
      tickCount = DEFAULT_TICK_COUNT;
    }
    // 如果配置了精度优先，那么最低是 5
    // 否则就直接使用tickCount即可
    if (this._spec.niceType === 'accurateFirst') {
      tickCount = Math.max(DEFAULT_TICK_COUNT, tickCount);
    }
    const { min, max } = this._domain ?? {};
    if (isNil(min) && isNil(max)) {
      this._nice && this._scale.nice(tickCount);
    } else if (isValid(min) && isNil(max)) {
      this._nice && this._scale.niceMax(tickCount);
    } else if (isNil(min) && isValid(max)) {
      this._nice && this._scale.niceMin(tickCount);
    }
  }

  setLogScaleNice() {
    const { min, max } = this._domain ?? {};
    if (isNil(min) && isNil(max)) {
      this._nice && this._scale.nice();
    } else if (isValid(min) && isNil(max)) {
      this._nice && this._scale.niceMax();
    } else if (isNil(min) && isValid(max)) {
      this._nice && this._scale.niceMin();
    }
  }

  setScaleNice() {
    if (this._spec.type === 'log') {
      this.setLogScaleNice();
    } else {
      this.setLinearScaleNice();
    }
  }

  dataToPosition(values: any[], cfg?: IAxisLocationCfg): number {
    return this.valueToPosition(values[0]);
  }

  valueToPosition(value: any): number {
    return this._scale.scale(value);
  }

  computeLinearDomain(data: { min: number; max: number; values: any[] }[]): number[] {
    const domain: number[] = [];

    if (data.length) {
      data.forEach(d => {
        const { min, max } = d;
        domain[0] = domain[0] === undefined ? min : Math.min(domain[0] as number, min as number);
        domain[1] = domain[1] === undefined ? max : Math.max(domain[1] as number, max as number);
      });
    } else {
      // default value for linear axis
      domain[0] = 0;
      domain[1] = 0;
    }
    this.expandDomain(domain);
    this.includeZero(domain);
    this.setDomainMinMax(domain);
    return domain;
  }

  protected expandDomain(domain: number[]): void {
    if (!this._expand) {
      return;
    }

    let domainMin = domain[0];
    let domainMax = domain[domain.length - 1];

    if (domainMin === domainMax) {
      if (domainMax === 0) {
        domainMax = 1;
      } else if (domainMax > 0) {
        domainMin = 0;
      } else if (domainMax < 0) {
        domainMax = 0;
      }
    }

    if (isValid(this._expand.min)) {
      domain[0] = domainMin - (domainMax - domainMin) * this._expand.min;
    }
    if (isValid(this._expand.max)) {
      domain[domain.length - 1] = domainMax + (domainMax - domainMin) * this._expand.max;
    }
  }

  protected niceDomain(domain: number[]) {
    const { min: userMin, max: userMax } = getLinearAxisSpecDomain(this._spec);
    if (isValid(userMin) || isValid(userMax) || this._spec.type !== 'linear') {
      // 如果用户设置了 min 或者 max 则按照用户设置的为准
      // 如果是非 linear 类型也不处理
      return domain;
    }
    if (Math.abs(minInArr(domain) - maxInArr(domain)) <= 1e-12) {
      let num = domain[0];
      const flag = num >= 0 ? 1 : -1;
      num = Math.abs(num);
      if (num < 1) {
        domain[0] = 0;
        domain[1] = 1; // 在[0, 1) 区间变成[0, 1]
      } else {
        let step = num / DEFAULT_TICK_COUNT; // 默认5个ticks
        const power = Math.floor(Math.log(step) / Math.LN10);
        const err = step / Math.pow(10, power);
        step = (err >= e10 ? 10 : err >= e5 ? 5 : err >= e2 ? 2 : 1) * Math.pow(10, power);

        domain[0] = 0;
        domain[1] = step * 10;
      }
      if (flag < 0) {
        domain.reverse();
        domain[0] *= -1;
        domain[1] *= -1;
      }
    }
    return domain;
  }

  protected includeZero(domain: number[]): void {
    if (this._zero) {
      domain[0] = Math.min(domain[0], 0);
      domain[domain.length - 1] = Math.max(domain[domain.length - 1], 0);
    }
  }

  // 用户其他模块扩充轴scale的区间
  setExtendDomain(key: string, value: number | undefined) {
    if (value === undefined) {
      delete this._extend[key];
      return;
    }
    this._extend[key] = value;
    const domain = this._scale.domain();
    this.extendDomain(domain);
    this.includeZero(domain);
    this.setDomainMinMax(domain);
    this.niceDomain(domain);
    this._scale.domain(domain, this._nice);
    this.setScaleNice();

    this.event.emit(ChartEvent.scaleUpdate, { model: this as any, value: 'domain' });
  }

  protected extendDomain(domain: number[]) {
    let temp;
    const domainLast = domain.length - 1;
    const reverse = domain[0] - domain[domainLast] > 0;
    const min = reverse ? domainLast : 0;
    const max = reverse ? 0 : domainLast;
    for (const key in this._extend) {
      temp = this._extend[key];
      temp > domain[max] && (domain[max] = temp);
      temp < domain[min] && (domain[min] = temp);
    }
  }

  getDomainSpec() {
    return this._domain;
  }

  protected setDomainMinMax(domain: number[]): void {
    if (!this._domain) {
      return;
    }
    const { min, max } = this._domain;
    isValid(min) && (domain[0] = min);
    isValid(max) && (domain[1] = max);
  }

  setZero(zero: boolean) {
    if (this._zero !== zero) {
      this._zero = zero;
      this.updateScaleDomain();
    }
  }
  /**
   * @override
   * TODO event.emit是否可以考虑用decorator
   */
  protected updateScaleDomain() {
    if (!this.isSeriesDataEnable()) {
      return;
    }
    const data = this.collectData();
    const domain: number[] = this.computeDomain(data) as number[];
    this.updateScaleDomainByModel(domain);
  }

  /**
   * TODO event.emit是否可以考虑用decorator
   * 数据逻辑外，模块的设置更新对scale-domain的修改操作
   */
  protected updateScaleDomainByModel(domain?: number[]) {
    domain = domain ?? this._scale.domain();
    // 其他模块的设置 domain
    this.extendDomain(domain);
    this.includeZero(domain);
    // 用户 spec 的 min-max
    this.setDomainMinMax(domain);
    // nice 优先级最高
    this.niceDomain(domain);
    this._scale.domain(domain, this._nice);
    // 设置scale的nice-min-max
    this.setScaleNice();
    this._updateNiceLabelFormatter(domain);
    this._domainAfterSpec = domain as [number, number];
    this.event.emit(ChartEvent.scaleDomainUpdate, { model: this as any });
    this.event.emit(ChartEvent.scaleUpdate, { model: this as any, value: 'domain' });
  }

  getDomainAfterSpec() {
    return this._domainAfterSpec;
  }

  protected _updateNiceLabelFormatter(domain: number[]) {
    // 根据轴 domain 范围做动态判断，取最多 n + 2 位小数
    const domainSpan = Math.abs(domain[1] - domain[0]);
    const n = Math.max(-Math.floor(Math.log10(domainSpan)), 0) + 2;
    const unit = Math.pow(10, n);
    this.niceLabelFormatter = (value: StringOrNumber) => {
      if (isValidNumber(+value)) {
        return Math.round((+value as number) * unit) / unit;
      }
      return value;
    };
  }
}
