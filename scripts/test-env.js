const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// 環境変数を読み込む
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// 環境変数の確認
console.log('環境変数の確認:');

// GitHub Token
const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
if (githubToken) {
  // セキュリティのため、トークンの一部のみを表示
  const maskedToken = `${githubToken.substring(0, 4)}...${githubToken.substring(githubToken.length - 4)}`;
  console.log(`REACT_APP_GITHUB_TOKEN: ${maskedToken} (設定済み)`);
} else {
  console.log('REACT_APP_GITHUB_TOKEN: 未設定');
}

// Slack Token
const slackToken = process.env.REACT_APP_SLACK_TOKEN;
if (slackToken) {
  // セキュリティのため、トークンの一部のみを表示
  const maskedToken = `${slackToken.substring(0, 7)}...${slackToken.substring(slackToken.length - 4)}`;
  console.log(`REACT_APP_SLACK_TOKEN: ${maskedToken} (設定済み)`);
} else {
  console.log('REACT_APP_SLACK_TOKEN: 未設定');
}

// トークンの形式チェック
if (slackToken && !slackToken.startsWith('xoxb-')) {
  console.warn(
    '警告: Slack トークンは xoxb- で始まる Bot User OAuth Token を使用してください。',
  );
}

// 環境変数ファイルのパーミッションチェック
const envLocalPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  try {
    const stats = fs.statSync(envLocalPath);
    const fileMode = stats.mode & 0o777; // ファイルモードを取得

    // 0o600 (所有者のみ読み書き可能) かどうかチェック
    if (fileMode !== 0o600) {
      console.warn(
        `警告: .env.local のパーミッションが安全ではありません (${fileMode.toString(8)})`,
      );
      console.warn(
        '推奨: chmod 600 .env.local を実行して、所有者のみ読み書き可能に設定してください。',
      );
    } else {
      console.log('.env.local のパーミッションは適切に設定されています (600)');
    }
  } catch (err) {
    console.warn(
      `警告: .env.local のパーミッション確認中にエラーが発生しました: ${err.message}`,
    );
  }
}

// .gitignoreチェック
const gitignorePath = path.resolve(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignoreContent.includes('.env.local')) {
    console.warn(
      '警告: .gitignoreに.env.localが含まれていない可能性があります。',
    );
    console.warn(
      '環境変数ファイルがGitリポジトリにコミットされないように.gitignoreを確認してください。',
    );
  }
}

console.log('\n環境変数の確認が完了しました。');
console.log('\nセキュリティに関する注意事項:');
console.log(
  '- 環境変数ファイルには機密情報が含まれるため、Gitリポジトリにコミットしないでください。',
);
console.log('- トークンが漏洩した場合は、すぐに再生成してください。');
console.log(
  '- 本番環境では、CI/CDパイプラインやシークレット管理サービスを使用することをお勧めします。',
);
