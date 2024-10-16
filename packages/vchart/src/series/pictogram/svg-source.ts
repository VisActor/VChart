import { DataSet, DataView } from '@visactor/vdataset';
import { warn } from '../../util/debug';
import type { GeoSourceType } from '../../typings/geo';
import { registerDataSetInstanceParser } from '../../data/register';
import { IMatrix, Matrix, isString, isValid, isValidNumber, merge } from '@visactor/vutils';

export type SVGSourceOption = {
  type?: 'svg';
};

export interface SVGParserResult {
  root: SVGParsedElement;
  // number, the viewport width of the SVG
  width: number;
  // number, the viewport height of the SVG
  height: number;
  //  {x, y, width, height}, the declared viewBox rect of the SVG, if exists
  viewBoxRect: any;
  // the {scale, position} calculated by viewBox and viewport, is exists
  viewBoxTransform: {
    x: number;
    y: number;
    scale: number;
  };
  elements: SVGParsedElement[];
}

export interface SVGParsedElement {
  id: string;
  tagName: string;
  name: string; // 若不设置，默认为 tagName
  type: string;
  attributes: Record<string, any>;
  transform?: IMatrix;
  parent?: SVGParsedElement;
  value?: string;
  _inheritStyle?: Record<string, any>;
}

export const svgSourceMap = new Map<string, DataView>();

let svgDataSet: DataSet | null;

function initSVGDataSet() {
  if (svgDataSet) {
    return;
  }
  svgDataSet = new DataSet();
  registerDataSetInstanceParser(svgDataSet, 'svg', (data: string, option: SVGSourceOption, dataView: DataView) => {
    const svg = new DOMParser().parseFromString(data, 'text/xml');
    let node = svg.nodeType === 9 ? svg.firstChild : svg;
    while (node && (node.nodeName.toLowerCase() !== 'svg' || node.nodeType !== 1)) {
      node = node.nextSibling;
    }
    if (node) {
      const result = parseSvgNode(node as SVGElement);
      return result;
    }
    return null;
  });
}

function parseSvgNode(svg: SVGElement, opt: any = {}) {
  window.svg = svg;
  const elements: SVGParsedElement[] = [];
  // constant
  const nodeNameToType = {
    svg: 'group',
    rect: 'rect',
    line: 'rule',
    polygon: 'polygon',
    path: 'path',
    polyline: 'line',
    g: 'group',
    circle: 'arc',
    ellipse: 'arc',
    text: 'text'
  };
  const validNodeName = Object.keys(nodeNameToType);
  const validTextAttributes = ['font-size', 'font-family', 'font-weight', 'font-style'];
  const validCircleAttributes = ['cx', 'cy', 'r'];
  const validEllipseAttributes = ['cx', 'cy', 'rx', 'ry'];
  const validLineAttributes = ['x1', 'x2', 'y1', 'y2'];
  const validAttributes = [
    'x',
    'y',
    'width',
    'height',
    'd',
    'points',
    'stroke',
    'stroke-width',
    'fill',
    'fill-opacity',
    'stroke-opacity',
    ...validTextAttributes,
    ...validCircleAttributes,
    ...validEllipseAttributes,
    ...validLineAttributes
  ];
  const validInheritAttributes = [
    'visible',
    'fill',
    'stroke',
    'stroke-width',
    'fill-opacity',
    'stroke-opacity',
    ...validTextAttributes
  ];

  let idx = 0;

  const viewBox = svg.getAttribute('viewBox') || '';

  let root: SVGParsedElement = parseNode(svg, null);

  let width = parseFloat(svg.getAttribute('width') || opt.width);
  let height = parseFloat(svg.getAttribute('height') || opt.height);
  !isValidNumber(width) && (width = null);
  !isValidNumber(height) && (height = null);

  function toCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  function parseInheritAttributes(parsedElement: SVGParsedElement) {
    if (parsedElement.type === 'group') {
      // debugger;
    }
    let inheritedAttrs;
    const { parent, attributes } = parsedElement;

    const parse = (parent: any) => {
      return validInheritAttributes.reduce((acc, attrName) => {
        const camelAttrName = toCamelCase(attrName);
        if (isValid(parent[camelAttrName])) {
          acc[camelAttrName] = parent[camelAttrName];
        }
        return acc;
      }, {});
    };

    if (parent) {
      if (!parent._inheritStyle) {
        parent._inheritStyle = parse(parent.attributes);
      }
      inheritedAttrs = merge({}, parent._inheritStyle, parse(attributes));
    } else {
      inheritedAttrs = parse(attributes);
    }
    return inheritedAttrs;
  }

  function parseAttributes(el: Element, parent?: SVGParsedElement) {
    if (el.getAttribute('id') === 'text22819') {
      debugger;
    }
    const attrs = {};
    const attributes = el.attributes;
    const style = (el as any).style ?? {};
    for (let i = 0; i < validAttributes.length; i++) {
      const attrName = validAttributes[i];
      const attrValue =
        isValid(style[attrName]) && style[attrName] !== '' ? style[attrName] : attributes[attrName]?.value;
      if (isValid(attrValue)) {
        attrs[toCamelCase(attrName)] = isNaN(+attrValue) ? attrValue : parseFloat(attrValue);
      }
    }

    if (style['display'] === 'none') {
      attrs['visible'] = false;
    }

    if (attrs['fontSize'] && isString(attrs['fontSize'])) {
      attrs['fontSize'] = parseFloat(attrs['fontSize']);
    }
    return merge({}, parent?._inheritStyle, attrs);
  }

  function parseParentAttributes(parent: SVGParsedElement) {
    if (parent && parent._inheritStyle) {
      return;
    }
  }

  function parseNode(node: SVGElement, parent: SVGParsedElement) {
    const tagName = node.nodeName.toLowerCase();
    if (!validNodeName.includes(tagName)) {
      return null;
    }
    const el: SVGParsedElement = {
      tagName,
      type: nodeNameToType[tagName],
      attributes: parseAttributes(node, parent),
      value: node.textContent,
      parent,
      name: node.getAttribute('name'),
      id: node.getAttribute('id') ?? `${tagName}-${idx++}`,
      transform: parseTransform(node)
    };

    el._inheritStyle = parseInheritAttributes(el);

    return el;
  }

  function parseTransform(node: SVGElement) {
    let transforms = (node as any).transform?.baseVal as SVGTransformList;
    if (!transforms) {
      return null;
    }
    const matrix = transforms.consolidate()?.matrix;
    if (!matrix) {
      return null;
    }
    const { a, b, c, d, e, f } = matrix;
    return new Matrix(a, b, c, d, e, f);
  }

  function traverse(node: SVGElement, parsedParent: SVGParsedElement) {
    if (!node) {
      return;
    }

    if (!validNodeName.includes(node.tagName)) {
      return;
    }

    let parseResult;
    if (node.nodeName !== 'svg') {
      parseResult = parseNode(node, parsedParent);
    }

    if (parseResult) {
      elements.push(parseResult);
    }
    let child: SVGElement | null = node.firstChild as SVGElement;

    while (child) {
      traverse(child, parseResult ?? parsedParent);
      child = child.nextSibling as SVGElement;
    }
  }

  traverse(svg as SVGElement, root);

  return {
    root,
    width,
    height,
    viewBoxRect: null,
    viewBoxTransform: null,
    elements
  };
}

/**
 * 1. 这个和mapSeries强绑定，后续可以考虑动态注册API
 * 2. 存成dataView而不是原始数据，是考虑减少parser的开销
 */
export function registerSVGSource(key: string, source: GeoSourceType) {
  if (svgSourceMap.has(key)) {
    warn(`svg source key of '${key}' already exists, will be overwritten.`);
  }
  initSVGDataSet();
  const dataView = new DataView(svgDataSet!);
  dataView.parse(source, {
    type: 'svg'
  });
  console.log('svg parse result:', key, dataView.latestData);

  svgSourceMap.set(key, dataView);
}

export function unregisterSVGSource(key: string) {
  if (!svgSourceMap.has(key)) {
    warn(`map type of '${key}' does not exists.`);
    return;
  }
  svgSourceMap.delete(key);
}

export function getSVGSource(type: string) {
  return svgSourceMap.get(type);
}

export function clearSVGSource() {
  svgSourceMap.clear();
  svgDataSet = null;
}
