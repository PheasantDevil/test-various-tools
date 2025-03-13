const fs = require('fs');
const path = require('path');
const glob = require('glob');

// SCSSファイルを検索
const files = glob.sync('src/**/*.scss');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // @importを@useに変換
  content = content.replace(/@import ['"](.+)['"];/g, "@use '$1' as *;");

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
