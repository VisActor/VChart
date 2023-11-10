import type React from 'react';
import { Button, Popover } from '@douyinfe/semi-ui';
import { Symbol } from '@visactor/vrender-core';
import type { IBaseShapeComponentProps } from '../typings/base';
import { defaultBaseComponentConfig } from '../config/base';
import { tooltipWrapper } from '../utils/node';
import { isString } from '@visactor/vutils';

const shapeHtmlStore = new Map<string, string>();

function getSvgHtml(
  symbolType: string,
  size: number,
  fill: string,
  stroke?: string,
  lineWidth: number = 0,
  hollow: boolean = false
) {
  let fillString: string = 'currentColor';
  const getStroke = () => (stroke ? stroke : fillString);

  const symbol = new Symbol({ symbolType, size, fill: true });
  const pathModel = symbol.getParsedPath().path ?? symbol.getParsedPath().pathStr;
  const path = pathModel.toString();
  let viewBox = '-0.5 -0.5 1 1';
  if (!isString(pathModel)) {
    const bounds = pathModel.bounds;
    viewBox = `${bounds.x1} ${bounds.y1} ${bounds.width()} ${bounds.height()}`;
  }

  if (!fill || isString(fill) || hollow) {
    fillString = hollow ? 'none' : fill ? fill : 'currentColor';
    return `
    <svg width="${size}" height="${size}" viewBox="${viewBox}"
      style="display: inline-block; vertical-align: middle;">
      <path
        d="${path}"
        style="fill: ${fillString}; stroke: ${getStroke()}; stroke-width: ${lineWidth ?? 0}px"
      >
      </path>
    </svg>`;
  }

  return '';
}

function SvgShape(props: { shape: string; className?: string; onClick?: (e?: React.MouseEvent) => void }) {
  const { shape, className, onClick } = props;
  if (!shapeHtmlStore.has(shape)) {
    shapeHtmlStore.set(shape, getSvgHtml(shape, 16, '#555'));
  }
  const html = shapeHtmlStore.get(shape);

  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }}></div>;
}

const shapeList = [
  'circle',
  'cross',
  'diamond',
  'square',
  'arrow',
  'arrow2Left',
  'arrow2Right',
  'wedge',
  'thinTriangle',
  'triangle',
  'triangleUp',
  'triangleDown',
  'triangleRight',
  'triangleLeft'
  // 'stroke',
  // 'star',
  // 'wye',
  // 'rect'
];

function ShapePanel(props: { shape?: string; onChange?: (shape: string) => void }) {
  return (
    <div className="vchart-editor-ui-panel-shape-container">
      {shapeList.map(shape => (
        <SvgShape
          key={shape}
          shape={shape}
          className={`vchart-editor-ui-panel-shape-item ${
            shape === props.shape ? 'vchart-editor-ui-panel-shape-item-selected' : ''
          }`}
          onClick={() => {
            if (props.onChange && props.shape !== shape) {
              props.onChange.call(null, shape);
            }
          }}
        />
      ))}
    </div>
  );
}

export function Shape(props: IBaseShapeComponentProps) {
  const label = props.label ?? defaultBaseComponentConfig.select.label;

  return (
    <div className="vchart-editor-ui-panel-base-container">
      {tooltipWrapper(<p className="vchart-editor-ui-panel-base-label">{label}</p>, props.tooltip)}
      <Popover
        spacing={10}
        content={
          <ShapePanel
            shape={props.shape}
            onChange={shape => {
              props.onChange?.(shape);
            }}
          />
        }
      >
        <Button>
          <SvgShape shape={props.shape} />
        </Button>
      </Popover>

      {/* <SemiSelect
        value={props.value}
        style={{ width: 180 }}
        optionList={selectOptions}
        onChange={value => {
          props.onChange?.(value);
        }}
      ></SemiSelect> */}
    </div>
  );
}
