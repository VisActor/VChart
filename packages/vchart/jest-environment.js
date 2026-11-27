const ElectronEnvironment = require('jest-electron/environment');

/** jest-electron 复用窗口；每个 Jest 模块注册表必须拥有独立的全局单例。 */
module.exports = class VChartTestEnvironment extends ElectronEnvironment {
  async setup() {
    await super.setup();
    this.hostSymbols = new Set(Object.getOwnPropertySymbols(this.global));
  }

  async teardown() {
    for (const key of Object.getOwnPropertySymbols(this.global)) {
      // Jest 的 matcher 符号不可删除，由框架管理；库新增的单例符号可配置。
      if (!this.hostSymbols.has(key) && Object.getOwnPropertyDescriptor(this.global, key).configurable) {
        delete this.global[key];
      }
    }
    await super.teardown();
  }
};
