import { Input } from "./Input";
import { MessageList } from "./List";

export function Index() {
	return (
		<div class="size-full flex flex-col max-md:px-2">
			<div class="sm:basis-5/6 basis-6/7 overflow-y-auto overflow-x-hidden">
				<MessageList />
			</div>
			<div class="absolute bottom-2 w-min sm:w-full z-0">
				<Input />
			</div>
		</div>
	);
}
