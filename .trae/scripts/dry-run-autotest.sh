#!/usr/bin/env bash
set -euo pipefail

## 函数：检查 rush/jest 可用性
check_tools() {
  local has_rush=0; command -v rush >/dev/null 2>&1 && has_rush=1
  local has_jest=0; command -v jest >/dev/null 2>&1 && has_jest=1
  echo "$has_rush:$has_jest"
}

tools=$(check_tools)
echo "[DRY-RUN] rush/jest = $tools"
echo "[DRY-RUN] report path = ./.trae/output/autotest.report.local.md"

