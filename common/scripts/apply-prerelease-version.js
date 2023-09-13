const writePrereleaseVersion = require('./set-prerelease-version');
const checkAndUpdateNextBump = require('./version-policies');


function run() {
  const preReleaseName = process.argv.slice(2)[0];
  const nextBump = checkAndUpdateNextBump(process.argv.slice(2)[1]);

  console.log('[apply prerelease version]: ', preReleaseName, nextBump);

  writePrereleaseVersion(nextBump, preReleaseName);  
}

run()