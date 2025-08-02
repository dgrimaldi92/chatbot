import type { RouteSectionProps } from "@solidjs/router";
import { createSignal, type JSX, onCleanup, onMount, Suspense } from "solid-js";

import { List as ConversationList } from "~/features/conversation/ui/List";
import { Nav } from "./Nav";

const Layout = (props: RouteSectionProps<unknown>): JSX.Element => {
	const [showDrawer, setShowDrawer] = createSignal(false);

	let drawerRef: HTMLDivElement | undefined;

	const handleOutsideClick = (event: MouseEvent) => {
		if (
			showDrawer() &&
			drawerRef &&
			!drawerRef.contains(event.target as Node)
		) {
			setShowDrawer(false);
		}
	};

	onMount(() => {
		document.addEventListener("mousedown", handleOutsideClick);
		onCleanup(() => {
			document.removeEventListener("mousedown", handleOutsideClick);
		});
	});

	return (
		<div class="flex flex-col h-svh overflow-hidden">
			<header class="z-100">
				<Nav toggleList={setShowDrawer} showList={showDrawer} />
			</header>
			<div class="flex size-full flex-row overflow-hidden">
				<Suspense>
					<ConversationList
						showList={showDrawer}
						setShowList={setShowDrawer}
						ref={drawerRef}
					/>
					<Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>
				</Suspense>
			</div>
		</div>
	);
};

export default Layout;
