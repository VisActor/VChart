import { isValidNumber, isNil, isValid } from '@visactor/vutils';
import type { LinearScale } from '@visactor/vscale';
import { maxInArr, minInArr } from '../../../util/array';
import { getLinearAxisSpecDomain } from '../util';
import type { IAxisLocationCfg, ITick } from '../interface';
import { ChartEvent } from '../../../constant';
import type { IEvent } from '../../../event/interface';

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
  _domain: { min?: number; max?: number };
  _expand?: { max?: number; min?: number };
  _tick: ITick | undefined;
  isSeriesDataEnable: any;
  computeStatisticsDomain: any;
  computeDomain: any;
  collectData: any;
  event: IEvent;
}

export class LinearAxisMixin {
  protected _extend: { [key: string]: number } = {};

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
    let tickCount = this._spec.tick?.forceTickCount ?? this._spec.tick?.tickCount ?? DEFAULT_TICK_COUNT;
    if (!isValidNumber(tickCount)) {
      // tickCount 为函数通常是为了通过图表大小动态自适应 tick 数量
      // 这里在计算 nice 的时候可以相对粗略预估，不用精确值
      tickCount = 10;
    }
    // 如果配置了精度优先，那么最低是10
    // 否则就直接使用tickCount即可
    if (this._spec.niceType === 'accurateFirst') {
      tickCount = Math.max(10, tickCount);
    }
    if (isNil(this._domain?.min) && isNil(this._domain?.max)) {
      this._nice && this._scale.nice(tickCount);
    } else if (isValid(this._domain?.min) && isNil(this._domain?.max)) {
      this._nice && this._scale.niceMax(tickCount);
    } else if (isNil(this._domain?.min) && isValid(this._domain?.max)) {
      this._nice && this._scale.niceMin(tickCount);
    }
  }

  setLogScaleNice() {
    if (isNil(this._domain?.min) && isNil(this._domain?.max)) {
      this._nice && this._scale.nice();
    } else if (isValid(this._domain?.min) && isNil(this._domain?.max)) {
      this._nice && this._scale.niceMax();
    } else if (isNil(this._domain?.min) && isValid(this._domain?.max)) {
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
    if (this._spec.type === 'log' && (value === 0 || value[0] === 0)) {
      return this._scale.range()[0];
    }
    return this._scale.scale(value);
  }

  computeLinearDomain(data: { min: number; max: number; values: any[] }[]): number[] {
    const domain: number[] = [];
    data.forEach(d => {
      const { min, max } = d;
      domain[0] = domain[0] === undefined ? min : Math.min(domain[0] as number, min as number);
      domain[1] = domain[1] === undefined ? max : Math.max(domain[1] as number, max as number);
    });
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
    this.computeStatisticsDomain();
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
    this.event.emit(ChartEvent.scaleDomainUpdate, { model: this as any });
    this.event.emit(ChartEvent.scaleUpdate, { model: this as any, value: 'domain' });
  }
}
