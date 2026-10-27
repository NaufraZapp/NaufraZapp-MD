import fs from 'fs';
import fetch from 'node-fetch';
const handler = async (m, {conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems}) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  try {
    // Imagen del menú al azar entre todas las del bot (Menu.png, Menu2.jpg ... Menu7.png)
    const imagenesMenu = ['./Menu.png', './Menu2.jpg', './Menu3.png', './Menu4.jpg', './Menu5.png', './Menu6.jpg', './Menu7.png'].filter((f) => fs.existsSync(f));
    const pp = imagenesMenu.length ? fs.readFileSync(imagenesMenu[Math.floor(Math.random() * imagenesMenu.length)]) : imagen1;
    // let vn = './media/menu.mp3'
    const img = './Menu2.jpg';
    const d = new Date(new Date + 3600000);
    const locale = 'es-ES';
    const week = d.toLocaleDateString(locale, {weekday: 'long'});
    const date = d.toLocaleDateString(locale, {day: '2-digit', month: '2-digit', year: 'numeric'});
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    const user = global.db.data.users[m.sender];
    const {money, joincount} = global.db.data.users[m.sender];
    const {exp, limit, level, role} = global.db.data.users[m.sender];
    const rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
    const rtotal = Object.entries(global.db.data.users).length || '0'
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
    const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];

 await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })


const document = doc[Math.floor(Math.random() * doc.length)];
 const userHw = global.db.data.users[m.sender] || {};
 const str = `🦇🕸️ 🎃 🕸️🦇 🎃 🦇🕸️ 🎃 🕸️🦇
╔◊ •═════════════════• ◊╗
║🕸️ 🎃 \`𝑵𝒂𝒖𝒇𝒓𝒂𝒁𝒂𝒑𝒑-𝑴𝑫\` 👻 🕸️
║🕸️ _𝙃𝙖𝙡𝙡𝙤𝙬𝙚𝙚𝙣 𝙀𝙙𝙞𝙩𝙞𝙤𝙣_ 🕸️
║•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
║🦇 𝘏𝘰𝘭𝘢 ${taguser}
║🕯️ ${date}
╚◊ •═════════════════• ◊╝

╔◊ •═════════════════• ◊╗
║      🕸️ 🎃 \`𝗘𝗩𝗘𝗡𝗧𝗢 𝗛𝗔𝗟𝗟𝗢𝗪𝗘𝗘𝗡\` 👻 🕸️
╠◊ •═════════════════• ◊╝
║🍬 \`Dulces\` ➝ ${userHw.dulces || 0}
║🎟️ \`Tickets\` ➝ ${userHw.ticketsHw || 0}
║•┄┄┄┄┄┄┄┄┄┄┄•
> _#halloween_ 📜 _menú del evento_
> _#truco_ 🍬 / _#trato_ 🍭
> _#calabaza_ 🎃
> _#fantasma_ 👻
> _#cazar_ 🔦
> _#cementerio_ ⚰️
> _#ouija *pregunta*_ 🔮
> _#acertijo_ 🧩
> _#disfraz_ 🎭
> _#susto *@usuario*_ 😱
> _#regalardulces *@usuario cantidad*_ 🎁
> _#pocion *cantidad*_ 🧪
> _#perfilhw_ 🦇
> _#topdulces_ 🏆
> _#canjear_ 🎟️
╰•─────────────────•╯
> 🎁 _Más tickets = más chances de ganar un bot en el sorteo_

╔◊ •═════════════════• ◊╗
║🕸️ ✨ \`𝗧𝗨𝗦 𝗥𝗘𝗖𝗨𝗥𝗦𝗢𝗦\` ✨ 🕸️
║•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
║🚻 \`Nivel\` ➝ ${level}
║•┄┄┄┄┄┄┄┄┄┄┄•
║💎 \`Diamantes\` ➝ ${limit}
║•┄┄┄┄┄┄┄┄┄┄┄•
║💰 \`NZCoins\` ➝ ${money}
║•┄┄┄┄┄┄┄┄┄┄┄•
║🪙 \`Monedas\` ➝ ${joincount}
║•┄┄┄┄┄┄┄┄┄┄┄•
║⚔️ \`Rango\` ➝ ${role}
║•┄┄┄┄┄┄┄┄┄┄┄•
║⭐ \`Experiencia\` ➝ ${exp}
╚◊ •═════════════════• ◊╝
${readMore}

╔◊ •═════════════════• ◊╗
║        🕸️ 🗂️ \`INFORMACION\` 🗂️ 🕸️
╠◊ •═════════════════• ◊╝
> _#contactos_
> _#cuentasnz_
> _#creador_
> _#donar_
> _#tipobot_
> _#mirecurso_
> _#estado_
> _#infobot_
> _#gruponz_
╰•─────────────────•╯

╔◊ •═════════════════• ◊╗
║            🕸️ 🟢 \`ON Y OFF\` 🔴 🕸️
╠◊ •═════════════════• ◊╝
> _#on *antiprivado*_ 
> _#on *restrict*_
> _#on *autoread*_
> _#on *antispam*_
> _#on *anticall*_
> _#on *welcome*_
> _#on *antilink2*_
> _#on *antilink*_
> _#on *detect*_
> _#on *autosticker*_
> _#on *antiviewonce*_
> _#on *antitoxic*_
> _#on *antiarabes*_
> _#on *modoadmin*_
> _#on *antidelete*_
> _#on *public*_
> _#on *pconly*_
> _#on *gconly*_
> •┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•
> _#off *antiprivado*_ 
> _#off *restrict*_
> _#off *autoread*_
> _#off *antispam*_
> _#off *anticall*_
> _#off *welcome*_
> _#off *antilink2*_
> _#off *antilink*_
> _#off *detect*_
> _#off *autosticker*_
> _#off *antiviewonce*_
> _#off *antitoxic*_
> _#off *antiarabes*_
> _#off *modoadmin*_
> _#off *antidelete*_
> _#off *public*_
> _#off *pconly*_
> _#off *gconly*_
╰•─────────────────•╯

╔◊ •═════════════════• ◊╗
║        🕸️ ⬇️ \`DESCARGADOR\` ⬇️ 🕸️
╠◊ •═════════════════• ◊╝
> _#instagram *url*_
> _#mediafire *url*_
> _#gitclone *url*_
> _#tiktok *url*_
> _#twitter *url*_
> _#fb *url*_
> _#ytshort *url*_
> _#apk *texto*_
> _#modapk *texto*_
> _#google *texto*_
> _#ytsearch *texto*_
> _#playstore *texto*_
> _#play *texto*_
> _#youtube *texto*_
> _#playlist *texto*_
> _#imagen *texto*_
╰•─────────────────•╯

╔◊ •═════════════════• ◊╗
║          🕸️ ✨ \`NO COMMAND\` ✨ 🕸️
╠◊ •═════════════════• ◊╝
> _bot_
> _admins_
╰•─────────────────•╯

╔◊ •═════════════════• ◊╗
║       🕸️ 👥 \`CONFIG GROUP\` 👥 🕸️
╠◊ •═════════════════• ◊╝
> _#add *numero*_
> _#kick *responder*_
> _#kick2 *responder*_
> _#grupo *abrir*_
> _#grupo *cerrar*_
> _#promote *@tag*_
> _#demote *@tag*_
> _#link_
> _#setname *texto*_
> _#setdesc *texto*_
> _#invocar *texto*_
> _#setwelcome *texto*_
> _#setbye *texto*_
> _#hidetag *texto*_
> _#hidetag *audio*_
> _#hidetag *video*_
> _#hidetag *imagen*_
╰•─────────────────•╯

╔◊ •═════════════════• ◊╗
║     🕸️ ♻️ \`MENU ALEATORIO\` ♻️ 🕸️
╠◊ •═════════════════• ◊╝
> _#inspect *url grupal*_
> _#chatgpt *texto*_
> _#delchatgpt_
> _#dsowner_
> _#join *url grupal*_
> _#consejo_
> _#piropo_
> _#yoayudo *texto*_
> _#reporte *texto*_
> _#s *img*_
> _#sticker *img*_
> _#ocr *img*_
> _#hd *img*_
> _#acortar *url*_
> _#calc_
> _#del_
> _#whatmusic *audio*_
> _#traducir *texto*_
╰•─────────────────•╯

╔◊ •═════════════════• ◊╗
║   🕸️ 👑 \`MENU PARA OWNERS\` 👑 🕸️
╠◊ •═════════════════• ◊╝
> _#setprefix *prefix*_
> _#resetprefix_
> _#autoadmin_
> _#addowner *@tag*_
> _#delownr *@tag*_
> _#block *@tag*_
> _#unblock *@tag*_
> _#banchat_
> _#unbanchat_
> _#resetuser *@tag*_
> _#banuser *@tag*_
> _#unbanuser *@tag*_
> _#dardiamantes *@tag*_
> _#añadirxp *@tag*_
> _#banuser *@tag*_
> _#restart_
> _#update_
╰•─────────────────•╯

╔◊ •═════════════════• ◊╗
║     🕸️ 🪙 \`RPG / ECONOMÍA\` 🪙 🕸️
╠◊ •═════════════════• ◊╝
> _#cofre_
> _#balance_
> _#levelup_
> _#myns_
> _#perfil_
> _#work_
> _#minar_
> _#buy_
> _#buyall_
> _#verificar_
> _#robar *@tag*_
> _#transfer *@tag*_
> _#unreg_
╰•─────────────────•╯

> 🎃 𝙉𝙖𝙪𝙛𝙧𝙖𝙕𝙖𝙥𝙥-𝙈𝘿 · 𝙃𝙖𝙡𝙡𝙤𝙬𝙚𝙚𝙣 👻
🦇🕸️ 🎃 🕸️🦇 🎃 🦇🕸️ 🎃 🕸️🦇`.trim();     if (m.isGroup) { 
 // await conn.sendFile(m.chat, vn, 'menu.mp3', null, m, true, { type: 'audioMessage', ptt: true})
      const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
      conn.sendMessage(m.chat, {image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net')}, {quoted: m});
    } else {
      // await conn.sendFile(m.chat, vn, 'menu.mp3', null, m, true, { type: 'audioMessage', ptt: true})
      const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
      conn.sendMessage(m.chat, {image: pp, caption: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net')}, {quoted: fkontak2});
    }
  } catch {
    conn.reply(m.chat, '> ⓘ Ocurrio un error al mostrar el menu.', m);
  }
};
handler.command = /^(menu|allmenu|menú|menucompleto|allmenú)$/i;
handler.register = true
handler.exp = 50;
handler.fail = null;
export default handler;
function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}
