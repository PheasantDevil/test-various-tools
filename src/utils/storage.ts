export interface Repository {
  owner: string;
  repo: string;
}

export const saveRecentRepository = (owner: string, repo: string): void => {
  try {
    const recentRepos = getRecentRepositories();

    // 既存のエントリを削除
    const filteredRepos = recentRepos.filter(
      r => !(r.owner === owner && r.repo === repo),
    );

    // 新しいエントリを先頭に追加
    const newRepos = [{ owner, repo }, ...filteredRepos];

    // 最大5つまで保存
    const limitedRepos = newRepos.slice(0, 5);

    localStorage.setItem('recentRepositories', JSON.stringify(limitedRepos));
  } catch (error) {
    console.error('Failed to save recent repository:', error);
  }
};

export const getRecentRepositories = (): Repository[] => {
  try {
    const reposJson = localStorage.getItem('recentRepositories');
    if (!reposJson) {
      return [];
    }
    return JSON.parse(reposJson);
  } catch (error) {
    console.error('Failed to get recent repositories:', error);
    return [];
  }
};
