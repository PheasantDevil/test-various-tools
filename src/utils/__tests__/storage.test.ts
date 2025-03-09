import { getRecentRepositories, saveRecentRepository } from '../storage';

describe('storage', () => {
  beforeEach(() => {
    // テスト前に localStorage をクリア
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('saveRecentRepository should save repository to localStorage', () => {
    const owner = 'testOwner';
    const repo = 'testRepo';

    // 空の配列を返すようにモック
    localStorage.getItem = jest.fn().mockReturnValue(null);

    saveRecentRepository(owner, repo);

    // localStorage.setItem が正しい引数で呼ばれたことを確認
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'recentRepositories',
      JSON.stringify([{ owner, repo }]),
    );
  });

  test('saveRecentRepository should add new repository to the beginning of the list', () => {
    const existingRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
    ];

    localStorage.getItem = jest
      .fn()
      .mockReturnValue(JSON.stringify(existingRepos));

    const newOwner = 'newOwner';
    const newRepo = 'newRepo';

    saveRecentRepository(newOwner, newRepo);

    // 新しいリポジトリがリストの先頭に追加されたことを確認
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'recentRepositories',
      JSON.stringify([{ owner: newOwner, repo: newRepo }, ...existingRepos]),
    );
  });

  test('saveRecentRepository should remove duplicates', () => {
    const existingRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
    ];

    localStorage.getItem = jest
      .fn()
      .mockReturnValue(JSON.stringify(existingRepos));

    // 既存のリポジトリと同じものを保存
    saveRecentRepository('owner1', 'repo1');

    // 重複が削除され、リストの先頭に移動したことを確認
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'recentRepositories',
      JSON.stringify([
        { owner: 'owner1', repo: 'repo1' },
        { owner: 'owner2', repo: 'repo2' },
      ]),
    );
  });

  test('saveRecentRepository should limit the list to 5 items', () => {
    const existingRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
      { owner: 'owner3', repo: 'repo3' },
      { owner: 'owner4', repo: 'repo4' },
      { owner: 'owner5', repo: 'repo5' },
    ];

    localStorage.getItem = jest
      .fn()
      .mockReturnValue(JSON.stringify(existingRepos));

    // 新しいリポジトリを追加
    saveRecentRepository('owner6', 'repo6');

    // リストが5つに制限され、最も古いものが削除されたことを確認
    const savedRepos = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedRepos.length).toBe(5);
    expect(savedRepos[0]).toEqual({ owner: 'owner6', repo: 'repo6' });
    expect(savedRepos).not.toContainEqual({ owner: 'owner5', repo: 'repo5' });
  });

  test('getRecentRepositories should return repositories from localStorage', () => {
    const mockRepos = [
      { owner: 'owner1', repo: 'repo1' },
      { owner: 'owner2', repo: 'repo2' },
    ];

    localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(mockRepos));

    const result = getRecentRepositories();

    expect(result).toEqual(mockRepos);
    expect(localStorage.getItem).toHaveBeenCalledWith('recentRepositories');
  });

  test('getRecentRepositories should return empty array if localStorage is empty', () => {
    localStorage.getItem = jest.fn().mockReturnValue(null);

    const result = getRecentRepositories();

    expect(result).toEqual([]);
  });
});
