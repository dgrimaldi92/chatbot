import db from "~/libraries/db";
import type Message from "../domain/domain";

db.exec(`
  CREATE TABLE IF NOT EXISTS messages(
    key INTEGER PRIMARY KEY,
    id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,

    conversation_id TEXT NOT NULL,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
`);

export async function readAllMessagesByConversationId(conversationId: string) {
  const query = db.prepare(`
    SELECT * FROM messages 
    INNER JOIN conversations ON conversations.id = messages.conversation_id
    WHERE conversation_id = ? 
    ORDER BY created_at ASC
`);
  return query.all(conversationId); // returns array of { id, role, content }
}

export function createMessage({
  type,
  content,
  conversationId,
  metadata,
}: {
  type: Message["type"];
  content: string;
  conversationId: string;
  metadata: string | null;
}): string {
  const id = crypto.randomUUID();
  const query = db.prepare(
    "INSERT INTO messages (id, type, content, conversation_id, metadata) VALUES (?, ?, ?, ?, ?)"
  );
  query.run(id, type, content, conversationId, metadata);
  return id;
}
