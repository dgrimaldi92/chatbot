import {
	createAsync,
	revalidate,
	useParams,
	useSubmission,
} from "@solidjs/router";
import { createEffect, createSignal, For } from "solid-js";

import { getAllMessagesByConversationId, postMessage } from "../domain/service";
import { MessageDetails } from "./Message";

export function MessageList() {
	const params = useParams();
	const messages = createAsync(() => getAllMessagesByConversationId(params.id));
	const [isLoading, setIsLoading] = createSignal(false);
	const submission = useSubmission(postMessage.with(params.id));
	let lastMessageReference: HTMLDivElement | undefined;

	createEffect(() => {
		if (submission.pending && !isLoading()) {
			revalidate(getAllMessagesByConversationId.key);
			setIsLoading(true);
		} else if (!submission.pending && isLoading()) {
			setIsLoading(false);
		} else {
			return;
		}
	});

	createEffect(() => {
		if (lastMessageReference) {
			lastMessageReference.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			});
		}
	});

	return (
		<div class="flex flex-col gap-4 mt-4 sm:px-25">
			<For each={messages()}>
				{(item, index) =>
					index() - 1 === messages()?.length ? (
						<MessageDetails message={item} />
					) : (
						<div ref={lastMessageReference}>
							<MessageDetails message={item} />
						</div>
					)
				}
			</For>
		</div>
	);
}
