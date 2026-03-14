#!/usr/bin/env node
'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const { spawn } = require('child_process');

const installDir = path.join(os.homedir(), '.marionette', 'app');
const isWindows = process.platform === 'win32';
const realBin = path.join(installDir, 'bin', isWindows ? 'marionette.cmd' : 'marionette');

const args = process.argv.slice(2);
const command = args[0];

if (fs.existsSync(realBin)) {
  const child = spawn(realBin, args, { stdio: 'inherit', shell: isWindows });
  child.on('exit', (code) => process.exit(code ?? 0));
} else if (!command || command === 'setup') {
  require('../scripts/bootstrap.js')();
} else {
  console.error('Marionette is not installed yet. Run: marionette setup');
  process.exit(1);
}
