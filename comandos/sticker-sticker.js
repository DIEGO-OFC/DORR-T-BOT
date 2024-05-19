import {sticker} from '../lib/sticker.js'; 
 import uploadFile from '../lib/uploadFile.js'; 
 import uploadImage from '../lib/uploadImage.js'; 
 import {webp2png} from '../lib/webp2mp4.js'; 
  
 const handler = async (m, {conn, args, usedPrefix, command}) => { 
   if (usedPrefix == 'a' || usedPrefix == 'A') return; 
   let stiker = false; 
   const user = db.data.users[m.sender]; 
   try { 
     const q = m.quoted ? m.quoted : m; 
     const mime = (q.msg || q).mimetype || q.mediaType || ''; 
     if (/webp|image|video/g.test(mime)) { 
       const img = await q.download?.(); 
       if (!img) throw `*[❌] Responda a una imagen o video*`; 
       let out; 
       try { 
         stiker = await sticker(img, false, global.packname, global.author); 
       } catch (e) { 
         console.error(e); 
       } finally { 
         if (!stiker) { 
           if (/webp/g.test(mime)) out = await webp2png(img); 
           else if (/image/g.test(mime)) out = await uploadImage(img); 
           else if (/video/g.test(mime)) out = await uploadFile(img); 
           if (typeof out !== 'string') out = await uploadImage(img); 
           stiker = await sticker(false, out, global.packname, global.author); 
         } 
       } 
     } else if (args[0]) { 
       if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author); 
       else return m.reply('*[⚠️] El enlace no es válido, debe terminar en .jpg*'); 
     } 
   } catch (e) { 
     console.error(e); 
     if (!stiker) stiker = e; 
   } finally { 
     if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m); 
     else throw '*[❌] Responda a una imagen o video*'; 
   } 
 }; 
 handler.help = ['sfull']; 
 handler.tags = ['sticker']; 
 handler.command = /^s(tic?ker)?(gif)?(wm)?$/i; 
  
 export default handler; 
  
 const isUrl = (text) => { 
   return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi')); 
 };





/*import {sticker} from "../lib/sticker.js";
import uploadFile from "../lib/uploadFile.js";
import uploadImage from "../lib/uploadImage.js";
import {webp2png} from "../lib/webp2mp4.js";

let handler = async (m, {conn, args, usedPrefix, command}) => {
  let stiker = false;
  let username = conn.getName(m.sender);
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) if ((q.msg || q).seconds > 11) return m.reply("⚠️ *_Máximo 10 segundos._*");
      let img = await q.download?.();
      if (!img)
        throw `*[❌] Responda a una imagen o video*`;
      let out;
      try {
        stiker = await sticker(img, false, global.packname, global.author);
      } catch (e) {
        console.error(e);
      } finally {
        await m.reply(wait);
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img);
          else if (/image/g.test(mime)) out = await uploadImage(img);
          else if (/video/g.test(mime)) out = await uploadFile(img);
          if (typeof out !== "string") out = await uploadImage(img);
          stiker = await sticker(false, out, global.packname, global.author);
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author);
      else return m.reply("URL invalido");
    }
  } catch (e) {
    console.error(e);
    if (!stiker) stiker = e;
  } finally {
    if (stiker)
      conn.sendFile(
        m.chat,
        stiker,
        "sticker.webp",
        "",
        m,
        true,
        {
          contextInfo: {
            forwardingScore: 200,
            isForwarded: false,
            externalAdReply: {showAdAttribution: false, title: wm3, body: `h`, mediaType: 2, sourceUrl: md, thumbnail: imagen5},
          },
        },
        {quoted: m}
      );
    else
      throw "*[❌] Responda a una imagen o video*";
  }
};
handler.help = ["sticker"];
handler.tags = ["sticker"];
handler.command = ["s", "sticker", "stiker"];

export default handler;

const isUrl = (text) => {
  return text.match(
    new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, "gi")
  );
};*/
