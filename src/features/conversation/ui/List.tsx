import {
  type Accessor,
  createEffect,
  createSignal,
  For,
  type Setter,
  Show,
  splitProps,
} from "solid-js";
import type Conversation from "../domain/domain";
import { getAllConversations } from "../domain/service";
import ListDetail from "./ListDetails";

type ListProps = {
  showList?: Accessor<boolean>;
  setShowList: Setter<boolean>;
  ref: HTMLDivElement | undefined;
};

export default function List(props: ListProps) {
  const [{ showList }, { setShowList }, { ref }] = splitProps(
    props,
    ["showList"],
    ["setShowList"],
    ["ref"]
  );

  const [items, setItems] = createSignal<Conversation[]>([]);

  function handleClick() {
    setShowList((prevValue) => !prevValue);
  }

  createEffect(async () => {
    if (!showList?.()) return; // Exit if showList is false
    const fetchedData = await getAllConversations();
    setItems(fetchedData);
  });

  return (
    <Show when={showList?.() ?? false}>
      <div>
        <div role="dialog" aria-modal="true" aria-labelledby="drawer-title">
          <div
            aria-hidden="true"
            class="fixed inset-0 backdrop-blur-sm transition-opacity"
          ></div>

          <div class="fixed left-0 flex max-w-full">
            <div
              ref={ref}
              class="pointer-events-auto relative w-screen max-w-md h-screen"
            >
              <div class="flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl/30 rounded-b-lg">
                <div class="relative mt-6 flex-1 px-4 overflow-y-auto sm:px-6">
                  <For each={items()} fallback={<div>Loading...</div>}>
                    {(item) => (
                      <ListDetail
                        handleClick={handleClick}
                        conversation={item}
                      />
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
