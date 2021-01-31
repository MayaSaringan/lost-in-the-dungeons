import logo from './logo.svg';
import './App.css';
import Dungeon from './Dungeon/Dungeon'

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
function App() {
  return (
    <div className="App" style={{minHeight:'100vh',display:'flex', flex:1,alignItems:'center', justifyContent:'center'}}>
      <RecoilRoot>
      <Dungeon></Dungeon>

      </RecoilRoot>
    </div>
  );
}

export default App;
