import {
  loadAllEnv,
  loadBrowserEnv,
  loadFeishuEnv,
  loadLynxEnv,
  loadNodeEnv,
  loadTaroEnv,
  loadWxEnv,
  loadTtEnv,
  loadHarmonyEnv
} from '@visactor/vrender-kits';

/**
 * 加载所有环境兼容代码
 */
export const registerAllEnv = () => {
  loadAllEnv();
};

/**
 * 加载浏览器环境代码
 */
export const registerBrowserEnv = () => {
  loadBrowserEnv();
};

/**
 * 加载飞书（飞书小程序/block/tt）环境代码
 */
export const registerLarkEnv = () => {
  // TODO: 后续统一为 loadLarkEnv
  loadFeishuEnv();
};

/**
 * 加载 Lynx 环境代码
 */
export const registerLynxEnv = () => {
  loadLynxEnv();
};

/**
 * 加载 Node 环境代码
 */
export const registerNodeEnv = () => {
  loadNodeEnv();
};

/**
 * 加载 Taro 环境代码
 */
export const registerTaroEnv = () => {
  loadTaroEnv();
};

/**
 * 加载微信小程序环境代码
 */
export const registerWXEnv = () => {
  loadWxEnv();
};
/**
 * 加载TT小程序环境代码
 */
export const registerTTEnv = () => {
  loadTtEnv();
};
/**
 * 加载Harmony环境代码
 */
export const registerHarmonyEnv = () => {
  loadHarmonyEnv();
};
