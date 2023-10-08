const fs = require('fs')
const path = require('path')
const getPackageJson = require('./get-package-json');
const parseVersion = require('./parse-version');
const setJsonFileByKey = require('./set-json-file');


function writePrereleaseVersion(nextBump, preReleaseName, nextVersionStr) {
  const rushJson = getPackageJson(path.join(__dirname, '../../rush.json'));
  const projects = rushJson.projects;
  const mainPackage = projects.find((project) => project.packageName === '@visactor/vchart');

  if (!mainPackage) {
    return;
  }
  
  const mainPkgJsonPath = path.join(__dirname, '../../', mainPackage.projectFolder, 'package.json')
  const mainPkgJson = getPackageJson(mainPkgJsonPath)
  const mainVersion = mainPkgJson.version;
  console.log(`The version of main project is ${mainVersion}`);
  const curVersion = parseVersion(mainVersion);
  console.log('parsed current version:', curVersion)

  if (!curVersion) {
    return;
  }

  if (!nextVersionStr && !curVersion.preReleaseName) {
    if (nextBump === 'major') {
      curVersion.major += 1;
      curVersion.minor = 0;
      curVersion.patch = 0;
    } else if (nextBump === 'minor') {
      curVersion.minor += 1;
      curVersion.patch = 0;
    } else {
      curVersion.patch += 1;
    }
  }

  const nextVersion = nextVersionStr ? `${nextVersionStr}-${preReleaseName}` : `${curVersion.major}.${curVersion.minor}.${curVersion.patch}-${preReleaseName}`;
  const published = projects.filter(project => project.shouldPublish).map(project => project.packageName);

  console.log(`next version is ${nextVersion}`);

  projects.forEach(project => {
    const pkgJsonPath = path.join( __dirname, '../../', project.projectFolder, 'package.json')
    let jsonFile = fs.readFileSync(pkgJsonPath, { encoding: 'utf-8' })
    const pkgJson = JSON.parse(jsonFile);

    if (project.shouldPublish) {
      console.log(`handle project: ${project.packageName}, from ${pkgJson.version} to ${nextVersion}`);
    } else {
      console.log(`handle project: ${project.packageName}, update "dependencies" and "devDependencies" `);
    }

    if (project.shouldPublish) {
      jsonFile = setJsonFileByKey(jsonFile, pkgJson, ['version'], nextVersion);
    }

    if (pkgJson.dependencies) {
      Object.keys(pkgJson.dependencies).forEach(dep => {
        if (published.includes(dep)) {
          jsonFile = setJsonFileByKey(jsonFile, pkgJson, ['dependencies', dep], `workspace:${nextVersion}`);
        }
      });
    }

    if (pkgJson.devDependencies) {
      Object.keys(pkgJson.devDependencies).forEach(dep => {
        if (published.includes(dep)) {
          jsonFile = setJsonFileByKey(jsonFile, pkgJson, ['devDependencies', dep], `workspace:${nextVersion}`);
        }
      });
    }

    fs.writeFileSync(pkgJsonPath, jsonFile)
  });
  

}

module.exports = writePrereleaseVersion;