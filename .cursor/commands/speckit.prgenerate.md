---
description: 'Generate a well-formed PR body using repo template and local artifacts (changelog, auto-test report). Save to .trae/output/pr.body.local.md by default.'
handoffs:
  - label: 'Create Pull Request'
    agent: 'speckit.prcreate'
    prompt: 'Create the GitHub Pull Request using the generated body'
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1.  **Determine Template and Context**:
    - **Select Template**:
      - Check user input for language preference (English or Chinese).
      - If Chinese, use template at: `.github/PULL_REQUEST_TEMPLATE/pr_cn.md`
      - If English or unspecified, use template at: `.github/PULL_REQUEST_TEMPLATE.md`
    - **Infer Context**:
      - Get current branch name using `git branch --show-current`.
      - Get recent commit messages using `git log -5 --pretty=format:"%s"`.
      - Infer PR type (feat, fix, docs, etc.) to verify the checklist items.

2.  **Populate Body Sections**:
    - **Changelog**:
      - Check `common/changes` directory for change files.
      - If files exist, parse them to summarize changes for the `Changelog` section.
      - If no files, mark as "N/A" or leave empty.
    - **Self-test Summary**:
      - Read report from `.trae/output/autotest.report.local.md`.
      - If file exists, append summary to the body.
      - If missing, add a placeholder indicating no automated test report.
    - **Background/Solution**:
      - Synthesize a description from commit messages and user input.
      - Fill in the "Background and solution" section of the template.

3.  **Generate and Save**:
    - **Generate Title**: Create a concise PR title following Conventional Commits (e.g., `feat: add new chart type`).
    - **Preview**: Display the generated title and body content to the user for review.
    - **Save**: Write the final content to `.trae/output/pr.body.local.md`.
    - **Verify**: Check if the file `.trae/output/pr.body.local.md` was created successfully.

4.  **Validation Checklist**:
    - Confirm the output file exists.
    - Ask user to review the generated body in `.trae/output/pr.body.local.md`.
