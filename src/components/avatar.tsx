import path from "path";
import React from "react";

import { UserProfile, BotProfile } from "../interfaces";

import { isBot, getFile } from "../utils.js";

interface AvatarProps {
  profile?: UserProfile | BotProfile;
}

export const Avatar: React.FunctionComponent<AvatarProps> = ({ profile }) => {
  if (!profile) return null;

  let url;
  if (isBot(profile)) {
    if (!profile.icons || !profile.icons.image_72) return null;
    url = profile.icons.image_72;
  } else {
    if (!profile.image_72) return null;
    url = profile.image_72;
  }

  const filePath = `avatars/${path.basename(url.split("?")[0])}`;
  const src = getFile(url, filePath);

  return <img className="avatar" src={src} />;
};
