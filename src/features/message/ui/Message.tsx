import { Match, Switch, splitProps } from "solid-js";

import parser from "~/libraries/markdown";
import type Message from "../domain/domain";

type MessageDetailsProps = {
  message: Message;
};

export default function MessageDetails(props: MessageDetailsProps) {
  const [{ message }] = splitProps(props, ["message"]);
  return (
    <Switch fallback={<div>Not Found</div>}>
      <Match when={message.type === "user"}>
        <div class="flex items-start justify-end space-x-2">
          <div
            class="bg-pink-200 text-gray-800 p-3 rounded-xl rounded-br-none shadow"
            innerHTML={parser(message.content)}
          />
        </div>
      </Match>
      <Match when={message.type === "assistant"}>
        <div class="flex items-start space-x-2">
          <div
            class="bg-pink-100 text-gray-800 p-3 rounded-xl rounded-bl-none shadow"
            innerHTML={parser(message.content)}
          />
        </div>
      </Match>
    </Switch>
  );
}
