import { isFunction, isArray, TimeUtil, NumberUtil, numberSpecifierReg } from '@visactor/vutils';

import { BasePlugin } from '../../base/base-plugin';

import { IChartPlugin, IChartPluginService } from '../interface';
import { Factory, registerChartPlugin } from '../../../core';

const bracketReg = /\{([^}]+)\}/;
const bracketGReg = /\{([^}]+)\}/g;

const semicolonReg = /:/;

export class FormatterPlugin extends BasePlugin implements IChartPlugin {
  static readonly pluginType: 'chart' = 'chart';

  static readonly specKey = 'formatter';

  static readonly type: string = 'formatterPlugin';
  readonly type: string = 'formatterPlugin';

  private readonly _timeModeFormat = {
    utc: TimeUtil.getInstance().timeUTCFormat,
    local: TimeUtil.getInstance().timeFormat
  };

  protected _spec: {
    timeMode: 'utc' | 'local';
    customFormatter: (specifier: string, text: string | number | string[] | number[], datum: any) => string | string[];
    numericFormatter: (specifier: string, text: string | number | string[] | number[]) => string;
    timeFormatter: (specifier: string, text: string | number | string[] | number[]) => string;
  };

  protected _formatter = this._format;

  private _timeFormat = this._timeModeFormat.local;
  private _numericFormat = NumberUtil.getInstance().format;
  private _numericFormatter = NumberUtil.getInstance().formatter;
  private _numericFormatCache = new Map<string, any>();
  private _isNumericFormatterCache = new Map<string, boolean>();

  constructor() {
    super(FormatterPlugin.type);
  }

  onInit(service: IChartPluginService, chartSpec: any) {
    const { globalInstance } = service;
    if (!globalInstance) {
      return;
    }
    this._spec = chartSpec?.[FormatterPlugin.specKey] ?? {};
    const { timeMode, customFormatter, numericFormatter, timeFormatter } = this._spec;

    if (isFunction(customFormatter)) {
      this._formatter = customFormatter;
    } else {
      this._formatter = this._format.bind(this);
      if (isFunction(timeFormatter)) {
        this._timeFormat = timeFormatter;
      } else if (timeMode && this._timeModeFormat[timeMode]) {
        this._timeFormat = this._timeModeFormat[timeMode];
      }

      if (numericFormatter) {
        this._numericFormat = numericFormatter;
        this._numericFormatter = null;
        this._numericFormatCache = null;
      }
    }
    Factory.registerFormatter(this._formatter);
  }

  format(text: string | number | string[] | number[], datum: any, formatter: string | string[]) {
    return this._formatter(formatter, text, datum);
  }

  protected _format(formatter: string | string[], text: string | number | string[] | number[], datum: any) {
    if (isArray(text)) {
      return text.map((t, i) => {
        const f = isArray(formatter) ? formatter[i] : formatter;
        return f ? this._formatSingleLine(t, datum, f) : t;
      });
    }

    if (isArray(formatter)) {
      return formatter.map(f => this._formatSingleLine(text, datum, f));
    } else {
      return this._formatSingleLine(text, datum, formatter);
    }
  }

  protected _formatSingleLine(text: string | number, datum: any, formatter: string) {
    let isTemplate;
    if (this._isNumericFormatterCache) {
      if (this._isNumericFormatterCache.get(formatter)) {
        isTemplate = this._isNumericFormatterCache.get(formatter);
      } else {
        isTemplate = bracketReg.test(formatter);
        this._isNumericFormatterCache.set(formatter, isTemplate);
      }
    }
    if (isTemplate) {
      const result = formatter.replace(bracketGReg, (match, key) => {
        const hasFormatter = semicolonReg.test(key);
        if (!hasFormatter) {
          const value = datum[key.trim()];
          return typeof value !== 'undefined' ? value : match;
        } else {
          const parts = key.split(':');
          const value = datum[parts[0].trim()];
          const valueFormatter = parts[1];
          return this._formatSingleText(value, valueFormatter);
        }
      });
      return result;
    } else {
      return this._formatSingleText(text, formatter);
    }
  }

  protected _formatSingleText(text: string | number, formatter: string): string | number {
    const isNumeric = numberSpecifierReg.test(formatter);
    if (isNumeric && this._numericFormat) {
      // 内置的 formatter 逻辑，可以进行缓存性能优化
      let numericFormat;
      if (this._numericFormatCache && this._numericFormatter) {
        if (this._numericFormatCache.get(formatter)) {
          numericFormat = this._numericFormatCache.get(formatter);
        } else {
          numericFormat = this._numericFormatter(formatter) as any;
          this._numericFormatCache.set(formatter, numericFormat);
        }
        return numericFormat(Number(text));
      }
      return this._numericFormat(formatter, Number(text));
    } else if (formatter.includes('%') && this._timeFormat) {
      return this._timeFormat(formatter, text);
    } else {
      return text;
    }
  }

  dispose() {
    this._format = null;
    this._timeFormat = null;
    this._numericFormat = null;
    this._numericFormatter = null;
    this._numericFormatCache = null;
    this._isNumericFormatterCache = null;
  }
}

export const registerFormatPlugin = () => {
  registerChartPlugin(FormatterPlugin);
};
