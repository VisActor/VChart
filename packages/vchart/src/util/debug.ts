import { Logger, isFunction } from '@visactor/vutils';

export let log = (msg: string, ...args: any[]) => {
  // do nothing
};
export let warn = (msg: string, detail?: any) => {
  // do nothing
};
export let error = (msg: string, detail?: any, err?: Error) => {
  // do nothing
};

if (__DEV__) {
  const hasConsole = typeof console !== 'undefined';

  log = (msg: string, ...args: any[]) => {
    if (!config.silent) {
      return Logger.logger(Logger.Info, 'log').info(msg, ...args);
    }
  };

  warn = (msg: string, detail?: any) => {
    if (isFunction(config.warnHandler)) {
      config.warnHandler.call(null, msg, detail);
    } else if (hasConsole && !config.silent) {
      if (detail) {
        return Logger.logger(Logger.Warn, 'warn').warn(`[VChart warn]: ${msg}\n`, detail);
      }
      return Logger.logger(Logger.Warn, 'warn').warn(`[VChart warn]: ${msg}`);
    }
  };

  error = (msg: string, detail?: any, err?: Error) => {
    const errIns = new Error(msg);
    if (isFunction(config.errorHandler)) {
      config.errorHandler.call(null, errIns, detail);
    } else if (!config.silent) {
      return Logger.logger(Logger.Error, 'error').error(`[VChart error]: ${errIns}`, detail);
    }
  };
}

export const config = {
  silent: false,
  warnHandler: false,
  errorHandler: false
} as unknown as IConfig;

export interface IConfig {
  /**
   * 是否开启控制台告警
   */
  silent: boolean;
  /**
   * 错误处理
   */
  errorHandler?: (err: Error, detail?: any) => void;
  /**
   * 警告处理
   */
  warnHandler?: (msg: string, detail?: any) => void;
}
