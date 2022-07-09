import React from 'react';
import './App.scss';
// import ReactApp from './components/molucules/ReactApp/ReactApp';
import IdInfo from 'components/molucules/IdInfo/IdInfo';
import CommonFrame from 'components/molucules/CommonFrame/CommonFrame';
import ShortcutList from 'components/molucules/shortcut-list/shortcut-list';

function App() {
  return (
    <div className="App">
      {/* <ReactApp /> */}
      <CommonFrame
        viewComponent={<IdInfo />}
        componentName="idInfo"
        frameTitle="認可ユーザーIDの取得-test"
      />
      <CommonFrame
        viewComponent={<ShortcutList />}
        componentName="shortcutList"
      />
    </div>
  );
}

export default App;
