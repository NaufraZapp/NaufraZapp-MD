const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `> ⓘ 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙞𝙣𝙜𝙧𝙚𝙨𝙚 𝙚𝙡 𝙩𝙚𝙢𝙖 𝙙𝙚 𝙥𝙧𝙤𝙗𝙡𝙚𝙢𝙖 𝙚𝙣 𝙡𝙤𝙨 𝙘𝙤𝙢𝙖𝙣𝙙𝙤𝙨, 𝙥𝙤𝙧 𝙚𝙟𝙚𝙢𝙥𝙡𝙤:\n> *${usedPrefix + command}* esta fallando el siguiente comando: ${usedPrefix}owner`;
  if (text.length < 10) throw `> ⓘ 𝙀𝙡 𝙧𝙚𝙥𝙤𝙧𝙩𝙚 𝙙𝙚𝙗𝙚 𝙙𝙚 𝙩𝙚𝙣𝙚𝙧 𝙢𝙞𝙣𝙞𝙢𝙤 \`10\` 𝙘𝙖𝙧𝙖𝙘𝙩𝙚𝙧𝙚𝙨 𝙥𝙖𝙧𝙖 𝙚𝙣𝙫𝙞𝙖𝙧𝙡𝙤.`;
  if (text.length > 1000) throw `> ⓘ 𝙀𝙡 𝙧𝙚𝙥𝙤𝙧𝙩𝙚 𝙣𝙤 𝙙𝙚𝙗𝙚 𝙙𝙚 𝙨𝙪𝙥𝙚𝙧𝙖𝙧 𝙖 𝙡𝙤𝙨 \`1.000\` 𝙘𝙖𝙧𝙖𝙘𝙩𝙚𝙧𝙚𝙨.`;
  const teks = `> \`ⓘ 𝙍𝙚𝙥𝙤𝙧𝙩𝙚 𝙙𝙚 𝙘𝙤𝙢𝙖𝙣𝙙𝙤𝙨 𝙚𝙧𝙧𝙤𝙣𝙚𝙤𝙨...\`

> 『 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 』
> ✦ wa.me/${m.sender.split`@`[0]}

> 『 𝗧𝗘𝗫𝗧𝗢 』
> ✦ ${text}

\`NaufraZapp-MD\`
`;
  for (const [numero] of global.owner) conn.reply(numero + '@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {contextInfo: {mentionedJid: [m.sender]}});
  m.reply(`> ⓘ 𝙀𝙡 𝙧𝙚𝙥𝙤𝙧𝙩𝙚 𝙛𝙪𝙚 𝙚𝙣𝙫𝙞𝙖𝙙𝙤 𝙘𝙤𝙣 𝙚𝙭𝙞𝙩𝙤 𝙖 𝙡𝙤𝙨 𝙘𝙧𝙚𝙖𝙙𝙤𝙧𝙚𝙨 𝙙𝙚𝙡 𝙗𝙤𝙩.`);
};
handler.help = ['reporte', 'request'].map((v) => v + ' <teks>');
handler.tags = ['info'];
handler.command = /^(report|reportar|reporte|bugs|bug|report-owner|reportes)$/i;
export default handler;