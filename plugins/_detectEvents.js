import {BIENVENIDA, SALIDA, EXPULSION, armarTexto, digitos, idsParticipante, jidParticipante} from '../lib/bienvenida.js';
import {WAMessageStubType} from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, {conn, participants}) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const groupName = (await conn.groupMetadata(m.chat)).subject;
  const groupAdmins = participants.filter((p) => p.admin);
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => null) || './src/avatar_contact.png';
  const img = await (await fetch(pp)).buffer();
  const chat = global.db.data.chats[m.chat];
  // Baileys 7: el participante afectado llega como texto JSON {"id":"..@lid","phoneNumber":"..@s.whatsapp.net"}
  const afectado = jidParticipante(m.messageStubParameters?.[0]) || '';
  const tagAfectado = digitos(afectado);
  const mentionsString = [m.sender, afectado, ...groupAdmins.map((v) => v.id)].filter(Boolean);
  const mentionsContentM = [m.sender, afectado].filter(Boolean);
  const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};

  if (chat.detect2 && m.messageStubType == 29) {
    let txt1 = `╭•───────────────────◊\n│ ${groupName}\n╰•───────────────────◊\n\n`;
    txt1 += `> \`𝙎𝙚 𝙝𝙖 𝙖𝙜𝙧𝙚𝙜𝙖𝙙𝙤 𝙖 𝙪𝙣 𝙣𝙪𝙚𝙫𝙤 𝙖𝙙𝙢𝙞𝙣 𝙚𝙣 𝙚𝙨𝙩𝙚 𝙜𝙧𝙪𝙥𝙤.\`\n\n`;
    txt1 += `𝙀𝙡 𝙣𝙪𝙚𝙫𝙤 𝙪𝙨𝙪𝙖𝙧𝙞𝙤 𝙖𝙙𝙢𝙞𝙣 𝙚𝙨: @${tagAfectado}\n`;
    txt1 += `𝙥𝙧𝙤𝙢𝙤𝙫𝙞𝙙𝙤 𝙥𝙤𝙧:\n@${m.sender.split`@`[0]}`;
    await conn.sendMessage(m.chat, {image: img, caption: txt1, mentions: mentionsString}, {quoted: fkontak2});
  }

  if (chat.detect2 && m.messageStubType == 30) {
    let txt2 = `╭•───────────────────◊\n│ ${groupName}\n╰•───────────────────◊\n\n`;
    txt2 += `> \`𝙐𝙣 𝙖𝙙𝙢𝙞𝙣 𝙛𝙪𝙚 𝙦𝙪𝙞𝙩𝙖𝙙𝙤 𝙘𝙤𝙢𝙤 𝙖𝙙𝙢𝙞𝙣 𝙚𝙣 𝙚𝙨𝙩𝙚 𝙜𝙧𝙪𝙥𝙤.\`\n\n`;
    txt2 += `𝙀𝙡 𝙪𝙨𝙪𝙖𝙧𝙞𝙤: @${tagAfectado} 𝙮𝙖 𝙣𝙤 𝙚𝙨 𝙖𝙙𝙢𝙞𝙣 𝙚𝙣 𝙚𝙨𝙩𝙚 𝙜𝙧𝙪𝙥𝙤.\n•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`;
    txt2 += `𝘿𝙚𝙨𝙘𝙖𝙧𝙩𝙖𝙙𝙤 𝙥𝙤𝙧:\n@${m.sender.split`@`[0]}`;
    await conn.sendMessage(m.chat, {image: img, caption: txt2, mentions: mentionsString}, {quoted: fkontak2});
  }

  // Entradas y salidas (27 = entró, 28 = eliminado, 32 = salió).
  // Si la bienvenida (#on welcome) está activa, ella se encarga y aquí no se repite el mensaje.
  if (chat.detect2 && !chat.welcome && [27, 28, 32].includes(m.messageStubType) && afectado) {
    const meta = await conn.groupMetadata(m.chat).catch(() => ({}));
    const salioSolo = m.messageStubType == 32 || (m.messageStubType == 28 && idsParticipante(m.messageStubParameters?.[0]).includes(digitos(m.sender)));
    let plantilla;
    if (m.messageStubType == 27) plantilla = chat.sWelcome || conn.welcome || BIENVENIDA;
    else if (salioSolo) plantilla = chat.sBye || conn.bye || SALIDA;
    else plantilla = conn.kick || EXPULSION;
    const expulsado = m.messageStubType == 28 && !salioSolo;
    const texto = armarTexto(plantilla, {usuario: afectado, grupo: groupName, desc: meta?.desc?.toString(), admin: expulsado ? m.sender : ''});
    let foto = img;
    try {
      const ppUser = await conn.profilePictureUrl(afectado, 'image');
      foto = await (await fetch(ppUser)).buffer();
    } catch {}
    await conn.sendMessage(m.chat, {image: foto, caption: texto, mentions: expulsado ? mentionsContentM : [afectado]}, {quoted: fkontak2});
  }

  if (chat.detect2 && m.messageStubType == 26) {
    let accion;
    if (m.messageStubParameters[0].split`@`[0] === 'on') {
      accion = '𝙘𝙚𝙧𝙧𝙖𝙙𝙤. ❌';
    } else {
      accion = '𝙖𝙗𝙞𝙚𝙧𝙩𝙤. ✅';
    }
    let txt6 = `╭•───────────────────◊\n│ ${groupName}\n╰•───────────────────◊\n\n`;
    txt6 += `> \`𝙎𝙚 𝙝𝙖𝙣 𝙘𝙤𝙣𝙛𝙞𝙜𝙪𝙧𝙖𝙙𝙤 𝙡𝙤𝙨 𝙖𝙟𝙪𝙨𝙩𝙚𝙨 𝙙𝙚 𝙚𝙨𝙩𝙚 𝙜𝙧𝙪𝙥𝙤.\`\n\n`;
    txt6 += `> 𝘼𝙝𝙤𝙧𝙖 𝙚𝙡 𝙜𝙧𝙪𝙥𝙤 𝙚𝙨𝙩𝙖 ${accion}\n•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`;
    txt6 += `𝙀𝙟𝙚𝙘𝙪𝙩𝙖𝙙𝙤:\n@${m.sender.split`@`[0]}`;
    await conn.sendMessage(m.chat, {image: {url: pp}, caption: txt6, mentions: mentionsContentM}, {quoted: fkontak2});
  }

  if (chat.detect2 && m.messageStubType == 21) {
    let txt7 = `╭•───────────────────◊\n│ ${groupName}\n╰•───────────────────◊\n\n`;
    txt7 += `> 𝙎𝙚 𝙝𝙖 𝙘𝙖𝙢𝙗𝙞𝙖𝙙𝙤 𝙚𝙡 𝙣𝙤𝙢𝙗𝙧𝙚 𝙙𝙚𝙡 𝙜𝙧𝙪𝙥𝙤 𝙧𝙚𝙘𝙞𝙚𝙣𝙩𝙚𝙢𝙚𝙣𝙩𝙚.\n•┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄•\n`;
    txt7 += `𝙀𝙟𝙚𝙘𝙪𝙩𝙖𝙙𝙤 𝙥𝙤𝙧:\n@${m.sender.split`@`[0]}`;
    await conn.sendMessage(m.chat, {image: {url: pp}, caption: txt7, mentions: mentionsContentM}, {quoted: fkontak2});
  }
                            }
    
