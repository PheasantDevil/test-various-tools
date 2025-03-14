import React, { ReactNode, createContext, useContext, useState } from 'react';
import {
  Repository,
  getRepositories,
} from '../services/github/repositoryService';
import {
  CreateChannelParams,
  SlackChannel,
  SlackMessage,
  createLogChannel,
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
  repositories: Repository[];
  fetchChannels: () => Promise<void>;
  selectChannel: (channel: SlackChannel) => Promise<void>;
  channelHistory: SlackMessage[];
  notificationSettings: NotificationSetting[];
  fetchChannelHistory: (channelId: string, limit?: number) => Promise<void>;
  fetchNotificationSettings: () => Promise<void>;
  saveNotificationSetting: (setting: NotificationSetting) => Promise<void>;
  fetchRepositories: () => Promise<void>;
  createChannel: (params: CreateChannelParams) => Promise<void>;
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
  const [repositories, setRepositories] = useState<Repository[]>([]);

  // キャッシュ用の状態
  const [lastFetchTimes, setLastFetchTimes] = useState<Record<string, number>>({
    channels: 0,
    notifications: 0,
    repositories: 0,
  });
  const CACHE_DURATION = 60000; // 1分

  const shouldFetch = (key: string) => {
    const lastFetch = lastFetchTimes[key] || 0;
    return Date.now() - lastFetch >= CACHE_DURATION;
  };

  const updateLastFetchTime = (key: string) => {
    setLastFetchTimes(prev => ({
      ...prev,
      [key]: Date.now(),
    }));
  };

  const fetchChannels = async () => {
    if (!shouldFetch('channels')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getLogChannels();
      setChannels(data);
      updateLastFetchTime('channels');
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

  const fetchChannelHistory = async (channelId: string) => {
    setLoading(true);
    try {
      const messages = await getChannelHistory(channelId);
      if (Array.isArray(messages)) {
        setChannelHistory(messages);
      } else {
        setChannelHistory([]);
        setError('メッセージの取得に失敗しました');
      }
    } catch (err) {
      console.error('Failed to fetch channel history:', err);
      setError('メッセージの取得中にエラーが発生しました');
      setChannelHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationSettings = async () => {
    if (!shouldFetch('notifications')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const settings = getNotificationSettings();
      setNotificationSettings(settings);
      updateLastFetchTime('notifications');
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

  const fetchRepositories = async () => {
    if (!shouldFetch('repositories')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const repos = await getRepositories();
      setRepositories(repos);
      updateLastFetchTime('repositories');
    } catch (err) {
      setError('Failed to fetch repositories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createChannel = async (params: CreateChannelParams) => {
    setLoading(true);
    setError(null);

    try {
      await createLogChannel(params);
      await fetchChannels(); // チャンネル一覧を更新
    } catch (err) {
      setError('Failed to create channel');
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
        repositories,
        fetchChannels,
        selectChannel,
        channelHistory,
        notificationSettings,
        fetchChannelHistory,
        fetchNotificationSettings,
        saveNotificationSetting: handleSaveNotificationSetting,
        fetchRepositories,
        createChannel,
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
