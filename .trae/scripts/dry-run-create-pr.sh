#!/usr/bin/env bash
set -euo pipefail

## 函数：检查 gh 或 REST 可用性
check_channels() {
  local has_gh=0
  command -v gh >/dev/null 2>&1 && has_gh=1
  local has_token=0
  [[ -n "${GITHUB_TOKEN:-}" ]] && has_token=1
  echo "$has_gh:$has_token"
}

## 函数：读取正文文件
read_body() {
  local file=${1:-./.trae/output/pr.body.local.md}
  [[ -f "$file" ]] || { echo "[ERROR] 正文文件不存在: $file"; exit 1; }
  wc -c "$file" | awk '{print $1}'
}

chan=$(check_channels)
size=$(read_body "${1:-./.trae/output/pr.body.local.md}")
echo "[DRY-RUN] channels gh/token = $chan"
echo "[DRY-RUN] body size = $size bytes"

