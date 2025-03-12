# Git ワークフロー

このドキュメントでは、プロジェクトで使用する Git ワークフローについて説明します。

## ブランチ戦略

このプロジェクトでは、以下のブランチ戦略を採用しています：

- `main`: 本番環境用のブランチ。常に安定した状態を維持します。
- `develop`: 開発用のブランチ。次のリリースに向けた機能が統合されます。
- 機能ブランチ: 新機能の開発用。`develop`から分岐し、完了後に`develop`にマージします。
- バグ修正ブランチ: バグ修正用。`develop`から分岐し、完了後に`develop`にマージします。
- リリースブランチ: リリース準備用。`develop`から分岐し、完了後に`main`と`develop`にマージします。

## ブランチ命名規則

ブランチ名は、作業の種類と内容を明確に示すために、以下の形式に従ってください：

```
<type>/<issue-number>-<short-description>
```

### タイプ

- `feature`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントの変更のみ
- `style`: コードの意味に影響を与えない変更（空白、フォーマット、セミコロンの欠落など）
- `refactor`: バグ修正や機能追加ではないコードの変更
- `test`: テストの追加または修正
- `chore`: ビルドプロセスやツールの変更

### 例

- `feature/123-add-slack-integration`
- `fix/456-fix-github-api-error`
- `docs/789-update-readme`
- `refactor/101-improve-performance`
- `test/202-add-unit-tests`

## コミットメッセージの形式

コミットメッセージは、変更内容を明確に伝えるために、以下の形式に従ってください：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### タイプ

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: フォーマットの変更（コードの動作に影響しない変更）
- `refactor`: リファクタリング（バグ修正や機能追加ではないコードの変更）
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

### スコープ

変更が影響する範囲（コンポーネント、ファイル名など）を指定します。省略可能です。

### 件名

変更内容を簡潔に説明します。命令形で記述し、最初の文字は小文字にし、末尾にピリオドを付けないでください。

### 本文

変更の詳細な説明を記述します。「なぜ」その変更が必要だったのかを説明してください。

### フッター

関連する Issue や PR への参照を記述します。例：`Closes #123`、`Related to #456`

### 例

```
feat(auth): implement GitHub OAuth login

Add GitHub OAuth authentication to allow users to log in with their GitHub accounts.
This includes:
- OAuth flow implementation
- User profile fetching
- Token storage and refresh logic

Closes #123
```

```
fix(api): handle rate limit errors

Add proper error handling for GitHub API rate limit errors.
Now the application shows a user-friendly message and retries after the rate limit reset.

Fixes #456
```

## プルリクエストのプロセス

1. 適切な命名規則に従ってブランチを作成します。
2. 変更を実装し、上記のコミットメッセージの形式に従ってコミットします。
3. テストが通ることを確認します。
4. プルリクエストを作成し、レビュアーを割り当てます。
5. レビューのフィードバックに基づいて変更を行います。
6. すべての承認が得られたら、プルリクエストをマージします。 