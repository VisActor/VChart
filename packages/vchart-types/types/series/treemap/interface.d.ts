import type { IRectMarkSpec, ITextMarkSpec } from '../../typings';
import type { IHierarchyData, IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings/spec';
import type { TreemapOptions } from '@visactor/vgrammar-hierarchy';
import type { ICartesianSeriesTheme } from '../cartesian/interface';
import type { IAnimationSpec } from '../../animation/spec';
import type { TreemapAppearPreset, TreemapMark } from './animation';
import type { SeriesMarkNameEnum } from '../interface/type';
export interface ITreemapSeriesSpec extends Omit<ISeriesSpec, 'data'>, IAnimationSpec<TreemapMark, TreemapAppearPreset> {
    type: 'treemap';
    categoryField: string;
    valueField: string;
    data: IHierarchyData;
    aspectRatio?: number;
    splitType?: TreemapOptions['splitType'];
    gapWidth?: TreemapOptions['gapWidth'];
    nodePadding?: TreemapOptions['padding'];
    maxDepth?: TreemapOptions['maxDepth'];
    minVisibleArea?: TreemapOptions['minVisibleArea'];
    minChildrenVisibleArea?: TreemapOptions['minChildrenVisibleArea'];
    minChildrenVisibleSize?: TreemapOptions['minChildrenVisibleSize'];
    roam?: boolean;
    drill?: boolean;
    drillField?: string;
    [SeriesMarkNameEnum.leaf]?: IMarkSpec<IRectMarkSpec>;
    [SeriesMarkNameEnum.nonLeaf]?: IMarkSpec<IRectMarkSpec>;
    [SeriesMarkNameEnum.label]?: IMarkSpec<ITextMarkSpec>;
    [SeriesMarkNameEnum.nonLeafLabel]?: IMarkSpec<ITextMarkSpec> & {
        position?: TreemapOptions['labelPosition'];
        padding?: TreemapOptions['labelPadding'];
    };
}
export interface ITreemapSeriesTheme extends ICartesianSeriesTheme {
    gapWidth?: TreemapOptions['padding'];
    nodePadding?: TreemapOptions['padding'];
    [SeriesMarkNameEnum.leaf]?: Partial<IMarkTheme<IRectMarkSpec>>;
    [SeriesMarkNameEnum.nonLeaf]?: Partial<IMarkTheme<IRectMarkSpec>>;
    [SeriesMarkNameEnum.label]?: Partial<IMarkTheme<ITextMarkSpec>>;
    [SeriesMarkNameEnum.nonLeafLabel]?: Partial<IMarkTheme<ITextMarkSpec> & {
        padding?: TreemapOptions['labelPadding'];
    }>;
}
