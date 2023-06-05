/* Adapted from d3-time-format by Mike Bostock
 * https://github.com/d3/d3-time-format
 * Licensed under the ISC

 * url: https://github.com/d3/d3-time-format/blob/d6feb945baa4b7a45898a9ca926ebca044e20657/src/locale.js
 * License: https://github.com/d3/d3-time-format/blob/main/LICENSE
 * @license
 */

import type { StringOrNumber } from '../../../../typings';

interface dateInfo {
  y?: number;
  m?: number;
  d?: number;
  w?: number;
  p?: number;
  H?: number;
  M?: number;
  S?: number;
  L?: number;
}

export class TimeUtil {
  private locale_shortWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private locale_periods = ['AM', 'PM'];
  private locale_weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private locale_shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private numberRe = /^\s*\d+/; // note: ignores next directive
  private pads = { '-': '', _: ' ', '0': '0' };

  //   const percentRe = /^%/;
  private requoteRe = /[\\^$*+?|[\]().{}]/g;

  private periodRe: RegExp;
  private periodLookup: Map<string, number>;
  private weekdayRe: RegExp;
  private weekdayLookup: Map<string, number>;
  private shortWeekdayRe: RegExp;
  private shortWeekdayLookup: Map<string, number>;
  private monthRe: RegExp;
  private monthLookup: Map<string, number>;
  private shortMonthRe: RegExp;
  private shortMonthLookup: Map<string, number>;

  //#region singleton
  private static instance: TimeUtil;
  static getInstance(): TimeUtil {
    if (!TimeUtil.instance) {
      TimeUtil.instance = new TimeUtil();
    }

    return TimeUtil.instance;
  }

  private requoteF;
  private constructor() {
    this.requoteF = this.requote.bind(this);
    this.periodRe = this.formatRe(this.locale_periods);
    this.periodLookup = this.formatLookup(this.locale_periods);
    this.weekdayRe = this.formatRe(this.locale_weekdays);
    this.weekdayLookup = this.formatLookup(this.locale_weekdays);
    this.shortWeekdayRe = this.formatRe(this.locale_shortWeekdays);
    this.shortWeekdayLookup = this.formatLookup(this.locale_shortWeekdays);
    this.monthRe = this.formatRe(this.locale_months);
    this.monthLookup = this.formatLookup(this.locale_months);
    this.shortMonthRe = this.formatRe(this.locale_shortMonths);
    this.shortMonthLookup = this.formatLookup(this.locale_shortMonths);
  }
  //#endregion

  private requote(s: string) {
    return s.replace(this.requoteRe, '\\$&');
  }

  private localDate(d: dateInfo) {
    if (0 <= d.y && d.y < 100) {
      const date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  private utcDate(d: dateInfo) {
    if (0 <= d.y && d.y < 100) {
      const date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  private newDate(y: number, m: number, d: number) {
    return { y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0 };
  }
  private formatRe(names: string[]) {
    return new RegExp('^(?:' + names.map(this.requoteF).join('|') + ')', 'i');
  }
  private formatLookup(names: string[]) {
    return new Map(names.map((name, i) => [name.toLowerCase(), i]));
  }

  private locale_months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  private formatShortWeekday = (d: Date) => {
    return this.locale_shortWeekdays[d.getDay()];
  };

  private formatWeekday = (d: Date) => {
    return this.locale_weekdays[d.getDay()];
  };

  private formatShortMonth = (d: Date) => {
    return this.locale_shortMonths[d.getMonth()];
  };

  private formatMonth = (d: Date) => {
    return this.locale_months[d.getMonth()];
  };

  private pad(value: number, fill: string, width: number) {
    const sign = value < 0 ? '-' : '';
    const string = (sign ? -value : value) + '';
    const length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  private formatDayOfMonth = (d: Date, p: string) => {
    return this.pad(d.getDate(), p, 2);
  };

  private formatHour24 = (d: Date, p: string) => {
    return this.pad(d.getHours(), p, 2);
  };

  private formatHour12 = (d: Date, p: string) => {
    return this.pad(d.getHours() % 12 || 12, p, 2);
  };

  private formatMilliseconds = (d: Date, p: string) => {
    return this.pad(d.getMilliseconds(), p, 3);
  };

  private formatMonthNumber = (d: Date, p: string) => {
    return this.pad(d.getMonth() + 1, p, 2);
  };

  private formatMinutes = (d: Date, p: string) => {
    return this.pad(d.getMinutes(), p, 2);
  };

  private formatPeriod = (d: Date) => {
    return this.locale_periods[+(d.getHours() >= 12)];
  };

  private formatSeconds = (d: Date, p: string) => {
    return this.pad(d.getSeconds(), p, 2);
  };

  private formatFullYear = (d: Date, p: string) => {
    return this.pad(d.getFullYear() % 10000, p, 4);
  };

  private formatUTCShortWeekday = (d: Date) => {
    return this.locale_shortWeekdays[d.getUTCDay()];
  };

  private formatUTCWeekday = (d: Date) => {
    return this.locale_weekdays[d.getUTCDay()];
  };

  private formatUTCShortMonth = (d: Date) => {
    return this.locale_shortMonths[d.getUTCMonth()];
  };

  private formatUTCMonth = (d: Date) => {
    return this.locale_months[d.getUTCMonth()];
  };

  private formatUTCDayOfMonth = (d: Date, p: string) => {
    return this.pad(d.getUTCDate(), p, 2);
  };

  private formatUTCHour24 = (d: Date, p: string) => {
    return this.pad(d.getUTCHours(), p, 2);
  };

  private formatUTCHour12 = (d: Date, p: string) => {
    return this.pad(d.getUTCHours() % 12 || 12, p, 2);
  };

  private formatUTCMilliseconds = (d: Date, p: string) => {
    return this.pad(d.getUTCMilliseconds(), p, 3);
  };

  private formatUTCMonthNumber = (d: Date, p: string) => {
    return this.pad(d.getUTCMonth() + 1, p, 2);
  };

  private formatUTCMinutes = (d: Date, p: string) => {
    return this.pad(d.getUTCMinutes(), p, 2);
  };

  private formatUTCPeriod = (d: Date) => {
    return this.locale_periods[+(d.getUTCHours() >= 12)];
  };

  private formatUTCSeconds = (d: Date, p: string) => {
    return this.pad(d.getUTCSeconds(), p, 2);
  };

  private formatUTCFullYear = (d: Date, p: string) => {
    return this.pad(d.getUTCFullYear() % 10000, p, 4);
  };

  private formats = {
    a: this.formatShortWeekday,
    A: this.formatWeekday,
    b: this.formatShortMonth,
    B: this.formatMonth,
    d: this.formatDayOfMonth,
    e: this.formatDayOfMonth,
    H: this.formatHour24,
    I: this.formatHour12,
    L: this.formatMilliseconds,
    m: this.formatMonthNumber,
    M: this.formatMinutes,
    p: this.formatPeriod,
    S: this.formatSeconds,
    Y: this.formatFullYear
  };

  private utcFormats = {
    a: this.formatUTCShortWeekday,
    A: this.formatUTCWeekday,
    b: this.formatUTCShortMonth,
    B: this.formatUTCMonth,
    d: this.formatUTCDayOfMonth,
    e: this.formatUTCDayOfMonth,
    H: this.formatUTCHour24,
    I: this.formatUTCHour12,
    L: this.formatUTCMilliseconds,
    m: this.formatUTCMonthNumber,
    M: this.formatUTCMinutes,
    p: this.formatUTCPeriod,
    S: this.formatUTCSeconds,
    Y: this.formatUTCFullYear
  };

  private parseShortWeekday = (d: dateInfo, string: string, i: number) => {
    const n = this.shortWeekdayRe.exec(string.slice(i));
    return n ? ((d.w = this.shortWeekdayLookup.get(n[0].toLowerCase())), i + n[0].length) : -1;
  };

  private parseWeekday = (d: dateInfo, string: string, i: number) => {
    const n = this.weekdayRe.exec(string.slice(i));
    return n ? ((d.w = this.weekdayLookup.get(n[0].toLowerCase())), i + n[0].length) : -1;
  };

  private parseShortMonth = (d: dateInfo, string: string, i: number) => {
    const n = this.shortMonthRe.exec(string.slice(i));
    return n ? ((d.m = this.shortMonthLookup.get(n[0].toLowerCase())), i + n[0].length) : -1;
  };

  private parseMonth = (d: dateInfo, string: string, i: number) => {
    const n = this.monthRe.exec(string.slice(i));
    return n ? ((d.m = this.monthLookup.get(n[0].toLowerCase())), i + n[0].length) : -1;
  };

  private parseDayOfMonth = (d: dateInfo, string: string, i: number) => {
    const n = this.numberRe.exec(string.slice(i, i + 2));
    return n ? ((d.d = +n[0]), i + n[0].length) : -1;
  };

  private parseHour24 = (d: dateInfo, string: string, i: number) => {
    const n = this.numberRe.exec(string.slice(i, i + 2));
    return n ? ((d.H = +n[0]), i + n[0].length) : -1;
  };

  private parseMilliseconds = (d: dateInfo, string: string, i: number) => {
    const n = this.numberRe.exec(string.slice(i, i + 3));
    return n ? ((d.L = +n[0]), i + n[0].length) : -1;
  };

  private parseMonthNumber = (d: dateInfo, string: string, i: number) => {
    const n = this.numberRe.exec(string.slice(i, i + 2));
    return n ? ((d.m = (n as any[0]) - 1), i + n[0].length) : -1;
  };

  private parseMinutes = (d: dateInfo, string: string, i: number) => {
    const n = this.numberRe.exec(string.slice(i, i + 2));
    return n ? ((d.M = +n[0]), i + n[0].length) : -1;
  };

  private parsePeriod = (d: dateInfo, string: string, i: number) => {
    const n = this.periodRe.exec(string.slice(i));
    return n ? ((d.p = this.periodLookup.get(n[0].toLowerCase())), i + n[0].length) : -1;
  };

  private parseSeconds = (d: dateInfo, string: string, i: number) => {
    const n = this.numberRe.exec(string.slice(i, i + 2));
    return n ? ((d.S = +n[0]), i + n[0].length) : -1;
  };

  private parseFullYear = (d: dateInfo, string: string, i: number) => {
    const n = this.numberRe.exec(string.slice(i, i + 4));
    return n ? ((d.y = +n[0]), i + n[0].length) : -1;
  };

  private parses = {
    a: this.parseShortWeekday,
    A: this.parseWeekday,
    b: this.parseShortMonth,
    B: this.parseMonth,
    d: this.parseDayOfMonth,
    e: this.parseDayOfMonth,
    H: this.parseHour24,
    I: this.parseHour24,
    L: this.parseMilliseconds,
    m: this.parseMonthNumber,
    M: this.parseMinutes,
    p: this.parsePeriod,
    S: this.parseSeconds,
    Y: this.parseFullYear
  };

  private parseSpecifier(d: dateInfo, specifier: string, string: string, j: number) {
    let i = 0;
    const n = specifier.length;
    const m = string.length;
    let c;
    let parse;

    while (i < n) {
      if (j >= m) {
        return -1;
      }
      c = specifier.charCodeAt(i++);
      if (c === 37) {
        c = specifier.charAt(i++);
        parse = this.parses[c in this.pads ? specifier.charAt(i++) : c];
        if (!parse || (j = parse(d, string, j)) < 0) {
          return -1;
        }
      } else if (c !== string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  private newParse(specifier: string, Z: boolean) {
    const that = this;
    return function (string: string) {
      const d = that.newDate(1900, undefined, 1) as any;
      const i = that.parseSpecifier(d, specifier, (string += ''), 0);
      if (i !== string.length) {
        return null;
      }

      // If a UNIX timestamp is specified, return it.
      if ('Q' in d) {
        return new Date(d.Q);
      }
      if ('s' in d) {
        return new Date(d.s * 1000 + ('L' in d ? d.L : 0));
      }

      // If this is utcParse, never use the local timezone.
      if (Z && !('Z' in d)) {
        d.Z = 0;
      }

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ('p' in d) {
        d.H = (d.H % 12) + d.p * 12;
      }

      // If the month was not specified, inherit from the quarter.
      if (d.m === undefined) {
        d.m = 'q' in d ? d.q : 0;
      }
      if ('Z' in d) {
        d.H += (d.Z / 100) | 0;
        d.M += d.Z % 100;
        return that.utcDate(d);
      }

      // Otherwise, all fields are in local time.
      return that.localDate(d);
    };
  }
  private newFormat(specifier: string, formats: any) {
    const that = this;
    return function (date: Date) {
      const string = [];
      let i = -1;
      let j = 0;
      const n = specifier.length;
      let c;
      let pad;
      let format;
      if (!(date instanceof Date)) {
        date = new Date(+date);
      }

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = that.pads[(c = specifier.charAt(++i))])) {
            c = specifier.charAt(++i);
          } else {
            pad = c === 'e' ? ' ' : '0';
          }
          format = formats[c];
          c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join('');
    };
  }

  private getFullTimeStamp(timeText: StringOrNumber) {
    const timeOriStamp = parseInt(timeText + '', 10);
    return String(timeOriStamp).length === 10 ? timeOriStamp * 1000 : timeOriStamp;
  }

  //#region  public

  timeFormat = (specifier: string, timeText: StringOrNumber) => {
    return this.newFormat(specifier, this.formats)(new Date(this.getFullTimeStamp(timeText)));
  };

  timeUTCFormat = (specifier: string, timeText: StringOrNumber) => {
    return this.newFormat(specifier, this.utcFormats)(new Date(this.getFullTimeStamp(timeText)));
  };

  timeParse = (specifier: string, timeText: string | string) => {
    return this.newParse(specifier, false)(timeText + '');
  };
  //#region public
}

// export const timeUtil = () => {

// };
