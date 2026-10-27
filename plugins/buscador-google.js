import {googleBuscar} from '../lib/naufra-api.js';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {googleIt} = await import('@bochilteam/scraper').catch(() => ({}));
import google from 'google-it';
import axios from 'axios';
let handler = async (m, { conn, command, args, usedPrefix }) => {
  const fetch = (await import('node-fetch')).default;
  const text = args.join` `;
  if (!text) return conn.reply(m.chat, '> ⓘ Ingrese el tema que quiere buscar en google.', m);
const url = 'https://google.com/search?q=' + encodeURIComponent(text);
google({'query': text}).then(res => {
let teks = `> ✅ *RESULTADOS: _${text}_*\n\n${url}\n\n`
for (let g of res) {
teks += `_*${g.title}*_\n_${g.link}_\n_${g.snippet}_\n\n`
} 
const ss = `https://image.thum.io/get/fullpage/${url}`
conn.sendFile(m.chat, ss, 'error.png', teks, m)
//m.reply(teks)
})
} 
handler.help = ['google', 'googlef'].map((v) => v + ' <pencarian>');
handler.tags = ['internet'];
handler.command = /^googlef?$/i;
export default handler;

/*import {googleIt} from '@bochilteam/scraper';
import axios from 'axios';
const handler = async (m, {conn, command, args}) => {
  const fetch = (await import('node-fetch')).default;
  const text = args.join` `;
  if (!text) return conn.reply(m.chat, 'ⓘ *Ingrese el tema que quiere buscar en google.*', m);
  const url = 'https://google.com/search?q=' + encodeURIComponent(text);
  // API Naufra primero; si falla, sigue con los métodos de siempre
  try {
    const r = await googleBuscar(text);
    if (r?.titulo || r?.descripcion) {
      const msgN = `*${r.titulo || text}*\n_${r.enlace || url}_\n_${r.descripcion || ''}_`;
      try {
        const ss = `https://image.thum.io/get/fullpage/${r.enlace || url}`;
        await conn.sendFile(m.chat, ss, 'error.png', (r.enlace || url) + '\n\n' + msgN, m);
      } catch {
        m.reply(msgN);
      }
      return;
    }
  } catch (e) {
    console.log('[API Naufra] google falló, se usa el método anterior:', e?.message || e);
  }
  const search = await googleIt(text);
  const msg = search.articles.map(({title, url, description}) => {
    return `*${title}*\n_${url}_\n_${description}_`;
  }).join('\n\n');
  try {
    const ss = `https://image.thum.io/get/fullpage/${url}`;
    await conn.sendFile(m.chat, ss, 'error.png', url + '\n\n' + msg, m);
  } catch {
    m.reply(msg);
  }
};
handler.help = ['google', 'googlef'].map((v) => v + ' <pencarian>');
handler.tags = ['internet'];
handler.command = /^googlef?$/i;
export default handler;

 let ss2 = await ssweb(url, 'desktop')
let dataa = ss2.result
async function ssweb(url, device = 'desktop'){
return new Promise((resolve, reject) => {
const base = 'https://www.screenshotmachine.com'
const param = { url: url, device: device, cacheLimit: 0 }
axios({url: base + '/capture.php', method: 'POST', data: new URLSearchParams(Object.entries(param)), headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }}).then((data) => {
const cookies = data.headers['set-cookie']
if (data.data.status == 'success') {
axios.get(base + '/' + data.data.link, { headers: { 'cookie': cookies.join('') }, responseType: 'arraybuffer' }).then(({ data }) => {
let result = { status: 200, author: '@BrunoSobrino', result: data }
resolve(result)})
} else {
reject({ status: 404, author: 'Ryzn', message: data.data })}}).catch(reject)})}*/
