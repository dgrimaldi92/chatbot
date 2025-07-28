interface MessageMetadata {
  model: string;
  tokens: number;
  messageType?: string;
  intents?: string;
}

export default interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  created_at: string;
  metadata?: MessageMetadata;
}
