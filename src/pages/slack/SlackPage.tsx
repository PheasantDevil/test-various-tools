import React, { useEffect } from 'react';
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
  } = useSlack();

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <div className="slack-page">
      <h1>Slack チャンネル管理</h1>

      {error && <div className="error">{error}</div>}

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
                  onSelect={selectChannel}
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
