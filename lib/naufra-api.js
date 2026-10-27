/**
 * Cliente de la API propia: https://api.naufrabot.com
 *
 * La URL y la clave se configuran en config.js:
 *   global.naufraApi = { url: 'https://api.naufrabot.com', key: 'TU_CLAVE' }
 *
 * Todos los plugins que usan API llaman a estas funciones, así que para cambiar
 * la clave o el dominio solo hay que tocar config.js.
 */
import fetch from 'node-fetch'
import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

export function naufraBase() {
  return String(global.naufraApi?.url || 'https://api.naufrabot.com').replace(/\/+$/, '')
}

export function naufraKey() {
  return String(global.naufraApi?.key || '')
}

/** Arma la URL completa de un endpoint con la apikey incluida. */
export function naufraUrl(ruta, params = {}) {
  const url = new URL(naufraBase() + '/' + String(ruta).replace(/^\/+/, ''))
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  }
  url.searchParams.set('apikey', naufraKey())
  return url.toString()
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function pedir(url, { timeout = 60000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeout)
  try {
    return await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0' } })
  } finally {
    clearTimeout(timer)
  }
}

/** GET que devuelve JSON. Reintenta si el servidor falla o responde HTML. */
export async function naufraJson(ruta, params = {}, { timeout = 60000, reintentos = 2 } = {}) {
  const url = naufraUrl(ruta, params)
  let ultimoError
  for (let i = 0; i <= reintentos; i++) {
    try {
      const res = await pedir(url, { timeout })
      const texto = await res.text()
      if (!texto || texto.trim().startsWith('<')) throw new Error(`respuesta no válida (HTTP ${res.status})`)
      const json = JSON.parse(texto)
      if (res.status === 401 || res.status === 403) {
        throw new Error(json?.mensaje || json?.message || 'apikey inválida o sin permisos')
      }
      return json
    } catch (e) {
      ultimoError = e
      if (/apikey/i.test(e?.message || '')) break
      if (i < reintentos) await espera(1000 * (i + 1))
    }
  }
  throw ultimoError || new Error('la API no respondió')
}

/** GET que devuelve un archivo (video, audio, imagen, apk...). */
export async function naufraArchivo(ruta, params = {}, { timeout = 180000 } = {}) {
  const res = await pedir(naufraUrl(ruta, params), { timeout })
  const tipo = res.headers.get('content-type') || ''
  const buffer = Buffer.from(await res.arrayBuffer())
  if (!res.ok || /application\/json|text\/html/i.test(tipo)) {
    let detalle = `HTTP ${res.status}`
    try {
      const j = JSON.parse(buffer.toString('utf8'))
      detalle = j?.mensaje || j?.message || j?.error || detalle
    } catch {}
    throw new Error(`la API no devolvió el archivo (${detalle})`)
  }
  let nombre = ''
  const disp = res.headers.get('content-disposition') || ''
  const m = disp.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
  if (m) {
    try { nombre = decodeURIComponent(m[1]) } catch { nombre = m[1] }
  }
  return { buffer, tipo: tipo.split(';')[0] || 'application/octet-stream', nombre }
}

/* ───────────────────────── YouTube ───────────────────────── */

/**
 * /ytinfo acepta un link o un texto de búsqueda.
 * Respuesta: { Estado: 'online', Resultado: { Titulo, Duracion, Canal:{Nombre}, Visualizaciones,
 *              Miniatura, EnlaceYoutube, EnlaceDescarga } }
 */
export async function ytInfo(linkOTexto) {
  const json = await naufraJson('ytinfo', { url: String(linkOTexto).trim() })
  const r = json?.Resultado
  if (!r || (json?.Estado && json.Estado !== 'online')) return null
  return {
    titulo: r.Titulo || 'Desconocido',
    duracion: r.Duracion || '—',
    canal: r.Canal?.Nombre || r.Canal || '—',
    vistas: r.Visualizaciones ?? '—',
    miniatura: r.Miniatura || '',
    url: r.EnlaceYoutube || String(linkOTexto).trim(),
    descarga: r.EnlaceDescarga || ''
  }
}

/** /ytsearch -> { status, resultados:[{ title, author, duration, views, url, thumbnail }] } */
export async function ytBuscar(texto) {
  const json = await naufraJson('ytsearch', { q: String(texto).trim() })
  if (!json?.status || !Array.isArray(json.resultados)) return []
  return json.resultados.map((v) => ({
    title: v.title || 'Desconocido',
    author: typeof v.author === 'object' ? (v.author?.name || '—') : (v.author || '—'),
    duration: v.duration || v.timestamp || '—',
    views: v.views ?? 0,
    url: v.url || (v.videoId ? `https://youtu.be/${v.videoId}` : ''),
    image: v.thumbnail || v.image || ''
  })).filter((v) => v.url)
}

/** URL directa del MP3 (para pasarla a sendMessage). Usa ytmp3file para iPhone. */
export function ytMp3Url(urlVideo, { archivo = false } = {}) {
  return naufraUrl(archivo ? 'ytmp3file' : 'ytmp3', { url: urlVideo })
}

/** URL directa del MP4. */
export function ytMp4Url(urlVideo) {
  return naufraUrl('ytmp4', { url: urlVideo })
}

/* ───────────────────────── Redes sociales ───────────────────────── */

export const instagramUrl = (link) => naufraUrl('instagram', { url: link })
export const facebookUrl = (link) => naufraUrl('fbvideo', { url: link })
export const tiktokUrl = (link) => naufraUrl('tiktok', { url: link })
export const twitterUrl = (link) => naufraUrl('twitter', { url: link })
export const pinterestUrl = (texto) => naufraUrl('pinterest-search', { q: texto, t: Date.now() })

/* ───────────────────────── APK ───────────────────────── */

/** /aptoide-search -> { resultado:[{ nombre, paquete, rating, descargas, tamaño, version }] } */
export async function apkBuscar(texto) {
  const json = await naufraJson('aptoide-search', { q: texto, t: Date.now() })
  return Array.isArray(json?.resultado) ? json.resultado : []
}

export const apkDescargaUrl = (paquete) => naufraUrl('aptoide-download', { package: paquete, t: Date.now() })

/* ───────────────────────── IA ───────────────────────── */

/** Evita URLs gigantes: conserva el inicio (instrucciones) y el final (mensaje). */
function recortarPrompt(texto, max = 3500) {
  const t = String(texto || '')
  if (t.length <= max) return t
  const mitad = Math.floor((max - 10) / 2)
  return t.slice(0, mitad) + '\n...\n' + t.slice(-mitad)
}

/** /chatgpt -> { respuesta } */
export async function iaChatGPT(prompt) {
  prompt = recortarPrompt(prompt)
  const json = await naufraJson('chatgpt', { prompt, t: Date.now() })
  if (!json?.respuesta) throw new Error('la IA no respondió')
  return String(json.respuesta)
}

/** /llama -> { respuesta } */
export async function iaLlama(prompt) {
  prompt = recortarPrompt(prompt)
  const json = await naufraJson('llama', { prompt, t: Date.now() })
  if (!json?.respuesta) throw new Error('la IA no respondió')
  return String(json.respuesta)
}

/** /chat (con personalidad) -> { respuesta } */
export async function iaChat(personalidad, pregunta) {
  const prompt = recortarPrompt(personalidad ? `${personalidad} Pregunta: ${pregunta}` : pregunta)
  const json = await naufraJson('chat', { prompt, t: Date.now() })
  if (!json?.respuesta) throw new Error('la IA no respondió')
  return String(json.respuesta)
}

/** Imagen generada por IA (URL directa). */
export const imagineUrl = (prompt) => naufraUrl('api/imagine', { prompt })

/* ───────────────────────── Imágenes ───────────────────────── */

export const hdUrl = (urlImagen) => naufraUrl('api/hd', { url: urlImagen })
export const removeBgUrl = (urlImagen) => naufraUrl('api/removebg', { url: urlImagen })

/** /api/stickersearch -> { status, resultados:[{ sticker }] } */
export async function stickerBuscar(texto, limite = 5) {
  const json = await naufraJson('api/stickersearch', { q: texto, limit: limite })
  if (!json?.status || !Array.isArray(json.resultados)) return []
  return json.resultados.map((r) => r?.sticker).filter(Boolean)
}

/* ───────────────────────── Búsqueda ───────────────────────── */

/** /google -> { titulo, descripcion, enlace } */
export async function googleBuscar(texto) {
  return naufraJson('google', { q: texto, t: Date.now() })
}

/** /wikipedia -> { titulo, descripcion, enlace } */
export async function wikipediaBuscar(texto) {
  return naufraJson('wikipedia', { q: texto, t: Date.now() })
}

/* ───────────────────────── Subir imagen ───────────────────────── */

/**
 * Algunos endpoints (hd, removebg) piden la URL pública de la imagen.
 * Se sube a catbox.moe (gratis, sin clave). Si falla, se intenta con litterbox (24 h).
 */
export async function subirImagenPublica(buffer) {
  const { ext = 'jpg', mime = 'image/jpeg' } = (await fileTypeFromBuffer(buffer)) || {}
  const destinos = [
    { url: 'https://catbox.moe/user/api.php', extra: {} },
    { url: 'https://litterbox.catbox.moe/resources/internals/api.php', extra: { time: '24h' } }
  ]
  let ultimo
  for (const d of destinos) {
    try {
      const form = new FormData()
      form.append('reqtype', 'fileupload')
      for (const [k, v] of Object.entries(d.extra)) form.append(k, v)
      form.append('fileToUpload', buffer, { filename: `imagen.${ext}`, contentType: mime })
      const { data } = await axios.post(d.url, form, { headers: form.getHeaders(), timeout: 60000, maxBodyLength: Infinity })
      const texto = String(data || '').trim()
      if (/^https?:\/\//.test(texto)) return texto
      ultimo = new Error(texto.slice(0, 120) || 'respuesta vacía')
    } catch (e) {
      ultimo = e
    }
  }
  throw ultimo || new Error('no se pudo subir la imagen')
}

/* ───────────────────────── Enviar archivo ───────────────────────── */

/**
 * Descarga un endpoint que devuelve un archivo y lo envía con el tipo correcto
 * (video, imagen, audio o documento). Si la API responde con error, lanza un
 * Error con el mensaje de la API para mostrárselo al usuario.
 */
export async function enviarDesdeNaufra(conn, jid, ruta, params, { caption = '', quoted, fileName, contextInfo } = {}) {
  const { buffer, tipo, nombre } = await naufraArchivo(ruta, params)
  const extra = { ...(caption ? { caption } : {}), ...(contextInfo ? { contextInfo } : {}) }
  let contenido
  if (tipo.startsWith('video/')) {
    contenido = { video: buffer, mimetype: 'video/mp4', fileName: fileName || nombre || 'video.mp4', ...extra }
  } else if (tipo.startsWith('image/')) {
    contenido = { image: buffer, ...extra }
  } else if (tipo.startsWith('audio/')) {
    contenido = { audio: buffer, mimetype: tipo === 'audio/mp3' ? 'audio/mpeg' : tipo, fileName: fileName || nombre || 'audio.mp3' }
  } else {
    contenido = { document: buffer, mimetype: tipo, fileName: fileName || nombre || 'archivo', ...extra }
  }
  return conn.sendMessage(jid, contenido, { quoted })
}

/* ───────────────────────── Extras de la API Naufra ───────────────────────── */

/** /api/translate -> { status, translated } */
export async function traducir(texto, a = 'es', de = 'auto') {
  const json = await naufraJson('api/translate', { text: texto, to: a, from: de })
  if (!json?.status || !json.translated) throw new Error(json?.error || 'no se pudo traducir')
  return String(json.translated)
}

/** /api/clima -> { status, ubicacion, clima, sol } */
export async function clima(lugar) {
  const json = await naufraJson('api/clima', { lugar })
  if (!json?.status) throw new Error(json?.error || 'lugar no encontrado')
  return json
}

/** /horoscopo -> { signo, fecha, descripcion } */
export async function horoscopo(signo) {
  return naufraJson('horoscopo', { signo: String(signo).toLowerCase().trim(), t: Date.now() })
}

/** /waifu-rw -> { status, waifu: { name, franchise, image, ... } } */
export async function waifuAleatoria() {
  const json = await naufraJson('waifu-rw', { t: Date.now() })
  if (!json?.status || !json.waifu?.image) throw new Error('no se obtuvo waifu')
  return json.waifu
}

export const attpUrl = (tipo, texto) => naufraUrl(`api/${tipo}`, { text: texto })

/* ───────────────────────── YouTube con tamaños ───────────────────────── */

/**
 * Descarga audio o video de YouTube con la API Naufra y lo envía.
 * Si pesa mucho lo manda como documento (igual que hacían los plugins antes).
 * Devuelve true si se envió, false si la API falló (para usar el método viejo).
 */
export async function enviarYoutubeNaufra(conn, m, urlOTexto, tipo = 'audio', { titulo = '', documento = false } = {}) {
  try {
    const ruta = tipo === 'video' ? 'ytmp4' : 'ytmp3'
    const { buffer, nombre } = await naufraArchivo(ruta, { url: urlOTexto })
    const mb = buffer.length / 1024 / 1024
    const base = String(titulo || nombre || (tipo === 'video' ? 'video' : 'audio')).replace(/\.(mp3|mp4)$/i, '').replace(/[\\/:*?"<>|]/g, '').slice(0, 80)
    if (tipo === 'video') {
      if (documento || mb >= 100) {
        await conn.sendMessage(m.chat, { document: buffer, mimetype: 'video/mp4', fileName: base + '.mp4' }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4', fileName: base + '.mp4' }, { quoted: m })
      }
    } else if (documento || mb >= 50) {
      await conn.sendMessage(m.chat, { document: buffer, mimetype: 'audio/mpeg', fileName: base + '.mp3' }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', fileName: base + '.mp3' }, { quoted: m })
    }
    return true
  } catch (e) {
    console.log('[API Naufra] YouTube falló, se usa el método anterior:', e?.message || e)
    return false
  }
}

/**
 * Igual que enviarDesdeNaufra pero no lanza error: devuelve true si se envió y
 * false si la API falló (así el plugin puede seguir con sus métodos de siempre).
 */
export async function enviarArchivoNaufra(conn, m, ruta, params, { caption = '', fileName, documento = false } = {}) {
  try {
    if (documento) {
      const { buffer, tipo, nombre } = await naufraArchivo(ruta, params)
      await conn.sendMessage(m.chat, { document: buffer, mimetype: tipo, fileName: fileName || nombre || 'archivo', ...(caption ? { caption } : {}) }, { quoted: m })
    } else {
      await enviarDesdeNaufra(conn, m.chat, ruta, params, { caption, quoted: m, fileName })
    }
    return true
  } catch (e) {
    console.log(`[API Naufra] ${ruta} falló, se usa el método anterior:`, e?.message || e)
    return false
  }
}
