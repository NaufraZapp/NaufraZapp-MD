const handler = async (m, {conn}) => {
  try {
    const pp = imagen6;
    const img = await(await fetch('https://images3.alphacoders.com/125/1251707.png')).buffer();
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
    const str = `> 𝙃𝙤𝙡𝙖 𝙪𝙨𝙪𝙖𝙧𝙞𝙤/𝙖: ${taguser}, 𝙗𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙤/𝙖 𝙖𝙡 𝙚𝙨𝙩𝙖𝙙𝙤 𝙙𝙚𝙡 𝙗𝙤𝙩.
> •━━━━━━━━━━━━━━━━━•
> ⓘ 𝙈𝙊𝘿𝙊 𝘿𝙀 𝘽𝙊𝙏:
> ✦ Publico
> •━━━━━━━━━━━━━━━━━•
> ⓘ 𝙊𝙒𝙉𝙀𝙍:
> ✦ wa.me/51927339074
> •━━━━━━━━━━━━━━━━━•
> ⓘ 𝘾𝙐𝙀𝙉𝙏𝘼𝙎:
> ✦ ${gp1}
> ✦ ${channel}
> ✦ ${web}
> ✦ ${yt}
> ✦ ${paypal}
> ✦ ${md}
> •━━━━━━━━━━━━━━━━━•
> ⓘ 𝙏𝙄𝙀𝙈𝙋𝙊:
> ✦ ${uptime}
> •━━━━━━━━━━━━━━━━━•
> ⓘ 𝘾𝙊𝙉𝙉𝙀𝘾𝙏𝙄𝙊𝙉:
> ✦ GuardianBot-MD
> •━━━━━━━━━━━━━━━━━•
> ⓘ 𝙐𝙇𝙏𝙄𝙈𝘼 𝙑𝙀𝙍𝙎𝙄𝙊𝙉:
> ✦ ${vs}
> •━━━━━━━━━━━━━━━━━•
> ⓘ 𝙉𝘼𝙈𝙀 𝘽𝙊𝙏:
> ✦ ${wm}
> •━━━━━━━━━━━━━━━━━•`.trim();
    if (m.isGroup) {
      conn.sendMessage(m.chat, {text: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), contextInfo: {forwardingScore: 9999999, isForwarded: true, mentionedJid: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), "externalAdReply": {"showAdAttribution": true, "containsAutoReply": true, "renderLargerThumbnail": true, "title": global.titulowm, "containsAutoReply": true, "mediaType": 1, "thumbnail": pp, "mediaUrl": `https://youtube.com/@user-bw5wl4ye8r?si=qN8bP4ZdKm3yXwbx`, "sourceUrl": `https://youtube.com/@user-bw5wl4ye8r?si=qN8bP4ZdKm3yXwbx`}}}, {quoted: m});
    } else {
      const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
      conn.sendMessage(m.chat, {text: str.trim(), mentions: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), contextInfo: {forwardingScore: 9999999, isForwarded: true, mentionedJid: [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net'), "externalAdReply": {"showAdAttribution": true, "containsAutoReply": true, "renderLargerThumbnail": true, "title": global.titulowm, "containsAutoReply": true, "mediaType": 1, "thumbnail": pp, "mediaUrl": `https://youtube.com/@user-bw5wl4ye8r?si=qN8bP4ZdKm3yXwbx`, "sourceUrl": `https://youtube.com/@user-bw5wl4ye8r?si=qN8bP4ZdKm3yXwbx`}}}, {quoted: fkontak2});
    }
  } catch {
  }
};
handler.help = ['estado'];
handler.tags = ['main'];
handler.command = /^(estado|status|estate|state|stado|stats|runtime|uptime)$/i;
export default handler;
function clockString(ms) {
  const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [`` + d, ' Día(s)* ', `• ` + h, ' Hora(s)* ', `• ` + m, ' Minuto(s)* ', `• ` + s, ' Segundo(s)* '].map((v) => v.toString().padStart(2, 0)).join('');
}
