import './App.css';
import { ColorEditorBar, EditorBar, LineEditorBar, TextEditorBar, Title } from '../../../src';

function App() {
  return (
    <div>
      <p>VChart Editor UI</p>
      <EditorBar style={{ marginBottom: 20 }} />
      <ColorEditorBar style={{ marginBottom: 20 }} />
      <LineEditorBar style={{ marginBottom: 20 }} />
      <TextEditorBar style={{ marginBottom: 20 }} />
      <Title spec={{}} />
      {/* <Title spec={{}} entries={[{ key: 'fontSize' }]} /> */}
    </div>
  );
}

export default App;
