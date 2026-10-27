import {naufraArchivo} from '../lib/naufra-api.js';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {pinterest} = await import('@bochilteam/scraper').catch(() => ({}));
const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `> ⓘ 𝙄𝙣𝙜𝙧𝙚𝙨𝙚 𝙪𝙣 𝙩𝙚𝙭𝙩𝙤 𝙥𝙖𝙧𝙖 𝙗𝙪𝙨𝙘𝙖𝙧 𝙡𝙖 𝙞𝙢𝙖𝙜𝙚𝙣, 𝙥𝙤𝙧 𝙚𝙟𝙚𝙢𝙥𝙡𝙤: *${usedPrefix + command} Minecraft*`;
  // API Naufra primero; si falla, sigue con los métodos de siempre
  try {
    const {buffer, tipo} = await naufraArchivo('pinterest-search', {q: text, t: Date.now()});
    if (tipo.startsWith('image/')) {
      return conn.sendFile(m.chat, buffer, 'error.jpg', `
> ⓘ 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨 𝙙𝙚 𝙩𝙪 𝙗𝙪𝙨𝙦𝙪𝙚𝙙𝙖
> \`${text}\`
`.trim(), m);
    }
  } catch (e) {
    console.log('[API Naufra] pinterest falló, se usa el método anterior:', e?.message || e);
  }
  const json = await pinterest(text);
  conn.sendFile(m.chat, json.getRandom(), 'error.jpg', `
> ⓘ 𝙍𝙚𝙨𝙪𝙡𝙩𝙖𝙙𝙤𝙨 𝙙𝙚 𝙩𝙪 𝙗𝙪𝙨𝙦𝙪𝙚𝙙𝙖
> \`${text}\`
`.trim(), m);
};
handler.help = ['pinterest <keyword>'];
handler.tags = ['internet'];
handler.command = /^(pinterest)$/i;
export default handler;
