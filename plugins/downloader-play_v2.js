import {enviarYoutubeNaufra} from '../lib/naufra-api.js';
import fetch from 'node-fetch';
let data;
let buff;
let mimeType;
let fileName;
let apiUrl;
let enviando = false;
const handler = async (m, { command, usedPrefix, conn, text }) => {
  if (!text) throw `> ⓘ 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙞𝙣𝙜𝙧𝙚𝙨𝙚 𝙚𝙡 𝙩𝙞𝙩𝙪𝙡𝙤 𝙙𝙚 𝙡𝙖 𝙢𝙪𝙨𝙞𝙘𝙖 𝙤 𝙫𝙞𝙙𝙚𝙤 𝙦𝙪𝙚 𝙚𝙨𝙩𝙚 𝙗𝙪𝙨𝙘𝙖𝙣𝙙𝙤...`;
if (enviando) return;
    enviando = true
  // API Naufra primero; si falla, sigue con los métodos de siempre
  if (await enviarYoutubeNaufra(conn, m, text, command === 'play.2' ? 'video' : 'audio')) {
    enviando = false;
    return;
  }
  try {
    const apiUrls = [
      `https://api-brunosobrino.zipponodes.xyz/api/ytplay?text=${text}`,
      `https://api-brunosobrino.onrender.com/api/ytplay?text=${text}`
    ];

    for (const url of apiUrls) {
      try {
        const res = await fetch(url);
        data = await res.json();
        if (data.resultado && data.resultado.url) {
          break;
        }
      } catch {}
    }

    if (!data.resultado || !data.resultado.url) {
      enviando = false;
      throw `> ⓘ 𝙉𝙤 𝙛𝙪𝙚 𝙥𝙤𝙨𝙞𝙗𝙡𝙚 𝙤𝙗𝙩𝙚𝙣𝙚𝙧 𝙚𝙡 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚𝙡 𝙘𝙤𝙣𝙩𝙚𝙣𝙞𝙙𝙤...`;
    } else {
      try {
        if (command === 'play.1') {
              apiUrl = `https://api-brunosobrino.zipponodes.xyz/api/v1/ytmp3?url=${data.resultado.url}`;
              mimeType = 'audio/mpeg';
              fileName = 'error.mp3';
              buff = await conn.getFile(apiUrl);
            } else if (command === 'play.2') {
              apiUrl = `https://api-brunosobrino.zipponodes.xyz/api/v1/ytmp4?url=${data.resultado.url}`;
              mimeType = 'video/mp4';
              fileName = 'error.mp4';
              buff = await conn.getFile(apiUrl);
        }
      } catch {
          try {
            if (command === 'play.1') {
              apiUrl = `https://api-brunosobrino.onrender.com/api/v1/ytmp3?url=${data.resultado.url}`;
              mimeType = 'audio/mpeg';
              fileName = 'error.mp3';
              buff = await conn.getFile(apiUrl);
            } else if (command === 'play.2') {
              apiUrl = `https://api-brunosobrino.onrender.com/api/v1/ytmp4?url=${data.resultado.url}`;
              mimeType = 'video/mp4';
              fileName = 'error.mp4';
              buff = await conn.getFile(apiUrl);
            }
          } catch {
            enviando = false;
            throw `> ⓘ 𝙊𝙘𝙪𝙧𝙧𝙞𝙤 𝙪𝙣 𝙚𝙧𝙧𝙤𝙧 𝙖𝙡 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙘𝙤𝙣𝙩𝙚𝙣𝙞𝙙𝙤, 𝙚𝙨𝙩𝙤 𝙨𝙚 𝙙𝙚𝙗𝙚 𝙖 𝙦𝙪𝙚 𝙩𝙖𝙡 𝙫𝙚𝙯 𝙚𝙡 𝙘𝙤𝙣𝙩𝙚𝙣𝙞𝙙𝙤 𝙥𝙚𝙨𝙚 𝙢𝙪𝙘𝙝𝙤.`;
          }
       }
    }

    const dataMessage = `> ⓘ 𝙏𝙄𝙏𝙐𝙇𝙊/𝙉𝙊𝙈𝘽𝙍𝙀:\n${data.resultado.title}\n\n> ⓘ 𝘾𝘼𝙉𝘼𝙇:\n${data.resultado.channel}\n\n> ⓘ 𝙀𝙉𝙇𝘼𝘾𝙀/𝙐𝙍𝙇:\n${data.resultado.url}\n\n> ⓘ 𝙋𝙐𝘽𝙇𝙄𝘾𝘼𝘿𝙊 𝙀𝙉:\n${data.resultado.publicDate}`;
    await conn.sendMessage(m.chat, { text: dataMessage }, { quoted: m });

    if (buff) {
      await conn.sendMessage(m.chat, {[mimeType.startsWith('audio') ? 'audio' : 'video']: buff.data, mimetype: mimeType, fileName: fileName}, {quoted: m});
      enviando = false;
    } else {
      enviando = false;
      throw `> ⓘ 𝙊𝙘𝙪𝙧𝙧𝙞𝙤 𝙪𝙣 𝙚𝙧𝙧𝙤𝙧 𝙖𝙡 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙚𝙡 𝙘𝙤𝙣𝙩𝙚𝙣𝙞𝙙𝙤, 𝙚𝙨𝙩𝙤 𝙨𝙚 𝙙𝙚𝙗𝙚 𝙖 𝙦𝙪𝙚 𝙩𝙖𝙡 𝙫𝙚𝙯 𝙚𝙡 𝙘𝙤𝙣𝙩𝙚𝙣𝙞𝙙𝙤 𝙥𝙚𝙨𝙚 𝙢𝙪𝙘𝙝𝙤.`;
    }
  } catch (error) {
    enviando = false;
    throw `> ⓘ 𝙀𝙧𝙧𝙤𝙧 𝙚𝙣 𝙚𝙡 𝙘𝙤𝙣𝙩𝙚𝙣𝙞𝙙𝙤: ${error.message || 'Ocurrió un error inesperado'}.*`;
  }
};
handler.help = ['play.1', 'play.2'].map((v) => v + ' <texto>');
handler.tags = ['downloader'];
handler.command = ['play.1', 'play.2'];
export default handler;


/*import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
const handler = async (m, {command, usedPrefix, conn, text}) => {
  if (!text) throw `*[❗𝐈𝐍𝐅𝐎❗] 𝙽𝙾𝙼𝙱𝚁𝙴 𝙳𝙴 𝙻𝙰 𝙲𝙰𝙽𝙲𝙸𝙾𝙽 𝙵𝙰𝙻𝚃𝙰𝙽𝚃𝙴, 𝙿𝙾𝚁 𝙵𝙰𝚅𝙾𝚁 𝙸𝙽𝙶𝚁𝙴𝚂𝙴 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 𝙼𝙰𝚂 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴/𝚃𝙸𝚃𝚄𝙻𝙾 𝙳𝙴 𝙰𝙻𝙶𝚄𝙽𝙰 𝙲𝙰𝙽𝙲𝙸𝙾𝙽 𝙾 𝚅𝙸𝙳𝙴𝙾 𝙳𝙴 𝚈𝙾𝚄𝚃𝚄𝙱𝙴*\n\n*—◉ 𝙴𝙹𝙴𝙼𝙿𝙻𝙾:*\n*${usedPrefix + command} Good Feeling - Flo Rida*`;
  try {
    if (command == 'play.1') {
      conn.reply(m.chat, `*_⏳Sᴇ ᴇsᴛᴀ ᴘʀᴏᴄᴇsᴀɴᴅᴏ Sᴜ ᴀᴜᴅɪᴏ...⏳_*`, m);
      try {
        const mediaa = await ytPlay(text);
        const audiocore = mediaa.result2?.[0]?.audio || mediaa.result2?.[1]?.audio || mediaa.result2?.[2]?.audio || null;
        const aa = await conn.sendMessage(m.chat, {audio: {url: audiocore}, fileName: `error.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
        if (!aa) {
        throw new Error('*[❗] El primero metodo fallo, intentando otro...*');
       }        
      } catch {
        const res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=${lolkeysapi}&query=${text}`);
        const json = await res.json();
        const aa_1 = await conn.sendMessage(m.chat, {audio: {url: json.result.audio}, fileName: `error.mp3`, mimetype: 'audio/mpeg'}, {quoted: m});
        if (!aa_1) aa_1 = await conn.sendFile(m.chat, json.result.audio, 'error.mp3', null, m, false, {mimetype: 'audio/mpeg'});
      }
    }
    if (command == 'play.2') {
      conn.reply(m.chat, `*_⏳Sᴇ ᴇsᴛᴀ ᴘʀᴏᴄᴇsᴀɴᴅᴏ Sᴜ ᴠɪᴅᴇᴏ...⏳_*`, m);
      try {
        const mediaa = await ytPlayVid(text);
        const aa_2 = await conn.sendMessage(m.chat, {video: {url: mediaa.result}, fileName: `error.mp4`, caption: `_𝐓𝐡𝐞 𝐌𝐲𝐬𝐭𝐢𝐜 - 𝐁𝐨𝐭_`, thumbnail: mediaa.thumb, mimetype: 'video/mp4'}, {quoted: m});
        if (!aa_2) {
        throw new Error('*[❗] El primero metodo fallo, intentando otro...*');
       }
      } catch {
        const res = await fetch(`https://api.lolhuman.xyz/api/ytplay2?apikey=${lolkeysapi}&query=${text}`);
        const json = await res.json();
        await conn.sendFile(m.chat, json.result.video, 'error.mp4', `_𝐓𝐡𝐞 𝐌𝐲𝐬𝐭𝐢𝐜 - 𝐁𝐨𝐭_`, m);
      }
    }
  } catch {
    throw '*[❗𝐈𝐍𝐅𝐎❗] 𝙴𝚁𝚁𝙾𝚁, 𝙿𝙾𝚁 𝙵𝙰𝚅𝙾𝚁 𝚅𝚄𝙴𝙻𝚅𝙰 𝙰 𝙸𝙽𝚃𝙴𝙽𝚃𝙰𝚁𝙻𝙾*';
  }
};
handler.help = ['play.1', 'play.2'].map((v) => v + ' <texto>');
handler.tags = ['downloader'];
handler.command = ['play.1', 'play.2'];
export default handler;

function bytesToSize(bytes) {
  return new Promise((resolve, reject) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0) resolve(`${bytes} ${sizes[i]}`);
    resolve(`${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`);
  });
}

async function ytMp3(url) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      const result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        const item = getUrl.formats[i];
        if (item.mimeType == 'audio/webm; codecs=\"opus\"') {
          const {contentLength} = item;
          const bytes = await bytesToSize(contentLength);
          result[i] = {audio: item.url, size: bytes};
        }
      }
      const resultFix = result.filter((x) => x.audio != undefined && x.size != undefined);
      const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].audio}`);
      const tinyUrl = tiny.data;
      const title = getUrl.videoDetails.title;
      const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({title, result: tinyUrl, result2: resultFix, thumb});
    }).catch(reject);
  });
}

async function ytMp4(url) {
  return new Promise(async (resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      const result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        const item = getUrl.formats[i];
        if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
          const {qualityLabel, contentLength} = item;
          const bytes = await bytesToSize(contentLength);
          result[i] = {video: item.url, quality: qualityLabel, size: bytes};
        }
      }
      const resultFix = result.filter((x) => x.video != undefined && x.size != undefined && x.quality != undefined);
      const tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
      const tinyUrl = tiny.data;
      const title = getUrl.videoDetails.title;
      const thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({title, result: tinyUrl, rersult2: resultFix[0].video, thumb});
    }).catch(reject);
  });
}

async function ytPlay(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      const result = getData.videos.slice( 0, 5 );
      const url = [];
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url);
      }
      const random = url[0];
      const getAudio = await ytMp3(random);
      resolve(getAudio);
    }).catch(reject);
  });
}

async function ytPlayVid(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      const result = getData.videos.slice( 0, 5 );
      const url = [];
      for (let i = 0; i < result.length; i++) {
        url.push(result[i].url);
      }
      const random = url[0];
      const getVideo = await ytMp4(random);
      resolve(getVideo);
    }).catch(reject);
  });
}*/
