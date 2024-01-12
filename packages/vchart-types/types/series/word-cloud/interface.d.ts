import type { ITextMarkSpec, IMarkSpec, ISeriesSpec } from '../../typings';
import type { IAnimationSpec, IMarkAnimateSpec, IStateAnimateSpec } from '../../animation/spec';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { WordcloudAppearPreset } from './animation';
export declare enum WordCloudShapeEnum {
    triangleForward = "triangleForward",
    triangle = "triangle",
    diamond = "diamond",
    square = "square",
    star = "star",
    cardioid = "cardioid",
    circle = "circle",
    pentagon = "pentagon"
}
export type WordCloudShapeType = keyof typeof WordCloudShapeEnum;
export type EllipsisType = {
    string?: string;
    limitLength?: number;
};
export type ZoomToFitType = {
    shrink?: boolean;
    enlarge?: boolean;
    fontSizeLimitMin?: number;
    fontSizeLimitMax?: number;
};
export type DrawOutOfBoundType = 'clip' | 'hidden' | 'ellipsis';
export type WordCloudConfigType = {
    drawOutOfBound?: DrawOutOfBoundType;
    ellipsis?: EllipsisType;
    layoutMode?: 'fast' | 'grid' | 'default';
    zoomToFit: ZoomToFitType;
    progressiveTime?: number;
    progressiveStep?: number;
};
export type WordCloudShapeConfigType = {
    fillingSeriesField?: string;
    fillingColorList?: string[];
    fillingFontFamilyField?: string;
    fillingFontWeightField?: string;
    fillingFontStyleField?: string;
    fillingColorHexField?: string;
    fillingRotateAngles?: number[];
    ratio?: number;
    removeWhiteBorder?: boolean;
    layoutMode?: 'default' | 'ensureMapping' | 'ensureMappingEnlarge';
    fillingTimes?: number;
    fillingXStep?: number;
    fillingYStep?: number;
    fillingXRatioStep?: number;
    fillingYRatioStep?: number;
    fillingInitialFontSize?: number;
    fillingDeltaFontSize?: number;
    fillingInitialOpacity?: number;
    fillingDeltaOpacity?: number;
    textLayoutTimes?: number;
    fontSizeShrinkFactor?: number;
    stepFactor?: number;
    importantWordCount?: number;
    globalShinkLimit?: number;
    fontSizeEnlargeFactor?: number;
    fillingDeltaFontSizeFactor?: number;
    fillingRatio?: number;
};
export interface IWordCloudSeriesBaseSpec extends ISeriesSpec, IAnimationSpec<string, WordcloudAppearPreset> {
    nameField: string;
    valueField?: string;
    fontFamilyField?: string;
    fontWeightField?: string;
    fontStyleField?: string;
    colorHexField?: string;
    colorMode?: 'linear' | 'ordinal';
    colorList?: string[];
    rotateAngles?: number[];
    fontWeightRange?: [number, number];
    fontSizeRange?: [number, number] | 'auto';
    maskShape?: string | WordCloudShapeType;
    keepAspect?: boolean;
    random?: boolean;
    wordCloudConfig?: WordCloudConfigType;
    wordCloudShapeConfig?: WordCloudShapeConfigType;
    [SeriesMarkNameEnum.word]?: IMarkSpec<ITextMarkSpec> & {
        padding?: number;
        formatMethod?: (datum?: any) => string;
    };
    [SeriesMarkNameEnum.fillingWord]?: IMarkSpec<ITextMarkSpec> & {
        padding?: number;
    };
    animationAppear?: boolean | (IStateAnimateSpec<WordcloudAppearPreset> & {
        duration?: number;
        totalTime?: number;
    }) | IMarkAnimateSpec<string>;
}
export interface IWordCloudSeriesSpec extends IWordCloudSeriesBaseSpec {
    type: 'wordCloud';
}
export interface IWordCloudSeriesTheme {
    [SeriesMarkNameEnum.word]?: IMarkSpec<ITextMarkSpec> & {
        padding?: number;
        formatMethod?: (datum?: any) => string;
    };
    [SeriesMarkNameEnum.fillingWord]?: IMarkSpec<ITextMarkSpec> & {
        padding?: number;
        formatMethod?: (datum?: any) => string;
    };
}
export interface IWordCloud3dSeriesSpec extends IWordCloudSeriesBaseSpec {
    type: 'wordCloud3d';
    depth_3d?: number;
    postProjection?: 'StereographicProjection';
}
export interface IWordCloud3dSeriesTheme {
    [SeriesMarkNameEnum.word]?: IMarkSpec<ITextMarkSpec> & {
        padding?: number;
        formatMethod?: (text: string | string[], datum?: any) => string | string[];
    };
    [SeriesMarkNameEnum.fillingWord]?: IMarkSpec<ITextMarkSpec> & {
        padding?: number;
        formatMethod?: (text: string | string[], datum?: any) => string | string[];
    };
}
