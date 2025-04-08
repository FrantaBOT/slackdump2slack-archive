import React from "react";
import slackMarkdown from "slack-markdown";

import { Message as MessageType } from "../interfaces";

import { getUser, getName, formatTimestamp } from "../utils.js";

import { Avatar } from "./avatar.js";

interface MessageProps {
  message: MessageType;
  channelId: string;
}

export const Message: React.FunctionComponent<MessageProps> = (props) => {
  const { message } = props;
  const username = getName(message.user_profile ?? message.bot_profile);
  const slackCallbacks = {
    user: ({ id }: { id: string }) => `@${getName(getUser(id))}`,
  };

  return (
    <div className="message-gutter" id={message.ts}>
      <div className="" data-stringify-ignore="true">
        <Avatar profile={message.user_profile ?? message.bot_profile}  />
      </div>
      <div className="">
        <span className="sender">{username}</span>
        <span className="timestamp">
          <span className="c-timestamp__label">{formatTimestamp(message)}</span>
        </span>
        <br />
        <div
          className="text"
          dangerouslySetInnerHTML={{
            __html: slackMarkdown.toHTML(message.text ?? "", {
              escapeHTML: false,
              slackCallbacks,
            }),
          }}
        />
        {message.attachments?.map((attachment, index) => (
          <div
            key={index}
            className="text"
            dangerouslySetInnerHTML={{
              __html: slackMarkdown.toHTML(attachment.fallback ?? "", {
                escapeHTML: false,
                slackCallbacks,
              }),
            }}
          />
        ))}
        {props.children}
      </div>
    </div>
  );
};
