import { Match, Switch } from "solid-js";

interface Props {
  class?: string;
  type: "filled" | "outline";
}

export default function IconLink(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class={props.class}
    >
      <Switch>
        <Match when={props.type === "filled"}>
          <path
            d="M200.66 352H144a96 96 0 010-192h55.41M312.59 160H368a96 96 0 010 192h-56.66M169.07 256h175.86"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
          />
        </Match>
        <Match when={props.type === "outline"}>
          <path
            d="M208 352h-64a96 96 0 010-192h64M304 160h64a96 96 0 010 192h-64M163.29 256h187.42"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="36"
          />
        </Match>
      </Switch>
    </svg>
  );
}
