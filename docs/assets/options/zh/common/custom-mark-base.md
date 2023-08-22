{{ target: common-custom-mark-base }}

<!-- ICustomMarkSpec -->

#${prefix} dataIndex(number)

支持自定义 mark 使用某一份数据，如果配置了 `dataId` 此配置无效。

#${prefix} dataId(string)

支持自定义 mark 使用某一份数据。自定义 mark 指定数据后，`line` 会基于每一个数据点，产生一个线的节点，其他图形会对应每一份数据产生一个图形。

{{ use: common-mark(
  prefix = ${prefix}
) }}
