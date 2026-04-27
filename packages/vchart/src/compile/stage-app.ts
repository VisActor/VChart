import { createBrowserVRenderApp, createNodeVRenderApp } from '@visactor/vrender';
import type { IApp, IStage, IStageParams } from '@visactor/vrender-core';
import { RenderModeEnum, type RenderMode } from '../typings/spec/common';

type VRenderAppEnv = 'browser' | 'node';

type DefaultVRenderAppRecord = {
  app: IApp;
  refCount: number;
};

export type ResolvedVRenderApp = {
  app: IApp;
  releaseAppRef?: () => void;
};

const defaultVRenderApps = new Map<VRenderAppEnv, DefaultVRenderAppRecord>();

const getVRenderAppEnv = (mode?: RenderMode): VRenderAppEnv =>
  mode === RenderModeEnum.node || mode === RenderModeEnum.worker ? 'node' : 'browser';

// Default apps are an internal reuse detail; ordinary VChart users should keep using dom/renderCanvas.
const createDefaultVRenderApp = (env: VRenderAppEnv): IApp =>
  env === 'node' ? createNodeVRenderApp() : createBrowserVRenderApp();

const getDefaultVRenderAppRecord = (mode?: RenderMode): DefaultVRenderAppRecord => {
  const env = getVRenderAppEnv(mode);
  const record = defaultVRenderApps.get(env);

  if (record && !record.app.released) {
    return record;
  }

  const nextRecord = {
    app: createDefaultVRenderApp(env),
    refCount: 0
  };
  defaultVRenderApps.set(env, nextRecord);

  return nextRecord;
};

export const getDefaultVRenderApp = (mode?: RenderMode): IApp => getDefaultVRenderAppRecord(mode).app;

const retainDefaultVRenderApp = (mode?: RenderMode): ResolvedVRenderApp => {
  const env = getVRenderAppEnv(mode);
  const record = getDefaultVRenderAppRecord(mode);
  let released = false;

  record.refCount += 1;

  return {
    app: record.app,
    releaseAppRef: () => {
      if (released) {
        return;
      }
      released = true;
      record.refCount -= 1;

      if (record.refCount <= 0) {
        defaultVRenderApps.delete(env);
        if (!record.app.released) {
          record.app.release();
        }
      }
    }
  };
};

export const resolveVRenderApp = (app: IApp | undefined, mode?: RenderMode): ResolvedVRenderApp => {
  if (app) {
    return { app };
  }

  return retainDefaultVRenderApp(mode);
};

export const createStageFromApp = (app: IApp, params: Partial<IStageParams>): IStage => app.createStage(params);
