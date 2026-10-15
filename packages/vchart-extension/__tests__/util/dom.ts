export function createDiv(container: HTMLElement = document.body): HTMLElement {
  const div = document.createElement('div');
  container.appendChild(div);
  return div;
}

export function removeDom(dom: HTMLElement) {
  dom.parentNode?.removeChild(dom);
}
