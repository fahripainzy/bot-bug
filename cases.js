import {
  isJidStatusBroadcast,
  isJidGroup,
  jidDecode,
  getContentType,
} from "@bayumahadika/baileysx";
import chalk from "chalk";

export default async function cases(sock, message) {
  const m = message;
  if (!m.message || (m.message && m.message.protocolMessage)) return;
  if (global.setting.readstory && isJidStatusBroadcast(m.key.remoteJid))
    return sock.readMessages([m.key]).catch(console.log);
  m.id = m.key.id;
  m.chatId = m.key.remoteJid;
  m.isGroup = isJidGroup(m.chatId);
  m.userId = m.isGroup
    ? m.key.participant || `${jidDecode(m.participant).user}@s.whatsapp.net`
    : m.chatId;
  m.fromMe = m.key.fromMe;
  m.itsSelf = jidDecode(m.chatId).user === global.bot.number;
  m.isOwner = jidDecode(m.userId).user === global.owner.number;
  m.isPremium = global.db.users.find((user) => user.id === m.userId)?.premium;
  m.type = getContentType(m.message);
  m.body =
    m.type === "conversation"
      ? m.message.conversation
      : m.message[m.type].text ||
        m.message[m.type].caption ||
        m.message[m.type].message?.buttonsMessage?.contentText ||
        m.message[m.type].selectedButtonId ||
        (m.message[m.type].nativeFlowResponseMessage?.paramsJson
          ? JSON.parse(m.message[m.type].nativeFlowResponseMessage.paramsJson)
              .id
          : "") ||
        "";
  m.text =
    m.type === "conversation"
      ? m.message.conversation
      : m.message[m.type].text ||
        m.message[m.type].caption ||
        m.message[m.type].message?.buttonsMessage?.contentText ||
        m.message[m.type].selectedDisplayText ||
        m.message[m.type].body?.text ||
        "";
  m.isQuoted = m.message[m.type].contextInfo?.quotedMessage
    ? {
        message: m.message[m.type].contextInfo.quotedMessage,
        userId: m.message[m.type].contextInfo.participant,
      }
    : false;
  m.isMentioned =
    m.message[m.type].contextInfo?.mentionedJid?.length > 0
      ? {
          mentionedJid: m.message[m.type].contextInfo.mentionedJid,
        }
      : false;
  m.isForwarded = m.message[m.type].contextInfo?.isForwarded;
  m.isLink =
    /(http:\/\/|https:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]+(\.[a-zA-Z]+)?(\/[^\s]*)?/g.test(
      m.text,
    );
  m.isCmd = m.body.startsWith(global.bot.prefix);
  m.cmd = m.isCmd
    ? m.body.trim().replace(global.bot.prefix, "").split(" ")[0].toLowerCase()
    : "";
  m.args = m.isCmd
    ? m.body
        .replace(/^\S*\b/g, "")
        .split("|")
        .map((x) => x.trim())
        .filter((x) => x)
    : [];
  m.quoted = {
    key: {
      fromMe: false,
      remoteJid: "status@broadcast",
      participant: "0@s.whatsapp.net",
      id: m.id,
    },
    message: {
      conversation: `💬 ${m.text}`,
    },
  };

  if (
    (global.setting.self && !m.fromMe) ||
    (!global.setting.public && !m.fromMe && !m.isOwner)
  )
    return;

  if (!m.isCmd) return;

  m.reply = (text) =>
    sock.sendMessage(
      m.chatId,
      {
        text,
      },
      {
        quoted: m.quoted,
      },
    );
  m.replyError = (text) =>
    sock.sendMessage(
      m.chatId,
      {
        text: `*ERROR:* ${text}`,
      },
      {
        quoted: {
          key: {
            fromMe: false,
            remoteJid: "status@broadcast",
            participant: "0@s.whatsapp.net",
            id: m.id,
          },
          message: {
            conversation: `❌ ${m.text}`,
          },
        },
      },
    );

  for (let command of global.bot.commands) {
    if (command.command === m.cmd) {
      try {
        if (command.onlyOwner && !m.isOwner && !m.fromMe)
          return m.reply(global.mess.onlyOwner);
        if (command.onlyPremium && !m.isOwner && !m.fromMe && !m.isPremium)
          return m.reply(global.mess.onlyPrem);
        console.log(
          `${chalk.bgBlueBright.bold.white("\x20COMMAND\x20")}\x20${chalk.blueBright.bold(m.cmd)}\n- FROM: ${m.userId.split("@")[0]}\n- ARGS: ${m.args}\n- DESC: ${command.description}\n- PATH: ${command.path}`,
        );
        if (command.handle) await command.handle(sock, m);
      } catch (err) {
        console.log(err);
        m.replyError(err.message);
      }
      break;
    }
  }
}
