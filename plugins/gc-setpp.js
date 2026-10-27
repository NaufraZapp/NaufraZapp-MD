// Baileys 7 + jimp 1.x: cambia la foto del grupo en tamaño completo
import {Jimp, JimpMime} from 'jimp';

async function prepararImagen(buffer) {
  const img = await Jimp.read(buffer);
  if (img.width > img.height) img.resize({w: 720});
  else img.resize({h: 720});
  return {img: await img.getBuffer(JimpMime.jpeg)};
}

const handler = async (m, {conn}) => {
  try {
    const chat = m.chat;
    const q = m.quoted ? m.quoted : m;
    if (!m.quoted) throw '*⚠️️ Responde a una imagen.*';
    const media = await q.download();
    const {img} = await prepararImagen(media);
    await conn.query({tag: 'iq', attrs: {to: chat, type: 'set', xmlns: 'w:profile:picture'}, content: [{tag: 'picture', attrs: {type: 'image'}, content: img}]});
    m.reply('⚘ *_Imagen actualizada con éxito._*');
  } catch {
    throw '*⚠️️ Responde a una imagen.*';
  }
};
handler.help = ['setppgrup'];
handler.tags = ['group', 'adm'];
handler.alias = ['setppgc', 'setppgrup', 'setppgroup'];
handler.command = /^setpp(gc|grup|group)$/i;
handler.group = handler.admin = handler.botAdmin = true;
export default handler;
