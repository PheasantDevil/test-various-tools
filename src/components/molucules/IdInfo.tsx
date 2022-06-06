import React from 'react';
import './IdInfo.css';

interface State {
  idInfo: string;
}
class IdInfo extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { idInfo: '未取得' };
    this.handleClick = this.handleClick.bind(this);
  }
  label = 'ID取得';
  timetreeApi = 'https://timetreeapis.com';
  // MEMO：ひとまず直書き。今後envに格納、もしくはinput.valueにする予定
  timetreePersonalAccessTokens =
    'S1rJHodOSNCVTUOuHmfKEOS0cxk4JcedcIG0jOG3Pd6ppSqv';
  handleClick(process: string) {
    fetch(`${this.timetreeApi}/${process}`, {
      headers: {
        Authorization: `Bearer ${this.timetreePersonalAccessTokens}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        this.setState({ idInfo: json.data.id });
      });
  }
  render(): React.ReactNode {
    return (
      <div>
        <button onClick={() => this.handleClick('user')}>{this.label}</button>
        <p className="IdInfo">{`ID:${this.state.idInfo}`}</p>
      </div>
    );
  }
}

export default IdInfo;
