import { slackApiClient } from '../../../utils/api';
import {
  getChannelHistory,
  getGithubAppPermissions,
  getLatestMessage,
  getLogChannels,
} from '../channelService';

jest.mock('../../../utils/api');

describe('channelService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('getLogChannels should fetch log channels from Slack API', async () => {
    const mockChannels = [
      {
        id: 'C123456',
        name: 'log-channel',
        is_channel: true,
        created: 1609459200, // 2021-01-01
        creator: 'U123456',
        is_archived: false,
        is_general: false,
        topic: { value: 'Log channel topic' },
        purpose: { value: 'For logging' },
      },
      {
        id: 'C234567',
        name: 'general',
        is_channel: true,
        created: 1609459200,
        creator: 'U123456',
        is_archived: false,
        is_general: true,
        topic: { value: 'General channel' },
        purpose: { value: 'General discussion' },
      },
    ];

    (slackApiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { channels: mockChannels },
    });

    const result = await getLogChannels();

    expect(slackApiClient.get).toHaveBeenCalledWith('/conversations.list', {
      params: {
        types: 'public_channel',
        exclude_archived: true,
      },
    });

    // 'log' を含むチャンネルのみがフィルタリングされることを確認
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('log-channel');
  });

  test('getLatestMessage should fetch the latest message from a channel', async () => {
    const mockMessage = {
      ts: '1609459200.000100',
      user: 'U123456',
      text: 'Test message',
      type: 'message',
    };

    (slackApiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { messages: [mockMessage] },
    });

    const result = await getLatestMessage('C123456');

    expect(slackApiClient.get).toHaveBeenCalledWith('/conversations.history', {
      params: {
        channel: 'C123456',
        limit: 1,
      },
    });
    expect(result).toEqual(mockMessage);
  });

  test('getLatestMessage should return null if no messages', async () => {
    (slackApiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { messages: [] },
    });

    const result = await getLatestMessage('C123456');

    expect(result).toBeNull();
  });

  test('getChannelHistory should fetch multiple messages from a channel', async () => {
    const mockMessages = [
      {
        ts: '1609459200.000100',
        user: 'U123456',
        text: 'Test message 1',
        type: 'message',
      },
      {
        ts: '1609459300.000200',
        user: 'U234567',
        text: 'Test message 2',
        type: 'message',
      },
    ];

    (slackApiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { messages: mockMessages },
    });

    const result = await getChannelHistory('C123456', 10);

    expect(slackApiClient.get).toHaveBeenCalledWith('/conversations.history', {
      params: {
        channel: 'C123456',
        limit: 10,
      },
    });
    expect(result).toEqual(mockMessages);
  });

  test('getGithubAppPermissions should return permissions', async () => {
    const permissions = await getGithubAppPermissions('C123456');

    // この関数は現在モックデータを返すだけなので、返り値を確認
    expect(permissions).toEqual(
      expect.arrayContaining([
        'issues:read',
        'issues:write',
        'pull_requests:read',
        'pull_requests:write',
      ]),
    );
  });
});
