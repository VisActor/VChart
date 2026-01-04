#!/usr/bin/env bash
set -euo pipefail

## 函数：模板选择
select_tpl() {
  local lang=${1:-zh}
  if [[ "$lang" == "zh" ]]; then echo .github/PULL_REQUEST_TEMPLATE/pr_cn.md; else echo .github/PULL_REQUEST_TEMPLATE.md; fi
}

tpl=$(select_tpl "${1:-zh}")
echo "[DRY-RUN] template=$tpl"
echo "[DRY-RUN] output=./.trae/output/pr.body.local.md"

