import { Event_Bubble_Level } from '../constant/event';
import type { EventHandler, EventParams, EventBubbleLevel } from './interface';

export type BubbleNode = {
  handler: EventHandler<EventParams>;
  level: EventBubbleLevel;
};

export class Bubble {
  private _map: Map<EventHandler<EventParams>, BubbleNode> = new Map();
  private _levelNodes: Map<EventBubbleLevel, BubbleNode[]> = new Map();

  constructor() {
    this._levelNodes.set(Event_Bubble_Level.vchart, []);
    this._levelNodes.set(Event_Bubble_Level.chart, []);
    this._levelNodes.set(Event_Bubble_Level.model, []);
    this._levelNodes.set(Event_Bubble_Level.mark, []);
  }

  addHandler(handler: EventHandler<EventParams>, level: EventBubbleLevel): this {
    const node: BubbleNode = { level, handler };
    this._levelNodes.get(level)?.push(node);
    this._map.set(handler, node);
    return this;
  }

  removeHandler(handler: EventHandler<EventParams>): this {
    const node = this._map.get(handler);
    if (!node) {
      return this;
    }
    node.handler.wrappedCallback?.cancel?.();
    this._map.delete(handler);
    const nodes = this._levelNodes.get(node.level);
    const index = nodes?.indexOf(node);
    index !== undefined && index >= 0 && nodes?.splice(index, 1);
    return this;
  }

  preventHandler(handler: EventHandler<EventParams>): this {
    if (handler) {
      handler.prevented = true;
    }
    return this;
  }

  allowHandler(handler: EventHandler<EventParams>): this {
    if (handler) {
      handler.prevented = false;
    }
    return this;
  }

  getHandlers(level: EventBubbleLevel): EventHandler<EventParams>[] {
    return this._levelNodes.get(level)?.map(node => node.handler) || [];
  }

  getAllHandlers(): EventHandler<EventParams>[] {
    return Array.from(this._map.values()).map(node => node.handler) || [];
  }

  getCount() {
    return this._map.size;
  }

  release() {
    this._map.forEach(({ handler }) => handler.wrappedCallback?.cancel?.());
    this._map.clear();
    this._levelNodes.clear();
  }
}
