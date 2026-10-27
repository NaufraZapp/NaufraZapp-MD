/**
 * Textos de bienvenida y despedida de NaufraZapp-MD.
 *
 * Variables que se reemplazan:
 *   @user    -> mención del usuario
 *   @subject -> nombre del grupo
 *   @desc    -> descripción del grupo
 *   @admin   -> mención del admin que eliminó (solo en expulsión)
 *
 * Si el grupo tiene textos personalizados (#setwelcome / #setbye), se usan esos.
 */

export const BIENVENIDA = `╭•───────────────────◊
┆ 🌎 *@subject*
╰•───────────────────◊

👋🏻 *¡Bienvenido/a!* @user
Nos alegra mucho tenerte aquí. ✨

📌 Lee la descripción y respeta las reglas
para que todos pasemos un buen rato.
•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•
@desc
•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•
> Escribe \`#menu\` para ver todo lo que puedo hacer.`;

export const SALIDA = `╭•───────────────────◊
┆ 🌎 *@subject*
╰•───────────────────◊

👋🏻 @user *salió del grupo.*
Gracias por haber sido parte de esta comunidad,
¡te deseamos lo mejor! 🍀`;

export const EXPULSION = `╭•───────────────────◊
┆ 🌎 *@subject*
╰•───────────────────◊

🚫 @user *fue eliminado/a del grupo.*
•┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈•
👮🏻 Acción realizada por: @admin`;

/** Dígitos de un jid, aunque venga como "123@lid", "51...:2@s.whatsapp.net" u objeto. */
export function digitos(jid) {
  if (!jid) return '';
  if (typeof jid === 'object') jid = jid.phoneNumber || jid.id || jid.lid || '';
  return String(jid).split('@')[0].split(':')[0].replace(/\D/g, '');
}

/**
 * Baileys 7 manda los participantes de los avisos del grupo como texto JSON
 * ('{"id":"123@lid","phoneNumber":"51...@s.whatsapp.net"}'). Devuelve el jid
 * con el número real si lo hay (para que la mención salga bien).
 */
export function jidParticipante(p) {
  if (!p) return '';
  if (typeof p === 'object') return p.phoneNumber || p.id || p.lid || '';
  const s = String(p).trim();
  if (s.startsWith('{')) {
    try {
      const o = JSON.parse(s);
      return o.phoneNumber || o.id || o.lid || '';
    } catch {}
  }
  return s;
}

/** Todas las formas conocidas de identificar a un participante (número y LID). */
export function idsParticipante(p) {
  if (!p) return [];
  let o = p;
  if (typeof p === 'string' && p.trim().startsWith('{')) {
    try {
      o = JSON.parse(p);
    } catch {}
  }
  if (typeof o === 'string') return [digitos(o)].filter(Boolean);
  return [o.id, o.phoneNumber, o.lid, o.jid].map(digitos).filter(Boolean);
}

/** Arma el texto final reemplazando las variables. */
export function armarTexto(plantilla, {usuario, grupo = '', desc = '', admin = ''}) {
  return String(plantilla)
      .replace(/@subject/g, grupo)
      .replace(/@desc/g, desc || 'Sin descripción')
      .replace(/@user/g, '@' + digitos(usuario))
      .replace(/@admin/g, admin ? '@' + digitos(admin) : 'un admin');
}
