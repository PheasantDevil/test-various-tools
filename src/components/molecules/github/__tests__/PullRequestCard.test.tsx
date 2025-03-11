import { fireEvent, render, screen } from '@testing-library/react';
import PullRequestCard from '../PullRequestCard';

// PullRequestの型を定義
type PullRequest = {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  requested_reviewers: {
    login: string;
    avatar_url: string;
  }[];
  reviews: {
    user: { login: string };
    state: string;
    submitted_at: string;
  }[];
};

describe('PullRequestCard', () => {
  const mockPR: PullRequest = {
    id: 1,
    number: 101,
    title: 'Test PR',
    state: 'open',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    html_url: 'https://github.com/owner/repo/pull/101',
    user: {
      login: 'testuser',
      avatar_url: 'https://github.com/testuser.png',
    },
    requested_reviewers: [
      { login: 'reviewer1', avatar_url: 'https://github.com/reviewer1.png' },
    ],
    reviews: [
      {
        user: { login: 'approver' },
        state: 'APPROVED',
        submitted_at: '2023-01-03T00:00:00Z',
      },
    ],
  };

  test('renders PR correctly', () => {
    const onClose = jest.fn();
    const onRequestReview = jest.fn();

    render(
      <PullRequestCard
        pullRequest={mockPR}
        onClose={onClose}
        onRequestReview={onRequestReview}
      />,
    );

    // PR のタイトルと番号が表示されることを確認
    expect(screen.getByText(/#101 Test PR/)).toBeInTheDocument();

    // 作成者が表示されることを確認
    expect(screen.getByText(/作成者: testuser/)).toBeInTheDocument();

    // 状態が表示されることを確認
    expect(screen.getByText(/状態: 開いています/)).toBeInTheDocument();

    // 承認状態が表示されることを確認
    expect(screen.getByText(/承認状態: 承認済み/)).toBeInTheDocument();

    // レビュアーが表示されることを確認
    expect(screen.getByText('reviewer1')).toBeInTheDocument();

    // Close ボタンが表示されることを確認
    const closeButton = screen.getByText('Close PR');
    expect(closeButton).toBeInTheDocument();

    // ボタンをクリックするとonClose関数が呼ばれることを確認
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledWith(101);
  });

  test('handles review request correctly', () => {
    const onClose = jest.fn();
    const onRequestReview = jest.fn();

    render(
      <PullRequestCard
        pullRequest={mockPR}
        onClose={onClose}
        onRequestReview={onRequestReview}
      />,
    );

    // レビュー依頼フォームが表示されることを確認
    const input = screen.getByPlaceholderText(
      'レビュアーのGitHubユーザー名を入力',
    );
    expect(input).toBeInTheDocument();

    // 入力を行う
    fireEvent.change(input, { target: { value: 'newreviewer' } });

    // レビュー依頼ボタンをクリックする
    // queryAllByTextを使用して、複数の要素から特定のボタンを選択
    const requestButtons = screen.queryAllByText('レビュー依頼');
    // ボタンは通常、配列の最後の要素（h4の後にあるボタン）
    const requestButton = requestButtons[requestButtons.length - 1];
    if (requestButton) {
      fireEvent.click(requestButton);
      // onRequestReview関数が正しい引数で呼ばれることを確認
      expect(onRequestReview).toHaveBeenCalledWith(101, ['newreviewer']);
    } else {
      throw new Error('レビュー依頼ボタンが見つかりません');
    }
  });

  test('does not show close button for closed PR', () => {
    const closedPR: PullRequest = { ...mockPR, state: 'closed' };
    const onClose = jest.fn();
    const onRequestReview = jest.fn();

    render(
      <PullRequestCard
        pullRequest={closedPR}
        onClose={onClose}
        onRequestReview={onRequestReview}
      />,
    );

    // Close ボタンが表示されないことを確認
    expect(screen.queryByText('Close PR')).not.toBeInTheDocument();
  });
});
