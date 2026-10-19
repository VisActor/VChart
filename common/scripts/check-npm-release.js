const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function versionExists(packageName, version) {
  const spec = `${packageName}@${version}`;
  const result = spawnSync('npm', ['view', spec, 'version', '--json', '--registry=https://registry.npmjs.org'], {
    encoding: 'utf8',
    timeout: 60000
  });
  if (result.error) {
    throw new Error(`Failed to query ${spec}: ${result.error.message}`);
  }

  let response;
  try {
    response = JSON.parse(result.stdout);
  } catch {
    throw new Error(`Invalid npm response for ${spec} (exit ${result.status}). ${result.stderr}`);
  }
  if (result.status === 0 && response === version) {
    return true;
  }
  if (result.status !== 0 && response.error && response.error.code === 'E404') {
    return false;
  }
  throw new Error(`Failed to query ${spec}: ${response.error?.code || `unexpected response (exit ${result.status})`}`);
}

function checkNpmRelease() {
  const version = process.env.PACKAGE_VERSION;
  if (!version) {
    throw new Error('PACKAGE_VERSION is required.');
  }
  const rush = JSON.parse(fs.readFileSync('rush.json', 'utf8'));
  const projects = rush.projects.filter(project => project.shouldPublish);
  if (!projects.length) {
    throw new Error('No publishable Rush projects found.');
  }
  // 先校验本地目标版本，再进行远端查询，避免恢复时混入其他版本。
  for (const project of projects) {
    const manifest = JSON.parse(fs.readFileSync(path.join(project.projectFolder, 'package.json'), 'utf8'));
    if (manifest.version !== version) {
      throw new Error(`${project.packageName} has local version ${manifest.version}, expected ${version}.`);
    }
  }

  const existing = [];
  const missing = [];
  for (const project of projects) {
    (versionExists(project.packageName, version) ? existing : missing).push(project.packageName);
  }
  if (missing.length === 0) {
    console.log(`All packages already have version ${version} on npm, skip publish.`);
    return true;
  }
  if (existing.length === 0) {
    console.log(`No package has version ${version} on npm, continue publish.`);
    return false;
  }

  console.log(`Partial npm publish detected for ${version}.`);
  console.log(`Existing packages: ${existing.join(' ')}`);
  console.log(`Missing packages: ${missing.join(' ')}`);
  if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' && process.env.RESUME_PARTIAL_PUBLISH === 'true') {
    console.log('Manual recovery enabled. Rush will skip existing versions and publish only missing packages.');
    return false;
  }
  throw new Error('Stop before publish. After reviewing the release source, use Run workflow with resume_partial_publish enabled.');
}

try {
  const skip = checkNpmRelease();
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `skip_publish=${skip}\n`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
