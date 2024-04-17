export const isDatumEqual = (source, target) => {
  const sKeys = Object.keys(source);
  const tKeys = Object.keys(target);

  // 找到source中所有在t中存在的key
  const keys = sKeys.filter(k => tKeys.includes(k));

  return keys.every(key => source[key] === target[key]);
};
