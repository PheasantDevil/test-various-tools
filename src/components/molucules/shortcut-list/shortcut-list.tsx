import React from 'react';
import './shortcut-list.scss';

// interface State {
//   idInfo: string;
//   inputPersonalAccessToken: string;
// }
class ShortcutList extends React.Component<{}, {}> {
  // constructor(props: any) {
  //   super(props);
  // }

  override render(): React.ReactNode {
    return (
      <>
        <ul>
          <li>
            <a
              href="https://pheasantdevil.github.io/test-storybook"
              target="_blank"
              rel="noreferrer"
            >
              test-storybook（GithubPage-開発中）
            </a>
          </li>
          <li>
            <a
              href="https://644b0f326c28f39b18380657-gjtqtcvumw.chromatic.com"
              target="_blank"
              rel="noreferrer"
            >
              test-storybook（chromatic-開発中）
            </a>
          </li>
          {/* <li>test 222</li> */}
          {/* <li>test 333</li> */}
        </ul>
      </>
    );
  }
}

export default ShortcutList;
