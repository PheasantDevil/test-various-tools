import React from 'react';
import './IdInfo.css';

interface State {
  idInfo: string;
  inputPersonalAccessToken: string;
}
class IdInfo extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = { idInfo: '未取得', inputPersonalAccessToken: '' };
    this.handleClick = this.handleClick.bind(this);
  }
  label = 'ID取得';
  timetreeApi = process.env.REACT_APP_TIMETREE_API;

  handleClick(path: string) {
    if (!this.state.inputPersonalAccessToken) {
      return console.log('inputValue is unset');
    }
    fetch(`${this.timetreeApi}/${path}`, {
      headers: {
        Authorization: `Bearer ${
          this.state.inputPersonalAccessToken ??
          process.env.REACT_APP_TIMETREE_PERSONAL_ACCESSTOKEN
        }`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          return console.log('error 401');
        }
        return res.json();
      })
      .then(res => {
        console.log('res.data', res.data);
        this.setState({ idInfo: res.data.id });
      })
      // this.state.inputPersonalAccessTokenが適切な値でない場合
      .catch(error => {
        console.error(error);
      });
  }

  changeInput(inputValue: string) {
    console.log(inputValue);
    this.setState({ inputPersonalAccessToken: inputValue });
  }
  render(): React.ReactNode {
    return (
      <>
        <input
          type="text"
          value={this.state.inputPersonalAccessToken}
          onChange={event => this.changeInput(event.target.value)}
        />
        <button onClick={() => this.handleClick('user')}>{this.label}</button>
        <p className="IdInfo">{`ID:${this.state.idInfo}`}</p>
      </>
    );
  }
}

export default IdInfo;
