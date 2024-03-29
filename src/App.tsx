import './App.scss';
// import ReactApp from './components/molucules/ReactApp/ReactApp';
import CommonFrame from 'components/molucules/CommonFrame/CommonFrame';
import ShortcutList from 'components/molucules/shortcut-list/shortcut-list';
import SlackNotification from 'components/organism/slack/slackNotification';

function App() {
  return (
    <div className="App">
      {/* <ReactApp /> */}
      <CommonFrame
        viewComponent={<SlackNotification />}
        componentName="slackNotification"
        frameTitle="Slack通知"
      />
      <CommonFrame
        viewComponent={<ShortcutList />}
        componentName="shortcutList"
        frameTitle="ショットカット一覧"
      />
    </div>
  );
}

export default App;
