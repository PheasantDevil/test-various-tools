import React from 'react';
import './App.scss';
// import ReactApp from './components/molucules/ReactApp/ReactApp';
import IdInfo from 'components/molucules/IdInfo/IdInfo';
import CommonFrame from 'components/molucules/CommonFrame/CommonFrame';

function App() {
  return (
    <div className="App">
      {/* <ReactApp /> */}
      <CommonFrame viewComponent={<IdInfo />} componentName="idInfo" />
    </div>
  );
}

export default App;
