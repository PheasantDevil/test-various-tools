import { act, render, screen, waitFor } from '@testing-library/react';
import { SlackProvider, useSlack } from '../SlackContext';

// モックをインポート
const channelService = jest.requireMock('../../services/slack/channelService');
const notificationService = jest.requireMock(
  '../../services/slack/notificationService',
);

// モックの設定
beforeEach(() => {
  jest.resetAllMocks();

  // channelServiceのモックメソッドを設定
  channelService.fetchChannels = jest.fn().mockResolvedValue([]);
  channelService.getLogChannels = jest.fn().mockResolvedValue([]);
  channelService.fetchChannelHistory = jest.fn().mockResolvedValue([]);
  channelService.getChannelHistory = jest.fn().mockResolvedValue([]);
  channelService.joinChannel = jest.fn().mockResolvedValue({});
  channelService.leaveChannel = jest.fn().mockResolvedValue({});
  channelService.getLatestMessage = jest.fn().mockResolvedValue(null);
  channelService.getGithubAppPermissions = jest.fn().mockResolvedValue([]);

  // notificationServiceのモックメソッドを設定
  notificationService.sendNotification = jest.fn().mockResolvedValue({});
  notificationService.getNotifications = jest.fn().mockResolvedValue([]);
});

// テスト用のコンポーネント
const TestComponent = () => {
  const {
    channels,
    selectedChannel,
    loading,
    error,
    fetchChannels,
    selectChannel,
    channelHistory,
    fetchChannelHistory,
  } = useSlack();

  return (
    <div>
      <div data-testid="channels-count">{channels.length}</div>
      <div data-testid="selected-channel">
        {selectedChannel?.name || 'None'}
      </div>
      <div data-testid="history-count">{channelHistory.length}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <button onClick={() => fetchChannels()}>Fetch Channels</button>
      <button
        onClick={() =>
          selectChannel({ id: 'C123', name: 'test-channel' } as any)
        }
      >
        Select Channel
      </button>
      <button onClick={() => fetchChannelHistory('C123')}>Fetch History</button>
    </div>
  );
};

describe('SlackContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should provide initial values', () => {
    render(
      <SlackProvider>
        <TestComponent />
      </SlackProvider>,
    );

    expect(screen.getByTestId('channels-count')).toHaveTextContent('0');
    expect(screen.getByTestId('selected-channel')).toHaveTextContent('None');
    expect(screen.getByTestId('history-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
  });

  test('should fetch channels when fetchChannels is called', async () => {
    const mockChannels = [
      { id: 'C123', name: 'log-channel' },
      { id: 'C456', name: 'log-events' },
    ];

    (channelService.getLogChannels as jest.Mock).mockResolvedValueOnce(
      mockChannels,
    );

    render(
      <SlackProvider>
        <TestComponent />
      </SlackProvider>,
    );

    // Fetch channels
    act(() => {
      screen.getByText('Fetch Channels').click();
    });

    // Check loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Check that channels were loaded
    expect(screen.getByTestId('channels-count')).toHaveTextContent('2');
    expect(channelService.getLogChannels).toHaveBeenCalled();
  });

  test('should select channel and fetch details when selectChannel is called', async () => {
    const mockMessage = {
      ts: '123',
      user: 'U123',
      text: 'Test',
      type: 'message',
    };
    const mockPermissions = ['issues:read', 'issues:write'];

    (channelService.getLatestMessage as jest.Mock).mockResolvedValueOnce(
      mockMessage,
    );
    (channelService.getGithubAppPermissions as jest.Mock).mockResolvedValueOnce(
      mockPermissions,
    );

    render(
      <SlackProvider>
        <TestComponent />
      </SlackProvider>,
    );

    // Select channel
    act(() => {
      screen.getByText('Select Channel').click();
    });

    // Check loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Check that channel was selected and details were fetched
    expect(screen.getByTestId('selected-channel')).toHaveTextContent(
      'test-channel',
    );
    expect(channelService.getLatestMessage).toHaveBeenCalledWith('C123');
    expect(channelService.getGithubAppPermissions).toHaveBeenCalledWith('C123');
  });

  test('should fetch channel history when fetchChannelHistory is called', async () => {
    const mockMessages = [
      { ts: '123', user: 'U123', text: 'Test 1', type: 'message' },
      { ts: '456', user: 'U456', text: 'Test 2', type: 'message' },
    ];

    (channelService.getChannelHistory as jest.Mock).mockResolvedValueOnce(
      mockMessages,
    );

    render(
      <SlackProvider>
        <TestComponent />
      </SlackProvider>,
    );

    // Fetch history
    act(() => {
      screen.getByText('Fetch History').click();
    });

    // Check loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Check that history was loaded
    expect(screen.getByTestId('history-count')).toHaveTextContent('2');
    expect(channelService.getChannelHistory).toHaveBeenCalledWith('C123', 10);
  });

  test('should handle errors when fetching channels fails', async () => {
    (channelService.getLogChannels as jest.Mock).mockRejectedValueOnce(
      new Error('API Error'),
    );

    render(
      <SlackProvider>
        <TestComponent />
      </SlackProvider>,
    );

    // Fetch channels
    act(() => {
      screen.getByText('Fetch Channels').click();
    });

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Check that error was set
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Failed to fetch channels',
    );
  });
});
