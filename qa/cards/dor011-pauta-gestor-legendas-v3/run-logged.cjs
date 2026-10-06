const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const [label, command, ...args] = process.argv.slice(2);
const dir = path.join(__dirname, 'logs');
fs.mkdirSync(dir, { recursive: true });
const started = new Date().toISOString();
const windowsCommand = process.platform === 'win32' && ['npm', 'npx'].includes(command);
const cwd = process.env.DOR011_COMMAND_CWD || path.resolve(__dirname, '../../..');
const child = spawn(windowsCommand ? 'cmd.exe' : command, windowsCommand ? ['/d', '/s', '/c', [command, ...args.map(arg => /[\s&|<>^()%!\"]/.test(arg) ? JSON.stringify(arg) : arg)].join(' ')] : args, { cwd, env: process.env, windowsHide: true });
let stdout = '', stderr = '';
child.stdout.on('data', data => { stdout += data; process.stdout.write(data); });
child.stderr.on('data', data => { stderr += data; process.stderr.write(data); });
child.on('error', e => { stderr += e.stack; });
child.on('close', exitCode => {
  const result = { command: [command, ...args].join(' '), cwd, started, ended: new Date().toISOString(), exitCode, stdout, stderr };
  fs.writeFileSync(path.join(dir, label + '.json'), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(dir, label + '.log'), `COMMAND: ${result.command}\nSTART: ${started}\nEND: ${result.ended}\nEXIT: ${exitCode}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`);
  process.exitCode = exitCode || 0;
});

