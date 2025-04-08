import React from "react";
import { sortBy } from "lodash-es";

import { Channel } from "../interfaces";

import { isPublicChannel, isPrivateChannel } from "../utils.js";

import { ChannelLink } from "./channelLink.js";
import { HtmlPage } from "./htmlPage.js";

interface IndexPageProps {
  channels: Channel[];
}

export const IndexPage: React.FunctionComponent<IndexPageProps> = (props) => {
  const { channels } = props;
  const sortedChannels = sortBy(channels, "name");

  const publicChannels = sortedChannels
    .filter((channel) => isPublicChannel(channel) && !channel.is_archived)
    .map((channel) => <ChannelLink key={channel.id} channel={channel} />);

  const publicArchivedChannels = sortedChannels
    .filter((channel) => isPublicChannel(channel) && channel.is_archived)
    .map((channel) => <ChannelLink key={channel.id} channel={channel} />);

  const privateChannels = sortedChannels
    .filter((channel) => isPrivateChannel(channel) && !channel.is_archived)
    .map((channel) => <ChannelLink key={channel.id} channel={channel} />);

  const privateArchivedChannels = sortedChannels
    .filter((channel) => isPrivateChannel(channel) && channel.is_archived)
    .map((channel) => <ChannelLink key={channel.id} channel={channel} />);

  const groupChannels = sortedChannels
    .filter((channel) => channel.is_mpim)
    .map((channel) => <ChannelLink key={channel.id} channel={channel} />);

  return (
    <HtmlPage base="html/">
      <div id="index">
        <div id="channels">
          <p className="section">Public Channels</p>
          <ul>{publicChannels}</ul>
          <p className="section">Private Channels</p>
          <ul>{privateChannels}</ul>
          <p className="section">Group DMs</p>
          <ul>{groupChannels}</ul>
          <p className="section">Archived Public Channels</p>
          <ul>{publicArchivedChannels}</ul>
          <p className="section">Archived Private Channels</p>
          <ul>{privateArchivedChannels}</ul>
        </div>
        <div id="messages">
          <iframe name="iframe" src={`html/${channels[0].id!}-0.html`} />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const urlSearchParams = new URLSearchParams(window.location.search);
            const channelValue = urlSearchParams.get("c");
            const tsValue = urlSearchParams.get("ts");
            
            if (channelValue) {
              const iframe = document.getElementsByName('iframe')[0]
              iframe.src = "html/" + decodeURIComponent(channelValue) + '.html' + '#' + (tsValue || '');
            }
            `,
          }}
        />
      </div>
    </HtmlPage>
  );
};
