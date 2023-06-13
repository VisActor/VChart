/**
 * prelease
 */

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function getPackageJson(pkgJsonPath) {
  const pkgJson = fs.readFileSync(pkgJsonPath, { encoding: 'utf-8' })
  return JSON.parse(pkgJson);
}

function run() {
  const preReleaseName = process.argv.slice(2)[0] || 'alpha'
  const cwd = process.cwd();

  if (typeof preReleaseName === 'string' && preReleaseName) {
    const preReleaseType = preReleaseName.includes('.') ? preReleaseName.split('.')[0] : 'alpha';

    // 1. build all the packages
    spawnSync('sh', ['-c', `rush build --only tag:package`], {
      stdio: 'inherit',
      shell: false,
    });

    // 2. apply version and update version of package.json
    spawnSync('sh', ['-c', `rush publish --apply --prerelease-name ${preReleaseName} --partial-prerelease`], {
      stdio: 'inherit',
      shell: false,
    });

    // 3. publish to npm
    spawnSync('sh', ['-c', `rush publish --publish --include-all --tag ${preReleaseType}`], {
      stdio: 'inherit',
      shell: false,
    });

    // 4. update version of local packages to shrinkwrap
    spawnSync('sh', ['-c', `rush update`], {
      stdio: 'inherit',
      shell: false,
    });

    const rushJson = getPackageJson(`${cwd}/rush.json`)
    const package = rushJson.projects.find((project) => project.packageName === '@visactor/vchart');

    if (package) {
      const pkgJsonPath = path.resolve(package.projectFolder, 'package.json')
      const pkgJson = getPackageJson(pkgJsonPath)

      // 5. add the the changes
      spawnSync('sh', ['-c', `git add --all`], {
        stdio: 'inherit',
        shell: false,
      });

      // 6. commit all the changes
      spawnSync('sh', ['-c', `git commit -m "build: prerelease version ${pkgJson.version}"`], {
        stdio: 'inherit',
        shell: false,
      });
    }
  }
}

run()
