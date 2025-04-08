import React from "react";

import { Message as MessageType } from "../interfaces";

import { Message } from "./message.js";
import { Files } from "./files.js";
import { Reaction } from "./reaction.js";

interface ParentMessageProps {
  message: MessageType;
  channelId: string;
}

export const ParentMessage: React.FunctionComponent<ParentMessageProps> = (props) => {
  const { message, channelId } = props;
  const hasFiles = !!message.files;

  return (
	<Message message={message} channelId={channelId}>
	  {hasFiles ? <Files message={message} /> : null}
	  {message.reactions?.map((reaction) => (
		<Reaction key={reaction.name} reaction={reaction} />
	  ))}
	  {message.replies?.map((reply) => (
		<ParentMessage message={reply} channelId={channelId} key={reply.ts} />
	  ))}
	</Message>
  );
};
