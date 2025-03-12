# 環境変数の設定方法

このプロジェクトでは、以下の環境変数を設定する必要があります。

## 必要な環境変数

### GitHub API設定

- `REACT_APP_GITHUB_TOKEN`: GitHub APIにアクセスするためのPersonal Access Token

### Slack API設定

- `REACT_APP_SLACK_TOKEN`: Slack APIにアクセスするためのBot User OAuth Token

## 環境ファイルの種類

プロジェクトでは以下の環境ファイルを使用します：

1. `.env.example`: 必要な環境変数の例（実際の値は含まない、Gitリポジトリにコミット可能）
2. `.env.local`: ローカル環境固有の環境変数（**Gitにコミットしない**）
3. `.env.development.local`: 開発環境用の環境変数（**Gitにコミットしない**）
4. `.env.production.local`: 本番環境用の環境変数（**Gitにコミットしない**）

## セキュリティに関する重要な注意事項

- **環境変数ファイルは機密情報を含むため、Gitリポジトリにコミットしないでください**
- `.env.local`, `.env.development.local`, `.env.production.local` などの実際の値を含むファイルは `.gitignore` に追加してください
- トークンが漏洩した場合は、すぐに再生成してください
- 本番環境では、CI/CDパイプラインやシークレット管理サービスを使用して環境変数を設定することをお勧めします

## 環境変数の設定手順

### GitHub Tokenの取得

1. GitHubにログイン
2. 右上のプロフィールアイコン → Settings
3. 左側のサイドバーで Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token → Generate new token (classic)
6. トークンに名前を付け、以下のスコープを選択:
   - repo (すべてのリポジトリアクセス)
   - read:org (組織の読み取りアクセス)
   - user (ユーザー情報へのアクセス)
7. Generate token をクリック
8. **重要**: 表示されたトークンを安全な場所にコピーしてください。このページを離れると二度とトークンを表示できません。

### Slack Tokenの取得

1. [Slack API ウェブサイト](https://api.slack.com/apps)にアクセス
2. Create New App をクリック
3. From scratch を選択
4. アプリ名とワークスペースを選択
5. OAuth & Permissions を選択
6. 以下のスコープを追加:
   - channels:read
   - channels:history
   - chat:write
   - users:read
   - auth:test
7. Install to Workspace をクリック
8. Bot User OAuth Token (xoxb-で始まるもの) をコピー

### 環境ファイルの作成

`.env.local`ファイルをプロジェクトのルートディレクトリに作成し、以下の内容を追加します：

```
REACT_APP_GITHUB_TOKEN=your_github_token_here
REACT_APP_SLACK_TOKEN=xoxb-your_slack_token_here
```

## 自動環境ファイル作成機能

このプロジェクトでは、`yarn start`または`yarn build`コマンドを実行する際に、必要な環境ファイルが存在しない場合は自動的に作成されます。ただし、作成されたファイルには実際のトークン値は含まれていないため、手動で設定する必要があります。

## 安全な環境変数管理のベストプラクティス

1. **ファイルのアクセス権限を制限する**: 環境変数ファイルのパーミッションを所有者のみ読み書き可能に設定します（chmod 600）
2. **バージョン管理から除外する**: `.gitignore`に`.env.local`などのファイルを追加します
3. **定期的にトークンをローテーションする**: セキュリティのため、定期的にトークンを再生成します
4. **最小権限の原則を適用する**: トークンには必要最小限のスコープ（権限）のみを付与します
5. **本番環境ではシークレット管理サービスを使用する**: AWS Secrets Manager、Google Secret Manager、HashiCorp Vaultなどのサービスを検討します
