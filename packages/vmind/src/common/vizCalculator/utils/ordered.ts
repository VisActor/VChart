export class OrderedMap<K = any, V = any> extends Map<K, V> {
  /** ordered list of keys */
  private _keys: K[] = [];
  private _indexMap: Map<K, Index> = new Map();

  constructor(entries?: [K, V][]) {
    super();
    entries?.forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  clear(): void {
    super.clear();
    this._keys = [];
    this._indexMap.clear();
  }

  delete(key: K): boolean {
    if (!this.has(key)) return false;
    super.delete(key);

    const index = this._indexMap.get(key)!;
    this._indexMap.delete(key);
    this._keys.splice(index, 1);

    return true;
  }

  set(key: K, value: V): this {
    if (this.has(key)) return this;
    super.set(key, value);

    const index = this._keys.length;
    this._keys.push(key);
    this._indexMap.set(key, index);

    return this;
  }

  keys(): IterableIterator<K> {
    return this._keys[Symbol.iterator]();
  }

  *values(): IterableIterator<V> {
    for (const key of this.keys()) {
      yield this.get(key)!;
    }
  }

  *entries(): IterableIterator<[K, V]> {
    for (const key of this.keys()) {
      yield [key, this.get(key)!];
    }
  }

  forEach(callbackfn: (value: V, key: K, map: OrderedMap<K, V>) => void): void {
    for (const key of this.keys()) {
      callbackfn(this.get(key)!, key, this);
    }
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
}

export class OrderedSet<T = any> extends Set<T> {
  private _orderedMap: OrderedMap<T, void> = new OrderedMap();

  constructor(values?: T[]) {
    super();
    values?.forEach(value => {
      this.add(value);
    });
  }

  get size(): number {
    return this._orderedMap.size;
  }

  clear(): void {
    this._orderedMap.clear();
  }

  delete(value: T): boolean {
    if (!this.has(value)) return false;
    this._orderedMap.delete(value);

    return true;
  }

  add(value: T): this {
    if (this.has(value)) return this;
    this._orderedMap.set(value);
    return this;
  }

  has(value: T): boolean {
    return this._orderedMap.has(value);
  }

  keys(): IterableIterator<T> {
    return this._orderedMap.keys();
  }

  values(): IterableIterator<T> {
    return this._orderedMap.keys();
  }

  *entries(): IterableIterator<[T, T]> {
    for (const value of this.values()) {
      yield [value, value];
    }
  }

  forEach(callbackfn: (value: T, value2: T, set: OrderedSet<T>) => void, thisArg?: any): void {
    for (const value of this.values()) {
      callbackfn(value, value, this);
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }
}

type Index = number;
