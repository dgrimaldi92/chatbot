import { action, query } from "@solidjs/router";
import { serverLogger as logger } from "~/libraries/logger";
import { runPythonCrawler } from "~/libraries/process";
import { ProtoType } from "~/libraries/protos//llm/type";
import { llmClient, searchClient } from "~/libraries/protos/asyncClient";
import type { Prompt } from "~/libraries/protos/llm/prompt";
import { Role } from "~/libraries/protos/llm/role";
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
    const query = formData.get("content")?.toString();
    const isWebSearchActive: string | undefined = formData
      .get("search")
      ?.toString();

    if (query === undefined || query === "") {
      return;
    }

    const metadataString: string | null = null; //metadata ? JSON.stringify(metadata) : null;

    createMessage({
      content: query,
      conversationId,
      metadata: metadataString,
      status: MessageStatus.DELIVERED,
      type: "user",
    });

    const responseId = createMessage({
      content: null,
      conversationId,
      metadata: metadataString,
      status: MessageStatus.LOADING,
      type: "assistant",
    });

    const messages: Prompt[] = [{ content: query, role: Role.USER }];

    let response: string;
    if (isWebSearchActive) {
      const searchResults = (
        await llmClient.generateText({
          prompt: messages[0],
          type: ProtoType.TYPE_SEARCH,
        })
      ).response.prompt?.content;
      response = await webSearch(query, searchResults ?? "");
    } else {
      try {
        response =
          (
            await llmClient.generateText({
              prompt: messages[0],
              type: ProtoType.TYPE_MESSAGE,
            })
          ).response.prompt?.content ?? "No response from the language model";
      } catch (error) {
        logger.error(error);
      }
    }

    updateMessage({
      content: response,
      conversationId,
      id: responseId,
      status: MessageStatus.DELIVERED,
    });
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

export async function webSearch(
  query: string,
  searchResults: string,
): Promise<string> {
  "use server";
  try {
    const queries = [
      ...new Set(
        [query, ...(searchResults?.split("\n") ?? [])]
          .map((value) => value.replace(/\n/g, "").trim())
          .filter((val) => val !== ""),
      ),
    ];

    return (
      await searchClient.getScrapedText({
        queries,
        userQuery: query,
      })
    ).response.scrape
      .map(({ content }) => content)
      .join("\n");
  } catch (error) {
    logger.error(error);
    throw new Error((error as Error).message);
  }
}
