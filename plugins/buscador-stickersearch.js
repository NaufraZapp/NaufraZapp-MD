import {stickerBuscar} from '../lib/naufra-api.js';
/* By https://github.com/ALBERTO9883 */
/*import fs from 'fs';
import fetch from 'node-fetch';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {googleImage} = await import('@bochilteam/scraper').catch(() => ({}));
const handler = async (m, {text, usedPrefix, command, conn}) => {
  // API Naufra primero; si falla, sigue con los métodos de siempre
  if (text) {
    try {
      const stickers = await stickerBuscar(text, 3);
      if (stickers.length) {
        for (const s of stickers.slice(0, 3)) await conn.sendFile(m.chat, s, 'sticker.webp', '', m, {asSticker: true});
        return;
      }
    } catch (e) {
      console.log('[API Naufra] stickersearch falló, se usa el método anterior:', e?.message || e);
    }
  }
  try {
    const res2 = await googleImage(text);
    const sfoto = res2.getRandom();
    if (!text) throw `*[❗] 𝙸𝙽𝙶𝚁𝙴𝚂𝙴 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴 𝙳𝙴𝙻 𝙿𝙰𝚀𝚄𝙴𝚃𝙴 𝚀𝚄𝙴 𝙳𝙴𝚂𝙴𝙴 𝙱𝚄𝚂𝙲𝙰𝚁*`;
    const json = await fetch(`https://api.akuari.my.id/search/sticker?query=${text}`);
    const jsons = await json.json();
    const res = jsons.result.map((v, index) => `*🪴 • Resultado:* ${1 + index}\n*🌵 • Nombre:* ${v.title}\n*🍂 • Url:* ${v.url}`).join`\n\n───\n\n`;
    await conn.sendFile(m.chat, sfoto, 'error.jpg', res, m);
  } catch {
    await m.reply('*[❗] 𝙴𝚁𝚁𝙾𝚁, 𝙿𝙾𝚁 𝙵𝙰𝚅𝙾𝚁 𝚅𝚄𝙴𝙻𝚅𝙰 𝙰 𝙸𝙽𝚃𝙴𝚁𝙽𝚃𝙰𝚁𝙻𝙾*');
  }
};
handler.tags = ['sticker', 'search'];
handler.command = ['stickersearch', 'searchsticker', 'stickerssearch', 'searchstickers'];
export default handler;*/
