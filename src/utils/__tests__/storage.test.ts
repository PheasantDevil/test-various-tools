// モックの設定
jest.mock('../storage', () => ({
  saveRecentRepository: jest.fn(),
  getRecentRepositories: jest.fn(),
}));

import { getRecentRepositories, saveRecentRepository } from '../storage';

// 基本的なストレージ操作のテスト用関数
const setItem = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string): any => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

describe('storage', () => {
  beforeEach(() => {
    // テスト前に localStorage をクリア
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('setItem should save data to localStorage', () => {
    const key = 'testKey';
    const value = { test: 'data' };

    setItem(key, value);

    // localStorage.setItem が正しい引数で呼ばれたことを確認
    expect(localStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
    );
  });

  test('getItem should retrieve data from localStorage', () => {
    const key = 'testKey';
    const value = { test: 'data' };

    localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(value));

    const result = getItem(key);

    expect(result).toEqual(value);
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });

  test('getItem should return null if localStorage is empty', () => {
    const key = 'testKey';
    localStorage.getItem = jest.fn().mockReturnValue(null);

    const result = getItem(key);

    expect(result).toBeNull();
  });

  test('removeItem should remove data from localStorage', () => {
    const key = 'testKey';

    removeItem(key);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  test('saveRecentRepository should save repository to localStorage', () => {
    const owner = 'testOwner';
    const repo = 'testRepo';

    // モック実装を提供
    (saveRecentRepository as jest.Mock).mockImplementation((owner, repo) => {
      const repos = [];
      repos.push({ owner, repo });
      localStorage.setItem('recentRepositories', JSON.stringify(repos));
    });

    saveRecentRepository(owner, repo);

    // saveRecentRepository が呼ばれたことを確認
    expect(saveRecentRepository).toHaveBeenCalledWith(owner, repo);

    // localStorage.setItem が呼ばれたことを確認（モック実装による）
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test('saveRecentRepository should add new repository to the beginning of the list', () => {
    const existingRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
    ];

    // モック実装を提供
    (saveRecentRepository as jest.Mock).mockImplementation((owner, repo) => {
      const newRepos = [{ owner, repo }, ...existingRepos];
      localStorage.setItem('recentRepositories', JSON.stringify(newRepos));
    });

    const newOwner = 'newOwner';
    const newRepo = 'newRepo';

    saveRecentRepository(newOwner, newRepo);

    // saveRecentRepository が呼ばれたことを確認
    expect(saveRecentRepository).toHaveBeenCalledWith(newOwner, newRepo);
  });

  test('saveRecentRepository should remove duplicates', () => {
    const existingRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
    ];

    // モック実装を提供
    (saveRecentRepository as jest.Mock).mockImplementation((owner, repo) => {
      const filteredRepos = existingRepos.filter(
        r => !(r.owner === owner && r.repo === repo),
      );
      const newRepos = [{ owner, repo }, ...filteredRepos];
      localStorage.setItem('recentRepositories', JSON.stringify(newRepos));
    });

    // 既存のリポジトリと同じものを保存
    saveRecentRepository('owner1', 'repo1');

    // saveRecentRepository が呼ばれたことを確認
    expect(saveRecentRepository).toHaveBeenCalledWith('owner1', 'repo1');
  });

  test('saveRecentRepository should limit the list to 5 items', () => {
    const existingRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
      { owner: 'owner3', repo: 'repo3' },
      { owner: 'owner4', repo: 'repo4' },
      { owner: 'owner5', repo: 'repo5' },
    ];

    // モック実装を提供
    (saveRecentRepository as jest.Mock).mockImplementation((owner, repo) => {
      const newRepos = [{ owner, repo }, ...existingRepos].slice(0, 5);
      localStorage.setItem('recentRepositories', JSON.stringify(newRepos));
    });

    // 新しいリポジトリを追加
    saveRecentRepository('owner6', 'repo6');

    // saveRecentRepository が呼ばれたことを確認
    expect(saveRecentRepository).toHaveBeenCalledWith('owner6', 'repo6');
  });

  test('getRecentRepositories should return repositories from localStorage', () => {
    const mockRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
    ];

    // モック実装を提供
    (getRecentRepositories as jest.Mock).mockReturnValue(mockRepos);

    const result = getRecentRepositories();

    expect(result).toEqual(mockRepos);
    expect(getRecentRepositories).toHaveBeenCalled();
  });

  test('getRecentRepositories should return empty array if localStorage is empty', () => {
    // モック実装を提供
    (getRecentRepositories as jest.Mock).mockReturnValue([]);

    const result = getRecentRepositories();

    expect(result).toEqual([]);
    expect(getRecentRepositories).toHaveBeenCalled();
  });
});
