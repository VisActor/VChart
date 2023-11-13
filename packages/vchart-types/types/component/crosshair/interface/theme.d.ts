import type { ICartesianCrosshairSpec, ICommonCrosshairSpec, ICrosshairCategoryFieldSpec, ICrosshairValueFieldSpec, IPolarCrosshairSpec } from '.';
export interface ICrosshairTheme extends ICommonCrosshairSpec {
    bandField?: Partial<ICrosshairCategoryFieldSpec>;
    linearField?: Partial<ICrosshairValueFieldSpec>;
    xField?: Partial<ICartesianCrosshairSpec['xField']>;
    yField?: Partial<ICartesianCrosshairSpec['yField']>;
    categoryField?: Partial<IPolarCrosshairSpec['categoryField']>;
    valueField?: Partial<IPolarCrosshairSpec['valueField']>;
}
