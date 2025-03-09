#!/bin/bash
# add-scss-imports.sh

# 対象ディレクトリ内の全SCSSファイルを検索
find src/components src/pages -name "*.scss" | while read -r file; do
  # ファイルの先頭に既にインポート文があるか確認
  if ! grep -q "@import " "$file" | grep -q "styles/index.scss"; then
    # ファイルからsrcディレクトリへの相対パスを計算
    rel_path=$(echo "$file" | sed -E 's|^src/([^/]+)/(.*)|\1/\2|' | sed -E 's|[^/]+/|../|g')
    
    # ファイルの先頭にインポート文を追加
    temp_file=$(mktemp)
    echo "@import '${rel_path}../styles/index.scss';" > "$temp_file"
    echo "" >> "$temp_file"
    cat "$file" >> "$temp_file"
    mv "$temp_file" "$file"
    
    echo "Added import to $file"
  else
    echo "Import already exists in $file"
  fi
done
