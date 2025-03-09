#!/bin/bash
# replace-with-variables.sh

# 色の置換
find src/components src/pages -name "*.scss" | xargs sed -i '' \
  -e 's/#0366d6/\$primary-color/g' \
  -e 's/#0358c3/\$primary-hover-color/g' \
  -e 's/#2ea44f/\$success-color/g' \
  -e 's/#2c974b/\$success-hover-color/g' \
  -e 's/#c62828/\$danger-color/g' \
  -e 's/#b71c1c/\$danger-hover-color/g' \
  -e 's/#24292e/\$text-color/g' \
  -e 's/#586069/\$secondary-text-color/g' \
  -e 's/#e1e4e8/\$border-color/g' \
  -e 's/#f6f8fa/\$background-color/g' \
  -e 's/#fff/\$white/g'

# スペーシングの置換
find src/components src/pages -name "*.scss" | xargs sed -i '' \
  -e 's/4px/\$spacing-xs/g' \
  -e 's/8px/\$spacing-sm/g' \
  -e 's/16px/\$spacing-md/g' \
  -e 's/24px/\$spacing-lg/g' \
  -e 's/32px/\$spacing-xl/g'

# ボーダーラディウスの置換
find src/components src/pages -name "*.scss" | xargs sed -i '' \
  -e 's/border-radius: 4px/border-radius: \$border-radius-sm/g' \
  -e 's/border-radius: 6px/border-radius: \$border-radius-md/g' \
  -e 's/border-radius: 8px/border-radius: \$border-radius-lg/g'

# シャドウの置換
find src/components src/pages -name "*.scss" | xargs sed -i '' \
  -e 's/0 1px 3px rgba(0, 0, 0, 0.1)/\$shadow-sm/g' \
  -e 's/0 4px 6px rgba(0, 0, 0, 0.1)/\$shadow-md/g' \
  -e 's/0 10px 15px rgba(0, 0, 0, 0.1)/\$shadow-lg/g'

# トランジションの置換
find src/components src/pages -name "*.scss" | xargs sed -i '' \
  -e 's/0.2s ease/\$transition-fast/g' \
  -e 's/0.3s ease/\$transition-normal/g' \
  -e 's/0.5s ease/\$transition-slow/g'

# フォントサイズの置換
find src/components src/pages -name "*.scss" | xargs sed -i '' \
  -e 's/font-size: 14px/font-size: \$font-size-small/g' \
  -e 's/font-size: 16px/font-size: \$font-size-normal/g' \
  -e 's/font-size: 18px/font-size: \$font-size-large/g' \
  -e 's/font-size: 24px/font-size: \$font-size-xlarge/g'

echo "Replaced hardcoded values with variables"
