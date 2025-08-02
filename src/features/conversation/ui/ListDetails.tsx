import { A } from "@solidjs/router";
import { splitProps } from "solid-js";
import type Conversation from "../domain/domain";

type ListDetailProps = {
	conversation: Conversation;
	handleClick?: () => void;
};

export function ListDetail(props: ListDetailProps) {
	const [{ conversation }, { handleClick }] = splitProps(
		props,
		["conversation"],
		["handleClick"],
	);

	return (
		<div class="cursor-pointer mb-4 p-4 rounded-lg text-default-blue bg-[url(/img/background-list.png)] bg-cover bg-center hover:bg-gray-200 transition drop-shadow-lg drop-shadow-pink-600/50">
			<A
				href={`/${conversation.id}`}
				class="w-full text-left bg-white/50 cursor-pointer"
				onclick={handleClick}
			>
				<strong class="block text-lg font-semibold cursor-pointer">
					{conversation.title}
				</strong>
				<div class="mt-1 cursor-pointer">{conversation.created_at}</div>
			</A>
		</div>
	);
}
