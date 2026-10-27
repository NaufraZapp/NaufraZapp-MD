import {traducir} from '../lib/naufra-api.js';
import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';
const handler = async (m, {args, usedPrefix, command}) => {
  const msg = `> ⓘ Ingrese un texto para traducirlo, por ejemplo:\n\n> ${usedPrefix + command} es Hello*`;
  if (!args || !args[0]) return m.reply(msg);
  let lang = args[0];
  let text = args.slice(1).join(' ');
  const defaultLang = 'es';
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
  // API Naufra primero; si falla, sigue con los métodos de siempre
  try {
    const traducido = await traducir(text, lang);
    return await m.reply('*Traducción:* ' + traducido);
  } catch (e) {
    console.log('[API Naufra] translate falló, se usa el método anterior:', e?.message || e);
  }
  try {
    const result = await translate(`${text}`, {to: lang, autoCorrect: true});
    await m.reply('*Traducción:* ' + result.text);
  } catch {
    try {
      const lol = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${text}`);
      const loll = await lol.json();
      const result2 = loll.result.translated;
      await m.reply('*Traducción:* ' + result2);
    } catch {
      await m.reply('> ⓘ Ocurrio un error inesperado, intentelo de nuevo.');
    }
  }
};
handler.command = /^(translate|traducir|trad)$/i;
export default handler;
