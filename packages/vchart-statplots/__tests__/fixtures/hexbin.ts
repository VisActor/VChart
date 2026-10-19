/** 确定性的合成双簇散点，用于分辨率与不同单位的对照。 */
export function hexbinPoints(length = 400) {
  return Array.from({ length }, (_, i) => {
    const cluster = i % 2;
    const angle = i * 2.399963229728653;
    const radius = Math.sqrt(((i * 73) % 199) / 199);
    return {
      x: (cluster ? 7 : 3) + Math.cos(angle) * radius * 2,
      y: (cluster ? 6 : 3) + Math.sin(angle) * radius * 1.5
    };
  });
}
