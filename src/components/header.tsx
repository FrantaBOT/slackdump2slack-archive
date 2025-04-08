import React from "react";
import { format } from "date-fns";

import { ChunkInfo, Channel } from "../interfaces";

import { getUser, getName } from "../utils.js";

import { Pagination } from "./pagination.js";

interface HeaderProps {
  index: number;
  chunksInfo: ChunkInfo[];
  channel: Channel;
}

export const Header: React.FunctionComponent<HeaderProps> = (props) => {
  const { channel, index, chunksInfo } = props;
  let created;

  if (!channel.is_im && !channel.is_mpim) {
    const creator = getName(getUser(channel.creator));
    const time = channel.created
      ? format(channel.created * 1000, "PPPP")
      : "Unknown";

    created =
      creator && time ? (
        <span className="created">
          Created by {creator} on {time}
        </span>
      ) : null;
  }

  return (
    <div className="header">
      <h1>{channel.name || channel.id}</h1>
      {created}
      <p className="topic">{channel.topic?.value}</p>
      <Pagination
        channelId={channel.id!}
        index={index}
        chunksInfo={chunksInfo}
      />
    </div>
  );
};
