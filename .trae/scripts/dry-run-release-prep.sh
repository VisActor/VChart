#!/usr/bin/env bash
set -euo pipefail

## 函数：展示串行步骤
show_steps() {
  echo "1) Autotest → 2) Changelog → 3) Commit → 4) PR Body → 5) PR Create"
}

show_steps

