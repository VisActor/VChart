import * as VRender from '@visactor/vrender';
import type { IApp, IStage, IStageParams } from '@visactor/vrender-core';
import { RenderModeEnum, type RenderMode } from '../typings/spec/common';

type VRenderAppEnv = 'browser' | 'node' | 'feishu' | 'tt' | 'wx' | 'lynx' | 'harmony';
type VRenderSharedAppKey = string | symbol;

type DefaultVRenderAppRecord = {
  app: IApp;
  refCount: number;
};

export type SharedVRenderAppOption = {
  /**
   * Explicit host/page/container scope. VChart intentionally does not use
   * VRender's default shared key to avoid sharing apps with different app-level
   * environment capabilities.
   */
  key: VRenderSharedAppKey;
};

export type ResolveVRenderAppOptions = {
  app?: IApp;
  mode?: RenderMode;
  modeParams?: unknown;
  sharedVRenderApp?: SharedVRenderAppOption;
};

export type ResolvedVRenderApp = {
  app: IApp;
  releaseAppRef?: () => void;
};

const defaultVRenderApps = new Map<VRenderAppEnv, DefaultVRenderAppRecord>();

type VRenderModule = typeof VRender & {
  createBrowserVRenderApp: (options?: { envParams?: unknown }) => IApp;
  createNodeVRenderApp: (options?: { envParams?: unknown }) => IApp;
  createFeishuVRenderApp?: (options?: { envParams?: unknown }) => IApp;
  createTTVRenderApp?: (options?: { envParams?: unknown }) => IApp;
  createWxVRenderApp?: (options?: { envParams?: unknown }) => IApp;
  createLynxVRenderApp?: (options?: { envParams?: unknown }) => IApp;
  createHarmonyVRenderApp?: (options?: { envParams?: unknown }) => IApp;
  acquireSharedVRenderApp?: (options: { env: VRenderAppEnv; key?: VRenderSharedAppKey; envParams?: unknown }) => {
    app: IApp;
    release: () => void;
  };
};

const vRenderModule = VRender as VRenderModule;

export const getVRenderAppEnv = (mode?: RenderMode): VRenderAppEnv => {
  switch (mode) {
    case RenderModeEnum.node:
    case RenderModeEnum.worker:
      return 'node';
    case RenderModeEnum.miniApp:
    case RenderModeEnum['desktop-miniApp']:
      return 'feishu';
    case RenderModeEnum.wx:
      return 'wx';
    case RenderModeEnum.tt:
      return 'tt';
    case RenderModeEnum.harmony:
      return 'harmony';
    case RenderModeEnum.lynx:
      return 'lynx';
    default:
      return 'browser';
  }
};

const isObjectLike = (value: unknown): value is Record<string, unknown> =>
  value != null && (typeof value === 'object' || typeof value === 'function');

const LYNX_APP_ENV_PARAM_KEYS = ['pixelRatio', 'lynx', 'runtime', 'canvasFactory'] as const;

/**
 * App envParams carry only app-scope environment capabilities. Concrete canvas
 * view binding, including Lynx domref/canvasIdLists/freeCanvasIdx, belongs to
 * app.createStage({ canvas, width, height, dpr }).
 */
export const getVRenderAppEnvParams = (mode?: RenderMode, modeParams?: unknown): unknown => {
  if (getVRenderAppEnv(mode) !== 'lynx') {
    return modeParams;
  }
  if (!isObjectLike(modeParams)) {
    return undefined;
  }

  const envParams: Record<string, unknown> = {};
  LYNX_APP_ENV_PARAM_KEYS.forEach(key => {
    if (modeParams[key] !== undefined) {
      envParams[key] = modeParams[key];
    }
  });

  return Object.keys(envParams).length ? envParams : undefined;
};

// Default apps are an internal reuse detail; ordinary VChart users should keep using dom/renderCanvas.
const createVRenderApp = (env: VRenderAppEnv, envParams?: unknown): IApp => {
  const options = envParams === undefined ? undefined : { envParams };

  switch (env) {
    case 'node':
      return vRenderModule.createNodeVRenderApp(options);
    case 'feishu':
      return (vRenderModule.createFeishuVRenderApp ?? vRenderModule.createBrowserVRenderApp)(options);
    case 'tt':
      return (vRenderModule.createTTVRenderApp ?? vRenderModule.createBrowserVRenderApp)(options);
    case 'wx':
      return (vRenderModule.createWxVRenderApp ?? vRenderModule.createBrowserVRenderApp)(options);
    case 'lynx':
      return (vRenderModule.createLynxVRenderApp ?? vRenderModule.createBrowserVRenderApp)(options);
    case 'harmony':
      return (vRenderModule.createHarmonyVRenderApp ?? vRenderModule.createBrowserVRenderApp)(options);
    default:
      return vRenderModule.createBrowserVRenderApp(options);
  }
};

const getDefaultVRenderAppRecord = (mode?: RenderMode, envParams?: unknown): DefaultVRenderAppRecord => {
  const env = getVRenderAppEnv(mode);
  const record = defaultVRenderApps.get(env);

  if (record && !record.app.released) {
    return record;
  }

  const nextRecord = {
    app: createVRenderApp(env, envParams),
    refCount: 0
  };
  defaultVRenderApps.set(env, nextRecord);

  return nextRecord;
};

export const getDefaultVRenderApp = (mode?: RenderMode): IApp => getDefaultVRenderAppRecord(mode).app;

const createExclusiveVRenderApp = (env: VRenderAppEnv, envParams?: unknown): ResolvedVRenderApp => {
  const app = createVRenderApp(env, envParams);
  let released = false;

  return {
    app,
    releaseAppRef: () => {
      if (released) {
        return;
      }
      released = true;
      if (!app.released) {
        app.release();
      }
    }
  };
};

const shouldReuseDefaultVRenderApp = (env: VRenderAppEnv): boolean => env === 'browser' || env === 'node';

const retainDefaultVRenderApp = (mode?: RenderMode, envParams?: unknown): ResolvedVRenderApp => {
  const env = getVRenderAppEnv(mode);
  if (!shouldReuseDefaultVRenderApp(env)) {
    return createExclusiveVRenderApp(env, envParams);
  }

  const record = getDefaultVRenderAppRecord(mode, envParams);
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

const isIApp = (value: unknown): value is IApp => !!value && typeof (value as IApp).createStage === 'function';

const normalizeResolveOptions = (
  appOrOptions?: IApp | ResolveVRenderAppOptions,
  mode?: RenderMode
): ResolveVRenderAppOptions => {
  if (!appOrOptions || isIApp(appOrOptions)) {
    return {
      app: appOrOptions as IApp | undefined,
      mode
    };
  }

  return appOrOptions;
};

const acquireSharedVRenderApp = (
  env: VRenderAppEnv,
  key: VRenderSharedAppKey,
  envParams?: unknown
): ResolvedVRenderApp | undefined => {
  const acquire = vRenderModule.acquireSharedVRenderApp;
  if (!acquire) {
    return undefined;
  }

  const handle = acquire({
    env,
    key,
    ...(envParams === undefined ? {} : { envParams })
  });

  return {
    app: handle.app,
    releaseAppRef: () => handle.release()
  };
};

export const resolveVRenderApp = (
  appOrOptions?: IApp | ResolveVRenderAppOptions,
  mode?: RenderMode
): ResolvedVRenderApp => {
  const options = normalizeResolveOptions(appOrOptions, mode);

  if (options.app) {
    return { app: options.app };
  }

  const env = getVRenderAppEnv(options.mode);
  const envParams = getVRenderAppEnvParams(options.mode, options.modeParams);
  const sharedKey = options.sharedVRenderApp?.key;

  if (sharedKey != null) {
    return acquireSharedVRenderApp(env, sharedKey, envParams) ?? createExclusiveVRenderApp(env, envParams);
  }

  return retainDefaultVRenderApp(options.mode, envParams);
};

export const createStageFromApp = (app: IApp, params: Partial<IStageParams>): IStage => app.createStage(params);
