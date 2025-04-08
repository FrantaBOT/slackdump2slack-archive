import fs from "fs-extra";
import path from "path";
import { format } from "date-fns";
import { createRequire } from "node:module";

import { User, UserProfile, BotProfile, Channel, Emoji, Message } from "./interfaces";

const require = createRequire(import.meta.url);
const emojiData = require("emoji-datasource");

let users: User[] = getUsers();
let emojis: Record<string, Emoji> = getEmojis();
let _unicodeEmoji: Record<string, string>;
let filesToDownload: Record<string, string> = {};

export function getUsers(): User[] {
  return getJson<Channel[]>("data/users.json");
}

export function getChannels(): Channel[] {
  return getJson<Channel[]>("data/channels.json");
}

export function getEmojis(): Record<string, Emoji> {
  return getJson<Record<string, Emoji>>("data/emojis.json");
}

export function getMessages(channelName: string): Message[] {
  let messages: Message[] = [];

  const path =  `data/${channelName}/`;
  const files = fs.readdirSync(path);
  for (let file of files) {
    if (file.endsWith(".json")) {
      let arr = getJson<Message[]>(path + "/" + file);
      messages = messages.concat(arr);
    }
  };

  for (let i = 0; i < messages.length; i++) {
    const replies = messages[i].replies;
    if (replies && replies.length > 0) {
      for (let j = 0; j < replies.length; j++) {
        for (let p = i; p < messages.length; p++) {
          if (replies[j].user && replies[j].ts && replies[j].user == messages[p].user && replies[j].ts == messages[p].ts) {
            replies[j] = messages[p];
            messages.splice(p, 1);
            break;
          }
        }
      }
    }
  }

  return messages.reverse();
}

function getJson<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    console.log(`Missing: ${filePath}`);
    process.exit(1);
  }

  const data: T = fs.readJSONSync(filePath);

  return data;
}

export function isBot(profile: any): profile is BotProfile {
  return 'icons' in profile;
}

export function getUser(userId?: string): UserProfile | undefined {
  const user = users.find((user) => user.id === userId);
  if (!user || !user.profile) {
    return undefined;
  }

	return {
    avatar_hash: user.profile.avatar_hash!,
    image_72: user.profile.image_72!,
    first_name: user.profile.first_name!,
    real_name: user.profile.real_name!,
    display_name: user.profile.display_name!,
    team: user.profile.team!,
    name: user.name!,
    is_restricted: user.is_restricted!,
    is_ultra_restricted: user.is_ultra_restricted!
  };
}

export function getName(profile?: UserProfile | BotProfile): string {
  if (!profile) return "Unknown";

  if (isBot(profile)) {
    return profile.name!;
  } else {
    return profile.real_name || profile.display_name || profile.name;
  }
}

export function getChannelName(channel: Channel) {
  return (
    channel.name || channel.id || channel.purpose?.value || "Unknown channel"
  );
}
export function isPublicChannel(channel: Channel) {
  return !channel.is_private && !channel.is_mpim && !channel.is_im;
}

export function isPrivateChannel(channel: Channel) {
  return channel.is_private && !channel.is_im && !channel.is_mpim;
}

export function slackTimestampToJavaScriptTimestamp(ts?: string): number {
	if (!ts) {
	  return 0;
	}
  
	const splitTs = ts.split(".") || [];
	const jsTs = parseInt(`${splitTs[0]}${splitTs[1].slice(0, 3)}`, 10);
  
	return jsTs;
}

export function formatTimestamp(message: Message, dateFormat = "PPPPpppp") {
  const jsTs = slackTimestampToJavaScriptTimestamp(message.ts);
  const ts = format(jsTs, dateFormat);

  return ts;
}

function getUnicodeEmoji() {
  if (_unicodeEmoji) {
    return _unicodeEmoji;
  }

  _unicodeEmoji = {};
  for (const emoji of emojiData) {
    _unicodeEmoji[emoji.short_name as string] = emoji.unified;
  }

  return _unicodeEmoji;
}

export function getEmojiFilePath(name: string) {
  const url = emojis[name]?.url;
  if (!url) {
    return;
  }

  const filePath = getFile(url, `emojis/${path.basename(url)}`);

  return filePath;
}

export function isEmojiUnicode(name: string) {
  const unicodeEmoji = getUnicodeEmoji();
  const nameLess = name.split(":")[0];
  return !!unicodeEmoji[nameLess];
}

export function getEmojiUnicode(name: string) {
  const unicodeEmoji = getUnicodeEmoji();
  const nameLess = name.split(":")[0];
  const unified = unicodeEmoji[nameLess];
  const split = unified.split("-");

  return split
    .map((code) => {
      return String.fromCodePoint(parseInt(code, 16));
    })
    .join("");
}

export function getFile(url: string, filePath: string) {
  filesToDownload[filePath] = url;
  return filePath;
}

export async function downloadFiles() {
  if (!fs.existsSync("build/html/avatars")) fs.mkdirSync("build/html/avatars");
  if (!fs.existsSync("build/html/emojis")) fs.mkdirSync("build/html/emojis");
  if (!fs.existsSync("build/html/files")) fs.copySync(`data/attachments/`, `build/html/files`);

  const channels = getChannels();
  for (const channel of channels) {
    fs.copySync(`data/${channel.name}/attachments/`, `build/html/files`)
  }

  for (const filePath in filesToDownload) {
    const destination = `build/html/${filePath}`;
    if (fs.existsSync(destination)) continue;
    console.log(`Downloading: ${destination}`);

    const res = await fetch(filesToDownload[filePath]);
    if (res.status !== 200) {
      console.log(`Failed to download: ${destination}`);
      continue;
    }

    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destination, Buffer.from(buffer));
  }
}
