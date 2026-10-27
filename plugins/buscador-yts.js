import {ytBuscar} from '../lib/naufra-api.js';
import yts from 'yt-search';
import fs from 'fs';

const handler = async (m, {conn, text}) => {
  if (!text) throw '> 👑 *_Ingrese lo que quiera buscar en YouTube_*';
  // API Naufra primero; si falla, sigue con los métodos de siempre
  try {
    const lista = await ytBuscar(text);
    if (lista.length) {
      const teksN = lista.map((v) => `
> \`Titulo/Nombre:\`
> *_${v.title}_*

> \`Enlace:\`
> *${v.url}*

> \`Duración:\`
> *${v.duration}*

> \`Vistas\`
> *${v.views}*`).join('\n\n◊╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌◊\n\n');
      return conn.sendFile(m.chat, lista[0].image, 'yts.jpeg', teksN, m);
    }
  } catch (e) {
    console.log('[API Naufra] ytsearch falló, se usa el método anterior:', e?.message || e);
  }
  const results = await yts(text);
  const tes = results.all;
  const teks = results.all.map((v) => {
    switch (v.type) {
      case 'video': return `
> \`Titulo/Nombre:\`
> *_${v.title}_*

> \`Enlace:\`
> *${v.url}*

> \`Duración:\`
> *${v.timestamp}*

> \`Vistas\`
> *${v.views}*`;
    }
  }).filter((v) => v).join('\n\n◊╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌◊\n\n');
  conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, m);
};
handler.help = ['ytsearch *<texto>*'];
handler.tags = ['search'];
handler.command = ['ytsearch', 'yts'];
export default handler;
