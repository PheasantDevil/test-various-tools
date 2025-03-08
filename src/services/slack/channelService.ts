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

export const getLogChannels = async (): Promise<SlackChannel[]> => {
  const response = await slackApiClient.get('/conversations.list', {
    params: {
      types: 'public_channel',
      exclude_archived: true,
    },
  });

  // "log"を含むチャンネルのみをフィルタリング
  return response.data.channels.filter((channel: SlackChannel) =>
    channel.name.includes('log'),
  );
};

export const getLatestMessage = async (
  channelId: string,
): Promise<SlackMessage | null> => {
  const response = await slackApiClient.get('/conversations.history', {
    params: {
      channel: channelId,
      limit: 1,
    },
  });

  if (response.data.messages && response.data.messages.length > 0) {
    return response.data.messages[0];
  }
  return null;
};

export const getGithubAppPermissions = async (
  channelId: string,
): Promise<string[]> => {
  // この実装は仮のものです。実際にはSlack APIを使用してGitHubアプリの権限を取得する必要があります
  // 実際の実装では、Slack APIのapps.permissionsなどを使用する必要があるかもしれません
  return [
    'issues:read',
    'issues:write',
    'pull_requests:read',
    'pull_requests:write',
  ];
};

export const getChannelHistory = async (
  channelId: string,
  limit: number = 10,
): Promise<SlackMessage[]> => {
  const response = await slackApiClient.get('/conversations.history', {
    params: {
      channel: channelId,
      limit,
    },
  });

  return response.data.messages || [];
};
