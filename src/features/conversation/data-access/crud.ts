import { db } from "~/libraries/db";

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations(
    key INTEGER PRIMARY KEY,
    id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  ) STRICT
`);

export function readAllConversations() {
	const query = db.prepare(
		"SELECT * FROM conversations ORDER BY created_at ASC",
	);
	return query.all();
}

export function createConversation(title: string): string {
	const id = crypto.randomUUID();
	// Create a prepared statement to insert data into the database.
	const insert = db.prepare(
		"INSERT INTO conversations (id, title) VALUES (?, ?)",
	);
	// Execute the prepared statement with bound values.
	insert.run(id, title);
	return id;
}
