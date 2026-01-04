#!/usr/bin/env bash
set -euo pipefail

## 函数：判定 bump 类型
compute_bump() {
  local base=${1:-develop}
  local subjects
  subjects=$(git log --pretty=%s "$base"...HEAD | tr 'A-Z' 'a-z')
  if echo "$subjects" | grep -E 'breaking change|!'; then echo major; return; fi
  if echo "$subjects" | grep -E '^feat'; then echo minor; return; fi
  echo patch
}

bt=$(compute_bump "${1:-develop}")
echo "[DRY-RUN] computed_bump_type=$bt"

