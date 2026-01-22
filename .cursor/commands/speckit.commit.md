---
description: "Create an intelligent commit (Conventional Commits) bundling workspace changes; optionally push to origin."
handoffs:
  - label: "Generate PR Body"
    agent: "speckit.prgenerate"
    prompt: "Generate a PR body from templates and artifacts"
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Outline

1.  **Pre-flight Checks**:
    *   Verify the current branch and check if the working tree is dirty.
    *   If `commitAllowEmpty=false` (default) and there are no changes, the process will be skipped.

2.  **Generate Commit Message**:
    *   **Priority 1**: Use the `message` argument if provided.
    *   **Priority 2**: If no message is provided, extract the subject from the latest entry in `common/changes/`.
    *   **Priority 3**: If neither is available, generate a generic subject like `chore: sync changes (N files)`.
    *   The commit type and scope are inferred from file paths and changelog entries.

3.  **Execute Git Actions**:
    *   The agent will run `git add --all` to stage all changes.
    *   It will then execute `git commit` with the generated message.
    *   If `pushAfterCommit=true` (default), it will push the commit to the remote origin.

4.  **Report Outputs**:
    *   `commit_message`: The full commit message used.
    *   `pushed_branch`: The name of the branch that was pushed (if applicable).
