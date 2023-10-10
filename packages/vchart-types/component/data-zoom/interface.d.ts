import type { IOrientType } from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { IComponent } from '../interface';
export interface IDataFilterComponentSpec extends Omit<IComponentSpec, 'width' | 'height'> {
  visible?: boolean;
  orient?: IOrientType;
  width?: 'auto' | number;
  height?: 'auto' | number;
  field?: string;
  axisId?: string;
  axisIndex?: number;
  regionIndex?: number | number[];
  start?: number;
  end?: number;
  startValue?: number | string;
  endValue?: number | string;
  valueField?: string;
  rangeMode?: [string, string];
  autoIndent?: boolean;
  roam?: boolean;
  auto?: boolean;
}
export interface IDataFilterComponent extends IComponent {
  setStartAndEnd: (start: number, end: number) => any;
}
