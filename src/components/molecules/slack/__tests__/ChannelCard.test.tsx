import { fireEvent, render, screen } from '@testing-library/react';
import ChannelCard from '../ChannelCard';

describe('ChannelCard', () => {
  const mockChannel = {
    id: 'C123456',
    name: 'log-channel',
    is_channel: true,
    created: 1609459200, // 2021-01-01
    creator: 'U123456',
    is_archived: false,
    is_general: false,
    topic: { value: 'Log channel topic' },
    purpose: { value: 'For logging' },
  };

  const mockLatestMessage = {
    ts: '1609459200.000100',
    user: 'U123456',
    text: 'Test message',
    type: 'message',
  };

  const mockPermissions = ['issues:read', 'issues:write'];

  test('renders channel correctly', () => {
    const onSelect = jest.fn();

    render(
      <ChannelCard
        channel={mockChannel}
        latestMessage={null}
        permissions={[]}
        isSelected={false}
        onSelect={onSelect}
      />,
    );

    // チャンネル名が表示されることを確認
    expect(screen.getByText('#log-channel')).toBeInTheDocument();

    // 作成日時が表示されることを確認
    expect(screen.getByText(/作成日時:/)).toBeInTheDocument();

    // 目的が表示されることを確認
    expect(screen.getByText(/目的: For logging/)).toBeInTheDocument();

    // カードをクリックするとonSelect関数が呼ばれることを確認
    fireEvent.click(screen.getByText('#log-channel'));
    expect(onSelect).toHaveBeenCalledWith(mockChannel);
  });

  test('renders selected channel with details', () => {
    const onSelect = jest.fn();

    render(
      <ChannelCard
        channel={mockChannel}
        latestMessage={mockLatestMessage}
        permissions={mockPermissions}
        isSelected={true}
        onSelect={onSelect}
      />,
    );

    // 選択されたチャンネルには selected クラスが付与されることを確認
    expect(
      screen.getByText('#log-channel').closest('.channel-card'),
    ).toHaveClass('selected');

    // 最新メッセージが表示されることを確認
    expect(screen.getByText('最新メッセージ:')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // GitHub アプリ権限が表示されることを確認
    expect(screen.getByText('GitHub アプリ権限:')).toBeInTheDocument();
    expect(screen.getByText('issues:read')).toBeInTheDocument();
    expect(screen.getByText('issues:write')).toBeInTheDocument();
  });

  test('shows no message text when latestMessage is null', () => {
    const onSelect = jest.fn();

    render(
      <ChannelCard
        channel={mockChannel}
        latestMessage={null}
        permissions={mockPermissions}
        isSelected={true}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText('メッセージはありません')).toBeInTheDocument();
  });

  test('shows no permissions text when permissions is empty', () => {
    const onSelect = jest.fn();

    render(
      <ChannelCard
        channel={mockChannel}
        latestMessage={mockLatestMessage}
        permissions={[]}
        isSelected={true}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText('権限はありません')).toBeInTheDocument();
  });
});
