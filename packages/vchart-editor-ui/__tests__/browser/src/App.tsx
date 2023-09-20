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
          { key: 'fontSize' },

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
      <Title spec={{}} />
      {/* <Title spec={{}} entries={[{ key: 'fontSize' }]} /> */}
    </div>
  );
}

export default App;
