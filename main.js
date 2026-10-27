process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './config.js';
import './api.js';
import {createRequire} from 'module';
import path, {join} from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import {platform} from 'process';
import * as ws from 'ws';
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch} from 'fs';
import yargs from 'yargs';
import {spawn} from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import {tmpdir} from 'os';
import {format} from 'util';
import P from 'pino';
import pino from 'pino';
import Pino from 'pino';
import {Boom} from '@hapi/boom';
import {makeWASocket, protoType, serialize} from './lib/simple.js';
import {Low, JSONFile} from 'lowdb';
import {mongoDB, mongoDBV2} from './lib/mongoDB.js';
import store from './lib/store.js';
import {BIENVENIDA, SALIDA, EXPULSION} from './lib/bienvenida.js';
const {proto} = (await import('@whiskeysockets/baileys'));
const {DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser} = await import('@whiskeysockets/baileys');
import qrcodeTerminal from 'qrcode-terminal';
// Baileys 7 ya no trae PHONENUMBER_MCC: se valida que el número tenga código de país + número (8 a 15 dígitos)
const numeroTelefonoValido = (n) => /^\d{8,15}$/.test(n) && !n.startsWith('0');
import readline from 'readline';
import NodeCache from 'node-cache';
const {CONNECTING} = ws;
const {chain} = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
}; global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date};
global.videoList = [];
global.videoListXXX = [];

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-.@').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

global.DATABASE = global.db; 
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000));
  }
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();

/* Creditos a Otosaka (https://wa.me/51993966345) */

global.chatgpt = new Low(new JSONFile(path.join(__dirname, '/db/chatgpt.json')));
global.loadChatgptDB = async function loadChatgptDB() {
  if (global.chatgpt.READ) {
    return new Promise((resolve) =>
      setInterval(async function() {
        if (!global.chatgpt.READ) {
          clearInterval(this);
          resolve( global.chatgpt.data === null ? global.loadChatgptDB() : global.chatgpt.data );
        }
      }, 1 * 1000));
  }
  if (global.chatgpt.data !== null) return;
  global.chatgpt.READ = true;
  await global.chatgpt.read().catch(console.error);
  global.chatgpt.READ = null;
  global.chatgpt.data = {
    users: {},
    ...(global.chatgpt.data || {}),
  };
  global.chatgpt.chain = lodash.chain(global.chatgpt.data);
};
loadChatgptDB();

/*◊════════════• ❮ INSTALACION Y CONEXIÓN ❯ •═════════════◊*/

global.authFile = `NaufraBotSession`;
const {state, saveState, saveCreds} = await useMultiFileAuthState(global.authFile);
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botnumber

const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

// CODIGO MEJORADO POR GUARDIAN BOT MD.
let opcion
if (methodCodeQR) {
opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${authFile}/creds.json`)) {
do {
let lineM = '────────────────────────✦'
opcion = await question('╭────────────────────────✦\n┋Seleccione las opciones que desea\n╰────────────────────────✦\n╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈◈\n│OPCION: 1\n│Escanea con un QR\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈◈\n╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈◈\n│OPCION: 2\n│Código de texto de 8 dígitos\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈◈\n---> ')
//if (fs.existsSync(`./${authFile}/creds.json`)) {
//console.log(chalk.bold.redBright(`PRIMERO BORRE EL ARCHIVO ${chalk.bold.greenBright("creds.json")} QUE SE ENCUENTRA EN LA CARPETA ${chalk.bold.greenBright(authFile)} Y REINICIE.`))
//process.exit()
if (!/^[1-2]$/.test(opcion)) {
console.log('⚠️ ERROR, SOLO SELECCIONA LA OPCION 1 O 2...\n')
}} while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${authFile}/creds.json`))
}

console.info = () => {}
console.warn = () => {}
const connectionOptions = {
logger: pino({ level: 'silent' }),
browser: opcion == '1' ? ['NaufraZapp-MD', 'Safari', '2.0.0'] : methodCodeQR ? ['NaufraZapp-MD', 'Safari', '2.0.0'] : ['Ubuntu', 'Chrome', '110.0.5585.95'],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: true, 
generateHighQualityLinkPreview: true, 
getMessage: async (clave) => {
// Baileys 7 lo usa para reintentar mensajes que no se pudieron descifrar
let jid = jidNormalizedUser(clave.remoteJid)
let msg = global.conn?.chats?.[jid]?.messages?.[clave.id] || await store.loadMessage(jid, clave.id)
return msg?.message || undefined
},
msgRetryCounterCache,
defaultQueryTimeoutMs: undefined,   
version
}

global.conn = makeWASocket(connectionOptions);

if (!fs.existsSync(`./${authFile}/creds.json`)) {
if (opcion === '2' || methodCode) {
//if (fs.existsSync(`./${authFile}/creds.json`)) {
//console.log(chalk.bold.redBright(`PRIMERO BORRE EL ARCHIVO ${chalk.bold.greenBright("creds.json")} QUE SE ENCUENTRA EN LA CARPETA ${chalk.bold.greenBright(authFile)} Y REINICIE.`))
//process.exit()
//}
opcion = '2'
if (!conn.authState.creds.registered) {  
if (MethodMobile) throw new Error('ⓘ No se puede usar un código de emparejamiento con la API móvil')

let numeroTelefono
if (!!phoneNumber) {
numeroTelefono = phoneNumber.replace(/[^0-9]/g, '')
if (!numeroTelefonoValido(numeroTelefono)) {
console.log(chalk.bgBlack(chalk.bold.greenBright("ⓘ Comience con el código de país de su número de WhatsApp.\nPor ejemplo: +5493873687620\n")))
process.exit(0)
}} else {
while (true) {
numeroTelefono = await question(chalk.bgBlack(chalk.bold.cyanBright('ⓘ Por favor, escriba o pegue su número de WhatsApp.\nPor ejemplo: +5493873687620\n')))
numeroTelefono = numeroTelefono.replace(/[^0-9]/g, '')

if (numeroTelefono.match(/^\d+$/) && numeroTelefonoValido(numeroTelefono)) {
break 
} else {
console.log(chalk.bgBlack(chalk.bold.cyanBright("ⓘ Por favor, escriba o pegue su número de WhatsApp.\nPor ejemplo: +5493873687620.\n")))
}}
rl.close()  
} 

        // Baileys 7: el código se pide cuando el socket ya está listo (cuando llega el primer QR)
        let codigoPedido = false
        const pedirCodigo = async ({qr}) => {
            if (codigoPedido || !qr) return
            codigoPedido = true
            conn.ev.off('connection.update', pedirCodigo)
            try {
            let codigo = await conn.requestPairingCode(numeroTelefono)
            codigo = codigo?.match(/.{1,4}/g)?.join("-") || codigo
            console.log(chalk.cyan('ⓘ introduce el código de emparejamiento en WhatsApp.'));
            console.log(chalk.black(chalk.bgGreen(`Su código de emparejamiento: `)), chalk.black(chalk.white(codigo)))
            } catch (e) {
            console.error(e)
            }
        }
        conn.ev.on('connection.update', pedirCodigo)
}}
}

conn.isInit = false;
conn.well = false;
conn.logger.info(`CARGANDO...\n`);

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', 'BotsWhatsAppOFC'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
    }, 30 * 1000);
  }
}

if (opts['server']) (await import('./server.js')).default(global.conn, PORT);


function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file); // 3 minutes
    return false;
  });
}

function purgeSession() {
// Baileys 7: borrar los pre-key hace que fallen los mensajes de contactos nuevos. Ya no se borran.
return
let prekey = []
let directorio = readdirSync("./NaufraBotSession")
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-') /*|| file.startsWith('session-') || file.startsWith('sender-') || file.startsWith('app-') */
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./MysticSession/${files}`)
})
} 

function purgeSessionSB() {
// Baileys 7: borrar los pre-key hace que fallen los mensajes de contactos nuevos. Ya no se borran.
return
try {
let listaDirectorios = readdirSync('./BotsWhatsAppOFC/');
let SBprekey = []
listaDirectorios.forEach(directorio => {
if (statSync(`./BotsWhatsAppOFC/${directorio}`).isDirectory()) {
let DSBPreKeys = readdirSync(`./BotsWhatsAppOFC/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-') /*|| fileInDir.startsWith('app-') || fileInDir.startsWith('session-')*/
})
SBprekey = [...SBprekey, ...DSBPreKeys]
DSBPreKeys.forEach(fileInDir => {
unlinkSync(`./BotsWhatsAppOFC/${directorio}/${fileInDir}`)
})
}
})
if (SBprekey.length === 0) return; //console.log(chalk.cyanBright(`=> No hay archivos por eliminar.`))
} catch (err) {
console.log(chalk.bold.red(`ⓘ Algo salio mal durante la eliminación, archivos no eliminados`))
}}

function purgeOldFiles() {
const directories = ['./NaufraBotSession/', './BotsWhatsAppOFC/']
const oneHourAgo = Date.now() - (60 * 60 * 1000)
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
const filePath = path.join(dir, file)
stat(filePath, (err, stats) => {
if (err) throw err;
if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') { 
unlinkSync(filePath, err => {  
if (err) throw err
console.log(chalk.bold.green(`Archivo ${file} borrado con éxito`))
})
} else {  
console.log(chalk.bold.red(`Archivo ${file} no borrado` + err))
} }) }) }) })
}

async function connectionUpdate(update) {
  const {connection, lastDisconnect, isNewLogin} = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  // La reconexión se hace abajo según el motivo (antes se reconectaba dos veces)
  if (code && code !== DisconnectReason.loggedOut) {
    global.timestamp.connect = new Date;
  }
  if (global.db.data == null) loadDatabase();
if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
    console.log(chalk.yellow('Escanea el código QR por favor..'));
    // Baileys 7 ya no imprime el QR solo (printQRInTerminal se eliminó)
    if (update.qr) qrcodeTerminal.generate(update.qr, {small: true});
 }}
   if (connection == 'open') {
console.log(chalk.yellowBright('\n╭──────────────────────◊\n╎✅ CONECTADO A WHATSAPP ✅\n╰──────────────────────◊\n'))
//conn.fakeReply('5493873687620@s.whatsapp.net', '✅', '0@s.whatsapp.net', 'Hola, soy un bot nuevo.', '0@s.whatsapp.net')
 await conn.groupAcceptInvite('IOExLiCmlLV9Bdsw8y5BvR').catch(() => {});
   }
   /*◊════════════• ❮ MENSAJES DE REEMPLAZO ❯ •═════════════◊*/
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
if (reason == 405) {
await fs.unlinkSync("./NaufraBotSession/" + "creds.json")
console.log(chalk.bold.redBright(`⚠️ Conexión replazada, Por favor espere un momento me voy a reiniciar...\nSi aparecen error vuelve a iniciar con : npm start`)) 
process.send('reset')}
if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
        conn.logger.error(`⚠️ Sesión incorrecta, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        //process.exit();
        await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionClosed) {
        conn.logger.warn(`⚠️ Conexión cerrada, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionLost) {
        conn.logger.warn(`⚠️ Conexión perdida con el servidor, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionReplaced) {
        conn.logger.error(`⚠️ Conexión reemplazada, se ha abierto otra nueva sesión. Por favor, cierra la sesión actual primero.`);
        //process.exit();
    } else if (reason === DisconnectReason.loggedOut) {
        conn.logger.error(`⚠️ Conexion cerrada, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        //process.exit();
    } else if (reason === DisconnectReason.restartRequired) {
        conn.logger.info(`⚠️ Reinicio necesario, reinicie el servidor si presenta algún problema.`);
        await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.timedOut) {
        conn.logger.warn(`⚠️ Tiempo de conexión agotado, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
    } else {
        conn.logger.warn(`⚠️ Razón de desconexión desconocida. ${reason || ''}: ${connection || ''}`);
        await global.reloadHandler(true).catch(console.error);
    }
}
  /*if (connection == 'close') {
    console.log(chalk.yellow(`🍀ㅤConexion cerrada, por favor borre la carpeta ${global.authFile} y reescanee el codigo QR`));
  }*/
}

process.on('uncaughtException', console.error);

/*◊════════════• ❮ MENSAJE PARA GRUPOS ❯ •═════════════◊*/
let isInit = true;
let handler = await import('./handler.js');
global.reloadHandler = async function(restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) handler = Handler;
  } catch (e) {
    console.error(e);
  }
  if (restatConn) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch { }
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, {chats: oldChats});
    isInit = true;
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('group-participants.update', conn.participantsUpdate);
    conn.ev.off('groups.update', conn.groupsUpdate);
    conn.ev.off('message.delete', conn.onDelete);
    conn.ev.off('call', conn.onCall);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

 // Textos de bienvenida / despedida / expulsión (ver lib/bienvenida.js)
  conn.welcome = BIENVENIDA;
  conn.bye = SALIDA;
  conn.kick = EXPULSION;
  conn.spromote = '╭•───────────────────◊\n┆ @subject\n╰•───────────────────◊\n> *Un/a usuario/a fue promovido/a como admin del grupo.*\n\n\`USUARIO/A:\`\n@user';
  conn.sdemote = '╭•───────────────────◊\n┆ @subject\n╰•───────────────────◊\n> *Un/a usuario/a fue descartado/a como admin del grupo.*\n\n\`USUARIO/A:\`\n@user';
  conn.sDesc = '╭•───────────────────◊\n┆ @subject\n╰•───────────────────◊\n> *Se ha cambiado la descripción del grupo.* ✨\n\n\`NUEVA DESCRIPCIÓN:\`\n@desc';
  conn.sSubject = '╭•───────────────────◊\n┆ @subject\n╰•───────────────────◊\n> *Se ha cambiado el nombre de este grupo.* ✨';
  conn.sIcon = '╭•───────────────────◊\n┆ @subject\n╰•───────────────────◊\n> *Se ha cambiado la foto de perfil del grupo.* ✨';
  conn.sRevoke = '╭•───────────────────◊\n┆ @subject\n╰•───────────────────◊\n> *Se ha restablecido el* \`link/enlace\` *del grupo.*\n\n\`LINK /ENLACE:\`\n@revoke';

  conn.handler = handler.handler.bind(global.conn);
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
  conn.onDelete = handler.deleteUpdate.bind(global.conn);
  conn.onCall = handler.callUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  const currentDateTime = new Date();
  const messageDateTime = new Date(conn.ev);
  if (currentDateTime >= messageDateTime) {
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
  } else {
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
  }

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('group-participants.update', conn.participantsUpdate);
  conn.ev.on('groups.update', conn.groupsUpdate);
  conn.ev.on('message.delete', conn.onDelete);
  conn.ev.on('call', conn.onCall);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);
  isInit = false;
  return true;
};

/*

const pluginFolder = join(__dirname, './plugins');
const pluginFilter = filename => /\.js$/.test(filename);
global.plugins = {};

async function filesInit(folder) {
  for (let filename of readdirSync(folder).filter(pluginFilter)) {
    try {
      let file = join(folder, filename);
      const module = await import(file);
      global.plugins[file] = module.default || module;
    } catch (e) {
      console.error(e);
      delete global.plugins[filename];
    }
  }

  for (let subfolder of readdirSync(folder)) {
    const subfolderPath = join(folder, subfolder);
    if (statSync(subfolderPath).isDirectory()) {
      await filesInit(subfolderPath);
    }
  }
}

await filesInit(pluginFolder).then(_ => Object.keys(global.plugins)).catch(console.error);

*/
/*◊════════════• ❮ MENSAJE DE ELIMINACIÓN ❯ •═════════════◊*/
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(e);
      delete global.plugins[filename];
    }
  }
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`);
      else {
        conn.logger.warn(`deleted plugin - '${filename}'`);
        return delete global.plugins[filename];
      }
    } else conn.logger.info(`new plugin - '${filename}'`);
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`);
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`error require plugin '${filename}\n${format(e)}'`);
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();
async function _quickTest() {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map((p) => {
    return Promise.race([
      new Promise((resolve) => {
        p.on('close', (code) => {
          resolve(code !== 127);
        });
      }),
      new Promise((resolve) => {
        p.on('error', (_) => resolve(false));
      })]);
  }));
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
  Object.freeze(global.support);
}
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  const a = await clearTmp();
console.log(chalk.greenBright(`\n╭─────────◊ ARCHIVO ◊─────────╮\n│✅ Archivo no necesario eliminado.\n╰─────────◊ ARCHIVO ◊─────────╯\n`));
}, 180000);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSession();
console.log(chalk.greenBright(`\n╭─────────◊ ARCHIVO ◊─────────╮\n│✅ Archivo no necesario eliminado.\n╰─────────◊ ARCHIVO ◊─────────╯\n`));
}, 1000 * 60 * 60);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSessionSB();
console.log(chalk.greenBright(`\n╭─────────◊ ARCHIVO ◊─────────╮\n│✅ Archivo no necesario eliminado.\n╰─────────◊ ARCHIVO ◊─────────╯\n`));
}, 1000 * 60 * 60);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeOldFiles();
console.log(chalk.greenBright(`\n╭─────────◊ ARCHIVO ◊─────────╮\n│✅ Archivo no necesario eliminado.\n╰─────────◊ ARCHIVO ◊─────────╯\n`));
}, 180000)
_quickTest()
.then()
.catch(console.error)
