import { createConversation, readAllConversations } from "../data-access/crud";
import type Conversation from "./domain";

export async function getAllConversations() {
  "use server";
  return readAllConversations() as unknown as Conversation[];
}

// Server function to insert message
export async function postConversation(): Promise<string> {
  "use server";
  return createConversation("New conversation"); // from db.ts
}
