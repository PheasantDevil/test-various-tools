const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 変数マッピング
const colorMap = {
  '#0366d6': '$primary-color',
  '#0358c3': '$primary-hover-color',
  // 他の色...
};

// ファイルを検索
const files = glob.sync('src/{components,pages}/**/*.scss');

files.forEach(file => {
  // ファイルの内容を読み込む
  let content = fs.readFileSync(file, 'utf8');

  // インポート文を追加
  if (!content.includes('@import') || !content.includes('styles/index.scss')) {
    // srcからの相対パスを計算
    const depth = file.split('/').length - 1;
    let importPath = '';
    for (let i = 0; i < depth - 1; i++) {
      importPath += '../';
    }
    content = `@import '${importPath}styles/index.scss';\n\n${content}`;
  }

  // 色を置換
  Object.entries(colorMap).forEach(([color, variable]) => {
    content = content.replace(
      new RegExp(color.replace('#', '\\#'), 'g'),
      variable,
    );
  });

  // ファイルに書き戻す
  fs.writeFileSync(file, content);

  console.log(`Updated ${file}`);
});
