import React, { useState } from 'react';
import { SlackChannel } from 'services/slack/channelService';
import { NotificationSetting } from '../../../services/slack/notificationService';

interface NotificationSettingFormProps {
  channels: SlackChannel[];
  onSave: (setting: NotificationSetting) => Promise<void>;
}

const NotificationSettingForm: React.FC<NotificationSettingFormProps> = ({
  channels,
  onSave,
}) => {
  const [channelId, setChannelId] = useState<string>('');
  const [events, setEvents] = useState<string[]>([]);
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId || events.length === 0 || !owner || !repo) return;

    const setting: NotificationSetting = {
      channelId,
      events,
      repositories: [{ owner, repo }],
    };

    onSave(setting);

    // フォームをリセット
    setChannelId('');
    setEvents([]);
    setOwner('');
    setRepo('');
  };

  const handleEventChange = (event: string) => {
    if (events.includes(event)) {
      setEvents(events.filter(e => e !== event));
    } else {
      setEvents([...events, event]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="notification-setting-form">
      <h3>通知設定の追加</h3>

      <div className="form-group">
        <label htmlFor="channel">チャンネル:</label>
        <select
          id="channel"
          value={channelId}
          onChange={e => setChannelId(e.target.value)}
          required
        >
          <option value="">選択してください</option>
          {channels.map(channel => (
            <option key={channel.id} value={channel.id}>
              #{channel.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>イベント:</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={events.includes('issue.opened')}
              onChange={() => handleEventChange('issue.opened')}
            />
            Issue 作成
          </label>
          <label>
            <input
              type="checkbox"
              checked={events.includes('issue.closed')}
              onChange={() => handleEventChange('issue.closed')}
            />
            Issue クローズ
          </label>
          <label>
            <input
              type="checkbox"
              checked={events.includes('pr.opened')}
              onChange={() => handleEventChange('pr.opened')}
            />
            PR 作成
          </label>
          <label>
            <input
              type="checkbox"
              checked={events.includes('pr.closed')}
              onChange={() => handleEventChange('pr.closed')}
            />
            PR クローズ
          </label>
          <label>
            <input
              type="checkbox"
              checked={events.includes('pr.review')}
              onChange={() => handleEventChange('pr.review')}
            />
            PR レビュー
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="owner">リポジトリオーナー:</label>
        <input
          id="owner"
          type="text"
          value={owner}
          onChange={e => setOwner(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="repo">リポジトリ名:</label>
        <input
          id="repo"
          type="text"
          value={repo}
          onChange={e => setRepo(e.target.value)}
          required
        />
      </div>

      <button type="submit">保存</button>
    </form>
  );
};

export default NotificationSettingForm;
