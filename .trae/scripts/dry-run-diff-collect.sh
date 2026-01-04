#!/usr/bin/env bash
set -euo pipefail

## 函数：采集差异摘要
collect_diff() {
  local base=${1:-develop}
  git fetch --all --prune >/dev/null 2>&1 || true
  git diff --name-status --diff-filter=AMR "$base"...HEAD | head -n 20
}

collect_diff "${1:-develop}"

