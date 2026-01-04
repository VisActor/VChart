#!/usr/bin/env bash
set -euo pipefail

## 函数：生成分支名
gen_branch() {
  local prefix=${1:-chore/trae}
  local topic=${2:?topic 必填}
  local ts; ts=$(date +%Y%m%d-%H%M)
  echo "$prefix-$topic-$ts"
}

bn=$(gen_branch "${1:-chore/trae}" "${2:-}")
echo "[DRY-RUN] branch_name=$bn"

