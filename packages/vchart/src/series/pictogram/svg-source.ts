import { DataSet, DataView } from '@visactor/vdataset';
import { warn } from '../../util/debug';
import type { GeoSourceType } from '../../typings/geo';
import { registerDataSetInstanceParser } from '../../data/register';
import { IMatrix, Matrix, isString, isValid, isValidNumber, merge } from '@visactor/vutils';
import { IRect } from '../../typings';

export type SVGSourceOption = {
  type?: 'svg';
};

export interface SVGParserResult {
  root: SVGParsedElement;
  width: number;
  height: number;
  elements: SVGParsedElement[];
  viewBoxRect?: IRect;
}

export interface SVGParsedElement {
  id: string;
  tagName: string;
  name: string; // 若不设置，默认为 tagName
  graphicType: string;
  attributes: Record<string, any>;
  transform?: IMatrix;
  parent?: SVGParsedElement;
  value?: string;
  _inheritStyle?: Record<string, any>;
  _textGroupStyle?: Record<string, any>;
  _nameFromParent?: string;
  [key: string]: any;
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
  const elements: SVGParsedElement[] = [];
  // constant
  const tagNameToType = {
    svg: 'group',
    rect: 'rect',
    line: 'rule',
    polygon: 'polygon',
    path: 'path',
    polyline: 'line',
    g: 'group',
    circle: 'arc',
    ellipse: 'arc'
  };
  const validTagName = Object.keys(tagNameToType);
  const validGroupNode = ['g', 'svg', 'text', 'tspan', 'switch'];
  const validTextAttributes = ['font-size', 'font-family', 'font-weight', 'font-style', 'text-align', 'text-anchor'];
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

  let root: SVGParsedElement = parseNode(svg, null);
  let width = parseFloat(svg.getAttribute('width') || opt.width);
  let height = parseFloat(svg.getAttribute('height') || opt.height);
  !isValidNumber(width) && (width = null);
  !isValidNumber(height) && (height = null);

  const viewBox = svg.getAttribute('viewBox');
  let viewBoxRect: IRect;
  if (viewBox) {
    const numberReg = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
    function splitNumberSequence(rawStr: string): string[] {
      return rawStr.match(numberReg) || [];
    }
    const viewBoxArr = splitNumberSequence(viewBox);
    if (viewBoxArr.length >= 4) {
      viewBoxRect = {
        x: parseFloat((viewBoxArr[0] || 0) as string),
        y: parseFloat((viewBoxArr[1] || 0) as string),
        width: parseFloat(viewBoxArr[2]),
        height: parseFloat(viewBoxArr[3])
      };
    }
  }

  function toCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  function parseInheritAttributes(parsedElement: SVGParsedElement) {
    let inheritedAttrs;
    const { parent, attributes } = parsedElement;

    const parse = (parent: any) => {
      if (!parent) {
        return {};
      }
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

  function parseAttributes(el: Element) {
    // if (el.getAttribute('id') === 'text22819') {
    //   debugger;
    // }
    const attrs = {};
    const attributes = el.attributes ?? {};
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
    return attrs;
  }

  function parseNode(node: SVGElement, parent: SVGParsedElement) {
    const tagName = node.tagName?.toLowerCase();
    if (node.nodeType === 3 || tagName === 'text' || tagName === 'tspan') {
      return parseText(node, parent);
    }

    if (!validTagName.includes(tagName)) {
      return null;
    }

    const parsed: SVGParsedElement = {
      tagName,
      graphicType: tagNameToType[tagName],
      attributes: parseAttributes(node),
      parent,
      name: node.getAttribute('name') ?? parent?.attributes?.name,
      id: node.getAttribute('id') ?? `${tagName}-${idx++}`,
      transform: parseTransform(node)
    };

    parsed._inheritStyle = parseInheritAttributes(parsed);

    if (parent && !isValid(parsed.name)) {
      parsed._nameFromParent = parent.name ?? parent._nameFromParent;
    }

    return parsed;
  }

  function parseText(node: SVGElement, parent: SVGParsedElement) {
    if (!parent) {
      return null;
    }

    const tagName = node.tagName?.toLowerCase();
    // 孤立 #text 节点不处理
    if (!tagName && parent.graphicType !== 'group') {
      return null;
    }

    // text 当作 group 处理
    // #text 都当作 text 处理
    const nodeAsGroup = tagName === 'text' || tagName === 'tspan';
    const elType = nodeAsGroup ? 'group' : 'text';
    const value = nodeAsGroup ? undefined : node.textContent?.replace(/\n/g, ' ').replace(/\s+/g, ' ');

    if (value === ' ') {
      return null;
    }

    let parsed: SVGParsedElement;

    if (nodeAsGroup) {
      parsed = {
        tagName,
        graphicType: elType,
        attributes: parseAttributes(node),
        parent,
        name: node.getAttribute('name'),
        id: node.getAttribute('id') ?? `${tagName}-${idx++}`,
        transform: parseTransform(node),
        value
      };
    } else {
      // #text or tspan
      parsed = {
        tagName,
        graphicType: 'text',
        attributes: parseAttributes(node),
        parent,
        name: parent?.name,
        id: node.getAttribute?.('id') ?? `${tagName}-${idx++}`,
        value
      };
    }

    parsed._inheritStyle = parseInheritAttributes(parsed);

    if (!isValid(parsed.name)) {
      parsed._nameFromParent = parent.name ?? parent._nameFromParent;
    }

    if (!nodeAsGroup) {
      parsed.attributes = parsed._inheritStyle;
    } else {
      if (parent._textGroupStyle) {
        parsed._textGroupStyle = merge({}, parent._textGroupStyle, parseAttributes(node));
      } else {
        parsed._textGroupStyle = parseAttributes(node);
      }
    }

    return parsed;
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

    let parseResult;
    if (node.nodeName !== 'svg') {
      parseResult = parseNode(node, parsedParent);
    }

    if (parseResult) {
      elements.push(parseResult);
    }

    let child: SVGElement | null = validGroupNode.includes(node.tagName?.toLocaleLowerCase())
      ? (node.firstChild as SVGElement)
      : null;

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
    elements,
    viewBoxRect
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
