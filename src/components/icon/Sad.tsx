import { Match, Switch } from "solid-js";

interface Props {
  class?: string;
  type: "filled" | "outline";
}

export default function IconSad(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      class={props.class}
    >
      <Switch>
        <Match when={props.type === "filled"}>
          <path d="M414.39 97.61A224 224 0 1097.61 414.39 224 224 0 10414.39 97.61zM184 208a24 24 0 11-24 24 23.94 23.94 0 0124-24zm-23.67 149.83c12-40.3 50.2-69.83 95.62-69.83s83.62 29.53 95.71 69.83a8 8 0 01-7.82 10.17H168.15a8 8 0 01-7.82-10.17zM328 256a24 24 0 1124-24 23.94 23.94 0 01-24 24z" />
        </Match>
        <Match when={props.type === "outline"}>
          <circle cx="184" cy="232" r="24" />
          <path d="M256 288c45.42 0 83.62 29.53 95.71 69.83a8 8 0 01-7.87 10.17H168.15a8 8 0 01-7.82-10.17C172.32 317.53 210.53 288 256 288z" />
          <circle cx="328" cy="232" r="24" />
          <circle
            cx="256"
            cy="256"
            r="208"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          />
        </Match>
      </Switch>
    </svg>
  );
}
