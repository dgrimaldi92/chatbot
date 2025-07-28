import { createAsync, useParams } from "@solidjs/router";
import { For } from "solid-js";

import { getAllMessagesByConversationId } from "../domain/service";
import MessageDetails from "./Message";

export default function MessageList() {
  const params = useParams();
  const messages = createAsync(() => getAllMessagesByConversationId(params.id));

  return (
    <div class="flex flex-col gap-4">
      <For each={messages()}>{(item) => <MessageDetails message={item} />}</For>
    </div>
  );
}
