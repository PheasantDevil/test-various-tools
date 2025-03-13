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

    if (response.data?.messages?.[0]) {
      return response.data.messages[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch latest message:', error);
    return null;
  }
};

export const getChannelHistory = async (
  channelId: string,
): Promise<SlackMessage[]> => {
  try {
    const response = await slackApiClient.get('/conversations.history', {
      params: {
        channel: channelId,
        limit: 50,
      },
    });

    if (response.data?.messages && Array.isArray(response.data.messages)) {
      return response.data.messages;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch channel history:', error);
    return [];
  }
};

export const getGithubAppPermissions = async (
  _channelId: string,
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
