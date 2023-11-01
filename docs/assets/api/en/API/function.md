# function

VChart provides methods to register expression functions on the global `expressionFunction` and instance `registerFunction`.
In principle, registration functions can be applied wherever user-defined callback functions are supported.
Supports function registration mechanism, aiming to solve the problem of inability to serialize scene functions such as mini programs and Feishu cards.

## expressionFunction

`expressionFunction` is a method on the VChart class. This method will be registered globally and can be used by every chart.

```ts
/**
  *Registration function (global registration)
  * @param key function name
  * @param fun function content
  */
expressionFunction: (key: string, fun: Function) => void;
```

## unregisterExpressionFunction

`unregisterExpressionFunction` is a method on the VChart class. This method will unregister the globally registered function.

```ts
/**
  * Logout function (global logout)
  * @param key function name
  */
unregisterExpressionFunction: (key: string) => void;
```

## getExpressionFunction

`getExpressionFunction` is a method on the VChart class. This method will obtain the globally registered function based on the function name.

```ts
/**
 * Get function (global get)
 * @param key function name
 */
getExpressionFunction: (key: string) => Function | null;
```

## getExpressionFunctionList

`getExpressionFunctionList` is a method on the VChart class. This method will obtain a list of all function names.

```ts
/**
  * Get the function list (global acquisition)
  * @param key function name
  */
getExpressionFunctionList: () => string[] | null;
```

## registerFunction

`registerFunction` is a method on the instance. Only the chart instance of the currently registered method can be used.

```ts
/**
  * Register instance function (one layer of internal packaging to distinguish names and avoid duplicate name problems)
  * @param key function name
  * @param fun function content
  * @returns
  */
registerFunction(key: string, fun: Function)
```

## unregisterFunction

`unregisterFunction` is a method on the instance, used to unregister the function registered in the current chart instance

```ts
/**
  * Unregister instance function
  * @param key function name
  */
unregisterFunction: (key: string) => void;
```

## getFunction

`getFunction` is a method on the instance. This method will obtain the function registered in the instance based on the function name.

```ts
/**
 * Get instance function
 * @param key function name
 * @returns
 */
getFunction: (key: string) => Function | null;
```

## getFunctionList

`getFunctionList` is a method on the instance. This method will obtain the functions registered in the instance based on the function name.

```ts
/**
 * Get instance function
 * @param key function name
 * @returns
 */
getFunctionList: (key: string) => Function | null;
```
