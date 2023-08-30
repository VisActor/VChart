import type { IModelSpec } from '../../model/interface';
import type { IOrientType } from '../../typings';
import type { IComponent } from '../interface';

/** spec */
export interface IDataFilterComponentSpec extends Omit<IModelSpec, 'width' | 'height'> {
  /**
   * 是否显示组件
   * @default true
   */
  visible?: boolean;
  /**
   * 组件位置
   * @default 'left'
   */
  orient?: IOrientType;

  /**
   * 组件宽度
   * @default 'auto'
   */
  width?: 'auto' | number;

  /**
   * 组件高度
   * @default 'auto'
   */
  height?: 'auto' | number;

  /**
   * 声明关联的映射字段
   */
  field?: string;
  /**
   * 关联的轴ID
   */
  axisId?: string;
  /**
   * 关联的轴序号
   */
  axisIndex?: number;

  /**
   * 组件关联的region索引，与axis关联的region取交集
   * 未配置：默认跟随axis控制的region
   * 已配置：用户配置与axis关联的region取交集
   * 配置优先级：index > id
   */
  regionIndex?: number | number[];
  regionId?: number | string | (number | string)[];

  /**
   * 关联的系列ID
   */
  seriesId?: number | string | (number | string)[];
  /**
   * 关联的系列序号
   */
  seriesIndex?: number | number[];

  /**
   * 数据过滤模式
   * @default true （默认直接过滤数据）
   * 详细可参考：https://echarts.apache.org/zh/option.html#dataZoom-slider.filterMode）
   */
  filterMode?: 'filter' | 'axis';
  /**
   * 起点配置（比例）：范围[0, 1]
   * @default 0
   */
  start?: number;

  /**
   * 终点配置（比例）：范围[0, 1]
   * @default 1
   */
  end?: number;

  /**
   * 起始点数据配置：没有配置的时候根据start和end进行转换
   */
  startValue?: number | string;
  endValue?: number | string;

  /** 数据过滤对应的数据字段 */
  valueField?: string;

  /**
   * start和end的配置模式：只有模式和配置匹配时才生效，比如rangeMode: ['percent', 'value'], 那么必须start和endValue都配置才可以生效
   */
  rangeMode?: [string, string];
  /**
   * 是否进行自动缩进
   */
  autoIndent?: boolean;
  /**
   * 是否开启鼠标缩放和平移漫游。默认不开启
   */
  roam?: boolean;
}

export interface IDataFilterComponent extends IComponent {
  setStartAndEnd: (start: number, end: number) => any;
}
