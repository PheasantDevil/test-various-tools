import React from 'react';
import './app.scss';
// import ReactApp from './components/molucules/ReactApp/ReactApp';
import IdInfo from 'components/molucules/id-info/id-info';
import ComponentFrame from 'components/molucules/component-frame/component-frame';

function App() {
  return (
    <div className="App">
      {/* <ReactApp /> */}
      <ComponentFrame viewComponent={<IdInfo />} componentName="id-info" />
    </div>
  );
}

export default App;
