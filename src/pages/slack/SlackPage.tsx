import React, { useCallback, useEffect, useRef } from 'react';
import ErrorMessage from '../../components/atoms/ErrorMessage';
import LoadingSpinner from '../../components/atoms/LoadingSpinner';
import ChannelCard from '../../components/molecules/slack/ChannelCard';
import CreateChannelForm from '../../components/molecules/slack/CreateChannelForm';
import NotificationSettingForm from '../../components/molecules/slack/NotificationSettingForm';
import { useSlack } from '../../contexts/SlackContext';
import { SlackChannel } from '../../services/slack/channelService';
import './SlackPage.scss';

const SlackPage: React.FC = () => {
  const {
    channels,
    selectedChannel,
    latestMessage,
    permissions,
    loading,
    error,
    repositories,
    fetchChannels,
    selectChannel,
    fetchNotificationSettings,
    fetchChannelHistory,
    channelHistory,
    saveNotificationSetting,
    fetchRepositories,
    createChannel,
  } = useSlack();

  // 初期化済みかどうかを追跡するref
  const isInitializedRef = useRef(false);

  // メモ化された初期化関数
  const initializeData = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      await Promise.all([
        fetchChannels(),
        fetchNotificationSettings(),
        fetchRepositories(),
      ]);
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize data:', error);
      isInitializedRef.current = false;
    }
  }, [fetchChannels, fetchNotificationSettings, fetchRepositories]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // クリーンアップ用のuseEffect
  useEffect(() => {
    return () => {
      isInitializedRef.current = false;
    };
  }, []);

  const handleSelectChannel = async (channel: SlackChannel) => {
    try {
      await selectChannel(channel);
      await fetchChannelHistory(channel.id, 20);
    } catch (error) {
      console.error('Failed to select channel:', error);
    }
  };

  const handleRetry = async () => {
    await fetchChannels();
    if (selectedChannel) {
      await fetchChannelHistory(selectedChannel.id);
    }
  };

  return (
    <div className="slack-page">
      <h1>Slack チャンネル管理</h1>

      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="create-channel-section">
            <CreateChannelForm
              repositories={repositories}
              onSubmit={createChannel}
              isLoading={loading}
            />
          </div>

          <div className="channels-section">
            <h2>ログチャンネル一覧</h2>
            {channels.length > 0 ? (
              <div className="channels-list">
                {channels.map(channel => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    latestMessage={
                      selectedChannel?.id === channel.id ? latestMessage : null
                    }
                    permissions={
                      selectedChannel?.id === channel.id ? permissions : []
                    }
                    isSelected={selectedChannel?.id === channel.id}
                    onSelect={handleSelectChannel}
                  />
                ))}
              </div>
            ) : (
              <p>ログチャンネルはありません</p>
            )}
          </div>

          {selectedChannel && (
            <div className="channel-history">
              <h3>#{selectedChannel.name} のメッセージ履歴</h3>
              <div className="message-list">
                {loading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <ErrorMessage message={error} />
                ) : Array.isArray(channelHistory) &&
                  channelHistory.length > 0 ? (
                  channelHistory.map(message => (
                    <div key={message.ts} className="message-item">
                      <div className="message-meta">
                        <span>ユーザー: {message.user}</span>
                        <span>
                          時間:{' '}
                          {new Date(parseInt(message.ts) * 1000).toLocaleString(
                            'ja-JP',
                          )}
                        </span>
                      </div>
                      <div className="message-text">{message.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-messages">
                    <p>このチャンネルにはメッセージがありません。</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="notification-settings-section">
            <h2>通知設定</h2>
            <NotificationSettingForm
              channels={channels}
              onSave={saveNotificationSetting}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SlackPage;
