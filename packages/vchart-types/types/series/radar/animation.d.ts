import type { Datum, IAnimationTypeConfig, IElement } from '@visactor/vgrammar-core';
import type { IRadarAnimationParams, RadarAppearPreset } from './interface';
export declare const radarFadeAnimation: (animationType: 'in' | 'out') => {
    type: string;
};
export declare const radarGrowAnimation: (params: IRadarAnimationParams, animationType: 'in' | 'out') => {
    type: string;
    options: () => {
        center: import("../../typings").IPoint;
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
