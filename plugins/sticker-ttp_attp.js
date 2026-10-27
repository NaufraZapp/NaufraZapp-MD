import {naufraArchivo} from '../lib/naufra-api.js';
import fetch from 'node-fetch';
import {sticker, addExif} from '../lib/sticker.js';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {Sticker} = await import('wa-sticker-formatter').catch(() => ({}));
const handler = async (m, {conn, text, args, usedPrefix, command}) => {
  if (!text) throw `> ⓘ 𝙄𝙣𝙜𝙧𝙚𝙨𝙚 𝙪𝙣 𝙩𝙚𝙭𝙩𝙤 𝙡𝙤 𝙘𝙪𝙖𝙡 𝙨𝙚𝙧𝙖 𝙘𝙤𝙣𝙫𝙚𝙧𝙩𝙞𝙙𝙤 𝙚𝙣 𝙨𝙩𝙞𝙘𝙠𝙚𝙧.\n\n> 𝙋𝙤𝙧 𝙚𝙟𝙚𝙢𝙥𝙡𝙤:\n> *${usedPrefix + command} NaufraZapp-MD*`;
  const teks = encodeURI(text);

  // API Naufra primero (/api/attp, /api/attp2 ... /api/attp6); si falla, sigue con los métodos de siempre
  const estilosNaufra = {attp: 'attp', attp2: 'attp2', attp3: 'attp3', ttp: 'attp4', ttp2: 'attp5', ttp3: 'attp6', ttp4: 'attp4', ttp5: 'attp5'};
  if (estilosNaufra[command]) {
    try {
      const {buffer} = await naufraArchivo(`api/${estilosNaufra[command]}`, {text});
      const stk = await createSticker(buffer, false, global.packname, global.author).catch(() => buffer);
      return conn.sendFile(m.chat, stk, 'sticker.webp', '', m, {asSticker: true});
    } catch (e) {
      console.log('[API Naufra] attp falló, se usa el método anterior:', e?.message || e);
    }
  }

  if (command == 'attp') {
    const a1 = await (await fetch(`https://api.erdwpe.com/api/maker/attp?text=${teks}`)).buffer();
    const a2 = await createSticker(a1, false, global.packname, global.author);
    conn.sendFile(m.chat, a2, 'sticker.webp', '', m, {asSticker: true});
  }

  if (command == 'attp2') {
    conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/attp?apikey=${lolkeysapi}&text=${teks}`, 'sticker.webp', '', m, {asSticker: true});
  }

  if (command == 'attp3') {
    conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/attp2?apikey=${lolkeysapi}&text=${teks}`, 'sticker.webp', '', m, {asSticker: true});
  }

  if (command == 'ttp5') {
    conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/ttp6?apikey=${lolkeysapi}&text=${teks}`, 'sticker.webp', '', m, {asSticker: true});
  }

  if (command == 'ttp4') {
    conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/ttp5?apikey=${lolkeysapi}&text=${teks}`, 'sticker.webp', '', m, {asSticker: true});
  }

  if (command == 'ttp3') {
    conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/ttp3?apikey=${lolkeysapi}&text=${teks}`, 'sticker.webp', '', m, {asSticker: true});
  }

  if (command == 'ttp2') {
    conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/ttp2?apikey=${lolkeysapi}&text=${teks}`, 'sticker.webp', '', m, {asSticker: true});
  }

  if (command == 'ttp') {
    conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/ttp?apikey=${lolkeysapi}&text=${teks}`, 'sticker.webp', '', m, {asSticker: true});
  }
};
handler.command = handler.help = ['ttp', 'ttp2', 'ttp3', 'ttp4', 'ttp5', 'attp', 'attp2', 'attp3'];
handler.tags = ['sticker'];
export default handler;

async function createSticker(img, url, packName, authorName, quality) {
  const stickerMetadata = {type: 'full', pack: packName, author: authorName, quality};
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer();
}
async function mp4ToWebp(file, stickerMetadata) {
  if (stickerMetadata) {
    if (!stickerMetadata.pack) stickerMetadata.pack = '‎';
    if (!stickerMetadata.author) stickerMetadata.author = '‎';
    if (!stickerMetadata.crop) stickerMetadata.crop = false;
  } else if (!stickerMetadata) {
    stickerMetadata = {pack: '‎', author: '‎', crop: false};
  }
  const getBase64 = file.toString('base64');
  const Format = {file: `data:video/mp4;base64,${getBase64}`, processOptions: {crop: stickerMetadata?.crop, startTime: '00:00:00.0', endTime: '00:00:7.0', loop: 0,
  }, stickerMetadata: {...stickerMetadata},
  sessionInfo: {
    WA_VERSION: '2.2106.5',
    PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
    WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
    BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
    OS: 'Windows Server 2016',
    START_TS: 1614310326309,
    NUM: '6247',
    LAUNCH_TIME_MS: 7934,
    PHONE_VERSION: '2.20.205.16',
  },
  config: {
    sessionId: 'session',
    headless: true,
    qrTimeout: 20,
    authTimeout: 0,
    cacheEnabled: false,
    useChrome: true,
    killProcessOnBrowserClose: true,
    throwErrorOnTosBlock: false,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--aggressive-cache-discard',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disk-cache-size=0',
    ],
    executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
    skipBrokenMethodsCheck: true,
    stickerServerEndpoint: true,
  }};
  const res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {method: 'post', headers: {'Accept': 'application/json, text/plain, /', 'Content-Type': 'application/json;charset=utf-8'}, body: JSON.stringify(Format)});
  return Buffer.from((await res.text()).split(';base64,')[1], 'base64');
}
