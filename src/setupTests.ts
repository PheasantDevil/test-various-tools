// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// モックの自動設定
jest.mock('./utils/api', () => {
  const mockApi = {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  };

  return {
    githubApiClient: { ...mockApi },
    slackApiClient: { ...mockApi },
  };
});

// localStorage のモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// グローバルオブジェクトに localStorage を追加
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // 非推奨
    removeListener: jest.fn(), // 非推奨
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 型定義を拡張して、グローバル変数を追加
declare global {
  namespace NodeJS {
    interface Global {
      getItem?: jest.Mock;
      setItem?: jest.Mock;
      removeItem?: jest.Mock;
      matchMedia?: jest.Mock;
    }
  }
}

// テスト用のモックオブジェクト
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// テスト用のモックサービス
// 実際のサービスが存在しない場合に備えて、基本的なモックを提供
jest.mock(
  './services/github/issueService',
  () => ({
    fetchIssues: jest.fn().mockResolvedValue([]),
    createIssue: jest.fn().mockResolvedValue({}),
    updateIssue: jest.fn().mockResolvedValue({}),
    closeIssue: jest.fn().mockResolvedValue({}),
    reopenIssue: jest.fn().mockResolvedValue({}),
  }),
  { virtual: true },
);

jest.mock(
  './services/github/pullRequestService',
  () => ({
    fetchPullRequests: jest.fn().mockResolvedValue([]),
    createPullRequest: jest.fn().mockResolvedValue({}),
    updatePullRequest: jest.fn().mockResolvedValue({}),
    closePullRequest: jest.fn().mockResolvedValue({}),
    requestReview: jest.fn().mockResolvedValue({}),
  }),
  { virtual: true },
);

jest.mock(
  './services/slack/channelService',
  () => ({
    fetchChannels: jest.fn().mockResolvedValue([]),
    fetchChannelHistory: jest.fn().mockResolvedValue([]),
    joinChannel: jest.fn().mockResolvedValue({}),
    leaveChannel: jest.fn().mockResolvedValue({}),
  }),
  { virtual: true },
);

jest.mock(
  './utils/storage',
  () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }),
  { virtual: true },
);
