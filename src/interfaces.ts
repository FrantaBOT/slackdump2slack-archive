import { Channel as SlackChannel } from "@slack/web-api/dist/response/ConversationsListResponse";
import { User as SlackUser } from "@slack/web-api/dist/response/UsersInfoResponse";
import { Message as SlackMessage, BotProfile as SlackBotProfile } from "@slack/web-api/dist/response/ConversationsHistoryResponse";
import { Reaction as SlackReaction } from "@slack/web-api/dist/response/ReactionsGetResponse";

export type Channel = SlackChannel;

export type User = SlackUser;

export interface Message extends SlackMessage {
  replies?: Message[];
  user_team?: string;
  source_team?: string;
  user_profile?: UserProfile;
  reply_users_count?: number;
}

export interface UserProfile {
  avatar_hash: string;
  image_72: string;
  first_name: string;
  real_name: string;
  display_name: string;
  team: string;
  name: string;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
}

export type BotProfile = SlackBotProfile;

export type Reaction = SlackReaction;

export interface Emoji {
  name: string
  url: string
  team_id: string
  user_id: string
  created: number
  user_display_name: string
  avatar_hash: string
}

export interface ChunkInfo {
  oldest?: string;
  newest?: string;
  count: number;
}
