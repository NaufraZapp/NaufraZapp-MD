import {watchFile, unwatchFile} from 'fs';
import chalk from 'chalk';
import {fileURLToPath} from 'url';
import fs from 'fs'; 
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone'

// ❒═════════════════◊【 𝐍𝐎 𝐓𝐎𝐂𝐀𝐑 𝐍𝐀𝐃𝐀 𝐏𝐎𝐑 𝐀𝐐𝐔𝐈 】◊═════════════════❒
global.botnumber = ""
global.confirmCode = ""

// ❒═════════════════◊【 𝐀𝐏𝐈 𝐍𝐀𝐔𝐅𝐑𝐀 】◊═════════════════❒
// Todos los comandos de descargas, IA, búsquedas, etc. usan esta API.
// Cambia aquí tu clave; no hace falta tocar los plugins.
global.naufraApi = {
  url: 'https://api.naufrabot.com',
  key: 'coloca tu key aquí'
}

// ❒═════════════════◊【 𝐎𝐖𝐍𝐄𝐑𝐀 】◊═════════════════❒
//No toques los nuneros que contienen el "true"
global.owner = [
 ['51927339074', '👑 𝘾𝙧𝙚𝙖𝙙𝙤𝙧 👑', true]]
 
// ❒═════════════════◊【 𝐂𝐎𝐍𝐓𝐀𝐂𝐓𝐎𝐒 】◊═════════════════❒
//Agregate si tu numero es owner
global.contactos = [
["51927339074", '🌎 𝙉𝙖𝙪𝙛𝙧𝙖𝙕𝙖𝙥𝙥 𝙊𝙁𝘾 🌎', 1]]

// ❒═════════════════◊【 𝐈𝐆𝐍𝐎𝐑𝐄𝐍 𝐄𝐒𝐓𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎 】◊═════════════════❒
global.suittag = ['51927339074'];
global.prems = ['51927339074'];

// ❒═════════════════◊【 𝐍𝐎𝐌𝐁𝐑𝐄𝐒 】◊═════════════════❒
// 🎃 Nombres de Halloween. Después del evento puedes volver a los originales (comentados abajo)
global.packname = '🎃 𝙉𝙖𝙪𝙛𝙧𝙖𝙕𝙖𝙥𝙥 𝙃𝙖𝙡𝙡𝙤𝙬𝙚𝙚𝙣 👻';
// global.packname = '🌎 𝙉𝙖𝙪𝙛𝙧𝙖𝙕𝙖𝙥𝙥-𝙈𝘿 🌎';
global.author = '𝙉𝙖𝙪𝙛𝙧𝙖𝙜𝙤';
global.wm = '🎃 𝙉𝙖𝙪𝙛𝙧𝙖𝙕𝙖𝙥𝙥-𝙈𝘿 · 𝙃𝙖𝙡𝙡𝙤𝙬𝙚𝙚𝙣 🦇';
// global.wm = '👑 𝙉𝙖𝙪𝙛𝙧𝙖𝙕𝙖𝙥𝙥-𝙈𝘿 👑';
global.sk = '♨️ 𝙉𝙖𝙪𝙛𝙧𝙖𝙕𝙖𝙥𝙥 ♨️';
global.titulowm = '👻 𝙉𝙖𝙪𝙛𝙧𝙖𝘽𝙤𝙩 𝙃𝙖𝙡𝙡𝙤𝙬𝙚𝙚𝙣 🎃';
// global.titulowm = '🏙️ 𝙉𝙖𝙪𝙛𝙧𝙖𝘽𝙤𝙩-𝙈𝘿 🏙️';
global.titulowm2 = `𝙉𝙖𝙪𝙛𝙧𝙖𝙜𝙤 ✨`
global.igfg = '𝙉𝙖𝙪𝙛𝙧𝙖𝙜𝙤';
global.wait = '*ⓘ 𝙲𝙰𝚁𝙶𝙰𝙽𝙳𝙾....*';
global.vs = '1.5.5';
// ❒═════════════════◊【 𝐌𝐄𝐍𝐔𝐒 𝐃𝐄 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎𝐍 】◊═════════════════❒
global.imagen1 = fs.readFileSync('./Menu2.jpg');
global.imagen2 = fs.readFileSync('./src/nuevobot.jpg');
global.imagen3 = fs.readFileSync('./src/NaufraMD.png');
global.imagen4 = fs.readFileSync('./Menu.png');
global.imagen5 = fs.readFileSync('./src/+18.jpg');
global.imagen6 = fs.readFileSync('./Menu3.png');
global.imagen7 = fs.readFileSync('./Menu6.jpg')
global.imagen8 = fs.readFileSync('./Menu4.jpg')
// ❒═════════════════◊【 𝐄𝐍𝐋𝐀𝐂𝐄𝐒 】◊═════════════════❒
//Enlaces aleatorios del bot
global.gp1 = 'https://chat.whatsapp.com/IOExLiCmlLV9Bdsw8y5BvR'
global.gp2 = 'https://www.paypal.me/ColaboracionBotOFC'
global.gp3 = 'https://www.instagram.com/naufrazapp?igsh=Y2g1ZXJxbm53eXAy'
global.gp4 = 'https://www.tiktok.com/@naufra.zapp?_t=8kcJigwvtji&_r=1'
global.channel = 'https://whatsapp.com/channel/0029Vaz3WoQ6RGJPJQcMXQ14'
global.web = 'https://naufrabot.com'
global.paypal = 'https://www.paypal.me/NaufragoSolano'
global.yt = 'https://youtube.com/@user-bw5wl4ye8r?si=qN8bP4ZdKm3yXwbx'
global.md = 'https://github.com/Bots-WhatsApp-OFC/NaufraZapp-MD'
global.fb = 'https://www.facebook.com/share/8XyV52kz3sfhrzft/?mibextid=qi2Omg'
// ❒═════════════════◊【 𝐈𝐌𝐀𝐆𝐄𝐍𝐄𝐒 】◊═════════════════❒
// ❒═════════════════◊【 𝐕𝐈𝐃𝐄𝐎𝐒 】◊═════════════════❒
// ❒═════════════════◊【 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐀𝐋𝐄𝐀𝐓𝐎𝐑𝐈𝐎𝐒 】◊═════════════════❒
//MENSAJES RANDOM:
global.naufraRedes = [gp1, gp2, gp3, gp4, channel, paypal, yt, md, fb]
// ❒═════════════════◊【 𝐇𝐎𝐑𝐀𝐑𝐈𝐎𝐒 】◊═════════════════❒
//Saludo User, Buen Dia
var ase = new Date(); var hour = ase.getHours(); switch(hour){ case 0: hour = 'Linda Mañana'; break; case 1: hour = 'Linda Mañana'; break; case 2: hour = 'Linda Mañana'; break; case 3: hour = 'Linda Mañana'; break; case 4: hour = 'linda mañana'; break; case 5: hour = 'Linda Mañana'; break; case 6: hour = 'Linda Mañana'; break; case 7: hour = 'Linda Mañana'; break; case 8: hour = 'Linda Mañana'; break; case 9: hour = 'Linda Mañana'; break; case 10: hour = 'Lindo Dia'; break; case 11: hour = 'Lindo Dia'; break; case 12: hour = 'Lindo Dia'; break; case 13: hour = 'Lindo Dia'; break; case 14: hour = 'Linda Tarde'; break; case 15: hour = 'Linda Tarde'; break; case 16: hour = 'Linda Tarde'; break; case 17: hour = 'Linda Tarde'; break; case 18: hour = 'Linda Noche'; break; case 19: hour = 'Linda Noche'; break; case 20: hour = 'Linda Noche'; break; case 21: hour = 'Linda Noche'; break; case 22: hour = 'Linda Noche'; break; case 23: hour = 'Linda Noche'; break;}
global.saludo = '🌎' + hour;

global.mods = [];

// ❒═════════════════◊【 𝐅𝐄𝐂𝐇𝐀 𝐘 𝐇𝐎𝐑𝐀 】◊═════════════════❒

global.d = new Date(new Date + 3600000);
global.locale = 'es';
global.dia = d.toLocaleDateString(locale, {weekday: 'long'});
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'});
global.mes = d.toLocaleDateString('es', {month: 'long'});
global.año = d.toLocaleDateString('es', {year: 'numeric'});
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true});
// ❒═════════════════◊【 𝐀𝐋𝐄𝐀𝐓𝐎𝐑𝐈𝐎 】◊═════════════════❒
global.wm2 = `${dia} ${fecha}\nNaufraBot`;
global.gt = 'NaufraBot';
global.mysticbot = 'NaufraBot-MD';
global.mysticbot = 'https://github.com/Bots-WhatsApp-OFC/NaufraZapp-MD';
global.waitt = '*ⓘ 𝙲𝙰𝚁𝙶𝙰𝙽𝙳𝙾....*';
global.waittt = '*ⓘ 𝙲𝙰𝚁𝙶𝙰𝙽𝙳𝙾....*';
global.waitttt = '*ⓘ 𝙲𝙰𝚁𝙶𝙰𝙽𝙳𝙾....*';
global.nomorown = '5493873687620';
global.pdoc = ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/msword', 'application/pdf', 'text/rtf'];
global.cmenut = '❖––––––『';
global.cmenub = '┊✦ ';
global.cmenuf = '╰━═┅═━––––––๑\n';
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     ';
global.dmenut = '*❖─┅──┅〈*';
global.dmenub = '*┊»*';
global.dmenub2 = '*┊*';
global.dmenuf = '*╰┅────────┅✦*';
global.htjava = '⫹⫺';
global.htki = '*⭑•̩̩͙⊱•••• ☪*';
global.htka = '*☪ ••••̩̩͙⊰•⭑*';
global.comienzo = '• • ◕◕════';
global.fin = '════◕◕ • •';
global.botdate = `*🏙️ Fecha:*  ${moment.tz('America/Mexico_City').format('DD/MM/YY')}`;
global.bottime = `*🌎 Hora:* ${moment.tz('America/Mexico_City').format('HH:mm:ss')}`;
global.fgif = {key: {participant: '0@s.whatsapp.net'}, message: {'videoMessage': {'title': wm, 'h': `Hmm`, 'seconds': '999999999', 'gifPlayback': 'true', 'caption': bottime, 'jpegThumbnail': fs.readFileSync('./Menu.png')}}};
global.multiplier = 99;
global.flaaa = [
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text=',
];
// ❒═════════════════◊【 𝐍𝐎 𝐓𝐎𝐂𝐀𝐑 𝐍𝐀𝐃𝐀 𝐏𝐎𝐑 𝐀𝐐𝐔𝐈 】◊═════════════════❒

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'config.js\''));
  import(`${file}?update=${Date.now()}`);
});
