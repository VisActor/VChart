import type { IBaseScale } from '@visactor/vscale';
import type { IGroup, IGraphic } from '@visactor/vrender-core';
import type { AxisItem } from '@visactor/vrender-components';
import type { IOrientType, IPolarOrientType, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IPolarAxisCommonTheme } from './polar/interface';
import type { ICartesianAxisCommonTheme } from './cartesian/interface';
import type { CompilableData } from '../../compile/data';
import type { IAxis, ICommonAxisSpec, ITick, StatisticsDomain } from './interface';
import type { IComponentOption } from '../interface';
import type { ISeries } from '../../series/interface';
import type { ITransformOptions } from '@visactor/vdataset';
import { type IComponentMark } from '../../mark/component';
export declare abstract class AxisComponent<T extends ICommonAxisSpec & Record<string, any> = any> extends BaseComponent<T> implements IAxis {
    static specKey: string;
    specKey: string;
    protected _orient: IPolarOrientType | IOrientType;
    getOrient(): IOrientType | IPolarOrientType;
    protected _scale: IBaseScale;
    getScale(): IBaseScale;
    protected _scales: IBaseScale[];
    getScales(): IBaseScale[];
    protected _theme: ICartesianAxisCommonTheme | IPolarAxisCommonTheme;
    protected _tickData: CompilableData;
    getTickData(): CompilableData;
    protected _statisticsDomain: StatisticsDomain;
    getStatisticsDomain(): StatisticsDomain;
    protected _seriesUserId?: StringOrNumber[];
    protected _seriesIndex?: number[];
    protected _regionUserId?: StringOrNumber[];
    protected _regionIndex?: number[];
    protected _visible: boolean;
    get visible(): boolean;
    protected _tick: ITick | undefined;
    protected abstract computeDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): StringOrNumber[];
    abstract valueToPosition(value: any): number;
    protected abstract axisHelper(): any;
    protected abstract getSeriesStatisticsField(s: ISeries): string[];
    protected abstract updateSeriesScale(): void;
    protected abstract collectData(depth: number): {
        min: number;
        max: number;
        values: any[];
    }[];
    protected abstract _initData(): void;
    abstract transformScaleDomain(): void;
    protected _dataFieldText: string;
    protected _axisMark: IComponentMark;
    protected _gridMark: IComponentMark;
    constructor(spec: T, options: IComponentOption);
    getVRenderComponents(): IGraphic[];
    created(): void;
    protected isSeriesDataEnable(): boolean;
    protected setSeriesAndRegionsFromSpec(): void;
    getBindSeriesFilter(): {
        userId: StringOrNumber[];
        specIndex: number[];
    };
    protected computeStatisticsDomain: () => void;
    protected initEvent(): void;
    protected updateScaleDomain(): void;
    protected computeData(updateType?: 'domain' | 'range' | 'force'): void;
    protected initScales(): void;
    _compareSpec(): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    protected getLabelFormatMethod(): (value: any, datum: any, index: number) => any;
    protected getLabelItems(length: number): any[];
    protected _delegateAxisContainerEvent(component: IGroup): void;
    protected _getAxisAttributes(): {
        orient: IOrientType | IPolarOrientType;
        select: boolean;
        hover: boolean;
        line: any;
        label: {
            style: any;
            formatMethod: (value: any, datum: any, index: number) => any;
            state: {};
        };
        tick: {
            visible: boolean;
            length: number;
            inside: boolean;
            alignWithLabel: boolean;
            style: any;
            state: {};
            dataFilter: (data: AxisItem[]) => AxisItem[];
        };
        subTick: {
            visible: boolean;
            length: number;
            inside: boolean;
            count: number;
            style: any;
            state: {};
        };
        title: {
            visible: any;
            position: any;
            space: any;
            autoRotate: boolean;
            angle: number;
            textStyle: any;
            padding: any;
            shape: {
                visible: any;
                space: any;
                style: any;
            };
            background: {
                visible: any;
                style: any;
            };
            state: {
                text: {};
                shape: {};
                background: {};
            };
            pickable: boolean;
            childrenPickable: boolean;
        };
        panel: {
            visible: any;
            style: any;
            state: {};
        };
    };
    protected _getGridAttributes(): {
        alternateColor: any;
        alignWithLabel: any;
        style: any;
        subGrid: {
            type: string;
            visible: any;
            alternateColor: any;
            style: any;
        };
    };
    addTransformToTickData(options: ITransformOptions, execute?: boolean): void;
    dataToPosition(values: any[]): number;
}
export declare const registerAxis: () => void;
