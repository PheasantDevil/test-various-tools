import { fireEvent, render, screen } from '@testing-library/react';
import IssueCard from '../IssueCard';

describe('IssueCard', () => {
  const mockIssue = {
    id: 1,
    number: 101,
    title: 'Test Issue',
    state: 'open',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    html_url: 'https://github.com/owner/repo/issues/101',
    user: {
      login: 'testuser',
      avatar_url: 'https://github.com/testuser.png',
    },
  };

  test('renders open issue correctly', () => {
    const onClose = jest.fn();
    const onReopen = jest.fn();

    render(
      <IssueCard issue={mockIssue} onClose={onClose} onReopen={onReopen} />,
    );

    // Issue のタイトルと番号が表示されることを確認
    expect(screen.getByText(/#101 Test Issue/)).toBeInTheDocument();

    // 作成者が表示されることを確認
    expect(screen.getByText(/作成者: testuser/)).toBeInTheDocument();

    // 状態が表示されることを確認
    expect(screen.getByText(/状態: 開いています/)).toBeInTheDocument();

    // Close ボタンが表示されることを確認
    const closeButton = screen.getByText('Close Issue');
    expect(closeButton).toBeInTheDocument();

    // ボタンをクリックするとonClose関数が呼ばれることを確認
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledWith(101);
  });

  test('renders closed issue correctly', () => {
    const closedIssue = { ...mockIssue, state: 'closed' };
    const onClose = jest.fn();
    const onReopen = jest.fn();

    render(
      <IssueCard issue={closedIssue} onClose={onClose} onReopen={onReopen} />,
    );

    // 状態が表示されることを確認
    expect(screen.getByText(/状態: 閉じています/)).toBeInTheDocument();

    // Reopen ボタンが表示されることを確認
    const reopenButton = screen.getByText('Reopen Issue');
    expect(reopenButton).toBeInTheDocument();

    // ボタンをクリックするとonReopen関数が呼ばれることを確認
    fireEvent.click(reopenButton);
    expect(onReopen).toHaveBeenCalledWith(101);
  });
});
