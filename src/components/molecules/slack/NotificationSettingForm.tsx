import React, { useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { SlackChannel } from '../../../services/slack/channelService';
import { NotificationSetting } from '../../../services/slack/notificationService';
import './NotificationSettingForm.scss';

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelId || events.length === 0 || !owner || !repo) return;

    const setting: NotificationSetting = {
      channelId,
      events,
      repositories: [{ owner, repo }],
    };

    // 送信中状態にする
    setIsSubmitting(true);

    try {
      await onSave(setting);

      // 成功メッセージをトースト通知で表示
      showToast('通知設定が正常に保存されました', 'success');

      // フォームをリセット
      setChannelId('');
      setEvents([]);
      setOwner('');
      setRepo('');
    } catch (error) {
      // エラーメッセージをトースト通知で表示
      showToast(
        `通知設定の保存に失敗しました: ${error instanceof Error ? error.message : 'エラーが発生しました'}`,
        'error',
      );
    } finally {
      // 送信中状態を解除
      setIsSubmitting(false);
    }
  };

  const handleEventChange = (event: string) => {
    if (events.includes(event)) {
      setEvents(events.filter(e => e !== event));
    } else {
      setEvents([...events, event]);
    }
  };

  return (
    <div className="notification-setting-form">
      <div className="form-header">
        <h3>通知設定の追加</h3>
        <div className="form-description">
          <p>
            GitHubリポジトリのイベントをSlackチャンネルに通知する設定を行います。
            以下の手順で設定してください：
          </p>
          <ol>
            <li>通知を送信するSlackチャンネルを選択</li>
            <li>通知したいGitHubイベントを選択（複数選択可能）</li>
            <li>対象のGitHubリポジトリ情報を入力</li>
          </ol>
          <div className="notification-examples">
            <h4>通知例：</h4>
            <ul>
              <li>
                <strong>Issue作成時：</strong>{' '}
                新しいIssueが作成されたとき、タイトルと作成者の情報が通知されます
              </li>
              <li>
                <strong>PRレビュー時：</strong>{' '}
                PRにレビューコメントが追加されたとき、レビュー内容が通知されます
              </li>
              <li>
                <strong>Issue/PRクローズ時：</strong>{' '}
                Issue/PRがクローズされたとき、関連する情報が通知されます
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="channel">
            <span className="label-text">通知先チャンネル:</span>
            <span className="required-mark">*</span>
          </label>
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
          <label>
            <span className="label-text">通知するイベント:</span>
            <span className="required-mark">*</span>
          </label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={events.includes('issue.opened')}
                onChange={() => handleEventChange('issue.opened')}
              />
              <span className="checkbox-text">Issue 作成</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={events.includes('issue.closed')}
                onChange={() => handleEventChange('issue.closed')}
              />
              <span className="checkbox-text">Issue クローズ</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={events.includes('pr.opened')}
                onChange={() => handleEventChange('pr.opened')}
              />
              <span className="checkbox-text">PR 作成</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={events.includes('pr.closed')}
                onChange={() => handleEventChange('pr.closed')}
              />
              <span className="checkbox-text">PR クローズ</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={events.includes('pr.review')}
                onChange={() => handleEventChange('pr.review')}
              />
              <span className="checkbox-text">PR レビュー</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h4>GitHubリポジトリ情報</h4>
          <div className="form-group">
            <label htmlFor="owner">
              <span className="label-text">リポジトリオーナー:</span>
              <span className="required-mark">*</span>
            </label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={e => setOwner(e.target.value)}
              placeholder="例: octocat"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="repo">
              <span className="label-text">リポジトリ名:</span>
              <span className="required-mark">*</span>
            </label>
            <input
              id="repo"
              type="text"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              placeholder="例: hello-world"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting || !channelId || events.length === 0 || !owner || !repo
          }
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  );
};

export default NotificationSettingForm;
