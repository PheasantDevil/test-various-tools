import axios from 'axios';

// GitHub API クライアント
export const githubApiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN || ''}`,
  },
});

// Slack API クライアント
export const slackApiClient = axios.create({
  baseURL: 'https://slack.com/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_SLACK_TOKEN || ''}`,
  },
});
