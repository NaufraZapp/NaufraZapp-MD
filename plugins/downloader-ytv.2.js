import {enviarYoutubeNaufra} from '../lib/naufra-api.js';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {youtubedl, youtubedlv2} = await import('@bochilteam/scraper').catch(() => ({}));
import fetch from 'node-fetch';
const handler = async (m, {conn, args}) => {
  if (!args[0]) throw '> ⓘ 𝙄𝙣𝙜𝙧𝙚𝙨𝙚 𝙪𝙣 𝙚𝙣𝙡𝙖𝙘𝙚 𝙫𝙖𝙡𝙞𝙙𝙤 𝙙𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 𝙥𝙖𝙧𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙨𝙪 𝙫𝙞𝙙𝙚𝙤.';
  await m.reply(`> ⓘ 𝙎𝙚 𝙚𝙨𝙩𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙣𝙙𝙤 𝙨𝙪 𝙫𝙞𝙙𝙚𝙤.\n\n> ⓘ 𝙎𝙞 𝙨𝙪 𝙫𝙞𝙙𝙚𝙤 𝙣𝙤 𝙨𝙚 𝙚𝙣𝙫𝙞𝙖, 𝙞𝙣𝙩𝙚𝙣𝙩𝙚 𝙘𝙤𝙣 𝙤𝙩𝙧𝙤 𝙢𝙚𝙩𝙤𝙙𝙤.`);
  // API Naufra primero; si falla, sigue con los métodos de siempre
  if (await enviarYoutubeNaufra(conn, m, args[0], 'video', {documento: true})) return;
  try {
    const qu = args[1] || '360';
    const q = qu + 'p';
    const v = args[0];
    const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
    const dl_url = await yt.video[q].download();
    const ttl = await yt.title;
    const size = await yt.video[q].fileSizeH;
    const cap = `> ⓘ 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎 𝘿𝙀 𝙇𝘼 𝘽𝙐𝙎𝙌𝙐𝙀𝘿𝘼:\n\n> ✦ 𝙉𝙊𝙈𝘽𝙍𝙀/𝙏𝙄𝙏𝙐𝙇𝙊:\n> ${ttl}\n\n> ✦ 𝙋𝙀𝙎𝙊 𝙏𝙊𝙏𝘼𝙇:\n> ${size}\n\n> NaufraZapp-MD • ${vs}`.trim();
    await await conn.sendMessage(m.chat, {document: {url: dl_url}, caption: cap, mimetype: 'video/mp4', fileName: ttl + `.mp4`}, {quoted: m});
  } catch {
    try {
      const lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytvideo2?apikey=${lolkeysapi}&url=${args[0]}`);
      const lolh = await lolhuman.json();
      const n = lolh.result.title || 'error';
      const n2 = lolh.result.link;
      const n3 = lolh.result.size;
      const cap2 = `> ⓘ 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊𝙎 𝘿𝙀 𝙇𝘼 𝘽𝙐𝙎𝙌𝙐𝙀𝘿𝘼:\n\n> ✦ 𝙉𝙊𝙈𝘽𝙍𝙀/𝙏𝙄𝙏𝙐𝙇𝙊:\n> ${n}\n\n> ✦ 𝙋𝙀𝙎𝙊 𝙏𝙊𝙏𝘼𝙇:\n> ${n3}\n\n> NaufraZapp-MD • ${vs}`.trim();
      await conn.sendMessage(m.chat, {document: {url: n2}, caption: cap2, mimetype: 'video/mp4', fileName: n + `.mp4`}, {quoted: m});
    } catch {
      await conn.reply(m.chat, '> ⓘ 𝙉𝙤 𝙛𝙪𝙚 𝙥𝙤𝙨𝙞𝙗𝙡𝙚 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙫𝙞𝙙𝙚𝙤, 𝙥𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙞𝙣𝙩𝙚𝙣𝙩𝙚 𝙙𝙚 𝙣𝙪𝙚𝙫𝙤...', m);
    }
  }
};
handler.command = /^ytmp4doc|ytvdoc|ytmp4.2|ytv.2$/i;
export default handler;
