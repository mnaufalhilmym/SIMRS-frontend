import IconSad from "../icon/Sad";

export default function NoData() {
  return (
    <div class="w-fit mx-auto flex flex-col items-center">
      <div>
        <IconSad type="outline" class="w-24 h-24" />
      </div>
      <div class="mt-2">
        <span>Tidak ada data</span>
      </div>
    </div>
  );
}
