import minimist, { ParsedArgs } from 'minimist';
import { RushConfiguration } from '@microsoft/rush-lib';
import { execSync } from 'child_process';

interface RunScriptArgv extends ParsedArgs {
  project?: string;
  script?: string;
}

export function run(args = process.argv.slice(2), execute: typeof execSync = execSync) {
  const argv: RunScriptArgv = minimist(args);

  if (!argv.project || !argv.script) {
    throw new Error('Both --project and --script are required.');
  }

  const projects = RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd()
  });

  const targetProject = projects.findProjectByShorthandName(argv.project);

  if (!targetProject) {
    throw new Error(`Cannot find Rush project: ${argv.project}`);
  }

  execute(`rushx ${argv.script}`, {
    cwd: targetProject.projectFolder,
    stdio: [0, 1, 2]
  });
}

if (require.main === module) {
  run();
}
