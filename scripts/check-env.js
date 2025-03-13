const fs = require('fs');
const path = require('path');

// プロジェクトのルートディレクトリ
const rootDir = path.resolve(__dirname, '..');

// 必要な環境変数のリスト
const requiredEnvVars = ['REACT_APP_GITHUB_TOKEN', 'REACT_APP_SLACK_TOKEN', 'REACT_APP_SLACK_WEBHOOK_URL'];

// 環境ファイルのリスト
const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];

// 環境ファイルの存在確認と作成
function checkAndCreateEnvFiles() {
  console.log('環境ファイルの確認を開始します...');

  // .env.exampleファイルの存在確認
  const examplePath = path.join(rootDir, '.env.example');
  if (!fs.existsSync(examplePath)) {
    console.error(
      '.env.example ファイルが見つかりません。リポジトリを確認してください。',
    );
    process.exit(1);
  }

  // .env.exampleからテンプレートを読み込む
  const envTemplate = fs.readFileSync(examplePath, 'utf8');

  // 各環境ファイルの確認
  envFiles.forEach(envFile => {
    const filePath = path.join(rootDir, envFile);

    if (!fs.existsSync(filePath)) {
      console.log(
        `${envFile} が見つかりません。.env.exampleをコピーして作成します...`,
      );
      fs.writeFileSync(filePath, envTemplate);
      console.log(
        `${envFile} を作成しました。必要な環境変数を設定してください。`,
      );

      // ファイルのパーミッションを600に設定 (所有者のみ読み書き可能)
      try {
        fs.chmodSync(filePath, 0o600);
        console.log(
          `${envFile} のパーミッションを設定しました (所有者のみ読み書き可能)`,
        );
      } catch (err) {
        console.warn(
          `警告: ${envFile} のパーミッション設定に失敗しました: ${err.message}`,
        );
      }
    } else {
      console.log(`${envFile} は既に存在します。`);

      // 既存のファイルから環境変数を読み込む
      const envContent = fs.readFileSync(filePath, 'utf8');
      const missingVars = [];

      // 必要な環境変数が設定されているか確認
      requiredEnvVars.forEach(envVar => {
        const regex = new RegExp(`${envVar}=.+`);
        if (!regex.test(envContent)) {
          missingVars.push(envVar);
        }
      });

      // 不足している環境変数がある場合は警告
      if (missingVars.length > 0) {
        console.warn(`警告: ${envFile} に以下の環境変数が設定されていません:`);
        missingVars.forEach(v => console.warn(`- ${v}`));
        console.warn('アプリケーションが正常に動作しない可能性があります。');
      }
    }
  });

  // .gitignoreに.env*が含まれているか確認
  const gitignorePath = path.join(rootDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (
      !gitignoreContent.includes('.env.local') &&
      !gitignoreContent.includes('.env*.local')
    ) {
      console.warn(
        '警告: .gitignoreに.env.localが含まれていない可能性があります。',
      );
      console.warn(
        '環境変数ファイルがGitリポジトリにコミットされないように.gitignoreを確認してください。',
      );
    }
  }

  console.log('環境ファイルの確認が完了しました。');
  console.log(
    '注意: 環境変数ファイルには機密情報が含まれるため、Gitリポジトリにコミットしないでください。',
  );
}

// スクリプト実行
checkAndCreateEnvFiles();
