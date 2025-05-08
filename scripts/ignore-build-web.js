#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  console.log('❗ Checking git diff from main branch...');

  // Get the diff between current branch and main
  const diff = execSync('git diff --name-only main', { encoding: 'utf-8' });
  console.log('❗ Raw diff output:', diff);

  // Split the diff into lines and filter out empty lines
  const changedFiles = diff.split('\n').filter(Boolean);
  console.log('❗ Changed files:', changedFiles);

  // Check if all changes are only in api-comsat or cybernetics-core
  const onlyApiOrCyberneticsChanges = changedFiles.every(
    (file) => file.startsWith('apps/api-comsat/') || file.startsWith('apps/cybernetics-core/')
  );
  console.log('❗ Only API or Cybernetics changes:', onlyApiOrCyberneticsChanges);

  // If there are no changes or only api/cybernetics changes, return 0
  if (changedFiles.length === 0 || onlyApiOrCyberneticsChanges) {
    console.log('❗ No changes or only API/Cybernetics changes detected. Exiting with code 0');
    process.exit(0);
  }

  // Otherwise return 1
  console.log('❗ Changes detected in other directories. Exiting with code 1');
  process.exit(1);
} catch (error) {
  console.error('❗ Error checking git diff:', error.message);
  process.exit(1);
}
