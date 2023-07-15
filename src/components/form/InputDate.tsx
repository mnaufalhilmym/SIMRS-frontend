import { formatDate } from "../../utils/formatDatetime";

interface Props {
  name: string;
  value?: string;
  onChangeValue: (text: string) => void;
}

export default function InputDate(props: Props) {
  let dateRef: HTMLInputElement | undefined;

  function showDatePicker() {
    if (!dateRef) return;

    dateRef.showPicker();
  }

  return (
    <div class="relative">
      <div
        role="button"
        onclick={showDatePicker}
        class="w-full py-2 px-4 bg-black/5 border border-black/30 rounded-lg"
      >
        <span class="block h-6">
          {props.value ? formatDate(props.value) : undefined}
        </span>
      </div>
      <input
        ref={dateRef}
        type="date"
        name={props.name}
        value={props.value?.split("T")[0]}
        onchange={(e) => props.onChangeValue(e.target.value)}
        class="absolute z-10 bottom-0 invisible"
      />
    </div>
  );
}
