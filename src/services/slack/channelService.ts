import { slackApiClient } from '../../utils/api';

export interface SlackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  created: number;
  creator: string;
  is_archived: boolean;
  is_general: boolean;
  topic: {
    value: string;
  };
  purpose: {
    value: string;
  };
}

export interface SlackMessage {
  ts: string;
  user: string;
  text: string;
  type: string;
}

export const getChannels = async (): Promise<SlackChannel[]> => {
  try {
    const response = await slackApiClient.get('/conversations.list');
    return response.data.channels;
  } catch (error) {
    console.error('Failed to fetch channels:', error);
    throw error;
  }
};

export const getLogChannels = async (): Promise<SlackChannel[]> => {
  try {
    const channels = await getChannels();
    return channels.filter(channel => channel.name.includes('log'));
  } catch (error) {
    console.error('Failed to fetch log channels:', error);
    throw error;
  }
};

export const getLatestMessage = async (
  channelId: string,
): Promise<SlackMessage | null> => {
  try {
    const response = await slackApiClient.get('/conversations.history', {
      params: {
        channel: channelId,
        limit: 1,
      },
    });
    return response.data.messages.length > 0 ? response.data.messages[0] : null;
  } catch (error) {
    console.error('Failed to fetch latest message:', error);
    throw error;
  }
};

export const getChannelHistory = async (
  channelId: string,
  limit = 10,
): Promise<SlackMessage[]> => {
  try {
    const response = await slackApiClient.get('/conversations.history', {
      params: {
        channel: channelId,
        limit,
      },
    });
    return response.data.messages;
  } catch (error) {
    console.error('Failed to fetch channel history:', error);
    throw error;
  }
};

export const getGithubAppPermissions = async (
  channelId: string,
): Promise<string[]> => {
  // 実際のAPIがない場合はモックデータを返す
  return [
    'issues:read',
    'issues:write',
    'pull_requests:read',
    'pull_requests:write',
    'workflows:read',
  ];
};
