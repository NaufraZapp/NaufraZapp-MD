import {enviarArchivoNaufra} from '../lib/naufra-api.js';
import fg from 'api-dylux';
import fetch from 'node-fetch';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {savefrom, facebookdl, facebookdlv2} = await import('@bochilteam/scraper').catch(() => ({}));
import fbDownloader from 'fb-downloader-scrapper';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {facebook} = await import('@xct007/frieren-scraper').catch(() => ({}));
import axios from 'axios';
const handler = async (m, {conn, args, command, usedPrefix}) => {
  if (!args[0]) throw `> ⓘ 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙞𝙣𝙜𝙧𝙚𝙨𝙚 𝙪𝙣 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙫𝙖𝙡𝙞𝙙𝙤, 𝙥𝙤𝙧 𝙚𝙟𝙚𝙢𝙥𝙡𝙤:\n> *${usedPrefix + command}* https://fb.watch/fOTpgn6UFQ/`;
  if (!args[0].match(/www.facebook.com|fb.watch/g)) throw `> ⓘ 𝙋𝙖𝙧𝙖 𝙚𝙨𝙩𝙚 𝙪𝙨𝙤 𝙙𝙚 𝙘𝙤𝙢𝙖𝙣𝙙𝙤, 𝙩𝙞𝙚𝙣𝙚𝙨 𝙦𝙪𝙚 𝙞𝙣𝙜𝙧𝙚𝙨𝙖𝙧 𝙪𝙣 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙫𝙖𝙡𝙞𝙙𝙤, 𝙥𝙤𝙧 𝙚𝙟𝙚𝙢𝙥𝙡𝙤:\n> *${usedPrefix + command}* https://fb.watch/fOTpgn6UFQ/`;
  try {
    await m.reply(`> ⬇️ 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙣𝙙𝙤 𝙫𝙞𝙙𝙚𝙤 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠, 𝙚𝙨𝙥𝙚𝙧𝙚 𝙪𝙣𝙤𝙨 𝙢𝙞𝙣𝙪𝙩𝙤𝙨...`);
    // API Naufra primero; si falla, sigue con los métodos de siempre
    if (await enviarArchivoNaufra(conn, m, 'fbvideo', {url: args[0]}, {caption: `> ⓘ 𝘼𝙦𝙪𝙞 𝙩𝙞𝙚𝙣𝙚𝙨 𝙩𝙪 𝙫𝙞𝙙𝙚𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠.`})) return;
    const d2ata = await facebook.v1(args[0]);
    let r2es = '';
    if (d2ata.urls && d2ata.urls.length > 0) {
      r2es = `${d2ata.urls[0]?.hd || d2ata.urls[1]?.sd || ''}`;
    }
    conn.sendFile(m.chat, r2es, 'error.mp4', `> ⓘ 𝘼𝙦𝙪𝙞 𝙩𝙞𝙚𝙣𝙚𝙨 𝙩𝙪 𝙫𝙞𝙙𝙚𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠.`, m);
  } catch (err1) {
    try {
      const req = await igeh(args[0]);
      conn.sendMessage(m.chat, {video: {url: req.url_list}}, m);
    } catch (err1_2) {
      try {
        const Rres = await fetch(`https://api.lolhuman.xyz/api/facebook?apikey=${lolkeysapi}&url=${args[0]}`);
        const Jjson = await Rres.json();
        let VIDEO = Jjson.result[0];
        if (VIDEO == '' || !VIDEO || VIDEO == null) VIDEO = Jjson.result[1];
        conn.sendFile(m.chat, VIDEO, 'error.mp4', `> ⓘ 𝙑𝙞𝙙𝙚𝙤 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤.`, m);
      } catch (err2) {
        try {
          const ress = await fg.fbdl(args[0]);
          const urll = await ress.data[0].url;
          await conn.sendFile(m.chat, urll, 'error.mp4', '> ⓘ 𝙑𝙞𝙙𝙚𝙤 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤.', m);
        } catch (err3) {
          try {
            const res = await fbDownloader(args[0]);
            for (const result of res.download) {
              const ur = result.url;
              await conn.sendFile(m.chat, ur, 'error.mp4', '> ⓘ 𝙑𝙞𝙙𝙚𝙤 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤.', m);
            }
          } catch (err4) {
            try {
              const res3 = await fetch(`https://latam-api.vercel.app/api/facebookdl?apikey=nekosmic&q=${args[0]}`);
              const json = await res3.json();
              const url3 = await json.video;
              await conn.sendFile(m.chat, url3, 'error.mp4', '> ⓘ 𝙑𝙞𝙙𝙚𝙤 𝙙𝙚 𝙛𝙖𝙘𝙚𝙗𝙤𝙤𝙠 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤.', m);
            } catch (err5) {
              try {
                const {result} = await facebookdl(args[0]).catch(async (_) => await facebookdlv2(args[0])).catch(async (_) => await savefrom(args[0]));
                for (const {url, isVideo} of result.reverse()) await conn.sendFile(m.chat, url, `facebook.${!isVideo ? 'bin' : 'mp4'}`, '*Aqui Su Video De Facebook 🚀*', m);
              } catch (err6) {
                throw `> ⓧ 𝙀𝙧𝙧𝙤𝙧 𝙖𝙡 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙫𝙞𝙙𝙚𝙤, 𝙥𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙞𝙣𝙩𝙚𝙣𝙩𝙚 𝙙𝙚 𝙣𝙪𝙚𝙫𝙤.`;
              }
            }
          }
        }
      }
    }
  }
};
handler.command = /^(facebook|fb|facebookdl|fbdl|facebook2|fb2|facebookdl2|fbdl2|facebook3|fb3|facebookdl3|fbdl3|facebook4|fb4|facebookdl4|fbdl4|facebook5|fb5|facebookdl5|fbdl5)$/i;
handler.register = true
export default handler;

async function igeh(url_media) {
  return new Promise(async (resolve, reject)=>{
    const BASE_URL = 'https://instasupersave.com/';
    try {
      const resp = await axios(BASE_URL);
      const cookie = resp.headers['set-cookie']; // get cookie from request
      const session = cookie[0].split(';')[0].replace('XSRF-TOKEN=', '').replace('%3D', '');
      const config = {method: 'post', url: `${BASE_URL}api/convert`, headers: {'origin': 'https://instasupersave.com', 'referer': 'https://instasupersave.com/pt/', 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.52', 'x-xsrf-token': session, 'Content-Type': 'application/json', 'Cookie': `XSRF-TOKEN=${session}; instasupersave_session=${session}`}, data: {url: url_media}};
      axios(config).then(function(response) {
        const ig = [];
        if (Array.isArray(response.data)) {
          response.data.forEach((post) => {
            ig.push(post.sd === undefined ? post.thumb : post.sd.url);
          });
        } else {
          ig.push(response.data.url[0].url);
        }
        resolve({results_number: ig.length, url_list: ig});
      }).catch(function(error) {
        reject(error.message);
      });
    } catch (e) {
      reject(e.message);
    }
  });
}