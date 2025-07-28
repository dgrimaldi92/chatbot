import { A, useLocation } from "@solidjs/router";
import {
  type Accessor,
  Match,
  type Setter,
  Switch,
  splitProps,
} from "solid-js";

import { generateImage } from "~/features/message/domain/service";
import CloseIcon from "~/features/shared/ui/CloseIcon";
import ListIcon from "~/features/shared/ui/ListIcon";

type NavProps = {
  showList: Accessor<boolean>;
  toggleList: Setter<boolean>;
};

export default function Nav(props: NavProps) {
  const location = useLocation();
  const active = (path: string) =>
    path === location.pathname
      ? "border-pink-600"
      : "border-transparent hover:border-pink-600";

  const [{ toggleList }, { showList }] = splitProps(
    props,
    ["toggleList"],
    ["showList"]
  );

  return (
    <nav class="mask-t-from-50% bg-[url(/img/default.svg)] bg-cover bg-center z-100">
      <ul class="container flex items-center p-3 text-pink-600">
        <button
          type="button"
          aria-label="Toggle list"
          onClick={() => toggleList((prevValue) => !prevValue)}
        >
          <Switch>
            <Match when={!showList()}>
              <ListIcon />
            </Match>
            <Match when={showList()}>
              <CloseIcon />
            </Match>
          </Switch>
        </button>
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <A href="/">Home</A>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <A href="/about">About</A>
        </li>
        <button type="button" class="bg-gray-500!" onClick={generateImage}>
          🌸​
        </button>
      </ul>
    </nav>
  );
}
