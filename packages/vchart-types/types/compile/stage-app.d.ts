import type { IApp, IStage, IStageParams } from '@visactor/vrender-core';
import { type RenderMode } from '../typings/spec/common';
export type ResolvedVRenderApp = {
    app: IApp;
    releaseAppRef?: () => void;
};
export declare const getDefaultVRenderApp: (mode?: RenderMode) => IApp;
export declare const resolveVRenderApp: (app: IApp | undefined, mode?: RenderMode) => ResolvedVRenderApp;
export declare const createStageFromApp: (app: IApp, params: Partial<IStageParams>) => IStage;
