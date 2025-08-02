import { db } from "~/libraries/db";
import type {
	Message,
	MessageStatusValues as MessageStatus,
} from "../domain/domain";

db.exec(`
  CREATE TABLE IF NOT EXISTS messages(
    key INTEGER PRIMARY KEY,
    id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
	status INTEGER,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,

    conversation_id TEXT NOT NULL,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
`);

export function readAllMessagesByConversationId(conversationId: string) {
	const query = db.prepare(`
		SELECT * FROM messages 
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
	status,
}: {
	type: Message["type"];
	content: string | null;
	conversationId: string;
	metadata: string | null;
	status: MessageStatus;
}): string {
	const id = crypto.randomUUID();
	const query = db.prepare(
		"INSERT INTO messages (id, type, content, conversation_id, metadata, status) VALUES (?, ?, ?, ?, ?, ?)",
	);
	query.run(id, type, content, conversationId, metadata, status);
	return id;
}

export function updateMessage({
	id,
	content,
	conversationId,
	status,
}: {
	id: string;
	content: string;
	conversationId: string;
	status: MessageStatus;
}) {
	const query = db.prepare(`
			UPDATE messages 
			SET content = ?, status = ? 
			WHERE id = ? AND conversation_id = ?
		`);
	query.run(content, status, id, conversationId);
}
