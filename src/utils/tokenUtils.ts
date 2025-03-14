export const getGitHubToken = (): string | null => {
  return localStorage.getItem('github_token');
};

export const getSlackToken = (): string | null => {
  return localStorage.getItem('slack_token');
};

export const setGitHubToken = (token: string): void => {
  localStorage.setItem('github_token', token);
};

export const setSlackToken = (token: string): void => {
  localStorage.setItem('slack_token', token);
};

export const clearTokens = (): void => {
  localStorage.removeItem('github_token');
  localStorage.removeItem('slack_token');
};
