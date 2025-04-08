import React from "react";

import { Channel, Message, ChunkInfo } from "../interfaces";

import { ParentMessage } from "./parentMessage.js";
import { HtmlPage } from "./htmlPage.js";
import { Header } from "./header.js";

interface MessagesPageProps {
  messages: Message[];
  channel: Channel;
  index: number;
  chunksInfo: ChunkInfo[];
}

export const MessagesPage: React.FunctionComponent<MessagesPageProps> = (props) => {
  const { channel, index, chunksInfo } = props;
  // Newest message is first
  const messages = props.messages
	.map((m) => (
	  <ParentMessage key={m.ts} message={m} channelId={channel.id!} />
	))
	.reverse();

  if (messages.length === 0) {
	messages.push(<span key="empty">No messages were ever sent!</span>);
  }

  return (
	<HtmlPage base="">
	  <div style={{ paddingLeft: 10 }}>
		<Header index={index} chunksInfo={chunksInfo} channel={channel} />
		<div className="messages-list">{messages}</div>
		<script src="scroll.js" />
	  </div>
	</HtmlPage>
  );
};
