import { formatDatetime } from "../../utils/formatDatetime";

interface Props {
  name: string;
  value?: string;
  onChangeValue: (text: string) => void;
}

export default function InputDatetime(props: Props) {
  let datetimeRef: HTMLInputElement | undefined;

  function showDatetimePicker() {
    if (!datetimeRef) return;

    datetimeRef.showPicker();
  }

  function manipulateValue(val: string) {
    const datetime = val.split("T");
    if (datetime.length === 1) {
      return;
    }
    const time = datetime?.[1].split(":");
    datetime[1] = "";
    for (let i = 0; i < 2; ++i) {
      if (i > 0) {
        datetime[1] += ":";
      }
      datetime[1] += time[i];
    }
    return datetime.join("T");
  }

  return (
    <div class="relative">
      <div
        role="button"
        onclick={showDatetimePicker}
        class="w-full py-2 px-4 bg-black/5 border border-black/30 rounded-lg"
      >
        <span class="block h-6">
          {props.value ? formatDatetime(props.value) : undefined}
        </span>
      </div>
      <input
        ref={datetimeRef}
        type="datetime-local"
        name={props.name}
        value={manipulateValue(props.value ?? "")}
        onchange={(e) => props.onChangeValue(e.target.value)}
        class="absolute z-10 bottom-0 invisible"
      />
    </div>
  );
}
