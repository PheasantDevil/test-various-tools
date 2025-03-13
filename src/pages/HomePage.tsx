import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/atoms/ErrorMessage';
import LoadingSpinner from '../components/atoms/LoadingSpinner';
import { getLatestCommits } from '../services/github/commitService';
import './HomePage.scss';

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

const HomePage: React.FC = () => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommits = async () => {
      setLoading(true);
      try {
        const latestCommits = await getLatestCommits();
        setCommits(latestCommits);
      } catch (err) {
        setError('更新履歴の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>GitHub-Slack 連携ツール</h1>
        <p className="description">
          GitHubリポジトリのイベントを効率的にSlackチャンネルで管理・通知するためのツールです。
          リポジトリごとの通知設定やログチャンネルの作成が簡単に行えます。
        </p>
      </section>

      <div className="content-grid">
        <section className="features-section">
          <h2>主な機能</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3>ログチャンネル作成</h3>
              <p>GitHubリポジトリに対応するSlackチャンネルを自動作成します。</p>
              <Link to="/slack" className="feature-link">
                チャンネル管理へ
              </Link>
            </div>
            <div className="feature-card">
              <h3>通知設定</h3>
              <p>
                Issue、PR、レビューなどのイベントごとに通知設定を管理できます。
              </p>
              <Link to="/slack" className="feature-link">
                通知設定へ
              </Link>
            </div>
            <div className="feature-card">
              <h3>メッセージ履歴</h3>
              <p>チャンネルごとのメッセージ履歴を確認できます。</p>
              <Link to="/slack" className="feature-link">
                履歴確認へ
              </Link>
            </div>
          </div>
        </section>

        <section className="updates-section">
          <h2>最近の更新</h2>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="commit-list">
              {commits.map(commit => (
                <div key={commit.sha} className="commit-item">
                  <div className="commit-header">
                    <span className="commit-author">{commit.author}</span>
                    <span className="commit-date">
                      {new Date(commit.date).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="commit-message">{commit.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="quick-actions">
        <h2>クイックアクション</h2>
        <div className="action-buttons">
          <Link to="/slack" className="action-button">
            チャンネル作成
          </Link>
          <Link to="/slack" className="action-button">
            通知設定
          </Link>
          <Link to="/github" className="action-button">
            GitHub連携設定
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
