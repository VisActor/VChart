import { createBrowserApp, createNodeApp, type IApp, type IStage, type IStageParams } from '@visactor/vrender-core';
import {
  installBrowserEnvToApp,
  installBrowserPickersToApp,
  installDefaultGraphicsToApp,
  installNodeEnvToApp,
  installNodePickersToApp
} from '@visactor/vrender-kits';
import { RenderModeEnum, type RenderMode } from '../typings/spec/common';

type VRenderAppEnv = 'browser' | 'node';

const defaultVRenderApps = new Map<VRenderAppEnv, IApp>();

const getVRenderAppEnv = (mode?: RenderMode): VRenderAppEnv =>
  mode === RenderModeEnum.node || mode === RenderModeEnum.worker ? 'node' : 'browser';

// Default apps are an internal reuse detail; ordinary VChart users should keep using dom/renderCanvas.
const createDefaultVRenderApp = (env: VRenderAppEnv): IApp => {
  const app = env === 'node' ? createNodeApp() : createBrowserApp();

  if (env === 'node') {
    installNodeEnvToApp(app);
    installDefaultGraphicsToApp(app);
    installNodePickersToApp(app);
  } else {
    installBrowserEnvToApp(app);
    installDefaultGraphicsToApp(app);
    installBrowserPickersToApp(app);
  }

  return app;
};

export const getDefaultVRenderApp = (mode?: RenderMode): IApp => {
  const env = getVRenderAppEnv(mode);
  const app = defaultVRenderApps.get(env);

  if (app && !app.released) {
    return app;
  }

  const nextApp = createDefaultVRenderApp(env);
  defaultVRenderApps.set(env, nextApp);

  return nextApp;
};

export const resolveVRenderApp = (app: IApp | undefined, mode?: RenderMode): IApp => app ?? getDefaultVRenderApp(mode);

export const createStageFromApp = (app: IApp, params: Partial<IStageParams>): IStage => app.createStage(params);
