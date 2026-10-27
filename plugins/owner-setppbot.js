// Baileys 7 + jimp 1.x: cambia la foto de perfil del bot en tamaño completo
import {Jimp, JimpMime} from 'jimp';

async function prepararImagen(buffer) {
  const img = await Jimp.read(buffer);
  if (img.width > img.height) img.resize({w: 720});
  else img.resize({h: 720});
  return {img: await img.getBuffer(JimpMime.jpeg)};
}

const handler = async (m, {conn, usedPrefix, command}) => {
  const error = '*🙀 𝘕𝘰 𝘚𝘦 𝘌𝘯𝘤𝘰𝘯𝘵𝘳𝘰́ 𝘕𝘪𝘯𝘨𝘶𝘯𝘢 𝘐𝘮𝘢𝘨𝘦𝘯, 𝘗𝘰𝘳 𝘍𝘢𝘷𝘰𝘳 𝘙𝘦𝘴𝘱𝘰𝘯𝘥𝘦 𝘈 𝘜𝘯𝘢 𝘐𝘮𝘢𝘨𝘦𝘯 𝘜𝘴𝘢𝘯𝘥𝘰 𝘌𝘭 𝘊𝘰𝘮𝘢𝘯𝘥𝘰 ' + (usedPrefix + command) + '*';
  try {
    const bot = conn.user.jid;
    const q = m.quoted ? m.quoted : m;
    if (!m.quoted) throw error;
    const media = await q.download();
    const {img} = await prepararImagen(media);
    await conn.query({tag: 'iq', attrs: {to: bot, type: 'set', xmlns: 'w:profile:picture'}, content: [{tag: 'picture', attrs: {type: 'image'}, content: img}]});
    m.reply('*🫶😻 𝘚𝘦 𝘊𝘢𝘮𝘣𝘪𝘰 𝘊𝘰𝘯 𝘌𝘹𝘪𝘵𝘰 𝘓𝘢 𝘍𝘰𝘵𝘰 𝘋𝘦 𝘗𝘦𝘳𝘧𝘪𝘭 𝘋𝘦𝘭 𝘕𝘶𝘮𝘦𝘳𝘰 𝘋𝘦𝘭 𝘉𝘰𝘵*');
  } catch {
    throw error;
  }
};
handler.command = /^setppbot$/i;
handler.rowner = true;
export default handler;
