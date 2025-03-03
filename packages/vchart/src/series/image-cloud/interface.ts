import type { GeometricMaskShape, shapes, TextShapeMask } from '@visactor/vgrammar-util';
import type { IImageMarkSpec, IMarkSpec, ISeriesSpec } from '../../typings';
import type { SeriesMarkNameEnum } from '../interface';
import type { IAnimationSpec } from '../../animation/spec';
import type { ImageCloudAppearPresetType } from './animation';

// TODO: 动画类型
export interface IImageCloudSeriesSpec extends ISeriesSpec, IAnimationSpec<'image', ImageCloudAppearPresetType> {
  type: 'imagecloud';
  /**
   * 图片 url 字段
   */
  urlField: string;
  /**
   * 文本字段
   */
  nameField?: string;
  /**
   * 权重字段
   */
  valueField?: string;
  /**
   * 图片大小
   */
  imageSize?: number;
  /**
   * 图片大小范围
   * @default [50,50]
   */
  imageSizeRange?: [number, number];
  /**
   * 图片大小与画布大小的比例
   * @description 当 layoutType 为 spiral 时，ratio 默认 0.45；其他 layoutType 时，ratio 默认 0.1
   */
  ratio?: number;
  /**
   * 图云形状
   * @default 'circle'
   */
  maskShape?: string | keyof typeof shapes | TextShapeMask | GeometricMaskShape;

  imageMask?: {
    /**
     * 是否显示遮罩图元
     * @default false
     */
    visible?: boolean;
    /**
     * 二值化阈值。
     * 默认情况下，透明或白色的像素会被认为是背景进行剔除。
     * @default undefined
     */
    threshold?: number;
    /**
     * 反转图像
     * @default false
     */
    invert?: boolean;
    /**
     * 是否对遮罩图片去除白边
     * @default false
     */
    removeWhiteBorder?: boolean;
    style?: Partial<IImageMarkSpec>;
  };

  /**
   * 布局相关配置
   */
  layoutConfig?: ImageCloudLayoutType;
  /**
   * 图片图元配置
   * @description 可以根据 datum._frequency 来区分图片是否为填充图片
   */
  [SeriesMarkNameEnum.image]?: IMarkSpec<Partial<IImageMarkSpec>> & {
    padding?: number;
  };
}

// TODO: 类型从 vgrammar 导出
export type ImageCloudLayoutType = SpiralLayoutConfig | GridLayoutConfig | StackLayoutConfig;

/** 螺旋线布局 */
export type SpiralLayoutConfig = {
  layoutMode?: 'spiral';
  /** 螺旋线种类
   * @default 'archimedean'
   */
  spiralType?: 'archimedean' | 'rectangular';

  /**
   * 图片填充迭代次数
   * @default 4
   * */
  fillingTimes?: number;
  /** 填充图片的最小尺寸 */
  minFillingImageSize?: number;
  /**
   * 填充图片的透明度
   * @default 1
   */
  fillingOpacity?: number;
};

/**
 * 网格布局
 * 网格布局下，每个网格单元的大小是固定的，图片的权重不再会影响图片的大小，仅会影响图片的位置。
 */
export type GridLayoutConfig = {
  layoutMode: 'grid';
  /** 网格单元形状 */
  cellType?: 'rect' | 'circle' | 'hexagonal';
  /** 网格大小比例。基于画布大小的百分比 */
  cellSizeRatio?: number;
  /**
   * 图片的布局方式
   * - 'default': 图片填满网格单元，尽可能排列成遮罩的形状
   * - 'masked': 图片填满网格单元，并应用遮罩
   * - 'edge': 图片延着遮罩边缘布局
   * @default 'default'
   */
  placement?: 'default' | 'masked' | 'edge';
};

/**
 * 堆叠布局
 * 堆叠布局下，图片之间可以发生重叠。
 */
export type StackLayoutConfig = {
  layoutMode: 'stack';
  /**
   * 图片的布局方式
   * - 'default': 图片填满网格单元，尽可能排列成遮罩的形状
   * - 'masked': 图片填满网格单元，并应用遮罩
   * - 'edge': 图片延着遮罩边缘布局
   * @default 'default'
   */
  placement?: 'default' | 'masked' | 'edge';
  /**
   * 最大旋转角度
   * @description 默认值为角度 70 度，转换为弧度：
   *      70 * (Math.PI / 180) ≈ 1.22173
   * */
  maxAngle?: number;
};
