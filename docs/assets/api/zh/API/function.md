# 函数

VChart 提供全局 `expressionFunction` 和实例 `registerFunction` 上注册表达式函数的方法。
原则上，凡是支持用户自定义回调函数的地方，都可以应用注册函数。
支持函数注册机制，旨在解决小程序端、飞书卡片等场景函数无法序列化问题。

## expressionFunction

`expressionFunction` 为 VChart 类上的方法，该方法会注册在全局，各个图表都可使用

```ts
/**
 * 注册函数（全局注册）
 * @param key 函数名称
 * @param fun 函数内容
 */
expressionFunction: (key: string, fun: Function) => void;
```

## removeExpressionFunction

`removeExpressionFunction` 为 VChart 类上的方法，该方法会注销在全局注册的函数

```ts
/**
 * 注销函数（全局注销）
 * @param key 函数名称
 */
removeExpressionFunction: (key: string) => void;
```

## getExpressionFunction

`getExpressionFunction` 为 VChart 类上的方法，该方法会根据函数名称获取在全局注册的函数

```ts
/**
 * 获取函数（全局获取）
 * @param key 函数名称
 */
getExpressionFunction: (key: string) => Function | null;
```

## getExpressionFunctionList

`getExpressionFunctionList` 为 VChart 类上的方法，该方法会获取全部函数名列表

```ts
/**
 * 获取函数列表（全局获取）
 * @param key 函数名称
 */
getExpressionFunctionList: () => string[] | null;
```

## registerFunction

`registerFunction` 为实例上的方法，仅当前注册的方法的图表实例可使用

```ts
/**
 * 注册实例函数（对内包装一层，区分名字，避免重名问题）
 * @param key 函数名称
 * @param fun 函数内容
 * @returns
 */
registerFunction(key: string, fun: Function)
```

## removeFunction

`removeFunction` 为实例上的方法，用于注销在当前图表实例注册的函数

```ts
/**
 * 注销实例函数
 * @param key 函数名称
 */
removeFunction: (key: string) => void;
```

## getFunction

`getFunction` 为实例上的方法，该方法会根据函数名称获取在实例注册的函数

```ts
/**
 * 获取实例函数
 * @param key 函数名称
 * @returns
 */
getFunction: (key: string) => Function | null;
```

## getFunctionList

`getFunctionList` 为实例上的方法，该方法会根据函数名称获取在实例注册的函数

```ts
/**
 * 获取实例函数
 * @param key 函数名称
 * @returns
 */
getFunctionList: (key: string) => Function | null;
```
