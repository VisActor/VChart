import type { Datum, IAnimationTypeConfig, IElement } from '@visactor/vgrammar-core';
import type { IPoint, Maybe } from '../../typings';
import type { IPolarAxisHelper } from '../../component/axis';
export interface IRadarAnimationParams {
    center: () => Maybe<IPoint>;
    radius: () => number;
    startAngle: number;
    pointToCoord: IPolarAxisHelper['pointToCoord'];
    coordToPoint: IPolarAxisHelper['coordToPoint'];
}
export type RadarAppearPreset = 'grow' | 'fadeIn' | 'clipIn';
export declare const radarFadeAnimation: (animationType: 'in' | 'out') => {
    type: string;
};
export declare const radarGrowAnimation: (params: IRadarAnimationParams, animationType: 'in' | 'out') => {
    type: string;
    options: () => {
        center: IPoint;
    };
};
export declare function radarPresetAnimation(params: IRadarAnimationParams, preset: RadarAppearPreset, animationType: 'in' | 'out'): {
    type: string;
};
export declare const radarSymbolMoveAnimation: (params: IRadarAnimationParams, animationType: 'in' | 'out') => {
    channel: {
        x: {
            from: () => number;
            to: (datum: Datum, element: IElement) => any;
        };
        y: {
            from: () => number;
            to: (datum: Datum, element: IElement) => any;
        };
    };
} | {
    channel: {
        x: {
            from: (datum: Datum, element: IElement) => any;
            to: () => number;
        };
        y: {
            from: (datum: Datum, element: IElement) => any;
            to: () => number;
        };
    };
};
export declare function radarSymbolPresetAnimation(params: IRadarAnimationParams, preset: RadarAppearPreset, animationType: 'in' | 'out'): {
    type: string;
} | {
    channel: {
        x: {
            from: () => number;
            to: (datum: any, element: IElement) => any;
        };
        y: {
            from: () => number;
            to: (datum: any, element: IElement) => any;
        };
    };
} | {
    channel: {
        x: {
            from: (datum: any, element: IElement) => any;
            to: () => number;
        };
        y: {
            from: (datum: any, element: IElement) => any;
            to: () => number;
        };
    };
};
export declare const radarGroupClipAnimation: (params: IRadarAnimationParams, animationType: 'in' | 'out') => IAnimationTypeConfig;
export declare const registerRadarAnimation: () => void;
