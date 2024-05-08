{{ target: component-marker-style-callback }}

<!-- StyleCallback -->

${description} supports callbacks. The callback function is defined as follows:

```ts
/**
 * @params markerData aggregated data of the marker component
 * @return returns the corresponding style
 */
(markerData: DataView) => T;
```

