---
description: 'Generate Rush changes entries for VChart monorepo based on commits since base branch; infer bump type; aggregate messages.'
handoffs:
  - label: 'Commit Changes'
    agent: 'speckit.commit'
    prompt: 'Create a clean Conventional Commits commit and push if desired'
    send: true
---

## User Input

```text
$ARGUMENTS
```

## Outline

1.  **Read Inputs**:
    - `sinceBranch` (default: `develop`): The base branch for collecting commits.
    - `bumpType` (default: `auto`): Explicit bump type (`patch`, `minor`, `major`). If `auto`, infer from commit messages.
    - `message` (optional): A custom message to use for the changelog entry.

2.  **Gather Context**:
    - Collect commits and file changes between `sinceBranch` and `HEAD`.
    - If `bumpType` is `auto`, analyze commit messages (`feat`, `fix`, `BREAKING CHANGE`) to determine the appropriate version bump.

3.  **Execute Rush Change**:
    - The agent will run `rush change`, providing the determined bump type and an aggregated message.
    - The message is constructed from the `message` input or summarized from commit history (and enriched with issue titles if `githubToken` is present).
    - This action generates changelog files under `common/changes/`.

4.  **Report Outputs**:
    - List the paths of the generated changelog files.
    - Confirm the final message used.
    - Verify that the generated message complies with Conventional Commits (`commitlint`) standards.
