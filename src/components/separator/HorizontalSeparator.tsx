interface Props {
  height: number;
}

export default function HorizontalSeparator(props: Props) {
  return (
    <div
      class="w-full bg-neutral-100"
      style={{ height: `${props.height}px` }}
    />
  );
}
