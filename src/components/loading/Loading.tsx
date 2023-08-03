import LoadingSpinner from "./LoadingSpinner";

export default function Loading() {
  return (
    <div class="w-fit py-8 mx-auto flex gap-x-4 items-center">
      <div>
        <LoadingSpinner class="w-8 h-8" />
      </div>
      <div>
        <span class="text-xl">Sedang memuat...</span>
      </div>
    </div>
  );
}
