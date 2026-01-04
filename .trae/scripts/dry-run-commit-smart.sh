#!/usr/bin/env bash
set -euo pipefail

## 函数：检查 git 与工作树状态
check_git() {
  git --version >/dev/null 2>&1 || { echo "[ERROR] git 未安装"; exit 1; }
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "[ERROR] 非 git 仓库"; exit 1; }
}

## 函数：推导分支名
resolve_head() {
  git rev-parse --abbrev-ref HEAD
}

## 函数：模拟提交信息生成
derive_message() {
  local strategy=${1:-auto}
  local message=${2:-}
  if [[ "$strategy" == "manual" && -n "$message" ]]; then
    echo "$message"
  else
    local count
    count=$(git status --porcelain | wc -l | tr -d ' ')
    echo "chore: sync changes before PR (${count} files)"
  fi
}

check_git
HEAD_BRANCH=$(resolve_head)
COMMIT_MSG=$(derive_message "${1:-auto}" "${2:-}")
echo "[DRY-RUN] head=$HEAD_BRANCH"
echo "[DRY-RUN] commit_message=$COMMIT_MSG"
echo "[DRY-RUN] pushAfterCommit=${3:-true}"

