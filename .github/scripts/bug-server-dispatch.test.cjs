const assert = require('node:assert/strict');
const { test } = require('node:test');
const { resolveBugServerTarget } = require('./bug-server-dispatch.cjs');

const sha = '40be3619d1608aa1d5827f0a465704eeb036a7d3';

function fixture(overrides = {}) {
  const calls = [];
  const context = {
    repo: { owner: 'VisActor', repo: 'VChart' },
    ref: 'refs/heads/develop',
    payload: { repository: { default_branch: 'develop' } }
  };
  const pull = {
    base: { repo: { id: 1, full_name: 'VisActor/VChart' } },
    head: { sha, ref: 'feat/line-render-contribution', repo: { id: 2, full_name: 'g1f9/VChart' } },
    html_url: 'https://github.com/VisActor/VChart/pull/1234'
  };
  const run = {
    id: 100,
    workflow_id: 50,
    path: '.github/workflows/bug-server-pr-bundle.yml',
    event: 'pull_request',
    status: 'completed',
    conclusion: 'success',
    head_sha: sha,
    head_branch: pull.head.ref,
    repository: { id: 1 },
    head_repository: { id: 2 },
    pull_requests: [],
    html_url: 'https://github.com/VisActor/VChart/actions/runs/100'
  };
  const artifact = {
    id: 200,
    name: `bug-server-pr-1234-${sha}`,
    expired: false,
    workflow_run: { id: 100, repository_id: 1, head_repository_id: 2, head_sha: sha }
  };
  const runs = [run];
  const artifacts = [artifact];
  const github = {
    paginate: async (method, params) => {
      const { data } = await method(params);
      return data.workflow_runs ?? data.artifacts;
    },
    rest: {
      actions: {
        getWorkflow: async params => {
          assert.equal(params.workflow_id, 'bug-server-pr-bundle.yml');
          return { data: { id: 50, path: '.github/workflows/bug-server-pr-bundle.yml' } };
        },
        listWorkflowRuns: async params => {
          assert.equal(params.workflow_id, 50);
          assert.equal(params.head_sha, sha);
          assert.equal(params.event, 'pull_request');
          assert.equal(params.status, 'success');
          return { data: { workflow_runs: runs } };
        },
        listWorkflowRunArtifacts: async params => {
          assert.equal(params.run_id, 100);
          return { data: { artifacts } };
        }
      },
      pulls: {
        get: async params => {
          calls.push(params);
          return { data: pull };
        }
      }
    }
  };
  return {
    args: { github, context, prNumber: '1234', headSha: sha, ...overrides },
    calls,
    pull,
    run,
    artifact,
    runs,
    artifacts
  };
}

test('resolves the reviewed fork head, including source metadata', async () => {
  const { args, calls } = fixture({ headSha: sha.toUpperCase() });
  assert.deepEqual(await resolveBugServerTarget(args), {
    prNumber: 1234,
    sha,
    headRef: 'feat/line-render-contribution',
    prUrl: 'https://github.com/VisActor/VChart/pull/1234',
    runId: 100,
    runUrl: 'https://github.com/VisActor/VChart/actions/runs/100',
    artifactId: 200
  });
  assert.deepEqual(calls, [{ owner: 'VisActor', repo: 'VChart', pull_number: 1234 }]);
});

for (const prNumber of ['', '0', '-1', '1.5', '1234;echo injected', '9007199254740992']) {
  test(`rejects invalid PR number ${JSON.stringify(prNumber)} before API access`, async () => {
    const { args, calls } = fixture({ prNumber });
    await assert.rejects(resolveBugServerTarget(args), /PR number/);
    assert.equal(calls.length, 0);
  });
}

for (const headSha of ['', '40be3619', 'g'.repeat(40), `${sha}\n`]) {
  test(`rejects invalid SHA ${JSON.stringify(headSha)} before API access`, async () => {
    const { args, calls } = fixture({ headSha });
    await assert.rejects(resolveBugServerTarget(args), /40-character/);
    assert.equal(calls.length, 0);
  });
}

test('rejects stale approval when the PR has a different head', async () => {
  const { args, pull } = fixture();
  pull.head.sha = 'a'.repeat(40);
  await assert.rejects(resolveBugServerTarget(args), /head changed/);
});

test('rejects a workflow launched from a non-default branch', async () => {
  const { args, calls } = fixture();
  args.context.ref = 'refs/heads/feature';
  await assert.rejects(resolveBugServerTarget(args), /default branch/);
  assert.equal(calls.length, 0);
});

test('rejects a PR belonging to another base repository', async () => {
  const { args, pull } = fixture();
  pull.base.repo.full_name = 'someone/VChart';
  await assert.rejects(resolveBugServerTarget(args), /base repository/);
});

test('propagates API lookup failures without producing a build target', async () => {
  const { args } = fixture();
  args.github.rest.pulls.get = async () => {
    throw new Error('Not Found');
  };
  await assert.rejects(resolveBugServerTarget(args), /Not Found/);
});

for (const [name, change] of [
  [
    'wrong workflow',
    run => {
      run.workflow_id = 51;
    }
  ],
  [
    'wrong workflow path',
    run => {
      run.path = '.github/workflows/other.yml';
    }
  ],
  [
    'wrong event',
    run => {
      run.event = 'workflow_dispatch';
    }
  ],
  [
    'wrong run SHA',
    run => {
      run.head_sha = 'a'.repeat(40);
    }
  ],
  [
    'wrong base repository',
    run => {
      run.repository.id = 3;
    }
  ],
  [
    'wrong head repository',
    run => {
      run.head_repository.id = 3;
    }
  ],
  [
    'wrong source branch',
    run => {
      run.head_branch = 'another-branch';
    }
  ],
  [
    'wrong PR association',
    run => {
      run.pull_requests = [{ number: 2135 }];
    }
  ],
  [
    'failed build',
    run => {
      run.conclusion = 'failure';
    }
  ],
  [
    'unfinished build',
    run => {
      run.status = 'in_progress';
    }
  ]
]) {
  test(`rejects artifact source with ${name}`, async () => {
    const { args, run } = fixture();
    change(run);
    await assert.rejects(resolveBugServerTarget(args), /No successful PR bundle build/);
  });
}

test('accepts an explicit matching PR association', async () => {
  const { args, run } = fixture();
  run.pull_requests = [{ number: 1234 }];
  assert.equal((await resolveBugServerTarget(args)).artifactId, 200);
});

test('rejects missing workflow runs', async () => {
  const { args, runs } = fixture();
  runs.length = 0;
  await assert.rejects(resolveBugServerTarget(args), /No successful PR bundle build/);
});

test('does not select an older run instead of the latest matching run', async () => {
  const { args, run, runs } = fixture();
  runs.unshift({ ...run, id: 99 });
  assert.equal((await resolveBugServerTarget(args)).runId, 100);
});

for (const [name, change] of [
  [
    'expired',
    artifact => {
      artifact.expired = true;
    }
  ],
  [
    'wrong run',
    artifact => {
      artifact.workflow_run.id = 101;
    }
  ],
  [
    'wrong head SHA',
    artifact => {
      artifact.workflow_run.head_sha = 'a'.repeat(40);
    }
  ],
  [
    'wrong base repository',
    artifact => {
      artifact.workflow_run.repository_id = 3;
    }
  ],
  [
    'wrong head repository',
    artifact => {
      artifact.workflow_run.head_repository_id = 3;
    }
  ]
]) {
  test(`rejects ${name} artifact`, async () => {
    const { args, artifact } = fixture();
    change(artifact);
    await assert.rejects(resolveBugServerTarget(args), /Artifact provenance|expired/);
  });
}

test('rejects an artifact from a different PR or SHA', async () => {
  const { args, artifact } = fixture();
  artifact.name = `bug-server-pr-2135-${sha}`;
  await assert.rejects(resolveBugServerTarget(args), /exactly one/);
});

test('rejects missing or ambiguous artifacts', async () => {
  for (const count of [0, 2]) {
    const { args, artifacts, artifact } = fixture();
    artifacts.splice(0, 1, ...Array(count).fill(artifact));
    await assert.rejects(resolveBugServerTarget(args), /exactly one/);
  }
});

test('does not silently fall back when the newest run artifact has expired', async () => {
  const { args, run, runs, artifact } = fixture();
  runs.push({ ...run, id: 99 });
  artifact.expired = true;
  await assert.rejects(resolveBugServerTarget(args), /expired/);
});
