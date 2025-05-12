#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 获取当前版本号
function getCurrentVersion() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

// 更新版本号
function updateVersion() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const [major, minor, patch] = packageJson.version.split('.').map(Number);
  packageJson.version = `${major}.${minor}.${patch + 1}`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  return packageJson.version;
}

// 回退版本号
function revertVersion(previousVersion) {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = previousVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

module.exports = {
  getCurrentVersion,
  updateVersion,
  revertVersion
};