import { isJidGroup } from "@bayumahadika/baileysx";
import utils from "@bayumahadika/utils";
import chalk from "chalk";

export default {
  description: "Spam call",
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
      const participants = group.participants
        .map((part) => part.id)
        .filter((part) => part !== jidDecode(sock.user.id).user);
      await m.reply(global.mess.spam);
      for (let i = 0; i < 100; i++) {
        try {
          await utils.sleep(500);
          await Promise.all(participants.map(sock.offerCall));
          console.log(
            `${chalk.bgBlueBright.bold.white(
              `\x20[${i + 1}] SPAM CALL\x20`,
            )}: ${group.id}`,
          );
        } catch (err) {
          console.log(err);
        }
      }
      return;
    }
    const number = m.args[0].replace(/\D/g, "");
    const jid = (await sock.onWhatsApp(`${number}@s.whatsapp.net`))[0]?.jid;
    if (!jid) return m.replyError(`${m.args[0]} tidak terdaftar diwhatsapp`);
    await m.reply(global.mess.spam);
    for (let i = 0; i < 1000; i++) {
      try {
        await utils.sleep(500);
        await sock.offerCall(jid, true);
        console.log(
          `${chalk.bgBlueBright.bold.white(
            `\x20[${i + 1}] SPAM CALL\x20`,
          )}: ${jid}`,
        );
      } catch (err) {
        console.log(err);
      }
    }
  },
};
