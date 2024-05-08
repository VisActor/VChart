{{ target: component-marker-style-callback }}

<!-- StyleCallback -->

${description}支持回调，回调函数的定义如下:

```ts
/**
 * @params markerData 标注组件聚合后的数据
 * @return 返回对应的样式
 */
(markerData: DataView) => T;
```

