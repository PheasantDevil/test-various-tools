import React from 'react';
import './CommonFrame.scss';

interface Props {
  viewComponent: React.ReactNode; // frame内で表示させたいComponent
  componentName?: string;
  frameTitle?: string;
}

class CommonFrame extends React.Component<Props, {}> {
  // constructor(props: any) {
  //   super(props);
  //   // this.state = { };
  // }
  frameTitle = this.props.frameTitle ? this.props.frameTitle : 'Title';

  render(): React.ReactNode {
    return (
      <div className="frame">
        <div className="frame__title">{this.frameTitle}</div>
        <div className={`frame__content ${this.props.componentName}`}>
          {this.props.viewComponent}
        </div>
      </div>
    );
  }
}

export default CommonFrame;
