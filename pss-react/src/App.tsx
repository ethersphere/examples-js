import './App.css';
import { SendForm } from './components/SendForm'
import { MessageHistory } from './components/MessageHistory'
import { OverlayAddress } from './components/OverlayAddress';

function App() {
  return (
    <div className="App">
      <OverlayAddress />
      <SendForm />
      <MessageHistory />
    </div>
  );
}

export default App;
