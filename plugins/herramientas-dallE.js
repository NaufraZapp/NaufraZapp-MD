import {naufraArchivo} from '../lib/naufra-api.js';
import fetch from 'node-fetch';
const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `> ⓘ 𝙄𝙣𝙜𝙧𝙚𝙨𝙚 𝙪𝙣 𝙩𝙚𝙭𝙩𝙤 𝙥𝙖𝙧𝙖 𝙘𝙧𝙚𝙖𝙧 𝙪𝙣𝙖 𝙞𝙢𝙖𝙜𝙚𝙣, 𝙥𝙤𝙧 𝙚𝙟𝙚𝙢𝙥𝙡𝙤:\n\n> *${usedPrefix + command} Estrellas en el universo con brillos coloridos.`;
await conn.sendMessage(m.chat, {text: '🖼️ \`CREANDO IMAGEN...\`\n> Espere un momento...'}, {quoted: m});
// API Naufra primero (/api/imagine); si falla, sigue con el método de siempre
try {
const {buffer} = await naufraArchivo('api/imagine', {prompt: text});
return await conn.sendMessage(m.chat, {image: buffer}, {quoted: m});
} catch (e) {
console.log('[API Naufra] imagine falló, se usa el método anterior:', e?.message || e);
}
try {
const tiores4 = await conn.getFile(`https://api.lolhuman.xyz/api/dall-e?apikey=${lolkeysapi}&text=${text}`);
await conn.sendMessage(m.chat, {image: {url: tiores4.data}}, {quoted: m});
} catch {
throw `> ⓘ 𝙃𝙪𝙗𝙤 𝙪𝙣 𝙚𝙧𝙧𝙤𝙧, 𝙧𝙚𝙥𝙤𝙧𝙩𝙚 𝙚𝙨𝙩𝙚 𝙘𝙤𝙢𝙖𝙣𝙙𝙤 𝙘𝙤𝙣: \`#reporte\`.`;
}}
handler.command = ['dall-e', 'dalle', 'naufraimg', 'cimg', 'imgnaufra', 'a-img', 'aimg', 'imagine'];
export default handler;
