import React from "react";

import { Reaction as ReactionType } from "../interfaces";

import { getUser, getName } from "../utils.js";

import { Emoji } from "./emoji.js";

interface ReactionProps {
  reaction: ReactionType;
}

export const Reaction: React.FunctionComponent<ReactionProps> = ({ reaction }) => {
  const reactors = [];

  if (reaction.users) {
    for (const userId of reaction.users) {
      reactors.push(getName(getUser(userId)));
    }
  }

  return (
    <div className="reaction" title={reactors.join(", ")}>
      <Emoji name={reaction.name!} />
      <span>{reaction.count}</span>
    </div>
  );
};
