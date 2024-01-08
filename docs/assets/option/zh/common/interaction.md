{{ target: common-interaction }}

#${prefix} interactions(Array)

从 @1.9.0 版本开始支持，配置格式如：

```ts
{
  interactions: [
    {
      type: 'element-active'
    }
  ];
}
```

配置内置支持的交互类型，现在支持的交互类型有：

- `'element-active'` 将触发元素的状态为`active`
- `'element-highlight'` 将触发元素的状态设置为 `highlight`，其他元素的状态设置为 `blur`
- `'element-select'` 将触发元素的状态设置为`selected`
- `'element-highlight-by-key'` 将触发元素以及和触发元素具有相同`key`值的元素状态设置为`highlight`，其他元素的状态设置为`blur`
- `'element-highlight-by-group'` 将触发元素以及和触发元素具有相同`group`值的元素状态设置为`highlight`，其他元素的状态设置为`blur`
- `'element-highlight-by-legend'` 通过图例触发，将关联元素状态设置为`highlight`，其他元素的状态设置为`blur`
- `'element-active-by-legend'` 通过图例触发，将关联元素状态设置为`active`
- `'element-highlight-by-name'` 当图形元素的`name`属性符合要求的时候，根据该元素将关联元素状态设置为`highlight`，其他元素的状态设置为`blur`
