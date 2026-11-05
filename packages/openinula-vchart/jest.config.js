const fs = require('fs');
const path = require('path');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const packageRoots = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../vchart/node_modules'),
  path.resolve(__dirname, '../../common/temp/node_modules')
];

function getNodeModulePackageJson(packageName) {
  const relativePath = path.join(...packageName.split('/'), 'package.json');
  for (let i = 0; i < packageRoots.length; i++) {
    const candidate = path.resolve(packageRoots[i], relativePath);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function mapPackageExportsToCjs(packageName) {
  const packageJsonPath = getNodeModulePackageJson(packageName);
  if (!packageJsonPath) {
    return {};
  }
  const packageJson = require(packageJsonPath);
  const packageRoot = path.dirname(packageJsonPath);

  return Object.entries(packageJson.exports ?? {}).reduce((mappers, [subpath, target]) => {
    if (subpath === '.' || !target || typeof target !== 'object' || !target.require) {
      return mappers;
    }

    const exportPath = subpath.slice(2);
    mappers[`^${escapeRegex(packageName)}\\/${escapeRegex(exportPath)}$`] = path.resolve(
      packageRoot,
      target.require.replace(/\.js$/, '')
    );

    return mappers;
  }, {});
}

function resolvePackageFile(packageName, relativeFile) {
  const packageJsonPath = getNodeModulePackageJson(packageName);
  if (!packageJsonPath) {
    return null;
  }
  const resolved = path.resolve(path.dirname(packageJsonPath), relativeFile);
  return fs.existsSync(resolved) || fs.existsSync(`${resolved}.js`) ? resolved : null;
}

function assignMapper(mappers, pattern, target) {
  if (target) {
    mappers[pattern] = target;
  }
}

const vrenderPackageExportMappers = {
  ...mapPackageExportsToCjs('@visactor/vrender'),
  ...mapPackageExportsToCjs('@visactor/vrender-core'),
  ...mapPackageExportsToCjs('@visactor/vrender-animate'),
  ...mapPackageExportsToCjs('@visactor/vrender-components'),
  ...mapPackageExportsToCjs('@visactor/vrender-kits')
};

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '/__tests__/.*\\.test\\.(js|ts|tsx)$',
  setupFiles: ['./jest.setup.js'],
  testTimeout: 60000,
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true,
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowJs: true,
        target: 'ES2019',
        module: 'commonjs',
        strict: false,
        skipLibCheck: true,
        sourceMap: true,
        composite: false,
        declaration: false,
        declarationMap: false,
        rootDir: path.resolve(__dirname, '../..')
      }
    }
  },
  moduleNameMapper: (() => {
    const mappers = {
      '^@visactor/vchart$': path.resolve(__dirname, '../vchart/src/index.ts'),
      '^@visactor/vutils-extension$': path.resolve(__dirname, '../vutils-extension/src/index.ts'),
      ...vrenderPackageExportMappers
    };
    assignMapper(mappers, '^d3-color$', resolvePackageFile('d3-color', 'dist/d3-color.min.js'));
    assignMapper(mappers, '^d3-array$', resolvePackageFile('d3-array', 'dist/d3-array.min.js'));
    assignMapper(mappers, '^d3-geo$', resolvePackageFile('d3-geo', 'dist/d3-geo.min.js'));
    assignMapper(mappers, '^d3-dsv$', resolvePackageFile('d3-dsv', 'dist/d3-dsv.min.js'));
    assignMapper(mappers, '^d3-hexbin$', resolvePackageFile('d3-hexbin', 'build/d3-hexbin.min.js'));
    assignMapper(mappers, '^d3-hierarchy$', resolvePackageFile('d3-hierarchy', 'dist/d3-hierarchy.min.js'));
    assignMapper(mappers, '^@visactor/vrender$', resolvePackageFile('@visactor/vrender', 'cjs/index'));
    assignMapper(mappers, '^@visactor/vrender-core$', resolvePackageFile('@visactor/vrender-core', 'cjs/index'));
    assignMapper(mappers, '^@visactor/vrender-animate$', resolvePackageFile('@visactor/vrender-animate', 'cjs/index'));
    assignMapper(
      mappers,
      '^@visactor/vrender-components$',
      resolvePackageFile('@visactor/vrender-components', 'cjs/index')
    );
    assignMapper(mappers, '^@visactor/vrender-kits$', resolvePackageFile('@visactor/vrender-kits', 'cjs/index-node'));
    assignMapper(
      mappers,
      '^@visactor/vrender/(.*)$',
      resolvePackageFile('@visactor/vrender', 'cjs') && `${resolvePackageFile('@visactor/vrender', 'cjs')}/$1`
    );
    assignMapper(
      mappers,
      '^@visactor/vrender-core/(.*)$',
      resolvePackageFile('@visactor/vrender-core', 'cjs') && `${resolvePackageFile('@visactor/vrender-core', 'cjs')}/$1`
    );
    assignMapper(
      mappers,
      '^@visactor/vrender-animate/(.*)$',
      resolvePackageFile('@visactor/vrender-animate', 'cjs') &&
        `${resolvePackageFile('@visactor/vrender-animate', 'cjs')}/$1`
    );
    assignMapper(
      mappers,
      '^@visactor/vrender-components/(.*)$',
      resolvePackageFile('@visactor/vrender-components', 'cjs') &&
        `${resolvePackageFile('@visactor/vrender-components', 'cjs')}/$1`
    );
    assignMapper(
      mappers,
      '^@visactor/vrender-kits/(.*)$',
      resolvePackageFile('@visactor/vrender-kits', 'cjs') && `${resolvePackageFile('@visactor/vrender-kits', 'cjs')}/$1`
    );
    return mappers;
  })()
};
