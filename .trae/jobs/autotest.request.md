# Task
Autotest (diff-with-develop)

# Parameters
sinceBranch: develop
project: ''
mode: full
noSnapshot: false
onlyNew: false
reportFormat: md

# ExecutionHints
- skipWrite: false
- stopOnError: true

# StepsOverride
# 如需覆盖默认步骤，取消下面行的注释并按需修改
# - git fetch --all --prune
# - git diff --name-status --diff-filter=AMR develop...HEAD
# - rush run -s test
# - rush run -s test-cov
