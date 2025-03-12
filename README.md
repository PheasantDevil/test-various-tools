# GitHub & Slack Integration App

このアプリケーションは、GitHubとSlackの統合を提供し、プルリクエストやイシューの管理を効率化します。

## 機能

- GitHubのプルリクエストとイシューの表示と管理
- Slackチャンネルとの連携
- レビュー依頼の自動化

## 開発環境のセットアップ

### 前提条件

- Node.js (v16以上)
- Yarn

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/github-slack-integration.git
cd github-slack-integration

# 依存関係のインストール
yarn install
```

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定します：

```
REACT_APP_GITHUB_API_TOKEN=your_github_token
REACT_APP_SLACK_API_TOKEN=your_slack_token
```

## 開発

```bash
# 開発サーバーの起動
yarn start

# ビルド
yarn build
```

## テスト

```bash
# テストの実行
yarn test

# カバレッジレポートの生成
yarn test:coverage
```

### テスト構造

テストは以下のディレクトリ構造に従って配置されています：

- `src/__tests__/`: 共通のテストユーティリティ
- `src/components/**/__tests__/`: コンポーネントのテスト
- `src/services/**/__tests__/`: サービスのテスト
- `src/utils/__tests__/`: ユーティリティ関数のテスト

## リンティングとフォーマット

```bash
# リンティングの実行
yarn lint

# リンティングの修正
yarn lint:fix

# コードフォーマットの実行
yarn format

# フォーマットチェック
yarn format:check
```

## CI/CD

このプロジェクトはGitHub Actionsを使用して継続的インテグレーションを実装しています：

- プッシュやプルリクエスト時に自動的にテストが実行されます
- リンティングとフォーマットチェックが行われます
- テストカバレッジレポートが生成されます

## ライセンス

MIT
