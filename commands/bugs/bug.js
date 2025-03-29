import fs from "fs";
import { isJidGroup } from "@bayumahadika/baileysx";

export default {
  description: "Bug",
  onlyOwner: false,
  onlyPremium: true,
  handle: async (sock, m) => {
    if (!m.args[0])
      return m.replyError("Nomor atau group id target dibutuhkan");

    if (isJidGroup(m.args[0])) {
      const group = Object.values(await sock.groupFetchAllParticipating()).find(
        (group) => group.id === m.args[0],
      );
      if (!group)
        return m.replyError(
          `${m.args[0]} tidak terdaftar atau belum bergabung dengan group tersebut.`,
        );
      return sock.sendMessage(
        m.chatId,
        {
          image: {
            url: global.images.banner,
          },
          caption: `*💉 Group ditemukan silahkan pilih menu bug dibawah:*`,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 1,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.bot.newsletterJid,
              newsletterName: global.bot.name,
              serverMessageId: 101,
            },
            externalAdReply: {
              mediaType: 1,
              renderLargerThumbnail: false,
              showAdAttribution: true,
              sourceUrl: "https://youtube.com/@bayumahadika",
              thumbnail: fs.readFileSync(global.images.logo),
              thumbnailUrl: global.images.logo,
              title: global.bot.name,
            },
          },
          buttons: [
            {
              buttonId: "action",
              buttonText: {
                displayText: "ALL BUG GROUP",
              },
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify({
                  title: "ALL BUG GROUP",
                  sections: [
                    {
                      title: global.bot.name,
                      highlight_label: "Favorit",
                      rows: [
                        {
                          title: "FORCE CLOSE",
                          id: `${global.bot.prefix}xforceclose ${group.id}`,
                        },
                        {
                          title: "SPAM CALL",
                          id: `${global.bot.prefix}xoffercall ${group.id}`,
                        },
                      ],
                    },
                  ],
                }),
              },
            },
          ],
          headerType: 2,
          viewOnce: true,
        },
        { quoted: m.quoted },
      );
    }
    const number = m.args[0].replace(/\D/g, "");
    const jid = (await sock.onWhatsApp(`${number}@s.whatsapp.net`))[0]?.jid;
    if (!jid) return m.replyError(`${m.args[0]} tidak terdaftar diwhatsapp`);
    await sock.sendMessage(
      m.chatId,
      {
        image: {
          url: global.images.banner,
        },
        caption: `*💉 Target ${m.args[0]} terdaftar diwhatsapp, silahkan pilih menu bug dibawah:*`,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 1,
          forwardedNewsletterMessageInfo: {
            newsletterJid: global.bot.newsletterJid,
            newsletterName: global.bot.name,
            serverMessageId: 101,
          },
          externalAdReply: {
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: "https://youtube.com/@bayumahadika",
            thumbnail: fs.readFileSync(global.images.logo),
            thumbnailUrl: global.images.logo,
            title: global.bot.name,
          },
        },
        buttons: [
          {
            buttonId: "action",
            buttonText: {
              displayText: "ALL BUG PRIVATE",
            },
            nativeFlowInfo: {
              name: "single_select",
              paramsJson: JSON.stringify({
                title: "ALL BUG PRIVATE",
                sections: [
                  {
                    title: global.bot.name,
                    highlight_label: "Favorit",
                    rows: [
                      {
                        title: "DELAY MAKER - INVISIBLE",
                        id: `${global.bot.prefix}xdelayinvis ${jid}`,
                      },
                      {
                        title: "DELAY MAKER - INVISIBLE 2",
                        id: `${global.bot.prefix}xdelayinvistwo ${jid}`,
                      },
                      {
                        title: "DELAY MAKER - INVIS STORY",
                        id: `${global.bot.prefix}xdelayinvisstory ${jid}`,
                      },
                      {
                        title: "DELAY MAKER",
                        id: `${global.bot.prefix}xdelaymaker ${jid}`,
                      },

                      {
                        title: "FORCE CLOSE",
                        id: `${global.bot.prefix}xforceclose ${jid}`,
                      },
                      {
                        title: "SPAM CALL",
                        id: `${global.bot.prefix}xoffercall ${jid}`,
                      },
                    ],
                  },
                ],
              }),
            },
          },
        ],
        headerType: 2,
        viewOnce: true,
      },
      { quoted: m.quoted },
    );
  },
};
