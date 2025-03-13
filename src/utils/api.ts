import axios from 'axios';

// GitHub API クライアント
export const githubApiClient = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${process.env['REACT_APP_GITHUB_TOKEN'] || ''}`,
  },
});

// Slack API クライアント
export const slackApiClient = axios.create({
  baseURL: 'https://slack.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${process.env['REACT_APP_SLACK_TOKEN'] || ''}`,
  },
});

// Slack APIのリクエストインターセプター
slackApiClient.interceptors.request.use(config => {
  // プロキシサーバーのURLを使用（開発環境の場合）
  if (process.env['NODE_ENV'] === 'development') {
    config.baseURL = '/api';
  }
  return config;
});

// Slack Webhook クライアント
export const slackWebhookClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Webhookリクエスト用のヘルパー関数
export const sendSlackWebhook = async (message: any) => {
  const webhookUrl = process.env['REACT_APP_SLACK_WEBHOOK_URL'];
  if (!webhookUrl) {
    throw new Error('Slack Webhook URL is not configured');
  }

  try {
    await slackWebhookClient.post(webhookUrl, message);
  } catch (error) {
    console.error('Failed to send message to Slack webhook:', error);
    throw error;
  }
};
