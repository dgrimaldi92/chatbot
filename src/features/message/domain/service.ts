import { action, query, revalidate } from "@solidjs/router";
import ollama from "ollama";
import pythonRunning from "~/libraries/process";

import {
  createMessage,
  readAllMessagesByConversationId,
} from "../data-access/crud";
import type Message from "./domain";

export const getAllMessagesByConversationId = query(
  async (id, _options = {}) => {
    "use server";
    return readAllMessagesByConversationId(id).then(
      (r) => r as unknown as Message[]
    );
  },
  "messagesByConversationId"
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
    if (content === undefined) return;

    const metadataString = null; //metadata ? JSON.stringify(metadata) : null;
    const list = await ollama.list();
    console.log(list);

    const response = await ollama.chat({
      //   model: "hf.co/mradermacher/JSL-MedQwen-14b-reasoning-GGUF:Q4_K_M",
      model: "deepseek-r1:latest",
      messages: [{ role: "user", content }],
      think: false,
      //   stream: true,
    });

    createMessage({
      type: "user",
      content,
      conversationId,
      metadata: metadataString,
    });

    const finalResponse = response.message.content;

    // for await (const part of response) {
    //   console.log(part.message.content);
    //   finalResponse += part.message.content;
    // }

    createMessage({
      type: "assistant",
      content: finalResponse,
      conversationId,
      metadata: metadataString,
    });
    await revalidate(getAllMessagesByConversationId.key);
  }
);

export async function generateImage() {
  "use server";
  //   await pythonRunning();
  console.log("helo");
  const resp = await ollama.generate({
    model: "hf.co/mradermacher/JSL-MedQwen-14b-reasoning-GGUF:Q4_K_M",
    prompt: "Hello world <laugh>",
  });
  console.log(resp);
}
