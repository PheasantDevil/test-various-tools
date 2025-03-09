import React from 'react';
import {
  SlackChannel,
  SlackMessage,
} from '../../../services/slack/channelService';
import './ChannelCard.scss';

interface ChannelCardProps {
  channel: SlackChannel;
  latestMessage: SlackMessage | null;
  permissions: string[];
  isSelected: boolean;
  onSelect: (channel: SlackChannel) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  latestMessage,
  permissions,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`channel-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(channel)}
    >
      <h3>#{channel.name}</h3>
      <div className="channel-meta">
        <p>
          作成日時: {new Date(channel.created * 1000).toLocaleString('ja-JP')}
        </p>
        <p>目的: {channel.purpose.value || 'なし'}</p>
      </div>
      {isSelected && (
        <>
          <div className="latest-message">
            <h4>最新メッセージ:</h4>
            {latestMessage ? (
              <p>
                {latestMessage.text.substring(0, 100)}
                {latestMessage.text.length > 100 ? '...' : ''}
              </p>
            ) : (
              <p>メッセージはありません</p>
            )}
          </div>
          <div className="github-permissions">
            <h4>GitHub アプリ権限:</h4>
            {permissions.length > 0 ? (
              <ul>
                {permissions.map(perm => (
                  <li key={perm}>{perm}</li>
                ))}
              </ul>
            ) : (
              <p>権限はありません</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChannelCard;
