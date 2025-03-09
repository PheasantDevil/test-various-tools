import React, { ReactNode, createContext, useContext, useState } from 'react';
import {
  SlackChannel,
  SlackMessage,
  getChannelHistory,
  getGithubAppPermissions,
  getLatestMessage,
  getLogChannels,
} from '../services/slack/channelService';
import {
  NotificationSetting,
  getNotificationSettings,
  saveNotificationSetting,
} from '../services/slack/notificationService';

interface SlackContextType {
  channels: SlackChannel[];
  selectedChannel: SlackChannel | null;
  latestMessage: SlackMessage | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
  fetchChannels: () => Promise<void>;
  selectChannel: (channel: SlackChannel) => Promise<void>;
  channelHistory: SlackMessage[];
  notificationSettings: NotificationSetting[];
  fetchChannelHistory: (channelId: string, limit?: number) => Promise<void>;
  fetchNotificationSettings: () => Promise<void>;
  saveNotificationSetting: (setting: NotificationSetting) => Promise<void>;
}

const SlackContext = createContext<SlackContextType | undefined>(undefined);

export const SlackProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<SlackChannel | null>(
    null,
  );
  const [latestMessage, setLatestMessage] = useState<SlackMessage | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [channelHistory, setChannelHistory] = useState<SlackMessage[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationSetting[]
  >([]);

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getLogChannels();
      setChannels(data);
    } catch (err) {
      setError('Failed to fetch channels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectChannel = async (channel: SlackChannel) => {
    setSelectedChannel(channel);
    setLoading(true);
    setError(null);

    try {
      const message = await getLatestMessage(channel.id);
      setLatestMessage(message);

      const perms = await getGithubAppPermissions(channel.id);
      setPermissions(perms);
    } catch (err) {
      setError('Failed to fetch channel details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelHistory = async (channelId: string, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      const messages = await getChannelHistory(channelId, limit);
      setChannelHistory(messages);
    } catch (err) {
      setError('Failed to fetch channel history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const settings = getNotificationSettings();
      setNotificationSettings(settings);
    } catch (err) {
      setError('Failed to fetch notification settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSetting = async (
    setting: NotificationSetting,
  ) => {
    setLoading(true);
    setError(null);

    try {
      await saveNotificationSetting(setting);
      await fetchNotificationSettings();
    } catch (err) {
      setError('Failed to save notification setting');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlackContext.Provider
      value={{
        channels,
        selectedChannel,
        latestMessage,
        permissions,
        loading,
        error,
        fetchChannels,
        selectChannel,
        channelHistory,
        notificationSettings,
        fetchChannelHistory,
        fetchNotificationSettings,
        saveNotificationSetting: handleSaveNotificationSetting,
      }}
    >
      {children}
    </SlackContext.Provider>
  );
};

export const useSlack = () => {
  const context = useContext(SlackContext);
  if (context === undefined) {
    throw new Error('useSlack must be used within a SlackProvider');
  }
  return context;
};
