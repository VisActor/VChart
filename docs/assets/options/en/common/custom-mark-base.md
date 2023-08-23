{{ target: common-custom-mark-base }}

<!-- ICustomMarkSpec -->

#${prefix} dataIndex(number)

Supports custom mark using a specific data, if `dataId` is configured, this setting is invalid.

#${prefix} dataId(string)

Supports custom mark using a specific data. After the custom mark specifies the data, the `line` will generate a line node based on each data point, and other graphics will generate a graphic for each data piece.

{{ use: common-mark(
  prefix = ${prefix}
) }}