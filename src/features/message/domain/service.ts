import { action, query } from "@solidjs/router";
import ollama from "ollama";
import { disableModel, runPythonCrawler } from "~/libraries/process";

import {
	createMessage,
	readAllMessagesByConversationId,
	updateMessage,
} from "../data-access/crud";
import { type Message, MessageStatus } from "./domain";

export const getAllMessagesByConversationId = query(
	async (id, _options = {}) => {
		"use server";
		return (await readAllMessagesByConversationId(id)) as unknown as Message[];
	},
	"messagesByConversationId",
);

// export async function getAllMessagesByConversationId(conversationId: string) {
//   "use server";
//   return query(
//     //(id, options = {})
//     () => readAllMessagesByConversationId(conversationId).then((r) => r),
//     "messagesByConversationId"
//   );
// }

// Server function to insert message
// export async function postMessage(
//   content: string,
//   conversationId: string,
//   metadata?: Message["metadata"]
// ): Promise<string[]> {

// }

export const postMessage = action(
	async (conversationId: string, formData: FormData) => {
		"use server";
		const content = formData.get("content")?.toString();
		if (content === undefined) {
			return;
		}
		const metadataString: string | null = null; //metadata ? JSON.stringify(metadata) : null;

		createMessage({
			type: "user",
			content,
			conversationId,
			metadata: metadataString,
			status: MessageStatus.DELIVERED,
		});

		const responseId = createMessage({
			type: "assistant",
			content: null,
			conversationId,
			metadata: metadataString,
			status: MessageStatus.LOADING,
		});

		// const list = await ollama.list();
		const model = "gemma3n:latest"; //"gemma3n:latest"; // "hf.co/mradermacher/JSL-MedQwen-14b-reasoning-GGUF:Q4_K_M"; ;
		const response = await ollama.chat({
			model,
			messages: [{ role: "user", content }],
			//   stream: true,
		});

		const finalResponse = response.message.content;

		// for await (const part of response) {
		//   console.log(part.message.content);
		//   finalResponse += part.message.content;
		// }

		updateMessage({
			id: responseId,
			content: finalResponse,
			conversationId,
			status: MessageStatus.DELIVERED,
		});
		await disableModel(model);
	},
);

export async function generateImage() {
	"use server";
	await runPythonCrawler();
	// console.log("helo");
	// const resp = await ollama.generate({
	//   model: "hf.co/mradermacher/JSL-MedQwen-14b-reasoning-GGUF:Q4_K_M",
	//   prompt: "Hello world <laugh>",
	// });
	// console.log(resp);
}
