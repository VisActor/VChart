async function resolveBugServerTarget({ github, context, prNumber, headSha }) {
  const defaultBranch = context.payload.repository.default_branch;
  if (context.ref !== `refs/heads/${defaultBranch}`) {
    throw new Error(`Run this workflow from the default branch (${defaultBranch}).`);
  }
  if (!/^[1-9][0-9]*$/.test(prNumber) || !Number.isSafeInteger(Number(prNumber))) {
    throw new Error('PR number must be a positive integer.');
  }
  if (headSha.length !== 40 || !/^[0-9a-f]+$/i.test(headSha)) {
    throw new Error('Head SHA must be a full 40-character hexadecimal commit SHA.');
  }

  const { data: pull } = await github.rest.pulls.get({
    ...context.repo,
    pull_number: Number(prNumber)
  });
  const repository = `${context.repo.owner}/${context.repo.repo}`;
  if (pull.base.repo.full_name !== repository) {
    throw new Error(`PR base repository must be ${repository}.`);
  }
  const sha = headSha.toLowerCase();
  if (pull.head.sha !== sha) {
    throw new Error(
      `PR #${prNumber} head changed: expected ${sha}, current ${pull.head.sha}. Review the current head before retrying.`
    );
  }

  if (!pull.head.repo) {
    throw new Error('The PR head repository no longer exists.');
  }
  const workflowPath = '.github/workflows/bug-server-pr-bundle.yml';
  const { data: workflow } = await github.rest.actions.getWorkflow({
    ...context.repo,
    workflow_id: 'bug-server-pr-bundle.yml'
  });
  const runs = await github.paginate(github.rest.actions.listWorkflowRuns, {
    ...context.repo,
    workflow_id: workflow.id,
    event: 'pull_request',
    head_sha: sha,
    status: 'success',
    per_page: 100
  });
  const run = runs
    .filter(
      candidate =>
        candidate.workflow_id === workflow.id &&
        candidate.path === workflowPath &&
        candidate.event === 'pull_request' &&
        candidate.status === 'completed' &&
        candidate.conclusion === 'success' &&
        candidate.head_sha === sha &&
        candidate.head_branch === pull.head.ref &&
        candidate.repository?.id === pull.base.repo.id &&
        candidate.head_repository?.id === pull.head.repo.id &&
        // GitHub omits PR associations for fork runs. Repository, branch and SHA still bind the source.
        (!candidate.pull_requests?.length || candidate.pull_requests.some(pr => pr.number === Number(prNumber)))
    )
    .sort((a, b) => b.id - a.id)[0];
  if (!run) {
    throw new Error(
      `No successful PR bundle build for PR #${prNumber} at ${sha}. Wait for or re-run Bug Server PR Bundle.`
    );
  }
  const artifacts = await github.paginate(github.rest.actions.listWorkflowRunArtifacts, {
    ...context.repo,
    run_id: run.id,
    per_page: 100
  });
  const matches = artifacts.filter(artifact => artifact.name === `bug-server-pr-${prNumber}-${sha}`);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one PR bundle artifact in run ${run.id}. Re-run Bug Server PR Bundle.`);
  }
  const artifact = matches[0];
  if (artifact.expired) {
    throw new Error('The PR bundle artifact has expired. Re-run Bug Server PR Bundle.');
  }
  if (
    artifact.workflow_run?.id !== run.id ||
    artifact.workflow_run.head_sha !== sha ||
    artifact.workflow_run.repository_id !== pull.base.repo.id ||
    artifact.workflow_run.head_repository_id !== pull.head.repo.id
  ) {
    throw new Error('Artifact provenance does not match the reviewed PR build.');
  }

  return {
    prNumber: Number(prNumber),
    sha,
    headRef: pull.head.ref,
    prUrl: pull.html_url,
    runId: run.id,
    runUrl: run.html_url,
    artifactId: artifact.id
  };
}

module.exports = { resolveBugServerTarget };
