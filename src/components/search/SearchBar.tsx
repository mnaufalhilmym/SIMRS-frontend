import { debounce } from "@solid-primitives/scheduled";

interface Props {
  placeholder: string;
  value?: string;
  outerClass?:string
  inputClass?:string
  executeSearch: (value?: string) => void;
}

export default function SearchBar(props: Props) {
  let searchRef: HTMLInputElement | undefined;

  const debounceSearchValue = debounce((value: string) => {
    props.executeSearch(value);
  }, 500);

  function onInput(
    e: Event & {
      currentTarget: HTMLInputElement;
      target: Element;
    }
  ) {
    debounceSearchValue(e.currentTarget.value);
  }

  return (
    <div class={props.outerClass}>
      <input
        ref={searchRef}
        type="text"
        placeholder={props.placeholder}
        oninput={onInput}
        value={props.value ?? ""}
        class={props.inputClass}
      />
    </div>
  );
}
