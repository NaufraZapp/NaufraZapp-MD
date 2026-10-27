import * as cheerio from 'cheerio';
import axios from 'axios';
const handler = async (m, {conn, text, __dirname, usedPrefix, command}) => {
  if (!global.db.data.chats[m.chat].modohorny && m.isGroup) throw '*😻𝐶𝑜𝑚𝑎𝑛𝑑𝑜 𝐷𝑒𝑠𝑎𝑐𝑡𝑖𝑣𝑎𝑑𝑜, 𝑆𝑖 𝐸𝑟𝑒𝑠 𝐴𝑑𝑚𝑖𝑛 𝑈𝑠𝑎: !enable modohorny*';
  if (!text) throw '*🍓 𝑁𝑎𝑚𝑒!*';
  const searchResults = await searchHentai(text);
  let teks = searchResults.result.map((v, i) => `
┄┄┄┄┄┄┄┄┄┄┄┄
${i+1}.
• *_${v.title}_*
┄┄┄┄┄┄┄┄┄┄┄┄
𖥨ํ∘̥⃟⸽⃟👀➤*_Vistas:_*
• ${v.views}
┄┄┄┄┄┄┄┄┄┄┄┄
𖥨ํ∘̥⃟⸽⃟⬇️➤ *_Link:_*
• ${v.url}
┄┄┄┄┄┄┄┄┄┄┄┄`).join('\n\n');
  let randomThumbnail;
  if (searchResults.result.length > 0) {
    const randomIndex = Math.floor(Math.random() * searchResults.result.length);
    randomThumbnail = searchResults.result[randomIndex].thumbnail;
  } else {
    randomThumbnail = 'https://pictures.hentai-foundry.com/e/Error-Dot/577798/Error-Dot-577798-Zero_Two.png';
    teks = '> 👑 *NO HAY RESULTADOS...*';
  }
  conn.sendFile(m.chat, randomThumbnail, 'error.jpg', teks, m);
};
handler.command = /^(hentaisearch|searchhentai)$/i;
export default handler;
async function searchHentai(search) {
  return new Promise((resolve, reject) => {
    axios.get('https://hentai.tv/?s=' + search).then(async ({data}) => {
      const $ = cheerio.load(data);
      const result = {};
      const res = [];
      result.coder = 'rem-comp';
      result.result = res;
      result.warning = 'It is strictly forbidden to reupload this code, copyright © 2022 by rem-comp';
      $('div.flex > div.crsl-slde').each(function(a, b) {
        const _thumbnail = $(b).find('img').attr('src');
        const _title = $(b).find('a').text().trim();
        const _views = $(b).find('p').text().trim();
        const _url = $(b).find('a').attr('href');
        const hasil = {thumbnail: _thumbnail, title: _title, views: _views, url: _url};
        res.push(hasil);
      });
      resolve(result);
    }).catch((err) => {
      console.log(err);
    });
  });
}
