import React from "react";

import { Channel } from "../interfaces";

import { getUser } from "../utils.js";

import { Avatar } from "./avatar.js";

interface ChannelLinkProps {
  channel: Channel;
}

export const ChannelLink: React.FunctionComponent<ChannelLinkProps> = ({ channel }) => {
  let name = channel.name || channel.id;
  let leadSymbol = <span># </span>;

  if (channel.is_im && (channel as any).user) {
    leadSymbol = <Avatar profile={getUser(channel.user)} />;
  }

  if (channel.is_mpim) {
    leadSymbol = <></>;
    name = name?.replace("Group messaging with: ", "");
  }

  return (
    <li key={name}>
      <a title={name} href={`html/${channel.id!}-0.html`} target="iframe">
        {leadSymbol}
        <span>{name}</span>
      </a>
    </li>
  );
};
