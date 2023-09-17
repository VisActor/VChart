import './App.css';
import { EditorBar, Title } from '../../../src';

function App() {
  return (
    <div>
      <p>VChart Editor UI</p>
      <EditorBar />
      <Title spec={{}} />
      {/* <Title spec={{}} entries={[{ key: 'fontSize' }]} /> */}
    </div>
  );
}

export default App;
