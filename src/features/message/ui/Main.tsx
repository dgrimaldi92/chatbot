import Input from "./Input";
import MessageList from "./List";

export default function Index() {
  return (
    <div class="px-25 size-full py-5 flex flex-col">
      <div class="basis-5/6 overflow-y-auto">
        <MessageList />
      </div>
      <div class="">
        <Input />
      </div>
    </div>
  );
}
