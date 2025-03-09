import React, { useEffect } from 'react';
import { SlackChannel } from 'services/slack/channelService';
import ErrorMessage from '../../components/atoms/ErrorMessage';
import ChannelCard from '../../components/molecules/slack/ChannelCard';
import { useSlack } from '../../contexts/SlackContext';

const SlackPage: React.FC = () => {
  const {
    channels,
    selectedChannel,
    latestMessage,
    permissions,
    loading,
    error,
    fetchChannels,
    selectChannel,
    fetchNotificationSettings,
    fetchChannelHistory,
  } = useSlack();

  useEffect(() => {
    fetchChannels();
    fetchNotificationSettings();
  }, []);

  const handleSelectChannel = async (channel: SlackChannel) => {
    await selectChannel(channel);
    await fetchChannelHistory(channel.id, 20);
  };

  return (
    <div className="slack-page">
      <h1>Slack チャンネル管理</h1>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            fetchChannels();
            if (selectedChannel) {
              fetchChannelHistory(selectedChannel.id);
            }
          }}
        />
      )}

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default SlackPage;
