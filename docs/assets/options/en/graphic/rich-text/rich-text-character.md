{{ target: graphic-rich-text-character }}

<!-- Canopus Graphic Attributes, IRichTextCharacter -->

#${prefix} text(string)

Text content.

#${prefix} fontSize(number)

Font size.

#${prefix} fontFamily(string)

Font family.

#${prefix} fill(string|Object)

Text fill color. Supports setting to solid colors using `rgb(255,255,255)`, `rgba(255,255,255,1)`, `#fff`, etc., and also supports gradient color fill.

- Gradient color usage

{{ use: graphic-gradient }}

#${prefix} stroke(string|Object)

Text stroke color. Supports setting to solid colors using `rgb(255,255,255)`, `rgba(255,255,255,1)`, `#fff`, etc., and also supports gradient color strokes.

- Gradient color usage

{{ use: graphic-gradient }}

#${prefix} fontWeight(string)

Font weight of the text.

#${prefix} fontStyle(string) = 'normal'

Font style of the text.

Options:

- `'normal'`
- `'italic'`
- `'oblique'`

#${prefix} textDecoration(string) = 'none'

Text decoration line.

Options:

- `'none'`
- `'underline'`
- `'line-through'`

#${prefix} script(string) = 'normal'

Script format of the text. Supports superscript and subscript notation.

Options:

- `'normal'`
- `'sub'`
- `'super'`