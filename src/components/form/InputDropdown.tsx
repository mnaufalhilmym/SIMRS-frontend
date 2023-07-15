import { For, Show, createSignal } from "solid-js";

interface Props {
  name: string;
  value?: { title: string; value: string };
  onChangeValue: (text: string) => void;
  placeholder?: string;
  options: { title: string; value: string }[];
}

export default function InputDropdown(props: Props) {
  const [isOptionsShown, setIsOptionsShown] = createSignal(false);

  function toggleShowOptions() {
    setIsOptionsShown((prev) => !prev);
  }

  function setOption(value: string) {
    props.onChangeValue(value);
    setIsOptionsShown(false);
  }

  return (
    <div class="relative">
      <div
        role="button"
        onclick={toggleShowOptions}
        class="w-full py-2 px-4 bg-black/5 border border-black/30 rounded-lg"
      >
        <span
          class="block h-6"
          classList={{ "text-gray-400": !props.value?.title }}
        >
          <Show when={props.value?.title} fallback={props.placeholder}>
            {props.value?.title}
          </Show>
        </span>
      </div>
      <input type="text" name={props.name} value={props.value?.value} hidden />
      <Show when={isOptionsShown()}>
        <div class="absolute z-10 w-full bg-white border border-black/30 rounded-lg">
          <For each={props.options}>
            {(o) => (
              <button
                type="button"
                onclick={() => setOption(o.value)}
                class="block w-full py-2 px-4 text-left"
                classList={{ "bg-black/5": o.value === props.value?.value }}
              >
                {o.title}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
