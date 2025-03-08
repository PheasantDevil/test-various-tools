export const saveRecentRepository = (owner: string, repo: string) => {
  const recentRepos = getRecentRepositories();
  const newRepo = { owner, repo };

  // 重複を避ける
  const filteredRepos = recentRepos.filter(
    r => !(r.owner === owner && r.repo === repo),
  );

  // 最大5つまで保存
  const updatedRepos = [newRepo, ...filteredRepos].slice(0, 5);
  localStorage.setItem('recentRepositories', JSON.stringify(updatedRepos));
};

export const getRecentRepositories = () => {
  const recentReposJson = localStorage.getItem('recentRepositories');
  return recentReposJson ? JSON.parse(recentReposJson) : [];
};
