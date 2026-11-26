{{ target: graphic-text }}

<!-- Canopus 图形属性，ITextGraphicAttribute -->

{{
  use: graphic-text-font(
    prefix = ${prefix},
    callbackType = ${callbackType}
  )
}}

{{
  use: graphic-text-poptip(
    prefix = ${prefix},
    callbackType = ${callbackType}
  )
}}

{{ use: graphic-attribute(
  prefix = ${prefix},
  callbackType = ${callbackType},
  noTexture = true
) }}
