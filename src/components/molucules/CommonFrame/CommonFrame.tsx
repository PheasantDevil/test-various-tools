import React from 'react';
import './CommonFrame.scss';

interface Props {
  viewComponent: React.ReactNode; // frame内で表示させたいComponent
  componentName?: string;
}

class CommonFrame extends React.Component<Props, {}> {
  //   constructor(props: any) {
  //     super(props);
  //     // this.state = { };
  //   }

  render(): React.ReactNode {
    return (
      <div className="frame">
        <div className="frame__title">認可ユーザーIDの取得</div>
        <div className={`frame__content ${this.props.componentName}`}>
          {this.props.viewComponent}
        </div>
      </div>
    );
  }
}

export default CommonFrame;
