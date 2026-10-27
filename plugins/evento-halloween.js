/**
 * 🎃 EVENTO HALLOWEEN - NaufraZapp-MD
 *
 * Todos los comandos (solo en grupos) dan o quitan 🍬 dulces. Los dulces se
 * canjean por 🎟️ tickets dorados y cada ticket es una oportunidad más de ganar
 * en el sorteo final (#sorteo, solo el dueño).
 *
 *   🍬 Ganar dulces:  #truco #trato #calabaza #fantasma #cazar #cementerio #ouija #acertijo
 *   🎭 Disfraces:     #disfraz  (da un bonus % a TODOS los dulces que ganes)
 *   😱 Contra otros:  #susto @usuario  ·  #regalardulces @usuario cantidad
 *   🧪 Apuesta:       #pocion cantidad
 *   📊 Info:          #halloween #dulces #perfilhw #topdulces
 *   🎟️ Tickets:       #canjear [cantidad]   ·   #sorteo [ganadores] (dueño)
 *
 * El evento se apaga solo después de FIN_EVENTO (el sorteo sigue funcionando).
 */

const FIN_EVENTO = new Date('2026-11-02T05:00:00Z'); // 2 de noviembre 00:00 hora Perú
const PRECIO_TICKET = 200;

const MIN = 60 * 1000;
const ESPERAS = {
  truco: 20 * MIN,
  calabaza: 24 * 60 * MIN,
  susto: 10 * MIN,
  fantasma: 15 * MIN,
  cazar: 30 * MIN,
  cementerio: 45 * MIN,
  ouija: 10 * MIN,
  pocion: 5 * MIN,
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];
const tag = (jid) => '@' + String(jid || '').split('@')[0].split(':')[0];
const numero = (jid) => String(jid || '').split('@')[0].split(':')[0].replace(/\D/g, '');

function tiempo(ms) {
  const m = Math.ceil(ms / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h ${m % 60} min`;
}

const CABECERA = `╭•───────────────────◊
┆ 🎃 *NAUFRAZAPP HALLOWEEN* 👻
╰•───────────────────◊`;

/* ─────────────── Disfraces ─────────────── */

const DISFRACES = [
  {nombre: 'Zombie Hambriento', emoji: '🧟', rareza: 'Común', bonus: 5, peso: 35},
  {nombre: 'Esqueleto Bailarín', emoji: '💀', rareza: 'Común', bonus: 5, peso: 35},
  {nombre: 'Momia Dormilona', emoji: '🤕', rareza: 'Común', bonus: 8, peso: 30},
  {nombre: 'Vampiro Elegante', emoji: '🧛🏻', rareza: 'Raro', bonus: 15, peso: 18},
  {nombre: 'Hombre Lobo', emoji: '🐺', rareza: 'Raro', bonus: 15, peso: 18},
  {nombre: 'Bruja del Caldero', emoji: '🧙🏻‍♀️', rareza: 'Épico', bonus: 25, peso: 8},
  {nombre: 'Fantasma Real', emoji: '👻', rareza: 'Épico', bonus: 30, peso: 6},
  {nombre: 'Rey Calabaza', emoji: '🎃', rareza: 'Legendario', bonus: 50, peso: 2},
];

function sortearDisfraz() {
  const total = DISFRACES.reduce((s, d) => s + d.peso, 0);
  let r = Math.random() * total;
  return DISFRACES.find((d) => (r -= d.peso) < 0) || DISFRACES[0];
}

const disfrazDe = (user) => DISFRACES.find((d) => d.nombre === user.disfrazHw) || null;

/* ─────────────── Datos del usuario ─────────────── */

function datos(user) {
  for (const k of ['dulces', 'ticketsHw', 'fantasmasHw', 'sustosHw']) if (typeof user[k] !== 'number') user[k] = 0;
  if (!user.esperasHw || typeof user.esperasHw !== 'object') user.esperasHw = {};
  return user;
}

/** Suma dulces aplicando el bonus del disfraz. Devuelve lo que realmente ganó. */
function ganar(user, n) {
  const d = disfrazDe(user);
  const total = d ? Math.round(n * (1 + d.bonus / 100)) : n;
  user.dulces += total;
  return total;
}

function perder(user, n) {
  const real = Math.min(user.dulces, n);
  user.dulces -= real;
  return real;
}

/** Revisa la espera de un comando. Lanza el mensaje si todavía falta. */
function esperar(user, clave, mensaje) {
  const falta = (user.esperasHw[clave] || 0) + ESPERAS[clave] - Date.now();
  if (falta > 0) throw `${mensaje} Vuelve en *${tiempo(falta)}*.`;
  user.esperasHw[clave] = Date.now();
}

function textoBonus(user, ganado, base) {
  const d = disfrazDe(user);
  return d && ganado > base ? `  _(+${d.bonus}% ${d.emoji})_` : '';
}

/* ─────────────── Textos ─────────────── */

const SUSTOS = [
  'Un fantasma te jaló los pies mientras dormías 👻',
  'Abriste la puerta y no había nadie... pero escuchaste tu nombre 🚪',
  'Tu reflejo en el espejo sonrió antes que tú 🪞',
  'Una calabaza te mordió la mano 🎃',
  'Una bruja te convirtió en sapo por 5 minutos 🐸',
  'Las luces se apagaron y algo respiró detrás de ti 🕯️',
];

const PREMIOS = [
  'Una abuelita te regaló una bolsa enorme de caramelos 🍬',
  'Encontraste un caldero lleno de chocolates 🍫',
  'Un vampiro amable te dio sus dulces favoritos 🧛🏻',
  'Ganaste el concurso de disfraces del barrio 🏆',
  'Un esqueleto te pagó con chupetines por asustarlo 💀',
  'Una bruja te dio dulces a cambio de una sonrisa 🧙🏻‍♀️',
];

const RESPUESTAS_OUIJA = [
  'Sí... definitivamente sí 👁️', 'No. Ni lo sueñes 💀', 'Los espíritus dicen que tal vez 🌫️',
  'Pregunta otra vez a medianoche 🕛', 'El tablero se movió solo hacia... *NO* 🕯️',
  'Las velas se apagaron. Eso es un sí 🔥', 'Los muertos se están riendo de tu pregunta 😂',
  'Todo indica que sí, pero cuidado con lo que deseas 🦇',
];

const ACERTIJOS = [
  {p: 'Tengo dientes pero no muerdo, me iluminan por dentro y salgo en Halloween. ¿Qué soy?', r: ['calabaza']},
  {p: 'Vuelo de noche, duermo de día, cuelgo de cabeza y no soy brujería. ¿Qué soy?', r: ['murcielago', 'murciélago']},
  {p: 'No tengo carne ni piel, solo huesos, y aun así bailo. ¿Qué soy?', r: ['esqueleto']},
  {p: 'Atravieso paredes, nadie me puede tocar y si me ves, vas a gritar. ¿Qué soy?', r: ['fantasma']},
  {p: 'Me envuelven en vendas y duermo en una pirámide. ¿Qué soy?', r: ['momia']},
  {p: 'Bebo sangre, odio el ajo y el sol me quema. ¿Qué soy?', r: ['vampiro']},
  {p: 'Con luna llena me salen pelos y colmillos. ¿Qué soy?', r: ['hombre lobo', 'lobo', 'licantropo', 'licántropo']},
  {p: 'Vuelo en escoba y preparo pociones en mi caldero. ¿Quién soy?', r: ['bruja']},
  {p: 'Tejo mi casa con hilos y atrapo a mis presas. ¿Qué soy?', r: ['araña', 'arana']},
  {p: 'Camino lento, tengo hambre de cerebros. ¿Qué soy?', r: ['zombie', 'zombi']},
];

const sinTildes = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
global.acertijosHw = global.acertijosHw || {};

/* ─────────────── Handler ─────────────── */

const handler = async (m, {conn, args, text, usedPrefix, command, participants, isOwner, isROwner}) => {
  const p = usedPrefix;
  const cmd = command.toLowerCase();
  if (Date.now() > FIN_EVENTO.getTime() && !/^(sorteo|sorteohalloween|halloween|dulces|topdulces|tophalloween)$/.test(cmd)) {
    throw `${CABECERA}\n\n🕯️ El evento de Halloween ya terminó. ¡Gracias por participar!`;
  }

  const users = global.db.data.users;
  const user = datos(users[m.sender] || (users[m.sender] = {}));
  const pie = () => `\n\n> 🍬 *${user.dulces}*  ·  🎟️ *${user.ticketsHw}*`;

  switch (cmd) {
    /* ───── Menú ───── */
    case 'halloween': {
      return m.reply(`${CABECERA}

🍬 *Junta dulces, asusta a tus amigos y gana*
*tickets dorados para el sorteo de bots.*

╭─ 🍬 \`GANAR DULCES\`
│ \`${p}truco\` / \`${p}trato\` · cada 20 min
│ \`${p}calabaza\` · regalo diario
│ \`${p}fantasma\` · invoca un fantasma
│ \`${p}cazar\` · caza fantasmas
│ \`${p}cementerio\` · explora tumbas
│ \`${p}ouija pregunta\` · habla con espíritus
│ \`${p}acertijo\` · el primero en responder gana
╰───────────────

╭─ 🎭 \`DISFRACES\`
│ \`${p}disfraz\` · da bonus a todo lo que ganes
│ \`${p}disfraz nuevo\` · cambiar (30 🍬)
╰───────────────

╭─ 😱 \`ENTRE USUARIOS\`
│ \`${p}susto @usuario\` · róbale dulces
│ \`${p}regalardulces @usuario 50\`
│ \`${p}pocion 50\` · apuesta tus dulces
╰───────────────

╭─ 🎟️ \`TICKETS Y SORTEO\`
│ \`${p}dulces\` · \`${p}perfilhw\` · \`${p}topdulces\`
│ \`${p}canjear\` · ${PRECIO_TICKET} 🍬 = 1 🎟️
╰───────────────

🎁 *Más tickets = más probabilidades de ganar tu bot.*
⏳ El evento termina el 1 de noviembre a medianoche.`);
    }

    /* ───── Truco o trato ───── */
    case 'truco':
    case 'trato':
    case 'dulce': {
      esperar(user, 'truco', '🕸️ Los vecinos aún no abren la puerta.');
      const suerte = Math.random();
      let texto;
      if (suerte < 0.05) {
        user.ticketsHw += 1;
        texto = `🎟️ *¡TICKET DORADO!*\nUn ser misterioso dejó un ticket en tu bolsa.`;
      } else if (suerte < 0.15) {
        const base = rand(100, 150);
        const n = ganar(user, base);
        user.exp = (user.exp || 0) + 300;
        texto = `🏆 *¡PREMIO GORDO!*\n${elegir(PREMIOS)}\n+${n} 🍬${textoBonus(user, n, base)}  ·  +300 exp`;
      } else if (suerte < 0.30) {
        const n = perder(user, rand(5, 20));
        user.sustosHw++;
        texto = `👻 *¡TRUCO!*\n${elegir(SUSTOS)}\nDel susto se te cayeron *${n}* 🍬`;
      } else {
        const base = rand(10, 50);
        const n = ganar(user, base);
        texto = `🍬 *¡TRATO!*\n${elegir(PREMIOS)}\n+${n} dulces${textoBonus(user, n, base)}`;
      }
      return m.reply(`${CABECERA}\n\n${texto}${pie()}`);
    }

    /* ───── Calabaza diaria ───── */
    case 'calabaza': {
      esperar(user, 'calabaza', '🎃 Tu calabaza todavía está creciendo.');
      const base = rand(40, 90);
      const n = ganar(user, base);
      return m.reply(`${CABECERA}\n\n🎃 Abriste tu calabaza diaria y encontraste *${n}* 🍬${textoBonus(user, n, base)}${pie()}`);
    }

    /* ───── Fantasma ───── */
    case 'fantasma':
    case 'invocar': {
      esperar(user, 'fantasma', '🕯️ Las velas todavía no se encienden.');
      const s = Math.random();
      let texto;
      if (s < 0.03) {
        user.ticketsHw += 1;
        texto = `👑 *¡EL FANTASMA DEL REY CALABAZA!*\nTe entregó un 🎟️ ticket dorado y desapareció.`;
      } else if (s < 0.18) {
        const base = rand(80, 150);
        const n = ganar(user, base);
        texto = `💰 *Fantasma millonario*\nTe dejó su herencia de dulces: +${n} 🍬${textoBonus(user, n, base)}`;
      } else if (s < 0.43) {
        const n = perder(user, rand(10, 30));
        user.sustosHw++;
        texto = `😡 *¡Poltergeist!*\nLanzó tus cosas por el cuarto y se llevó *${n}* 🍬`;
      } else {
        const base = rand(15, 60);
        const n = ganar(user, base);
        texto = `👻 *Fantasma amistoso*\nSolo quería compañía. Te regaló +${n} 🍬${textoBonus(user, n, base)}`;
      }
      return m.reply(`${CABECERA}\n\n🕯️ Encendiste las velas y dijiste las palabras...\n\n${texto}${pie()}`);
    }

    /* ───── Caza fantasmas ───── */
    case 'cazar':
    case 'cazafantasmas': {
      esperar(user, 'cazar', '🔦 Tu linterna se está cargando.');
      if (Math.random() < 0.2) {
        const n = perder(user, rand(10, 25));
        return m.reply(`${CABECERA}\n\n🔦 Saliste a cazar fantasmas...\n🪤 ¡Caíste en tu propia trampa! Perdiste *${n}* 🍬${pie()}`);
      }
      const cazados = rand(1, 3);
      user.fantasmasHw += cazados;
      const base = cazados * rand(20, 40);
      const n = ganar(user, base);
      const extra = user.fantasmasHw % 10 < cazados ? (user.ticketsHw++, `\n🎟️ *¡Llegaste a ${Math.floor(user.fantasmasHw / 10) * 10} fantasmas cazados! +1 ticket dorado*`) : '';
      return m.reply(`${CABECERA}\n\n🔦 Saliste a cazar fantasmas...\n👻 Atrapaste *${cazados}* fantasma(s) y los cambiaste por +${n} 🍬${textoBonus(user, n, base)}\n🏅 Total cazados: *${user.fantasmasHw}* (cada 10 = 1 🎟️)${extra}${pie()}`);
    }

    /* ───── Cementerio ───── */
    case 'cementerio':
    case 'explorar': {
      esperar(user, 'cementerio', '⚰️ El guardián del cementerio te está vigilando.');
      const s = Math.random();
      let texto;
      if (s < 0.04) {
        user.ticketsHw += 1;
        texto = `🎟️ Dentro de una tumba antigua encontraste un *ticket dorado*.`;
      } else if (s < 0.30) {
        const n = perder(user, rand(15, 35));
        user.sustosHw++;
        texto = `🧟 ¡Un zombie salió de la tierra y te persiguió!\nAl correr perdiste *${n}* 🍬`;
      } else {
        const tumbas = rand(1, 4);
        const base = tumbas * rand(15, 35);
        const n = ganar(user, base);
        texto = `⚰️ Revisaste *${tumbas}* tumba(s) y encontraste +${n} 🍬${textoBonus(user, n, base)}`;
      }
      return m.reply(`${CABECERA}\n\n🌫️ Entraste al cementerio a medianoche...\n\n${texto}${pie()}`);
    }

    /* ───── Ouija ───── */
    case 'ouija': {
      if (!text) throw `🔮 Hazle una pregunta a los espíritus.\n> Ejemplo: \`${p}ouija ¿ganaré el sorteo?\``;
      esperar(user, 'ouija', '🔮 Los espíritus están descansando.');
      const base = rand(5, 15);
      const n = ganar(user, base);
      return m.reply(`${CABECERA}\n\n🔮 *Pregunta:* ${text}\n🕯️ *Los espíritus responden:* ${elegir(RESPUESTAS_OUIJA)}\n\n+${n} 🍬 por tu valentía${pie()}`);
    }

    /* ───── Acertijo de grupo ───── */
    case 'acertijo': {
      const actual = global.acertijosHw[m.chat];
      if (actual && Date.now() < actual.vence) {
        throw `🧩 Ya hay un acertijo activo:\n\n*${actual.p}*\n\n> Responde con \`${p}respuesta tu respuesta\``;
      }
      const a = elegir(ACERTIJOS);
      global.acertijosHw[m.chat] = {...a, vence: Date.now() + 3 * MIN};
      return m.reply(`${CABECERA}\n\n🧩 *ACERTIJO DE HALLOWEEN*\n\n${a.p}\n\n> El primero en responder con \`${p}respuesta ...\` gana *60* 🍬\n> ⏳ Tienen 3 minutos.`);
    }

    case 'respuesta':
    case 'resp': {
      const actual = global.acertijosHw[m.chat];
      if (!actual || Date.now() > actual.vence) {
        delete global.acertijosHw[m.chat];
        throw `🧩 No hay ningún acertijo activo. Pide uno con \`${p}acertijo\``;
      }
      if (!text) throw `🧩 Escribe tu respuesta.\n> Ejemplo: \`${p}respuesta calabaza\``;
      if (!actual.r.some((r) => sinTildes(text).includes(sinTildes(r)))) {
        return m.reply('❌ Esa no es... ¡sigue intentando! 👻');
      }
      delete global.acertijosHw[m.chat];
      const n = ganar(user, 60);
      return conn.reply(m.chat, `${CABECERA}\n\n🎉 ${tag(m.sender)} acertó: *${actual.r[0]}*\n+${n} 🍬${textoBonus(user, n, 60)}${pie()}`, m, {mentions: [m.sender]});
    }

    /* ───── Disfraz ───── */
    case 'disfraz': {
      const actual = disfrazDe(user);
      const nuevo = /^(nuevo|cambiar)$/i.test(args[0] || '');
      if (actual && !nuevo) {
        return m.reply(`${CABECERA}\n\n🎭 Tu disfraz: ${actual.emoji} *${actual.nombre}*\n✨ Rareza: *${actual.rareza}*\n🍬 Bonus: *+${actual.bonus}%* en todos los dulces que ganes\n\n> Cámbialo con \`${p}disfraz nuevo\` (30 🍬)`);
      }
      if (actual && nuevo) {
        if (user.dulces < 30) throw `🎭 Cambiar de disfraz cuesta *30* 🍬 y tienes *${user.dulces}*.`;
        user.dulces -= 30;
      }
      const d = sortearDisfraz();
      user.disfrazHw = d.nombre;
      return m.reply(`${CABECERA}\n\n🎭 Abriste el baúl de disfraces y salió...\n\n${d.emoji} *${d.nombre}*\n✨ Rareza: *${d.rareza}*\n🍬 Bonus: *+${d.bonus}%* en todos los dulces que ganes${pie()}`);
    }

    /* ───── Susto a otro usuario ───── */
    case 'susto':
    case 'asustar': {
      const victima = m.mentionedJid?.[0] || m.quoted?.sender;
      if (!victima) throw `👻 Menciona a quien quieres asustar.\n> Ejemplo: \`${p}susto @usuario\``;
      if (numero(victima) === numero(m.sender)) throw '🪞 No puedes asustarte a ti mismo... ¿o sí?';
      esperar(user, 'susto', '🦇 Aún te estás recuperando del último susto.');
      const v = datos(users[victima] || (users[victima] = {}));
      if (v.dulces < 5) {
        return conn.reply(m.chat, `${CABECERA}\n\n👻 ${tag(m.sender)} asustó a ${tag(victima)}...\npero no tenía ni un dulce 😅`, m, {mentions: [m.sender, victima]});
      }
      if (Math.random() < 0.55) {
        const n = perder(v, rand(5, 25));
        user.dulces += n;
        v.sustosHw++;
        return conn.reply(m.chat, `${CABECERA}\n\n😱 ${tag(m.sender)} asustó a ${tag(victima)}\ny le quitó *${n}* 🍬 mientras gritaba.`, m, {mentions: [m.sender, victima]});
      }
      const n = perder(user, rand(5, 15));
      v.dulces += n;
      user.sustosHw++;
      return conn.reply(m.chat, `${CABECERA}\n\n💀 ${tag(m.sender)} quiso asustar a ${tag(victima)}\npero el susto se lo llevó él y soltó *${n}* 🍬`, m, {mentions: [m.sender, victima]});
    }

    /* ───── Regalar dulces ───── */
    case 'regalardulces':
    case 'darduces':
    case 'dardulces': {
      const destino = m.mentionedJid?.[0] || m.quoted?.sender;
      const cantidad = parseInt(args.find((a) => /^\d+$/.test(a)));
      if (!destino || !cantidad) throw `🎁 Uso: \`${p}regalardulces @usuario 50\``;
      if (numero(destino) === numero(m.sender)) throw '🎁 No puedes regalarte dulces a ti mismo.';
      if (cantidad < 1 || user.dulces < cantidad) throw `🍬 No tienes suficientes dulces. Tienes *${user.dulces}*.`;
      const d = datos(users[destino] || (users[destino] = {}));
      user.dulces -= cantidad;
      d.dulces += cantidad;
      return conn.reply(m.chat, `${CABECERA}\n\n🎁 ${tag(m.sender)} le regaló *${cantidad}* 🍬 a ${tag(destino)}`, m, {mentions: [m.sender, destino]});
    }

    /* ───── Poción (apuesta) ───── */
    case 'pocion':
    case 'poción': {
      const apuesta = parseInt(args[0]);
      if (!apuesta || apuesta < 10) throw `🧪 Apuesta al menos 10 🍬.\n> Ejemplo: \`${p}pocion 50\``;
      if (apuesta > 500) throw '🧪 El caldero solo aguanta hasta *500* 🍬 por poción.';
      if (user.dulces < apuesta) throw `🧪 No tienes suficientes dulces. Tienes *${user.dulces}*.`;
      esperar(user, 'pocion', '🧪 El caldero todavía está caliente.');
      const s = Math.random();
      let texto;
      if (s < 0.10) {
        user.dulces += apuesta * 2;
        texto = `✨ *¡POCIÓN LEGENDARIA!* Tus dulces se triplicaron: +${apuesta * 2} 🍬`;
      } else if (s < 0.55) {
        user.dulces += apuesta;
        texto = `💚 *¡Poción exitosa!* Duplicaste tu apuesta: +${apuesta} 🍬`;
      } else {
        user.dulces -= apuesta;
        texto = `☠️ *La poción explotó.* Perdiste ${apuesta} 🍬`;
      }
      return m.reply(`${CABECERA}\n\n🧪 Echaste *${apuesta}* 🍬 al caldero de la bruja...\n\n${texto}${pie()}`);
    }

    /* ───── Info ───── */
    case 'dulces':
    case 'misdulces': {
      return m.reply(`${CABECERA}\n\n🍬 Dulces: *${user.dulces}*\n🎟️ Tickets dorados: *${user.ticketsHw}*\n\n> Canjea ${PRECIO_TICKET} 🍬 por 1 🎟️ con \`${p}canjear\``);
    }

    case 'perfilhw':
    case 'perfilhalloween': {
      const d = disfrazDe(user);
      return conn.reply(m.chat, `${CABECERA}

🦇 *PERFIL DE HALLOWEEN*
👤 ${tag(m.sender)}

🎭 Disfraz: ${d ? `${d.emoji} *${d.nombre}* (${d.rareza}, +${d.bonus}%)` : `ninguno · usa \`${p}disfraz\``}
🍬 Dulces: *${user.dulces}*
🎟️ Tickets dorados: *${user.ticketsHw}*
👻 Fantasmas cazados: *${user.fantasmasHw}*
😱 Sustos recibidos: *${user.sustosHw}*`, m, {mentions: [m.sender]});
    }

    case 'topdulces':
    case 'tophalloween': {
      const miembros = new Set((participants || []).map((u) => numero(u.id)));
      const puntos = (u) => (u.ticketsHw || 0) * PRECIO_TICKET + (u.dulces || 0);
      const top = Object.entries(users)
          .filter(([jid, u]) => miembros.has(numero(jid)) && puntos(u) > 0)
          .sort(([, a], [, b]) => puntos(b) - puntos(a))
          .slice(0, 10);
      if (!top.length) throw `🕸️ Nadie tiene dulces todavía. ¡Usa \`${p}truco\`!`;
      const medallas = ['🥇', '🥈', '🥉'];
      const lista = top.map(([jid, u], i) => `${medallas[i] || `${i + 1}.`} ${tag(jid)} — ${u.dulces || 0} 🍬 · ${u.ticketsHw || 0} 🎟️`).join('\n');
      return conn.reply(m.chat, `${CABECERA}\n\n🏆 *TOP DULCES DEL GRUPO*\n\n${lista}`, m, {mentions: top.map(([jid]) => jid)});
    }

    /* ───── Tickets y sorteo ───── */
    case 'canjear': {
      const cantidad = Math.max(1, parseInt(args[0]) || 1);
      const costo = cantidad * PRECIO_TICKET;
      if (user.dulces < costo) throw `🍬 Necesitas *${costo}* dulces para ${cantidad} ticket(s). Tienes *${user.dulces}*.`;
      user.dulces -= costo;
      user.ticketsHw += cantidad;
      return m.reply(`${CABECERA}\n\n🎟️ Canjeaste *${cantidad}* ticket(s) dorado(s).${pie()}`);
    }

    case 'sorteo':
    case 'sorteohalloween': {
      if (!isOwner && !isROwner) throw '🔒 Solo el dueño del bot puede hacer el sorteo.';
      const cuantos = Math.max(1, Math.min(20, parseInt(args[0]) || 1));
      const miembros = new Set((participants || []).map((u) => numero(u.id)));
      const bolsa = Object.entries(users)
          .filter(([jid, u]) => miembros.has(numero(jid)) && (u.ticketsHw || 0) > 0)
          .map(([jid, u]) => ({jid, tickets: u.ticketsHw}));
      if (!bolsa.length) throw '🎟️ Nadie en este grupo tiene tickets dorados todavía.';
      const totalTickets = bolsa.reduce((s, b) => s + b.tickets, 0);
      const ganadores = [];
      while (ganadores.length < cuantos && bolsa.length) {
        const total = bolsa.reduce((s, b) => s + b.tickets, 0);
        let r = Math.random() * total;
        const i = bolsa.findIndex((b) => (r -= b.tickets) < 0);
        ganadores.push(bolsa.splice(i < 0 ? 0 : i, 1)[0]);
      }
      const lista = ganadores.map((g, i) => `${['🥇', '🥈', '🥉'][i] || `${i + 1}.`} ${tag(g.jid)} (${g.tickets} 🎟️)`).join('\n');
      return conn.reply(m.chat, `${CABECERA}

🎉 *¡GRAN SORTEO DE HALLOWEEN!* 🎉
🎟️ Tickets en juego: *${totalTickets}*

🏆 *GANADORES:*
${lista}

👑 Escríbanle al dueño para reclamar su bot.
> ¡Gracias a todos por participar! 🎃👻`, m, {mentions: ganadores.map((g) => g.jid)});
    }
  }
};

handler.help = ['halloween', 'truco', 'calabaza', 'fantasma', 'cazar', 'cementerio', 'ouija', 'acertijo', 'disfraz', 'susto', 'regalardulces', 'pocion', 'dulces', 'perfilhw', 'topdulces', 'canjear', 'sorteo'];
handler.tags = ['halloween'];
handler.command = /^(halloween|truco|trato|dulce|calabaza|fantasma|invocar|cazar|cazafantasmas|cementerio|explorar|ouija|acertijo|respuesta|resp|disfraz|susto|asustar|regalardulces|dardulces|darduces|poci[oó]n|dulces|misdulces|perfilhw|perfilhalloween|topdulces|tophalloween|canjear|sorteo|sorteohalloween)$/i;
handler.group = true;
export default handler;
