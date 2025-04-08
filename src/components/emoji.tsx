import React from "react";

import { isEmojiUnicode, getEmojiUnicode, getEmojiFilePath } from "../utils.js";

interface EmojiProps {
  name: string;
}

export const Emoji: React.FunctionComponent<EmojiProps> = ({ name }) => {
  if (isEmojiUnicode(name)) {
    return <>{getEmojiUnicode(name)}</>;
  }

  return <img src={getEmojiFilePath(name)} />;
};
