import fs from "fs-extra";
import ora, { Ora } from "ora";
import { chunk } from "lodash-es";

import { Channel, ChunkInfo } from "./interfaces";

import { downloadFiles, getChannels, getMessages } from "./utils.js";
import { formatTimestamp } from "./utils.js";

import { renderMessagesPage, renderIndexPage } from "./components/render.js";

const MESSAGE_CHUNK = 1000;

export async function createHtmlForChannels() {
  let channels = await getChannels();

  console.log(`\n Creating HTML files for ${channels.length} channels...`);

  for (const [i, channel] of channels.entries()) {
    if (!channel.id) {
      console.warn(`Can't create HTML for channel: No id found`, channel);
      continue;
    }

    await createHtmlForChannel(channel, i, channels.length);
  }

  await renderIndexPage();

  fs.copySync("static", "build/html/");

  await downloadFiles();
}

async function createHtmlForChannel(channel: Channel, i: number, total: number) {
  const messages = await getMessages(channel.name!);
  const chunks = chunk(messages, MESSAGE_CHUNK);
  const spinner = ora(
    `Rendering HTML for ${i + 1}/${total} ${channel.name || channel.id}`
  ).start();

  // Calculate info about all chunks
  const chunksInfo: ChunkInfo[] = [];
  for (const iChunk of chunks) {
    chunksInfo.push({
      oldest: formatTimestamp(iChunk[iChunk.length - 1], "Pp"),
      newest: formatTimestamp(iChunk[0], "Pp"),
      count: iChunk.length,
    });
  }

  if (chunks.length === 0) {
    await renderMessagesPage(channel, [], 0, chunksInfo, spinner);
  }

  for (const [chunkI, chunk] of chunks.entries()) {
    await renderMessagesPage(channel, chunk, chunkI, chunksInfo, spinner);
  }

  spinner.succeed(
    `Rendered HTML for ${i + 1}/${total} ${channel.name || channel.id}`
  );
}

createHtmlForChannels();
