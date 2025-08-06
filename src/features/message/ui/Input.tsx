import { createSignal } from "solid-js";
import { useParams, useSubmission } from "@solidjs/router";
import { SendIcon } from "~/features/shared/ui/SendIcon";
import { SpinIcon } from "~/features/shared/ui/SpinIcon";
import { postMessage } from "../domain/service";
import { SearchIcon } from "~/features/shared/ui/SearchIcon";

export function Input() {
	const params = useParams();
	const submission = useSubmission(postMessage.with(params.id));
	const [isWebSearch, setIsWebSearch] = createSignal(false)

	return (
		<form
			class="flex flex-col border rounded-xl px-3 mx-5"
			action={postMessage.with(params.id)}
			method="post"
		//   use:formSubmit={(e) => e.preventDefault()}
		>
			<div class="flex items-center py-2">
				<textarea
					class="flex-1 outline-none text-white placeholder-pink-400 disabled:border-gray-200 disabled:text-gray-500"
					name="content"
					placeholder="Insert a text"
					disabled={submission.pending}
				/>
				<button
					type="submit"
					class="ml-2 bg-pink-400 hover:bg-pink-500 text-white px-4 rounded-xl shadow cursor-progress"
					disabled={submission.pending}
				>
					{submission.pending ? <SpinIcon /> : <SendIcon />}
				</button>
			</div>
			<div>
				<label class="flex items-center cursor-pointer w-10 py-2">
					<input
						type="checkbox"
						name="search"
						class="hidden"
						checked={isWebSearch()}
						onChange={() => setIsWebSearch(!isWebSearch())}
					/>
					<div class="relative">
						<div class={`block w-10 h-6 rounded-full transition-colors duration-300 ${isWebSearch() ? 'bg-pink-400' : 'bg-gray-400'}`} />
						<div class={`icon-container absolute left-1 top-1 w-6 h-6 transition-transform duration-300 ${isWebSearch() ? 'translate-x-4' : ''}`}>
							<SearchIcon />
						</div>
					</div>
				</label>
			</div >
		</form >
	);
}
