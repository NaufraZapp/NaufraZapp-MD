console.log('👑ㅤIniciando...');
import {join, dirname} from 'path';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';
import cluster from 'cluster';
// Node 20+: setupMaster cambió de nombre a setupPrimary
const setupMaster = (cluster.setupPrimary || cluster.setupMaster).bind(cluster);
const fork = cluster.fork.bind(cluster);
import {watchFile, unwatchFile} from 'fs';
import cfonts from 'cfonts';
import {createInterface} from 'readline';
import yargs from 'yargs';
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const {name, author} = require(join(__dirname, './package.json'));
const {say} = cfonts;
// La consola la lee solo main.js (número de teléfono, opción 1/2). Si index.js también
// la leía, se "robaba" lo que escribías y por eso pedía el número varias veces.
/* ❒═════════════════◊【】◊═════════════════❒ */
say('Naufra\nZapp\nMD', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']});
say(`WhatsApp Bot By: SupportBots`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']});

let isRunning = false;
/**
* Start a js file
* @param {String} file `path/to/file`
*/
function start(file) {
  if (isRunning) return;
  isRunning = true;
  const args = [join(__dirname, file), ...process.argv.slice(2)];
/* ❒═════════════════◊【】◊═════════════════❒ */
  say('Ajuste la pantalla para escanear el codigo QR', {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']});

  setupMaster({
    exec: args[0],
    args: args.slice(1)});
  const p = fork();
  p.on('message', (data) => {
    console.log('[RECEIVED]', data);
    switch (data) {
      case 'reset':
        p.process.kill();
        isRunning = false;
        start.apply(this, arguments);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });
  /* ❒═════════════════◊【】◊═════════════════❒ */
  p.on('exit', (_, code) => {
    isRunning = false;
    console.error('🚫 Ocurrio un error inesperado:', code);

    p.process.kill();
    isRunning = false;
    start.apply(this, arguments);

    if (process.env.pm_id) {
      process.exit(1);
    } else {
      process.exit();
    }
  });
}
start('main.js');
