import { useParams, useSubmission } from "@solidjs/router";
import { postMessage } from "../domain/service";

export default function Input() {
  const params = useParams();
  const submission = useSubmission(postMessage);

  console.log({ submission }, submission.pending);

  return (
    <form
      class="mt-4 flex items-center border rounded-xl px-3 py-2"
      action={postMessage.with(params.id)}
      method="post"
      //   onSu={(e) => e.preventDefault()}
    >
      <input
        type="text"
        class="flex-1 bg-transparent outline-none text-white placeholder-pink-400"
        name="content"
        placeholder="Insert a text"
      />
      <button
        type="submit"
        class="ml-2 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-xl shadow"
        disabled={submission.pending}
      >
        Send
      </button>
    </form>
  );
}
