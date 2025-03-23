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

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
  profile: {
    display_name: string;
    email?: string;
    image_24?: string;
  };
}

export interface CreateChannelParams {
  repositoryName: string;
  description?: string | undefined;
  members?: string[] | undefined; // メンバーのIDリスト
}

// ユーザーリストのキャッシュデータ
interface UserCache {
  users: SlackUser[];
  timestamp: number;
}

// キャッシュの有効期間（10分 = 600,000ミリ秒）
const CACHE_DURATION = 600000;

// ユーザーリストのキャッシュ
let userCache: UserCache | null = null;

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

export const getSlackUsers = async (): Promise<SlackUser[]> => {
  // キャッシュがあり、まだ有効期間内であれば、キャッシュを返す
  const now = Date.now();
  if (userCache && now - userCache.timestamp < CACHE_DURATION) {
    return userCache.users;
  }

  try {
    const response = await slackApiClient.get('/users.list');
    const users = response.data.members.filter(
      (member: any) => !member.is_bot && !member.deleted,
    );

    // 結果をキャッシュに保存
    userCache = {
      users,
      timestamp: now,
    };

    return users;
  } catch (error: any) {
    // キャッシュが存在する場合は常にキャッシュのデータを返す
    if (userCache) {
      // 429エラー（Too Many Requests）の場合は、エラーログを出力しない
      if (!(error.response && error.response.status === 429)) {
        console.error('Failed to fetch Slack users:', error);
      }
      return userCache.users;
    }

    // キャッシュがない場合、429エラー以外は通常通りログを出力
    if (!(error.response && error.response.status === 429)) {
      console.error('Failed to fetch Slack users:', error);
    }
    throw error;
  }
};

export const createLogChannel = async (
  params: CreateChannelParams,
): Promise<SlackChannel> => {
  const channelName = `log_gh_${params.repositoryName.toLowerCase()}`;
  try {
    // チャンネルを作成
    const response = await slackApiClient.post('/conversations.create', {
      name: channelName,
      is_private: false,
    });

    const channelId = response.data.channel.id;

    // 説明を設定（オプション）
    if (params.description) {
      await slackApiClient.post('/conversations.setPurpose', {
        channel: channelId,
        purpose: params.description,
      });
    }

    // メンバーを招待（オプション）
    if (params.members && params.members.length > 0) {
      await slackApiClient.post('/conversations.invite', {
        channel: channelId,
        users: params.members.join(','),
      });
    }

    return response.data.channel;
  } catch (error) {
    console.error('Failed to create channel:', error);
    throw error;
  }
};
