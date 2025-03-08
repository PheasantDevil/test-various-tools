import axios from 'axios';

// GitHub API クライアント
export const githubApiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

// Slack API クライアント
export const slackApiClient = axios.create({
  baseURL: 'https://slack.com/api',
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_SLACK_TOKEN}`,
    'Content-Type': 'application/json',
  },
});
