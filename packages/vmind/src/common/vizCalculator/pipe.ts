/**
 * `source --> pipeline --> result`
 *
 * That's what this does:
 *
 * ```
 *   of(source).pipe(pipe1, pipe2, pipe3, ...)
 *   = pipe3(pipe2(pipe1(source)))
 * ```
 */
export const of = <Source>(
  source: Source
): {
  pipe: <Funcs extends AnyFunc[]>(
    ...funcs: Funcs['length'] extends 0
      ? []
      : Funcs extends [(arg: Source) => any, ...AnyFunc[]]
      ? PipeFuncs<Funcs> extends Funcs
        ? Funcs
        : PipeFuncs<Funcs>
      : [(arg: Source) => any, ...AnyFunc[]]
  ) => LastReturnType<Funcs, Source>;
} => ({
  pipe: (...funcs: AnyFunc[]) => funcs.reduce((arg, fn) => fn(arg), source as any)
});

type AnyFunc = (...args: any) => any;

type LastReturnType<F extends AnyFunc[], Else = never> = F extends [...any, (...arg: any) => infer R] ? R : Else;

type PipeFuncs<F extends AnyFunc[], Acc extends AnyFunc[] = []> = F['length'] extends 1
  ? [...Acc, ...F]
  : F extends [(...args: infer A) => infer B, (...args: any) => infer D, ...infer Tails]
  ? Tails extends AnyFunc[]
    ? PipeFuncs<[(arg: B) => D, ...Tails], [...Acc, (...args: A) => B]>
    : never
  : Acc;
