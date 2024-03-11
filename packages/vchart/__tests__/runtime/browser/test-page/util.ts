export const domDocument: Document | undefined = globalThis.document;

export const createElement = <T extends HTMLElement = HTMLElement>(
  tag: keyof HTMLElementTagNameMap,
  classList?: string[],
  style?: Partial<CSSStyleDeclaration>,
  attr?: Record<string, string | undefined>,
  id?: string
): T => {
  const element = domDocument.createElement(tag) as T;

  if (classList) {
    element.classList.add(...classList);
  }
  if (style) {
    setElementStyle(element, style);
  }
  if (id) {
    element.id = id;
  }
  if (attr) {
    for (const key in attr) {
      const attrItem = document.createAttribute(key);
      const value = attr[key];
      if (isValid(value)) {
        attrItem.value = value;
        element.attributes.setNamedItem(attrItem);
      }
    }
  }

  return element;
};

export const setElementStyle = (element: HTMLElement, style: Partial<CSSStyleDeclaration>) => {
  Object.keys(style).forEach((key: any) => {
    element.style[key] = style[key]!;
  });
};

export const isValid = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};
