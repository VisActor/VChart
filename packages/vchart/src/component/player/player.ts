import { Factory } from './../../core/factory';
import type { INode, IGroup, IGraphic } from '@visactor/vrender-core';
import type { ContinuousPlayerAttributes, DiscretePlayerAttributes } from '@visactor/vrender-components';

// eslint-disable-next-line no-duplicate-imports
import { DiscretePlayer, ContinuousPlayer, PlayerEventEnum } from '@visactor/vrender-components';
import { isNumber, array, isEqual, isNil, isValidNumber } from '@visactor/vutils';

import type { ILayoutRect, IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { IComponentOption } from '../interface';

import type { DirectionType, IPlayer } from './interface';
// eslint-disable-next-line no-duplicate-imports
import type { IComponent } from '../interface';
import type { IPoint, IOrientType } from '../../typings';
import { type IChartSpec, type IDataValues } from '../..';

// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import { BaseComponent } from '../base/base-component';
import { transformContinuousSpecToAttrs, transformDiscreteSpecToAttrs } from './utils/transform';
import { isHorizontal, isVertical } from './utils/orient';
import { ChartEvent, LayoutLevel, LayoutZIndex } from '../../constant';

export class Player extends BaseComponent<IPlayer> implements IComponent {
  layoutZIndex: number = LayoutZIndex.Player;
  layoutLevel: number = LayoutLevel.Player;

  static type = ComponentTypeEnum.player;
  type = ComponentTypeEnum.player;
  specKey = 'player';
  private _orient: IOrientType = 'bottom';
  private _specs: Partial<IChartSpec>[];

  private _playerComponent: DiscretePlayer | ContinuousPlayer;
  private _cacheAttrs: ContinuousPlayerAttributes | DiscretePlayerAttributes;

  private _direction: DirectionType;
  private _alternate: boolean;
  private _dx: number;
  private _dy: number;
  private _width: number;
  private _height: number;
  private _position: 'start' | 'middle' | 'end';

  get orient() {
    return this._orient;
  }

  get layoutOrient() {
    return this._orient;
  }

  set layoutOrient(v: IOrientType) {
    this._orient = v;
  }

  static createComponent = (spec: IChartSpec, options: IComponentOption) => {
    const playerSpec = spec.player as IPlayer;
    if (isNil(playerSpec) || playerSpec.visible === false) {
      return null;
    }
    return new Player(playerSpec, options);
  };

  /**
   * 设置Attr
   */
  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._orient = this._spec.orient ?? 'bottom';
    this._specs = this._spec.specs ?? [];
    this._direction = this._spec.direction ?? 'default';
    this._alternate = this._spec.alternate ?? false;
    this._dx = this._spec.dx ?? 0;
    this._dy = this._spec.dy ?? 0;
    this._position = this._spec.position ?? 'middle';
  }

  /**
   * 计算组件位置(布局的左上角起点)
   * @param pos
   */
  setLayoutStartPosition(pos: Partial<IPoint>) {
    super.setLayoutStartPosition(pos);
    if (isValidNumber(pos.x)) {
      const offsetX = isVertical(this._orient) ? pos.x + this._sliderExceededSize() / 2 : pos.x;
      this._playerComponent && this._playerComponent.setAttribute('x', offsetX);
    }
    if (isValidNumber(pos.y)) {
      const offsetY = isHorizontal(this._orient) ? pos.y + this._sliderExceededSize() / 2 : pos.y;
      this._playerComponent && this._playerComponent.setAttribute('y', offsetY);
    }
  }

  /**
   * 计算组件占用的bound box
   * @param rect
   * @returns
   */
  _boundsInRect(rect: ILayoutRect, fullSpace: ILayoutRect) {
    this._width = this._computeWidth(rect);
    this._height = this._computeHeight(rect);
    this._dx = this._computeDx(fullSpace);
    this._dy = this._computeDy(fullSpace);

    const bounds = this._computeLayoutRect(rect, this._width, this._height);

    this._createOrUpdatePlayerComponent();

    return bounds;
  }

  changeRegions(regions: IRegion[]): void {
    // do nothing
  }

  onRender(ctx: IModelRenderOption): void {
    // do nothing
  }

  getVRenderComponents(): IGraphic[] {
    return [this._playerComponent] as unknown as IGroup[];
  }

  /**
   * 播放器属性
   */
  private _getPlayerAttrs = () => {
    const type = this._spec.type;
    const layoutAttrs = {
      size: {
        width: this._width,
        height: this._height
      },
      dx: this._spec.dx ?? 0 + this._dx,
      dy: this._spec.dy ?? 0 + this._dy
    };
    // 离散类型Attrs
    if (type === 'discrete') {
      return {
        ...transformDiscreteSpecToAttrs(this._spec, this._specs),
        ...layoutAttrs,
        disableTriggerEvent: this._option.disableTriggerEvent
      };
    }
    // 连续类型Attrs
    return {
      ...transformContinuousSpecToAttrs(this._spec, this._specs),
      ...layoutAttrs,
      disableTriggerEvent: this._option.disableTriggerEvent
    };
  };

  /**
   * 创建或更新播放器组件
   */
  private _createOrUpdatePlayerComponent = () => {
    const attrs = { ...this._getPlayerAttrs() };
    const container = this.getContainer();
    if (this._playerComponent) {
      if (!isEqual(attrs, this._cacheAttrs)) {
        this._cacheAttrs = attrs;
        this._playerComponent.setAttributes(attrs);
      }
    } else {
      if (attrs.type === 'discrete') {
        this._playerComponent = new DiscretePlayer(attrs);
      } else {
        this._playerComponent = new ContinuousPlayer(attrs);
      }

      this._cacheAttrs = attrs;
      this._playerComponent.name = `player`;

      container.add(this._playerComponent as unknown as INode);

      this._initEvent();
    }
  };

  /**
   * 计算起点
   */
  private _computeLayoutRect(rect: ILayoutRect, width: number, height: number) {
    switch (this._orient) {
      case 'top': {
        return { x1: 0, y1: 0, x2: width, y2: height };
      }
      case 'right': {
        return { x1: rect.width - width, y1: 0, x2: rect.width, y2: rect.height };
      }
      case 'left': {
        return { x1: 0, y1: 0, x2: width, y2: height };
      }
      case 'bottom':
      default: {
        return { x1: 0, y1: rect.height - height, x2: rect.width, y2: rect.height };
      }
    }
  }

  /**
   * 计算组件宽度
   */
  private _computeWidth(rect: ILayoutRect) {
    // 若设置的是数值则直接返回
    if (isNumber(this._spec.width)) {
      return Math.min(rect.width, Number(this._spec.width));
    }

    if (isVertical(this._orient)) {
      return this._maxSize();
    }
    return rect.width;
  }

  /**
   * 计算组件高度
   */
  private _computeHeight(rect: ILayoutRect) {
    // 若设置的是数值则直接返回
    if (isNumber(this._spec.height)) {
      this._height = this._spec.height;
      return Math.min(rect.height, Number(this._spec.height));
    }

    if (isHorizontal(this._orient)) {
      return this._maxSize();
    }
    return rect.height;
  }

  /**
   * 计算x方向的偏移, 用于实现对齐
   */
  private _computeDx(rect: ILayoutRect) {
    // 垂直时, x不偏移
    if (isVertical(this._orient)) {
      return 0;
    }

    // start
    if (this._position === 'start') {
      return 0;
    }
    // middle
    else if (this._position === 'middle') {
      return (rect.width - this._width) / 2;
    }
    // end
    return rect.width - this._width;
  }

  /**
   * 计算y方向的偏移, 用于实现对齐
   */
  private _computeDy(rect: ILayoutRect) {
    // 水平时, y不偏移
    if (isHorizontal(this._orient)) {
      return 0;
    }

    // start
    if (this._position === 'start') {
      return 0;
    }
    // middle
    else if (this._position === 'middle') {
      return (rect.height - this._height) / 2;
    }

    // end
    return rect.height - this._height;
  }

  /**
   * 播放器宽度取计算子组件中最高的一个
   */
  private _maxSize = () => {
    return Math.max(
      ...array(this._spec.controller.start?.style?.size),
      ...array(this._spec.controller.pause?.style?.size),
      ...array(this._spec.controller.backward?.style?.size),
      ...array(this._spec.controller.forward?.style?.size),
      (isVertical(this._orient) ? this._spec.slider.railStyle.width : this._spec.slider.railStyle.height) ?? 10
    );
  };

  /**
   * 滑动条超过按钮的高度
   */
  private _sliderExceededSize = () => {
    const sliderHeight =
      (isVertical(this._orient) ? this._spec.slider.railStyle.width : this._spec.slider.railStyle.height) ?? 10;
    const controllersHeight = Math.max(
      ...array(this._spec.controller.start?.style?.size),
      ...array(this._spec.controller.pause?.style?.size),
      ...array(this._spec.controller.backward?.style?.size),
      ...array(this._spec.controller.forward?.style?.size)
    );
    if (sliderHeight >= controllersHeight) {
      return sliderHeight - controllersHeight;
    }
    return 0;
  };

  /**
   * 事件
   */
  private _initEvent = () => {
    if (this._option.disableTriggerEvent) {
      return;
    }
    // 自动播放
    this._option.globalInstance.on(ChartEvent.rendered, () => {
      if (this._spec?.auto) {
        this._playerComponent.play();
      }
    });

    // 循环播放 与 交替方向
    this._playerComponent.addEventListener(PlayerEventEnum.OnEnd, () => {
      this.event.emit(ChartEvent.playerEnd, { model: this });

      // 交替方向, 仅离散轴支持
      if (this._alternate && this._spec.type === 'discrete') {
        this._direction = this._direction === 'default' ? 'reverse' : 'default';
        this._playerComponent.setAttributes({
          direction: this._direction,
          dataIndex: this._direction === 'reverse' ? this._specs.length - 2 : 1
        });
      }

      // 循环播放
      if (this._spec?.loop) {
        this._playerComponent.play();
      }
    });

    // 数据更新
    this._playerComponent.addEventListener(PlayerEventEnum.OnChange, (e: { detail: { index: number } }) => {
      // 更新data
      const { index } = e.detail;
      const spec = this._specs[index];
      (array(spec.data) as IDataValues[]).forEach(data => {
        this._option?.globalInstance?.updateData(data.id, data.values);
      });

      this.event.emit(ChartEvent.playerChange, {
        model: this,
        value: {
          spec: spec,
          index: index,
          specs: this._specs
        }
      });
    });

    // 后退
    this._playerComponent.addEventListener(PlayerEventEnum.OnBackward, (e: { detail: { index: number } }) => {
      const { index } = e.detail;
      const spec = this._specs[index];
      this.event.emit(ChartEvent.playerBackward, {
        model: this,
        value: {
          spec: spec,
          index: index,
          specs: this._specs
        }
      });
    });

    // 前进
    this._playerComponent.addEventListener(PlayerEventEnum.OnForward, (e: { detail: { index: number } }) => {
      const { index } = e.detail;
      const spec = this._specs[index];
      this.event.emit(ChartEvent.playerForward, {
        model: this,
        value: {
          spec: spec,
          index: index,
          specs: this._specs
        }
      });
    });

    // 播放
    this._playerComponent.addEventListener(PlayerEventEnum.OnPlay, (e: { detail: { index: number } }) => {
      const { index } = e.detail;
      const spec = this._specs[index];
      this.event.emit(ChartEvent.playerPlay, {
        model: this,
        value: {
          spec: spec,
          index: index,
          specs: this._specs
        }
      });
    });

    // 暂停
    this._playerComponent.addEventListener(PlayerEventEnum.OnPause, (e: { detail: { index: number } }) => {
      const { index } = e.detail;
      const spec = this._specs[index];
      this.event.emit(ChartEvent.playerPause, {
        model: this,
        value: {
          spec: spec,
          index: index,
          specs: this._specs
        }
      });
    });
  };
}

export const registerPlayer = () => {
  Factory.registerComponent(Player.type, Player);
};
