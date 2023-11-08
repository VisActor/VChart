// FIXME: token 兼容策略，照目前的设计不应该硬编码。
// 后续需要二选一：
// - 主题模块指定唯一一套支持的 token（可以保留这段硬编码）
// - 在默认主题中做声明式的兼容（需要删除这段硬编码，并在 IColorKey 中支持新属性）

const legacyTokenMap = {
  titleFontColor: 'primaryFontColor',
  labelFontColor: 'secondaryFontColor'
};

export function getUpgradedColorKey(key: string): string {
  return legacyTokenMap[key] ?? key;
}
