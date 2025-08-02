import { useParams, useSubmission } from "@solidjs/router";
import { SendIcon } from "~/features/shared/ui/SendIcon";
import { postMessage } from "../domain/service";

export function Input() {
	const params = useParams();
	const submission = useSubmission(postMessage.with(params.id));

	return (
		<form
			class="flex items-center border rounded-xl px-3 py-2 mx-5 sm:mx-25"
			action={postMessage.with(params.id)}
			method="post"
			//   onSu={(e) => e.preventDefault()}
		>
			<textarea
				class="flex-1 outline-none text-white placeholder-pink-400 disabled:border-gray-200 disabled:text-gray-500"
				name="content"
				placeholder="Insert a text"
				disabled={submission.pending}
			/>
			<button
				type="submit"
				class="ml-2 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-xl shadow cursor-progress"
				disabled={submission.pending}
			>
				<SendIcon />
			</button>
		</form>
	);
}

// {
// 	("input");
// 	:["77aa45cb-4fa5-48f1-a9cc-e9c9238f3637",
// 	],"url":"/_server?id=src_features_message_domain_service_ts--postMessage_action&name=%2Fhome%2Fdavide%2FDocuments%2Fchatbot%2Fsrc%2Ffeatures%2Fmessage%2Fdomain%2Fservice.ts%3Ftsr-directive-use-server%3D"
// }
