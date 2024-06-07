(async () => {
require("./settings")
const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, DisconnectReason, proto , jidNormalizedUser,WAMessageStubType, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, msgRetryCounterMap, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const { state, saveCreds } = await useMultiFileAuthState('./ShadowSession')
const chalk = require('chalk')
const moment = require('moment')
const fs = require('fs')
const yargs = require('yargs/yargs')
const { smsg, sleep, delay, getBuffer} = require('./libs/fuctions')
const _ = require('lodash')
const NodeCache = require('node-cache')
const os = require('os')
const { execSync } = require('child_process')
const util = require('util')
const pino = require('pino')
const Pino = require("pino")
const cfonts = require('cfonts') 
const { tmpdir } = require('os')
const { join } = require('path')
const PhoneNumber = require('awesome-phonenumber')
const readline = require("readline")
const { Boom } = require('@hapi/boom')
const { parsePhoneNumber } = require("libphonenumber-js")

const { readdirSync, statSync, unlinkSync } = require('fs')
const {say} = cfonts;
const color = (text, color) => {
return !color ? chalk.green(text) : color.startsWith('#') ? chalk.hex(color)(text) : chalk.keyword(color)(text)
}

//base de datos
var low
try {
low = require('lowdb')
} catch (e) {
low = require('./libs/database/lowdb')
}

const { Low, JSONFile } = low
const mongoDB = require('./libs/database/mongoDB')

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`./database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
game: {},
database: {},
settings: {},
setting: {},
others: {},
sticker: {},
...(global.db.data || {})}
  global.db.chain = _.chain(global.db.data)}
loadDatabase() //Gracias aiden pro 😎 
//skid chinga tu madre :v

if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
  }, 30 * 1000)


//tmp
function clearTmp() {
const tmp = [tmpdir(), join(__dirname, './tmp')];
const filename = [];
tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
return filename.map((file) => {
const stats = statSync(file);
if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) {
return unlinkSync(file); // 3 minutes
}
return false;
})}

if (!opts['test']) { 
if (global.db) { 
setInterval(async () => { 
if (global.db.data) await global.db.write(); 
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']))); 
}, 30 * 1000); 
}}
setInterval(async () => {
await clearTmp()
console.log(chalk.cyanBright(`▣════════[ 𝐀𝐔𝐓𝐎𝐂𝐋𝐄𝐀𝐑-𝐓𝐌𝐏 ]════════════...\n│\n▣─➢ 𝐁𝐚𝐬𝐮𝐫𝐚 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐝𝐚 ✅\n│\n▣═════════════════════════════════════...`))}, 180000)
//_________________

//sessions/jadibts
function purgeSession() {
let prekey = []
let directorio = readdirSync("./ShadowSession")
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-') || file.startsWith('session-') || file.startsWith('sender-') || file.startsWith('app-') 
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./ShadowSession/${files}`)
})} 

function purgeSessionSB() {
try {
let listaDirectorios = readdirSync('./jadibts/');
let SBprekey = []
listaDirectorios.forEach(directorio => {
if (statSync(`./jadibts/${directorio}`).isDirectory()) {
let DSBPreKeys = readdirSync(`./jadibts/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-') || fileInDir.startsWith('app-') || fileInDir.startsWith('session-')
})
SBprekey = [...SBprekey, ...DSBPreKeys]
DSBPreKeys.forEach(fileInDir => {
unlinkSync(`./jadibts/${directorio}/${fileInDir}`)
})}})
if (SBprekey.length === 0) return; 
console.log(`🟢 NO HAY ARCHIVO POR ELIMINAR`)
} catch (err) {
console.log(`🟢 ALGO SALIO MAL DURANTE LA ELIMINACIÓN, ARCHIVO NO ELIMINADOS`)
}}

function purgeOldFiles() {
const directories = ['./ShadowSession/', './jadibts/']
const oneHourAgo = Date.now() - (60 * 60 * 1000)
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
const filePath = path.join(dir, file)
stat(filePath, (err, stats) => {
if (err) throw err;
if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') { 
unlinkSync(filePath, err => {  
if (err) throw err
console.log(chalk.bold.green(`🟢 Archivos ${file} borrado con éxito`))})
} else {  
console.log(chalk.bold.red(`🟢 Archivos ${file} borrado ` + err))
} }) }) }) })}
setInterval(async () => {
  await purgeSession();
  console.log(chalk.cyanBright(`▣════════[ AUTOPURGESESSIONS ]════════════...\n│\n▣─➢ ARCHIVOS ELIMINADOS ✅\n│\n▣═════════════════════════════════════...`));
}, 1000 * 60 * 60);
setInterval(async () => {
  await purgeSessionSB();
  console.log(chalk.cyanBright(`▣════════[ AUTO_PURGE_SESSIONS_SUB-BOTS ]════════════...\n│\n▣─➢ ARCHIVOS ELIMINADOS ✅\n│\n▣═════════════════════════════════════...`));
}, 1000 * 60 * 60);
setInterval(async () => {
  await purgeOldFiles();
  console.log(chalk.cyanBright(`▣════════[ AUTO_PURGE_OLDFILES ]════════════...\n│\n▣─➢ ARCHIVOS ELIMINADOS ✅\n│\n▣═════════════════════════════════════...`));
}, 1000 * 60 * 60);
//___________
    
async function startBot() {

console.info = () => {}
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }), })
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
let { version, isLatest } = await fetchLatestBaileysVersion();   

const socketSettings = {
printQRInTerminal: true,
logger: pino({ level: 'silent' }),
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
browser: [`ShadowBot-MD`,'Safari','3.0'], 
msgRetry,
msgRetryCache,
version,
syncFullHistory: true,
getMessage: async (key) => {
if (store) {
const msg = store.loadMessage(key.remoteJid, key.id)
return msg.message && undefined
} return {
conversation: 'ShadowBot-MD',
}}}

const sock = makeWASocket(socketSettings)

async function getMessage(key) {
if (store) {
const msg = store.loadMessage(key.remoteJid, key.id)
return msg.message && undefined
} return {
conversation: '',
}}

sock.ev.on('messages.upsert', async chatUpdate => {
//console.log(JSON.stringify(chatUpdate, undefined, 2))
try {
chatUpdate.messages.forEach(async (mek) => {
try {
//mek = (Object.keys(chatUpdate.messages[0])[0] !== "senderKeyDistributionMessage") ?  chatUpdate.messages[0] : chatUpdate.messages[1]

if (!mek.message) return
//console.log(chatUpdate.type)
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
    
if (!sock.public && !m.key.fromMe && !chatUpdate.type === 'notify') return
m = smsg(sock, mek)
//if (m.key.fromMe === true) return
//if (m.mtype === 'senderKeyDistributionMessage') mek = chatUpdate.messages[1]
global.numBot = sock.user.id.split(":")[0] + "@s.whatsapp.net"
global.numBot2 = sock.user.id
try {
require("./main")(sock, m, chatUpdate, mek)
} catch (e) {
let sktext = util.format(e)
console.log(sktext)
}} catch (e) {
console.log(e)
}})
} catch (err) {
console.log(err)
}})

//anticall
sock.ev.on('call', async (fuckedcall) => { 
 sock.user.jid = sock.user.id.split(":")[0] + "@s.whatsapp.net" // jid in user?
let anticall = global.db.data.settings[numBot].anticall
if (!anticall) return
console.log(fuckedcall)
for (let fucker of fuckedcall) {
if (fucker.isGroup == false) {
if (fucker.status == "offer") {
await sock.sendTextWithMentions(fucker.from, `Hey @${fucker.from.split('@')[0]}\n*${sock.user.name} no recibe ${fucker.isVideo ? `videollamadas` : `llamadas` } serás bloqueado.*\n*Si accidentalmente llamaste, comunícate con el propietario para que lo desbloquee.*\n\n`)
await sleep(8000)
await sock.updateBlockStatus(fucker.from, "block")
}}}})

//detect
sock.ev.on("groups.update", async (json) => {
console.log(color(json, '#009FFF'))
const res = json[0];
let detect = global.db.data.chats[res.id].detect
if (!detect) return
if (res.announce == true) {
await sleep(2000)
try {
ppgroup = await sock.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}

let text = `『❗』*¡Ahora solo los administradores pueden enviar mensajes!*`
sock.sendMessage(res.id, {text: text}, {quoted: null})
} else if (res.announce == false) {
await sleep(2000)
try {
ppgroup = await sock.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `『❗』*Ahora todos los participantes pueden mandar mensajes 🗣️*`
sock.sendMessage(res.id, {text: text}, {quoted: null})
} else if (res.restrict == true) {
await sleep(2000)
try {
ppgroup = await sock.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `『❗』*ᴀʜᴏʀᴀ sᴏʟᴏ ʟᴏs ᴀᴅᴍɪɴɪsᴛʀᴀᴅᴏʀᴇs ᴘᴜᴇᴅᴇ ᴇᴅɪᴛᴀʀ ʟᴏs ᴀᴊᴜsᴛᴇ ᴅᴇʟ ɢʀᴜᴘᴏ*`
sock.sendMessage(res.id, {text: text}, {quoted: null})
} else if (res.restrict == false) {
await sleep(2000)
try {
ppgroup = await sock.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `『❗』*AHORA TODOS LOS PARTICIPANTES PUEDEN EDITAR LA INFO DEL GRUPO *`
sock.sendMessage(res.id, {text: text}, {quoted: null})
} else if(!res.desc == ''){
await sleep(2000)
try {
ppgroup = await sock.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `『❗』 *𝚂𝙴 𝙷𝙰 𝙼𝙾𝙳𝙸𝙵𝙸𝙲𝙰𝙳𝙾 𝙻𝙰 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝙲𝙸𝙾𝙽 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾*\n\n*𝙽𝚄𝙴𝚅𝙰 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝙲𝙸𝙾𝙽:*\n${res.desc}`
sock.sendMessage(res.id, {text: text}, {quoted: null})
} else {
await sleep(2000)
try {
ppgroup = await sock.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
let text = `『❗』*𝚂𝙴 𝙷𝙰 𝙼𝙾𝙳𝙸𝙵𝙸𝙲𝙰𝙳𝙾 𝙴𝙻 𝙽𝙾𝙼𝙱𝚁𝙴 𝙳𝙴𝙻 𝙶𝚁𝚄𝙿𝙾*\n*𝙽𝚄𝙴𝚅𝙾 𝙽𝙾𝙼𝙱𝚁𝙴:* ${res.subject}`
sock.sendMessage(res.id, {text: text}, {quoted: null, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100})
/*sock.sendMessage(res.id, {text: text,  
contextInfo:{  
forwardingScore: 9999999,  
isForwarded: true,   
mentionedJid:[m.sender],  
"externalAdReply": {  
"showAdAttribution": true,  
"containsAutoReply": false,
"renderLargerThumbnail": false,  
"title": '「 ＡＪＵＳＴＥＳ ＤＥＬ ＧＲＵＰＯ 」', 
"mediaType": 1,   
"thumbnail": imagen1, 
"mediaUrl": md,  
"sourceUrl": md
}}}, { quoted: null })*/
}})

//Welcome adaptado
sock.ev.on('group-participants.update', async (anu) => {
let welcome = global.db.data.chats[anu.id].welcome
if (!welcome) return
console.log(anu)
try {
let metadata = await sock.groupMetadata(anu.id)
let participants = anu.participants
for (let num of participants) {
try {
ppuser = await sock.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await sock.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
memb = metadata.participants.length
welc = await getBuffer(ppuser)
leave = await getBuffer(ppuser)
if (anu.action == 'add') {
const buffer = await getBuffer(ppuser)
const time = moment.tz('America/Bogota').format('HH:mm:ss')
const date = moment.tz('America/Bogota').format('DD/MM/YYYY')
let name = num
const miembros = metadata.participants.length
sock.sendMessage(anu.id, {image: welc, caption: `┌─❖ 
 │「 BIENVENIDO/A 👋 」 
 └┬❖ 「  @${name.split("@")[0]}  」 
    │✑  *bienvenido a:*
    │✑  ${metadata.subject}
    └───────────────┈

${metadata.desc}`, mentions: [num]}, {quoted: null})
/*sock.sendMessage(anu.id, { 
text: `┌─❖ 
 │「 BIENVENIDO/A 👋 」 
 └┬❖ 「  @${name.split("@")[0]}  」 
    │✑  *bienvenido a:*
    │✑  ${metadata.subject}
    └───────────────┈

${metadata.desc}`,
contextInfo:{
forwardingScore: 9999999,
isForwarded: true, 
mentionedJid:[num],
"externalAdReply": {
"showAdAttribution": true,
"renderLargerThumbnail": true,
"thumbnail": welc, 
"title": '乂 ＷＥＬＣＯＭＥ 乂', 
body: `${metadata.subject}`,
"containsAutoReply": true,
"mediaType": 1, 
"mediaUrl": [md, nn], 
"sourceUrl": [md, nn]}}})*/
} else if (anu.action == 'remove') {
const buffer = await getBuffer(ppuser)
let name = num
const members = metadata.participants.length
sock.sendMessage(anu.id, {image: leave, caption: `*╔══════════════*\n*╟❧ @${name.split("@")[0]}*\n*╟❧ 𝙷𝙰𝚂𝚃𝙰 𝙿𝚁𝙾𝙽𝚃𝙾 👋🏻* \n*╚══════════════*`, mentions: [num]}, {quoted: null})
} else if (anu.action == 'promote') {
const buffer = await getBuffer(ppuser)
let name = num
sock.sendMessage(anu.id, { text: `[✅] *@${name.split("@")[0]} ES UN NUEVO ADMINISTRADOR!!*`, mentions: [num]}, {quoted: null})
} else if (anu.action == 'demote') {
const buffer = await getBuffer(ppuser)
let name = num
sock.sendMessage(anu.id, { text: `『❗』 *@${name.split("@")[0]}  𝙰𝙱𝙰𝙽𝙳𝙾𝙽𝙰 𝙴𝙻 𝙶𝚁𝚄𝙿𝙾 𝙳𝙴 𝙰𝙳𝙼𝙸𝙽𝚂 !!*`, mentions: [num]}, {quoted: null})
}}} catch (err) {
console.log(err)
}})

sock.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect, qr, receivedPendingNotifications, isNewLogin} = update;
console.log(receivedPendingNotifications)
if (isNewLogin) sock.isInit = true

if (connection == 'connecting') {
console.log("📑  Cargando comandos");
console.log("📦  Comandos Cargados correctamente");
console.log("☑️ㅤIniciando bot...");

say("THE SHADOW-BOT-MD", {
  font: "tiny",
  align: "center",
  colors: ["#ff8000"],
});
say(`CREADO POR DIEGO-OFC`, {
  font: "console",
  align: "center",
  colors: ["red"],
});

} else if (qr !== undefined) {
console.log(color('[SYS]', '#009FFF'),
color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
color(`\n[🔄] Escanea este codigo QR, el codigo QR expira en 60 segundos`, '#f12711')
)
} else if (connection === 'close') {
console.log(
color('[SYS]', '#009FFF'),
color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
color(`[❌] Conexion cerrada, por favor borre la carpeta sessions y reescanee el codigo QR`, '#f64f59')
);
lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
? startBot()
: console.log(
color('[SYS]', '#009FFF'), 
color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
color(`Wa Web logged Out`, '#f64f59')
);;
} else if (connection == 'open') {
console.log(color(` `,'magenta'))
console.log(color(JSON.stringify(sock.user, null, 2), 'yellow'))
console.log(color('[SYS]', '#009FFF'),
color(moment().format('DD/MM/YY HH:mm:ss'), '#A1FFCE'),
color(`\n╭──────────────────────────────✧•°•°···\n│➢ 𝐁𝐎𝐓 𝐂𝐎𝐍𝐄𝐂𝐓𝐀𝐃𝐎 𝐂𝐎𝐑𝐑𝐄𝐂𝐓𝐀𝐌𝐄𝐍𝐓𝐄 ☑️\n│❏ 𝐁𝐎𝐓 𝐈𝐍𝐒𝐓𝐀𝐋𝐀𝐃𝐎:SHADOW-BOT-MD ☑️\n╰──────────────────────────────✧•°•°···` + receivedPendingNotifications, '#38ef7d')
);
}});

sock.public = true
store.bind(sock.ev)
sock.ev.on('creds.update', saveCreds)
process.on('uncaughtException', console.log)
process.on('unhandledRejection', console.log)
process.on('RefenceError', console.log)
}

startBot()

})()