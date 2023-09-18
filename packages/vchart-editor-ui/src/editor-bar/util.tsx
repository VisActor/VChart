export function ColorItem(props: { color: string }) {
  const color = props.color;
  return color === 'disable' ? null : color.toLowerCase() === '#ffffff' ? (
    <span
      key={color}
      className="vchart-editor-ui-editor-bar-color-item"
      style={{ background: color, border: '1px solid #1F232926', width: 16, height: 16 }}
    ></span>
  ) : (
    <span key={color} className="vchart-editor-ui-editor-bar-color-item" style={{ background: color }}></span>
  );
}
