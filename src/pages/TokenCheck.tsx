import React, { useEffect, useState } from 'react';
import { githubApiClient, slackApiClient } from '../utils/api';

const TokenCheck: React.FC = () => {
  const [githubStatus, setGithubStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [slackStatus, setSlackStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [githubError, setGithubError] = useState<string>('');
  const [slackError, setSlackError] = useState<string>('');
  const [githubUser, setGithubUser] = useState<string>('');

  useEffect(() => {
    // GitHub トークンのチェック
    const checkGithubToken = async () => {
      try {
        if (!process.env['REACT_APP_GITHUB_TOKEN']) {
          throw new Error('GitHub token is not set');
        }
        const response = await githubApiClient.get('/user');
        setGithubStatus('success');
        setGithubUser(response.data.login);
      } catch (error: any) {
        setGithubStatus('error');
        if (error.response?.status === 401) {
          setGithubError('Invalid or expired GitHub token');
        } else if (error.message) {
          setGithubError(error.message);
        } else {
          setGithubError('Unknown error occurred');
        }
      }
    };

    // Slack トークンのチェック
    const checkSlackToken = async () => {
      try {
        if (!process.env['REACT_APP_SLACK_TOKEN']) {
          throw new Error('Slack token is not set');
        }
        const response = await slackApiClient.get('/auth.test');
        if (response.data.ok) {
          setSlackStatus('success');
        } else {
          throw new Error(response.data.error || 'Slack API error');
        }
      } catch (error: any) {
        setSlackStatus('error');
        if (error.response?.data?.error) {
          setSlackError(`Slack API error: ${error.response.data.error}`);
        } else if (error.message) {
          setSlackError(error.message);
        } else {
          setSlackError('Unknown error occurred');
        }
      }
    };

    checkGithubToken();
    checkSlackToken();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>API トークン設定確認</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>GitHub トークン</h2>
        {githubStatus === 'loading' && <p>確認中...</p>}
        {githubStatus === 'success' && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#e6ffe6',
              borderRadius: '5px',
            }}
          >
            <p>✅ GitHub トークンは正しく設定されています</p>
            <p>
              ログインユーザー: <strong>{githubUser}</strong>
            </p>
          </div>
        )}
        {githubStatus === 'error' && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#ffe6e6',
              borderRadius: '5px',
            }}
          >
            <p>❌ GitHub トークンの設定に問題があります</p>
            <p>エラー: {githubError}</p>
            <h3>考えられる原因:</h3>
            <ul>
              <li>トークンが設定されていない</li>
              <li>トークンが無効または期限切れ</li>
              <li>トークンに必要な権限がない</li>
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Slack トークン</h2>
        {slackStatus === 'loading' && <p>確認中...</p>}
        {slackStatus === 'success' && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#e6ffe6',
              borderRadius: '5px',
            }}
          >
            <p>✅ Slack トークンは正しく設定されています</p>
          </div>
        )}
        {slackStatus === 'error' && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#ffe6e6',
              borderRadius: '5px',
            }}
          >
            <p>❌ Slack トークンの設定に問題があります</p>
            <p>エラー: {slackError}</p>
            <h3>考えられる原因:</h3>
            <ul>
              <li>トークンが設定されていない</li>
              <li>トークンが無効または期限切れ</li>
              <li>トークンに必要な権限がない</li>
            </ul>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <h2>トークン設定方法</h2>
        <h3>1. GitHub トークンの取得</h3>
        <ol>
          <li>GitHub にログイン</li>
          <li>右上のプロフィールアイコン → Settings</li>
          <li>左側のサイドバーで Developer settings</li>
          <li>Personal access tokens → Tokens (classic)</li>
          <li>Generate new token → Generate new token (classic)</li>
          <li>
            トークンに名前を付け、以下のスコープを選択:
            <ul>
              <li>repo (すべてのリポジトリアクセス)</li>
              <li>read:org (組織の読み取りアクセス)</li>
              <li>user (ユーザー情報へのアクセス)</li>
            </ul>
          </li>
          <li>Generate token をクリック</li>
        </ol>

        <h3>2. Slack トークンの取得</h3>
        <ol>
          <li>
            <a
              href="https://api.slack.com/apps"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack API ウェブサイト
            </a>{' '}
            にアクセス
          </li>
          <li>Create New App をクリック</li>
          <li>From scratch を選択</li>
          <li>アプリ名とワークスペースを選択</li>
          <li>OAuth & Permissions を選択</li>
          <li>
            以下のスコープを追加:
            <ul>
              <li>channels:read</li>
              <li>channels:history</li>
              <li>chat:write</li>
              <li>users:read</li>
            </ul>
          </li>
          <li>Install to Workspace をクリック</li>
          <li>OAuth Access Token をコピー</li>
        </ol>

        <h3>3. トークンの設定</h3>
        <ol>
          <li>
            プロジェクトのルートディレクトリに <code>.env.local</code>{' '}
            ファイルを作成
          </li>
          <li>
            以下の内容を追加:
            <pre
              style={{
                backgroundColor: '#eee',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              REACT_APP_GITHUB_TOKEN=your_actual_github_token
              REACT_APP_SLACK_TOKEN=your_actual_slack_token
            </pre>
          </li>
          <li>アプリケーションを再起動</li>
        </ol>
      </div>
    </div>
  );
};

export default TokenCheck;
