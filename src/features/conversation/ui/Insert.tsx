import { useNavigate } from "@solidjs/router";
import { logger } from "~/libraries/logger";
import { postConversation } from "../domain/service";

export function Insert() {
	const navigate = useNavigate();
	async function createConversation() {
		try {
			const id = await postConversation();
			navigate(`/${id}`);
		} catch (error) {
			logger.error("Error creating new conversation:", error);
		}
	}

	return (
		<button type="button" onClick={createConversation}>
			New Conversation 🍙
		</button>
	);
}
