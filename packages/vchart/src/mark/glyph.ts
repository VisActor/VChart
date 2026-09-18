import type { ICommonSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IGlyph, IGlyphGraphicAttribute, IGraphic, ISetAttributeContext } from '@visactor/vrender-core';
import { createGlyph, registerGlyph, registerShadowRoot } from '../vrender-bridge';
import type { IGlyphMark } from './interface/mark';
import type { MarkType } from './interface/type';
import { Factory } from '../core/factory';
import type { Datum } from '../typings/common';
import type { IMarkGraphic } from './interface/common';

type SubGraphicAttributes = Record<string, Record<string, any>>;

type GlyphEncoderDefinition = {
  positionChannels: string[];
  channelEncoder: GlyphMark['_channelEncoder'];
  subMarks: GlyphMark['_subMarks'];
  positionKeys: string[];
  channelKeys: string[];
};

type GlyphEncoding = {
  definition: GlyphEncoderDefinition;
  children: IGraphic[];
  data?: Datum[];
  inputs: any[];
  parts: SubGraphicAttributes[];
};

export abstract class GlyphMark<T extends ICommonSpec = ICommonSpec, Cfg = any>
  extends BaseMark<T>
  implements IGlyphMark<T, Cfg>
{
  protected _defaultGlyphAttrs: T;

  protected _subMarks: Record<
    string,
    {
      type: MarkType;
      defaultAttributes?: any;
    }
  >;

  getSubMarks() {
    return this._subMarks;
  }

  protected _glyphConfig: Cfg;

  setGlyphConfig(cfg: Cfg) {
    this._glyphConfig = cfg;
    this._glyphEncoderDefinition = undefined;
  }

  getGlyphConfig() {
    return this._glyphConfig;
  }

  protected _positionChannels: string[];

  getPositionChannels() {
    return this._positionChannels;
  }

  protected _positionEncoder: (glyphAttrs: any, datum: Datum, g: IGlyph) => Record<string, any>;

  protected _channelEncoder: Record<string, (channelValue: any) => Record<string, any>>;

  private _glyphEncoderDefinition?: GlyphEncoderDefinition;
  private _glyphEncodings = new WeakMap<IGlyph, GlyphEncoding>();

  private _getGlyphEncoderDefinition(): GlyphEncoderDefinition {
    let definition = this._glyphEncoderDefinition;
    if (
      !definition ||
      definition.positionChannels !== this._positionChannels ||
      definition.channelEncoder !== this._channelEncoder ||
      definition.subMarks !== this._subMarks
    ) {
      definition = {
        positionChannels: this._positionChannels,
        channelEncoder: this._channelEncoder,
        subMarks: this._subMarks,
        positionKeys: Array.from(new Set(this._positionChannels ?? [])),
        channelKeys: Object.keys(this._channelEncoder ?? {})
      };
      this._glyphEncoderDefinition = definition;
    }
    return definition;
  }

  protected _afterCreateGraphic(g: IMarkGraphic & IGlyph): void {
    g.setSubGraphicEncoder(this._encodeGlyph);
  }

  private _encodeGlyph = (glyph: IGlyph, context?: ISetAttributeContext): void => {
    const definition = this._getGlyphEncoderDefinition();
    const children = glyph.getSubGraphic();
    const previous = this._glyphEncodings.get(glyph);
    const reset = !previous || previous.definition !== definition || previous.children !== children;
    const cache: GlyphEncoding = reset ? { definition, children, inputs: [], parts: [] } : previous;
    const data = glyph.context.data;
    const force = reset || cache.data !== data || glyph.context.reusing;
    let dirty: Map<string, Set<string>> | undefined;
    const collectKey = (name: string, key: string) => {
      dirty ??= new Map();
      let keys = dirty.get(name);
      if (!keys) {
        keys = new Set();
        dirty.set(name, keys);
      }
      keys.add(key);
    };
    const collectKeys = (part?: SubGraphicAttributes) => {
      if (part) {
        for (const name of Object.keys(part)) {
          for (const key of Object.keys(part[name] ?? {})) {
            collectKey(name, key);
          }
        }
      }
    };
    if (reset && previous) {
      previous.parts.forEach(collectKeys);
    }
    const updatePart = (index: number, part?: SubGraphicAttributes) => {
      const previousPart = cache.parts[index];
      if (force) {
        collectKeys(previousPart);
        collectKeys(part);
      } else {
        if (previousPart) {
          for (const name of Object.keys(previousPart)) {
            const next = part?.[name];
            for (const key of Object.keys(previousPart[name] ?? {})) {
              if (!next || !Object.prototype.hasOwnProperty.call(next, key)) {
                collectKey(name, key);
              }
            }
          }
        }
        if (part) {
          for (const name of Object.keys(part)) {
            const prev = previousPart?.[name];
            const next = part[name];
            for (const key of Object.keys(next ?? {})) {
              if (!prev || !Object.prototype.hasOwnProperty.call(prev, key) || prev[key] !== next[key]) {
                collectKey(name, key);
              }
            }
          }
        }
      }
      cache.parts[index] = part;
    };
    let positionChanged = force;
    const { positionKeys, channelKeys } = definition;
    for (let i = 0; i < positionKeys.length; i++) {
      const value = (glyph.attribute as any)[positionKeys[i]];
      positionChanged = positionChanged || cache.inputs[i] !== value;
      cache.inputs[i] = value;
    }
    if (positionChanged) {
      updatePart(0, this._positionEncoder?.(glyph.attribute, data[0], glyph));
    }
    for (let i = 0; i < channelKeys.length; i++) {
      const channel = channelKeys[i];
      const value = (glyph.attribute as any)[channel];
      const inputIndex = positionKeys.length + i;
      if (force || cache.inputs[inputIndex] !== value) {
        updatePart(i + 1, value === undefined ? undefined : this._channelEncoder[channel](value));
      }
      cache.inputs[inputIndex] = value;
    }
    cache.data = data;
    if (reset) {
      this._glyphEncodings.set(glyph, cache);
    }
    if (!dirty) {
      return;
    }
    for (const child of children) {
      const keys = dirty.get(child.name);
      if (!keys) {
        continue;
      }
      let patch: Record<string, any> | undefined;
      let removedKeys: string[] | undefined;
      let changed = false;
      const base = child.baseAttributes;
      const defaults = definition.subMarks[child.name]?.defaultAttributes;
      keys.forEach(key => {
        let hasValue = false;
        let value: any;
        for (let i = cache.parts.length - 1; i >= 0; i--) {
          const attrs = cache.parts[i]?.[child.name];
          if (attrs && Object.prototype.hasOwnProperty.call(attrs, key)) {
            hasValue = true;
            value = attrs[key];
            break;
          }
        }
        if (!hasValue && defaults && Object.prototype.hasOwnProperty.call(defaults, key)) {
          hasValue = true;
          value = defaults[key];
        }
        const hasOwn = Object.prototype.hasOwnProperty.call(base, key);
        if (hasValue) {
          if (!hasOwn || (base as any)[key] !== value) {
            (patch ??= {})[key] = value;
            changed = true;
          }
        } else if (hasOwn) {
          (removedKeys ??= []).push(key);
          changed = true;
        }
      });
      if (changed) {
        glyph.commitSubGraphicAttributes(child, patch ?? {}, removedKeys, context);
      }
    }
  };

  protected _createGraphic(attrs: IGlyphGraphicAttribute = {}): IGraphic {
    const glyph = createGlyph(attrs);
    const subMarks = this._subMarks;

    if (subMarks) {
      const subGraphics: IGraphic[] = [];

      Object.keys(subMarks).forEach(name => {
        // glyph 中的子元素会继承glyph 的 x,y，所以子元素手动设置一下，x: 0, y: 0
        const subGraphic = Factory.createGraphicComponent(subMarks[name].type, {
          ...subMarks[name].defaultAttributes
        });

        if (subGraphic) {
          subGraphics.push(subGraphic);

          subGraphic.name = name;
        }
      });

      glyph.setSubGraphic(subGraphics);
    }

    return glyph;
  }

  protected _runProgressiveEncoder(graphics: IMarkGraphic[]) {
    this._runEncoder(graphics);
  }
}

export const registerGlyphMark = () => {
  Factory.registerGraphicComponent('glyph', createGlyph);
  registerShadowRoot();
  registerGlyph();
};
