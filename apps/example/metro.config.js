// Expo + monorepo Metro config. Watches workspace packages so changes in
// packages/core, packages/tokens, packages/icons reload the example app.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, prefer the example's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Ensure peer deps resolve uniquely (avoid duplicate React copies)
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
