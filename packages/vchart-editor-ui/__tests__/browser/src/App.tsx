import './App.css';
import { ColorEditorBar, CustomEditorBar, EditorBar, LineEditorBar, TextEditorBar, Title } from '../../../src';

function App() {
  return (
    <div>
      <p>VChart Editor UI</p>
      <EditorBar style={{ marginBottom: 20 }} />
      <ColorEditorBar style={{ marginBottom: 20 }} />
      <LineEditorBar style={{ marginBottom: 20 }} />
      <TextEditorBar style={{ marginBottom: 20 }} />
      <CustomEditorBar
        style={{ marginBottom: 20 }}
        entries={[
          { key: 'chart' },
          { key: 'palette' },
          { key: 'fill' },
          { key: 'stroke' },
          { key: 'line' },
          { key: 'textColor' },
          { key: 'fontSize', default: 16 },

          { key: 'horizontalLine', divide: false },
          { key: 'verticalLine', divide: false },
          { key: 'horizontalRect', divide: false },
          { key: 'verticalRect', divide: false },
          { key: 'combineMark', divide: false },
          { key: 'sumDiff', divide: false },
          { key: 'hierarchyDiff', divide: false },
          { key: 'addText' },

          { key: 'bold' },

          { key: 'editData', divide: false },
          { key: 'comment', divide: false },
          { key: 'more', divide: false }
        ]}
      />
      <Title
        sections={{
          title: {
            label: '主标题',
            entries: [
              { key: 'text' },
              { key: 'fontSize', label: '字号' },
              { key: 'fontFamily', label: '字体' },
              { key: 'fontStyle', label: '样式' },
              { key: 'color', label: '颜色' }
            ]
          },
          subTitle: {
            label: '副标题',
            entries: [
              { key: 'display', label: '显示副标题' },
              { key: 'text' },
              { key: 'fontSize', label: '字号' },
              { key: 'fontFamily', label: '字体' },
              { key: 'fontStyle', label: '样式' },
              { key: 'color', label: '颜色' }
            ]
          },
          align: {
            label: '排列',
            entries: [
              {
                key: 'position',
                label: '显示位置',
                options: [
                  { value: 'left', label: '居左' },
                  { value: 'center', label: '居中' },
                  { value: 'right', label: '居右' }
                ]
              },
              { key: 'textAlign', label: '对齐方式' }
            ]
          }
        }}
      />
      {/* <Title spec={{}} entries={[{ key: 'fontSize' }]} /> */}
    </div>
  );
}

export default App;
