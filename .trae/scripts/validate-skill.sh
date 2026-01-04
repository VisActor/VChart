#!/usr/bin/env bash
set -euo pipefail

skill="${1:-}"
if [[ -z "$skill" ]]; then
  echo "usage: validate-skill <skill-id> [args]"; exit 1
fi
shift || true

case "$skill" in
  git.commit-push-smart)
    exec ./.trae/scripts/dry-run-commit-smart.sh "$@"
    ;;
  github.create-pr-from-file)
    exec ./.trae/scripts/dry-run-create-pr.sh "$@"
    ;;
  vcs.diff-collect)
    exec ./.trae/scripts/dry-run-diff-collect.sh "$@"
    ;;
  test.autogen-from-diff)
    exec ./.trae/scripts/dry-run-autotest.sh "$@"
    ;;
  release.changelog-rush-smart)
    exec ./.trae/scripts/dry-run-changelog.sh "$@"
    ;;
  git.create-branch)
    exec ./.trae/scripts/dry-run-create-branch.sh "$@"
    ;;
  github.pr-body-generate)
    exec ./.trae/scripts/dry-run-pr-body.sh "$@"
    ;;
  pipeline.release-prep)
    exec ./.trae/scripts/dry-run-release-prep.sh "$@"
    ;;
  *)
    echo "unknown skill: $skill"; exit 1
    ;;
esac

