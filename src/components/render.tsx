import fs from "fs-extra";
import { Ora } from "ora";
import React from "react";
import ReactDOMServer from "react-dom/server.js";

import { Channel, Message, ChunkInfo } from "../interfaces";

import { getChannels } from "../utils.js";

import { IndexPage } from "./indexPage.js";
import { MessagesPage } from "./messagesPage.js";

export function renderMessagesPage(channel: Channel, messages: Message[], index: number, chunksInfo: ChunkInfo[], spinner: Ora) {
  const page = (
    <MessagesPage
      channel={channel}
      messages={messages}
      index={index}
      chunksInfo={chunksInfo}
    />
  );

  const filePath = `build/html/${channel.id!}-${index}.html`;
  spinner.text = `${channel.name || channel.id}: Writing ${index + 1}/${chunksInfo.length} ${filePath}`;
  spinner.render();

  return renderAndWrite(page, filePath);
}

export async function renderIndexPage() {
  const channels = await getChannels();
  const page = <IndexPage channels={channels} />;

  return renderAndWrite(page, "build/index.html");
}

async function renderAndWrite(page: JSX.Element, filePath: string) {
  const html = ReactDOMServer.renderToStaticMarkup(page);
  const htmlWDoc = "<!DOCTYPE html>" + html;

  fs.outputFileSync(filePath, htmlWDoc);
}
