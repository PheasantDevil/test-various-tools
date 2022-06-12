import React from 'react';
import './App.scss';
// import ReactApp from './components/molucules/ReactApp/ReactApp';
import IdInfo from './components/molucules/IdInfo/IdInfo';

function App() {
  return (
    <div className="App">
      {/* <ReactApp /> */}
      <div className="App-content">
        <IdInfo />
      </div>
    </div>
  );
}

export default App;
