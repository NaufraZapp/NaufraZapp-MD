import {enviarYoutubeNaufra} from '../lib/naufra-api.js';
// Carga opcional: si la librería no está instalada o falla, el comando igual carga
const {youtubedl, youtubedlv2} = await import('@bochilteam/scraper').catch(() => ({}));
import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios'
import {bestFormat, getUrlDl} from '../lib/y2dl.js';
const handler = async (m, {text, conn, args, usedPrefix, command}) => {
  if (!args[0]) throw '> ⓘ 𝙄𝙣𝙜𝙧𝙚𝙨𝙚 𝙪𝙣 𝙘𝙤𝙢𝙖𝙣𝙙𝙤 𝙫𝙖𝙡𝙞𝙙𝙤 𝙙𝙚 𝙔𝙤𝙪𝙏𝙪𝙗𝙚.';  
  let enviando;
  if (enviando) return  
      enviando = true      
  let youtubeLink = '';
  if (args[0].includes('you')) {
    youtubeLink = args[0];
  } else {
    const index = parseInt(args[0]) - 1;
    if (index >= 0) {
      if (Array.isArray(global.videoList) && global.videoList.length > 0) {
        const matchingItem = global.videoList.find((item) => item.from === m.sender);
        if (matchingItem) {
          if (index < matchingItem.urls.length) {
            youtubeLink = matchingItem.urls[index];
          } else {
            throw `> ⓘ 𝙉𝙤 𝙨𝙚 𝙥𝙪𝙙𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙖𝙪𝙙𝙞𝙤 𝙘𝙤𝙣 𝙚𝙨𝙚 𝙣𝙪𝙢𝙚𝙧𝙤, 𝙫𝙚𝙧𝙞𝙛𝙞𝙦𝙪𝙚 𝙤 𝙚𝙡𝙞𝙟𝙖 𝙚𝙡 𝙣𝙪𝙢𝙚𝙧𝙤 𝙙𝙚𝙡 1 𝙖𝙡: ${matchingItem.urls.length}`;
          }
        } else {
          throw `> ⓘ 𝙋𝙖𝙧𝙖 𝙪𝙨𝙖𝙧 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚 𝙚𝙡 𝙘𝙤𝙢𝙖𝙣𝙙𝙤, 𝙪𝙨𝙚 𝙚𝙨𝙩𝙚 𝙚𝙟𝙚𝙢𝙥𝙡𝙤:\n> ${usedPrefix + command} 4\n> 𝙋𝙖𝙧𝙖 𝙗𝙪𝙨𝙘𝙖𝙧 𝙖𝙪𝙙𝙞𝙤𝙨 𝙮 𝙚𝙡𝙚𝙜𝙞𝙧 𝙡𝙤𝙨 𝙣𝙪𝙢𝙚𝙧𝙤𝙨, 𝙥𝙪𝙚𝙙𝙚𝙨 𝙧𝙚𝙖𝙡𝙞𝙯𝙖𝙧 𝙡𝙖 𝙗𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙘𝙤𝙣 𝙚𝙡 𝙘𝙤𝙢𝙖𝙣𝙙𝙤: \`${usedPrefix}playlist\``;
        }
      } else {
        throw `> ⓘ 𝙋𝙖𝙧𝙖 𝙪𝙨𝙖𝙧 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚 𝙚𝙡 𝙘𝙤𝙢𝙖𝙣𝙙𝙤, 𝙪𝙨𝙚 𝙚𝙨𝙩𝙚 𝙚𝙟𝙚𝙢𝙥𝙡𝙤:\n> ${usedPrefix + command} 4\n> 𝙋𝙖𝙧𝙖 𝙗𝙪𝙨𝙘𝙖𝙧 𝙖𝙪𝙙𝙞𝙤𝙨 𝙮 𝙚𝙡𝙚𝙜𝙞𝙧 𝙡𝙤𝙨 𝙣𝙪𝙢𝙚𝙧𝙤𝙨, 𝙥𝙪𝙚𝙙𝙚𝙨 𝙧𝙚𝙖𝙡𝙞𝙯𝙖𝙧 𝙡𝙖 𝙗𝙪𝙨𝙦𝙪𝙚𝙙𝙖 𝙘𝙤𝙣 𝙚𝙡 𝙘𝙤𝙢𝙖𝙣𝙙𝙤: \`${usedPrefix}playlist\``;
      }
    }
  }
  const { key } = await conn.sendMessage(m.chat, {text: `> ✅ 𝙎𝙚 𝙚𝙨𝙩𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙣𝙙𝙤 𝙨𝙪 𝙖𝙪𝙙𝙞𝙤, 𝙚𝙨𝙥𝙚𝙧𝙚 𝙪𝙣𝙤𝙨 𝙢𝙞𝙣𝙪𝙩𝙤𝙨...\n\n> ⓘ 𝙎𝙞 𝙣𝙤 𝙨𝙚 𝙚𝙣𝙫𝙞𝙖, 𝙞𝙣𝙩𝙚𝙣𝙩𝙚 𝙪𝙨𝙖𝙧 𝙤𝙩𝙧𝙤𝙨 𝙢𝙚𝙩𝙤𝙙𝙤𝙨 𝙙𝙚 𝙖𝙪𝙙𝙞𝙤...`}, {quoted: m});
  // API Naufra primero; si falla, sigue con los métodos de siempre
  if (await enviarYoutubeNaufra(conn, m, youtubeLink, 'audio')) return;
  try {
    const formats = await bestFormat(youtubeLink, 'audio');
    const dl_url = await getUrlDl(formats.url);
    const buff = await getBuffer(dl_url.download);    
    const yt_1 = await youtubedl(youtubeLink).catch(async (_) => await youtubedlv2(youtubeLink));
    const ttl_1 = `${yt_1?.title ? yt_1.title : 'Tu_audio_descargado'}`;
    const fileSizeInBytes = buff.byteLength;
    const fileSizeInKB = fileSizeInBytes / 1024;
    const fileSizeInMB = fileSizeInKB / 1024;
    const roundedFileSizeInMB = fileSizeInMB.toFixed(2);
   if (fileSizeInMB > 50) {
    await conn.sendMessage(m.chat, {document: buff, caption: `> ✦ 𝙏𝙄𝙏𝙐𝙇𝙊/𝙉𝙊𝙈𝘽𝙍𝙀:\n${ttl_1}\n\n> ✦ 𝙋𝙀𝙎𝙊 𝙏𝙊𝙏𝘼𝙇:\n> *${roundedFileSizeInMB}MB*\n\n> NaufraZapp-MD • ${vs}`, fileName: ttl_1 + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
    await conn.sendMessage(m.chat, {text: `> ✅ 𝙎𝙚 𝙝𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙨𝙪 𝙖𝙪𝙙𝙞𝙤 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚.\n\n> ⓘ 𝙎𝙚 𝙚𝙣𝙫𝙞𝙤 𝙚𝙡 𝙖𝙪𝙙𝙞𝙤 𝙚𝙣 𝙛𝙤𝙧𝙢𝙖𝙩𝙤 𝙙𝙚 𝙙𝙤𝙘𝙪𝙢𝙚𝙣𝙩𝙤, 𝙮𝙖 𝙦𝙪𝙚 𝙥𝙚𝙨𝙖: \`${roundedFileSizeInMB}MB\`\n\n> ⓘ 𝙉𝙊𝙈𝘽𝙍𝙀/𝙏𝙄𝙏𝙐𝙇𝙊:\n${ttl_1}`, edit: key}, {quoted: m});
    enviando = false
   } else {
    await conn.sendMessage(m.chat, {audio: buff, caption: `> ✦ 𝙏𝙄𝙏𝙐𝙇𝙊/𝙉𝙊𝙈𝘽𝙍𝙀:\n${ttl_1}\n\n> ✦ 𝙋𝙀𝙎𝙊 𝙏𝙊𝙏𝘼𝙇:\n> *${roundedFileSizeInMB}MB*\n\n> NaufraZapp-MD • ${vs}`, fileName: ttl_1 + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
    await conn.sendMessage(m.chat, {text: `> ✅ 𝙎𝙚 𝙝𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙨𝙪 𝙖𝙪𝙙𝙞𝙤 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚.`, edit: key}, {quoted: m});
    enviando = false   
   }    
  } catch {
    console.log('noooooo')
  try {
    const q = '128kbps';
    const v = youtubeLink;
    const yt = await youtubedl(v).catch(async (_) => await youtubedlv2(v));
    const dl_url = await yt.audio[q].download();
    const ttl = await yt.title;
    const size = await yt.audio[q].fileSizeH;
    await conn.sendFile(m.chat, dl_url, ttl + '.mp3', null, m, false, {mimetype: 'audio/mpeg'});
    await conn.sendMessage(m.chat, {text: '> ✅ 𝙎𝙚 𝙝𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙨𝙪 𝙖𝙪𝙙𝙞𝙤 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚.', edit: key}, {quoted: m});
  } catch {
    try {
      const lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkeysapi}&url=${youtubeLink}`);
      const lolh = await lolhuman.json();
      const n = lolh.result.title || 'error';
      await conn.sendMessage(m.chat, {audio: {url: lolh.result.link}, fileName: `${n}.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
      await conn.sendMessage(m.chat, {text: '> ✅ 𝙎𝙚 𝙝𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙨𝙪 𝙖𝙪𝙙𝙞𝙤 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚.', edit: key}, {quoted: m});
    } catch {
      try {
        const searchh = await yts(youtubeLink);
        const __res = searchh.all.map((v) => v).filter((v) => v.type == 'video');
        const infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId);
        const ress = await ytdl.chooseFormat(infoo.formats, {filter: 'audioonly'});
        conn.sendMessage(m.chat, {audio: {url: ress.url}, fileName: __res[0].title + '.mp3', mimetype: 'audio/mpeg'}, {quoted: m});
        await conn.sendMessage(m.chat, {text: '> ✅ 𝙎𝙚 𝙝𝙖 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙙𝙤 𝙨𝙪 𝙖𝙪𝙙𝙞𝙤 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚.', edit: key}, {quoted: m});
      } catch {
        await conn.sendMessage(m.chat, {text: `> ⓘ 𝙉𝙤 𝙨𝙚 𝙥𝙪𝙙𝙤 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙖𝙪𝙙𝙞𝙤, 𝙞𝙣𝙩𝙚𝙣𝙩𝙚 𝙙𝙚 𝙣𝙪𝙚𝙫𝙤 𝙥𝙤𝙧 𝙛𝙖𝙫𝙤𝙧...`, edit: key}, {quoted: m});
        throw '> ⓘ 𝙀𝙧𝙧𝙤𝙧 𝙖𝙡 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙖𝙪𝙙𝙞𝙤, 𝙥𝙤𝙧 𝙛𝙖𝙫𝙤𝙧 𝙞𝙣𝙩𝙚𝙣𝙩𝙚 𝙙𝙚 𝙣𝙪𝙚𝙫𝙤...';
      }
    }
  }
}};
handler.command = /^(audio|fgmp3|dlmp3|getaud)$/i;
export default handler

const getBuffer = async (url, options) => {
  try {
    options ? options : {};
    const res = await axios({
      method: 'get',
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1,
      },
      ...options,
      responseType: 'arraybuffer',
    });

    return res.data;
  } catch (e) {
    console.log(`Error : ${e}`);
  }
};
