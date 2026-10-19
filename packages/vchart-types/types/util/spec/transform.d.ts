interface IFunctionTransformRegistry {
    getFunction: (key: string) => unknown;
}
export declare function specTransform(spec: unknown, special?: {
    [key: string]: (v: unknown) => unknown;
}): unknown;
export declare function functionTransform(value: unknown, registry: IFunctionTransformRegistry): any;
export declare function transformFunctionAttribute(att: unknown, ...args: unknown[]): any;
export {};
