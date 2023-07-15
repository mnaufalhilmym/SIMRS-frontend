interface Props {
  type?: string;
  name: string;
  value?: string;
  onChangeValue: (text: string) => void;
}

export default function InputText(props: Props) {
  return (
    <input
      type={props.type ?? "text"}
      name={props.name}
      value={props.value ?? ""}
      onchange={(e) => props.onChangeValue(e.target.value)}
      autocomplete="off"
      class="block w-full py-2 px-4 bg-black/5 border border-black/30 outline-none rounded-lg"
    />
  );
}
