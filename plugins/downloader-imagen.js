import {naufraArchivo} from '../lib/naufra-api.js';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {googleImage} = await import('@bochilteam/scraper').catch(() => ({}));
const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `> ⓘ *USO ERRONEO, POR FAVOR, INGRESE EL COMANDO DE LA SIGUIENTE MANERA: ${usedPrefix + command} oso*`;
  // API Naufra primero; si falla, sigue con los métodos de siempre
  try {
    const {buffer, tipo} = await naufraArchivo('pinterest-search', {q: text, t: Date.now()});
    if (tipo.startsWith('image/')) return conn.sendFile(m.chat, buffer, 'error.jpg', `> *RESULTADO: ${text}*`, m);
  } catch (e) {
    console.log('[API Naufra] imagen falló, se usa el método anterior:', e?.message || e);
  }
  const res = await googleImage(text);
  const image = await res.getRandom();
  const link = image;
  conn.sendFile(m.chat, link, 'error.jpg', `> *RESULTADO: ${text}*`, m);
};
handler.help = ['gimage <query>', 'imagen <query>'];
handler.tags = ['internet', 'tools'];
handler.command = /^(gimage|image|imagen)$/i;
handler.register = true
export default handler;
