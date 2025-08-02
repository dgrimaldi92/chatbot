import { Match, Switch, splitProps } from "solid-js";

import { parser } from "~/libraries/markdown";
import { type Message, MessageStatus } from "../domain/domain";

type MessageDetailsProps = {
	message: Message;
};

export function MessageDetails(props: MessageDetailsProps) {
	const [{ message }] = splitProps(props, ["message"]);
	return (
		<Switch fallback={<div>Not Found</div>}>
			<Match when={message.status === MessageStatus.DELIVERED}>
				<div
					class={`flex items-start space-x-2 ${message.type === "user" ? "justify-end" : ""}`}
				>
					<div
						class={`${message.type === "user" ? "bg-pink-200 flex-row-reverse" : "text-pink-300"} text-gray-800 p-3 rounded-xl rounded-br-none shadow flex`}
					>
						<div class="min-h-fit flex-1 pt-[0.5rem]">
							<div
								class={`sm:size-10 size-8 rounded-full ${message.type === "user" ? "bg-[url(/img/default.svg)]" : "bg-[url(/img/bot.png)]"} border-purple-500 bg-cover bg-center`}
							/>
						</div>
						<div innerHTML={parser(message.content)} />
					</div>
				</div>
			</Match>
			<Match when={message.status === MessageStatus.LOADING}>
				<div
					class={`flex items-start ${message.type === "user" ? "justify-end space-x-2" : "space-x-2"}`}
				>
					<div class="text-gray-800 p-3 rounded-xl rounded-br-none shadow animate-pulse flex border-pink-300">
						<div class="size-10 rounded-full bg-[url(/img/bot.png)] border-purple-500 bg-cover bg-center" />
						<div class="space-y-6 py-1">
							<div class="h-2 rounded bg-gray-200" />
							<div class="space-y-3">
								<div class="grid grid-cols-3 gap-4">
									<div class="col-span-2 h-2 rounded bg-gray-200" />
									<div class="col-span-1 h-2 rounded bg-gray-200" />
								</div>
								<div class="h-2 rounded bg-gray-200" />
							</div>
						</div>
					</div>
				</div>
			</Match>
			<Match when={message.status === MessageStatus.ERROR}>
				<div
					class={`flex items-start ${message.type === "user" ? "justify-end space-x-2" : "space-x-2"}`}
				>
					<div
						class={`${message.type === "user" ? "bg-pink-200" : "bg-pink-100"} text-gray-800 p-3 rounded-xl rounded-br-none shadow`}
						innerHTML={parser(message.content)}
					/>
				</div>
			</Match>
		</Switch>
	);
	// 	return (
	// 		<Switch fallback={<div>Not Found</div>}>
	// 			<Match when={message.type === "user"}>
	// 				<div class="flex items-start justify-end space-x-2">
	// 					<div
	// 						class="bg-pink-200 text-gray-800 p-3 rounded-xl rounded-br-none shadow"
	// 						innerHTML={parser(message.content)}
	// 					/>
	// 				</div>
	// 			</Match>
	// 			<Match when={message.type === "assistant"}>
	// 				<div class="flex items-start ">
	// 					<div
	// 						class="bg-pink-100 text-gray-800 p-3 rounded-xl rounded-bl-none shadow"
	// 						innerHTML={parser(message.content)}
	// 					/>
	// 				</div>
	// 			</Match>
	// 		</Switch>
	// 	);
}
