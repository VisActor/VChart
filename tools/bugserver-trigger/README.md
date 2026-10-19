# Bug Server CI

`scripts/trigger-test.ts` 上传 `dist/index.js`，等待 SCM 构建，运行并等待图片测试，然后触发性能测试。调用接口需要仓库 secret `BUG_SERVER_TOKEN`。

## 自动执行规则

目标分支为 `main`、`develop`、`dev/**` 的 PR，按来源仓库分流，每个 PR 事件只实际构建一次：

| 事件           | Bug Server CI      | Bug Server PR Bundle                   |
| -------------- | ------------------ | -------------------------------------- |
| 仓库内 PR      | 构建并提交测试     | 跳过构建                               |
| 外部 fork PR   | 跳过自动构建与测试 | 构建并保存产物，等待维护者手动提交测试 |
| push 到 `main` | 构建并提交测试     | 不触发                                 |

来源判断使用 PR head 仓库的完整名称与当前仓库名称比较。GitHub 的 `pull_request` 触发器不能按来源仓库过滤，因此在 job 级设置互斥条件；两个 workflow 仍可能出现运行记录，但另一构建 job 显示 `skipped`，不会启动 runner。

仓库内 PR 如需重新验证，重跑 **Bug Server CI**。下面的手动入口用于外部 fork PR，依赖 **Bug Server PR Bundle** 产物；仓库内 PR 不再生成该产物。

## 手动验证外部 PR

两个 workflow 合入仓库默认分支 `develop` 后，先等待该 PR head 的 **Bug Server PR Bundle** 构建成功。外部 fork 的运行可能需要维护者先批准。随后拥有仓库写权限的维护者可打开 **Actions → Bug Server CI → Run workflow**，选择 **develop** 并填写：

- `pr_number`：提交到 VChart 仓库的外部 fork PR 编号。
- `head_sha`：已审查的 PR head 的完整 40 位 SHA。

也可使用 GitHub CLI（替换下面的 PR 编号和 SHA）：

```sh
gh workflow run bug-server.yml \
  --repo VisActor/VChart \
  --ref develop \
  -f pr_number=1234 \
  -f head_sha='<已审查的完整 40 位 head SHA>'
```

可通过 `gh pr view 1234 --repo VisActor/VChart --json headRefOid --jq .headRefOid` 查看当前 head SHA。先审查该提交，再将 SHA 填入输入；如果 PR 更新，旧 SHA 会在校验阶段被拒绝。

被测代码是固定的 **PR head commit**。GitHub 自动生成的 merge commit 不参与此次构建，校验后的新推送也不会改变此次被测代码。构建失败时检查该 head 的安装和构建日志；手动流程不会修改 PR 代码或自动修补构建错误。

手动入口使用已经生成的 PR 产物，不再执行 PR 构建。产物保留 7 天；若构建或产物缺失、失败、过期，请先批准、等待或重跑 **Bug Server PR Bundle**。工作流引入前已打开的 PR，需要更新或重新打开 PR 以触发新的 PR 事件；重跑旧 workflow 定义不会生成新增的 bundle 工作流。

## 查看结果

- 在 Actions 中查看本次运行，summary 会记录 PR 链接、被测 SHA 和来源构建链接。
- **Trigger Bug Server for reviewed PR** 日志提供 `scmVersion`、`bundleId`、图片用例总数和成功数，可用于在 Bug Server 定位结果。
- token 未配置、SCM 构建失败、图片测试超时或失败都会导致 job 失败。性能测试沿用现有脚本行为：触发后不等待结果。
- 手动运行不会自动给外部 PR 添加 check 或评论。

## 执行边界

1. **Bug Server PR Bundle** 仅在来自外部 fork 的 `pull_request` 中执行构建，在 macOS runner 上检出准确 head SHA，使用 Node.js 18 依次构建 vutils-extension、vchart、vchart-extension 和 bugserver-trigger。不持有 Bug Server token、不保留 checkout 凭据，缓存写入仅属于 PR 作用域；产物名为 `bug-server-pr-<编号>-<SHA>`。
2. 手动校验 job 从默认分支 workflow 的固定提交加载脚本，通过 GitHub API 确认当前 PR head，并校验来源 workflow ID/路径、PR 事件、成功状态、base/head 仓库 ID、源分支和 run SHA。选择最新匹配运行中唯一且未过期的命名产物，再复核产物的运行 ID、仓库 ID 和 SHA。fork 的运行记录可能没有 PR 列表，此时由仓库、分支、SHA 绑定来源；如列表存在，则还必须包含目标 PR。
3. 提交 job 使用 workflow 固定提交中的可信脚本，按 artifact ID 下载 ZIP，只接受单一普通 `index.js` 文件，最大 64 MiB。读取器只把字节写入固定路径，不按 ZIP 路径解压。客户端依赖以 `--ignore-scripts` 独立安装；bundle 只作为文件上传，此 runner 不执行 PR bundle 或其 package scripts。

两个 workflow 默认 `contents: read`；手动查询和下载 job 另需 `actions: read`，目标校验还需 `pull-requests: read`。token 仅注入最后调用 Bug Server API 的 step。默认分支手动流程不检出或构建 PR 代码；仅省略缓存步骤无法消除默认分支缓存写权限，因此采用 PR 事件隔离构建。

`main` push 和仓库内 PR 保留自动构建与测试。外部 fork PR 的自动运行只构建产物，不调用需要仓库 secret 的 Bug Server API，使用上述手动入口完成验证。

## 本地检查

在仓库根目录执行：

```sh
node --test .github/scripts/bug-server-dispatch.test.cjs
python3 -B -m unittest discover -s .github/scripts -p 'test_extract_bug_server_bundle.py'
actionlint .github/workflows/bug-server.yml .github/workflows/bug-server-pr-bundle.yml
```
