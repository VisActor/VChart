import { getContainerSize, isValid } from '@visactor/vutils';

export function calculateSize(container: HTMLElement | null, userSize: { width: number; height: number }) {
  const { width: userWidth, height: userHeight } = userSize;
  if (isValid(userWidth) && isValid(userHeight)) {
    return {
      width: userWidth,
      height: userHeight
    };
  }
  let width = 500;
  let height = 500;
  if (container) {
    const { width: containerWidth, height: containerHeight } = getContainerSize(container, width, height);
    width = containerWidth;
    height = containerHeight;
  }

  width = userWidth ?? width;
  height = userHeight ?? height;

  return {
    width,
    height
  };
}
