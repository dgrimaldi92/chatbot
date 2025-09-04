/** biome-ignore-all lint/style/useNamingConvention: domain use database standard and enum standard */
interface MessageMetadata {
  model: string;
  tokens: number;
  messageType?: string;
  intents?: string;
}

export const MessageStatus = {
  DELIVERED: 2,
  ERROR: 3,
  LOADING: 1,
} as const;

type MessageStatusKeys = keyof typeof MessageStatus;
export type MessageStatusValues = (typeof MessageStatus)[MessageStatusKeys];

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  created_at: string;
  metadata?: MessageMetadata;
  status: MessageStatusValues;
}

export interface Search {
  chunks: {
    url: string;
    sentence: string;
    score: number;
  }[];
}
