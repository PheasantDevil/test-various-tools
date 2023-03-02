import React from 'react';
import './slackNotification.scss';

interface State {
  webhookUrl: string;
  messageIcon: string;
  channelName: string;
  notificationTitle: string;
  notificationDetail: string;
  isClickIgnition: boolean;
}
class SlackNotification extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      webhookUrl:
        'https://hooks.slack.com/services/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',
      messageIcon: ':sunny:',
      channelName: '#random',
      notificationTitle: 'TEST',
      notificationDetail: 'TEST',
      isClickIgnition: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  label = 'Ignition!!';
  messageIconList = ['sunny', 'snowflake'];

  handleClick() {
    fetch(this.state.webhookUrl, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      method: 'POST',
      body: `${JSON.stringify({
        username: this.state.notificationTitle,
        text: this.state.notificationDetail,
        icon_emoji: this.state.messageIcon,
        channel: this.state.channelName,
      })}`,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        this.setState({ isClickIgnition: true });
        return res.json();
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Test用のfunction
  eventInput(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    switch (event.target.title) {
      case 'webhookUrl':
        this.setState({ webhookUrl: event.target.value });
        break;
      case 'messageIcon':
        this.setState({ messageIcon: event.target.value });
        break;
      case 'channelName':
        this.setState({ channelName: event.target.value });
        break;
      case 'notificationTitle':
        this.setState({ notificationTitle: event.target.value });
        break;
      case 'notificationDetail':
        this.setState({ notificationDetail: event.target.value });
        break;
      default:
        break;
    }
  }

  override render(): React.ReactNode {
    return (
      <div className="slackNotification">
        <div className="slackNotification__content">
          <label htmlFor="inputWebhookUrl">target webhook URL</label>
          <input
            type="text"
            title="webhookUrl"
            value={this.state.webhookUrl ?? ''}
            onChange={event => this.eventInput(event)}
            onBlur={event => this.eventInput(event)}
            size={90}
          />
        </div>
        <label>
          webhook URLの取得方法は
          <a href="https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-%E3%81%A7%E3%81%AE-Incoming-Webhook-%E3%81%AE%E5%88%A9%E7%94%A8">
            こちら
          </a>
        </label>

        <div className="slackNotification__content">
          <label htmlFor="inputMessageIcon">messageIcon</label>
          <select
            title="messageIcon"
            onChange={event => this.eventInput(event)}
          >
            {this.messageIconList.map((messageIcon: string) => (
              <option value={`:${messageIcon}:`}>{messageIcon}</option>
            ))}
          </select>
        </div>

        <div className="slackNotification__content">
          <label htmlFor="inputChannelName">channelName</label>
          <input
            type="text"
            title="channelName"
            value={this.state.channelName}
            onChange={event => this.eventInput(event)}
            onBlur={event => this.eventInput(event)}
          />
        </div>

        <div className="slackNotification__content">
          <label htmlFor="inputNotificationTitle">notificationTitle</label>
          <input
            type="text"
            title="notificationTitle"
            value={this.state.notificationTitle}
            onChange={event => this.eventInput(event)}
            onBlur={event => this.eventInput(event)}
            size={20}
          />
        </div>

        <div className="slackNotification__content">
          <label htmlFor="inputNotificationDetail">notificationDetail</label>
          <input
            type="text"
            title="notificationDetail"
            value={this.state.notificationDetail}
            onChange={event => this.eventInput(event)}
            onBlur={event => this.eventInput(event)}
            size={50}
          />
        </div>

        <button
          className="slackNotification__submit"
          onClick={() => this.handleClick()}
        >
          Ignition!!
        </button>

        {this.state.isClickIgnition ? (
          <p className="SlackNotification__result">
            表示させたい内容：
            <span>{`webhookUrl: ${this.state.webhookUrl}`}</span>
            <span>{`messageIcon: ${this.state.messageIcon}`}</span>
            <span>{`channelName: ${this.state.channelName}`}</span>
            <span>{`notificationTitle: ${this.state.notificationTitle}`}</span>
            <span>{`notificationDetail: ${this.state.notificationDetail}`}</span>
          </p>
        ) : (
          <p className="SlackNotification__result">
            サンプルテキスト：
            <span>{'webhookUrl:'}</span>
            {/* MEMO: webhookURLはsecretsのため表示させない */}
            {/* <span>{'https://hooks.slack.com/services/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'}</span> */}
            <span>{'messageIcon: :sunny:'}</span>
            <span>{'channelName: #random'}</span>
            <span>{'notificationTitle: TEST'}</span>
            <span>{'notificationDetail: TEST'}</span>
          </p>
        )}
      </div>
    );
  }
}

export default SlackNotification;
