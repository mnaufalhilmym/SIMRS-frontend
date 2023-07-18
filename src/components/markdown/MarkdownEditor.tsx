import IconLink from "../icon/Link";
import IconList from "../icon/List";
import styles from "../../styles/markdown.module.css";
import { Show, createSignal } from "solid-js";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Props {
  name: string;
  value: string;
  setEditorVal: (text: string) => void;
}

export default function MarkdownEditor(props: Props) {
  let textAreaRef: HTMLTextAreaElement | undefined;

  const [mode, setMode] = createSignal<"markdown" | "preview">("markdown");

  function insertOnStartAndEndSelection({
    start,
    end,
    defaultText,
  }: {
    start: string;
    end: string;
    defaultText: string;
  }) {
    if (!textAreaRef) return;

    start = " " + start;
    end = end + " ";

    const selectionStart = textAreaRef.selectionStart;
    const selectionEnd = textAreaRef.selectionEnd;

    const isSelection = selectionStart !== selectionEnd;

    props.setEditorVal(
      textAreaRef.value.substring(0, selectionStart) +
        start +
        (isSelection
          ? textAreaRef.value.substring(selectionStart, selectionEnd)
          : defaultText) +
        end +
        textAreaRef.value.substring(selectionEnd)
    );

    textAreaRef.focus();
    if (!isSelection) {
      textAreaRef.selectionStart = selectionStart + start.length;
      textAreaRef.selectionEnd =
        selectionEnd + start.length + defaultText.length;
    } else {
      textAreaRef.selectionEnd = selectionEnd + start.length + end.length;
    }
  }

  function bold() {
    insertOnStartAndEndSelection({
      start: "**",
      defaultText: "Bold",
      end: "**",
    });
  }

  function italic() {
    insertOnStartAndEndSelection({
      start: "_",
      defaultText: "Italic",
      end: "_",
    });
  }

  function underline() {
    insertOnStartAndEndSelection({
      start: "<u>",
      defaultText: "Underline",
      end: "</u>",
    });
  }

  function strikethrough() {
    insertOnStartAndEndSelection({
      start: "~~",
      defaultText: "Strikethrough",
      end: "~~",
    });
  }

  function insertList(type: "bullet" | "number") {
    if (!textAreaRef) return;

    const selectionStart = textAreaRef.selectionStart;
    const selectionEnd = textAreaRef.selectionEnd;

    const isSelection = selectionStart !== selectionEnd;

    let insertIndex = 0;
    for (let i = 0; i < textAreaRef.value.length; ++i) {
      if (i >= selectionStart) {
        break;
      }
      if (textAreaRef.value.charAt(i) === "\n") {
        insertIndex = i + 1;
      }
    }

    let insertText = "";
    if (type === "bullet") {
      insertText = "- ";
    } else if (type === "number") {
      insertText = "1. ";
    }

    props.setEditorVal(
      textAreaRef.value.substring(0, insertIndex) +
        insertText +
        textAreaRef.value.substring(insertIndex)
    );

    textAreaRef.focus();
    if (isSelection) {
      textAreaRef.selectionStart = selectionStart + insertText.length;
    }
    textAreaRef.selectionEnd = selectionEnd + insertText.length;
  }

  function insertLink() {
    if (!textAreaRef) return;

    const selectionStart = textAreaRef.selectionStart;
    const selectionEnd = textAreaRef.selectionEnd;

    const isSelection = selectionStart !== selectionEnd;

    if (isSelection) {
      props.setEditorVal(
        textAreaRef.value.substring(0, selectionStart) +
          ` [${textAreaRef.value.substring(
            selectionStart,
            selectionEnd
          )}](link) ` +
          textAreaRef.value.substring(selectionEnd)
      );

      textAreaRef.focus();
      textAreaRef.selectionEnd = selectionEnd + 10;
    } else {
      props.setEditorVal(
        textAreaRef.value.substring(0, selectionStart) +
          " [LinkName](link) " +
          textAreaRef.value.substring(selectionEnd)
      );

      textAreaRef.focus();
      textAreaRef.selectionStart = selectionStart + 2;
      textAreaRef.selectionEnd = selectionEnd + 10;
    }
  }

  function toggleMode() {
    setMode((prev) => {
      if (prev === "markdown") {
        return "preview";
      }
      if (prev === "preview") {
        return "markdown";
      }
      return "markdown";
    });
  }

  return (
    <div class="border border-black/30 rounded-lg">
      <div class="p-2 flex items-center justify-between">
        <div class="flex gap-x-4">
          <Show when={mode() === "markdown"}>
            <div class="flex gap-x-1">
              <button
                type="button"
                onclick={bold}
                class="w-8 h-8 border border-black/30 rounded-lg font-bold"
              >
                B
              </button>
              <button
                type="button"
                onclick={italic}
                class="w-8 h-8 border border-black/30 rounded-lg"
              >
                <i>I</i>
              </button>
              <button
                type="button"
                onclick={underline}
                class="w-8 h-8 border border-black/30 rounded-lg"
              >
                <u>U</u>
              </button>
            </div>
            <div class="flex gap-x-1">
              <button
                type="button"
                onclick={strikethrough}
                class="w-8 h-8 border border-black/30 rounded-lg"
              >
                <s>T</s>
              </button>
              <button
                type="button"
                onclick={() => insertList("bullet")}
                class="w-8 h-8 flex items-center justify-center border border-black/30 rounded-lg"
              >
                <IconList type="bullet" class="w-5 h-5" />
              </button>
              <button
                type="button"
                onclick={() => insertList("number")}
                class="w-8 h-8 flex items-center justify-center border border-black/30 rounded-lg"
              >
                <IconList type="number" class="w-5 h-5" />
              </button>
            </div>
            <div class="flex gap-x-1">
              <button
                type="button"
                onclick={insertLink}
                class="w-8 h-8 flex items-center justify-center border border-black/30 rounded-lg"
              >
                <IconLink type="outline" class="w-5 h-5" />
              </button>
            </div>
          </Show>
        </div>
        <div>
          <button
            type="button"
            onclick={toggleMode}
            class="px-4 py-1 border border-black/30 rounded-lg"
          >
            <Show when={mode() === "preview"}>Mode Markdown</Show>
            <Show when={mode() === "markdown"}>Mode Pratinjau</Show>
          </button>
        </div>
      </div>
      <textarea
        ref={textAreaRef}
        name={props.name}
        value={props.value}
        onchange={(e) => props.setEditorVal(e.target.value)}
        class="block w-full h-80 py-2 px-4 bg-black/5 outline-none resize-none"
        classList={{ hidden: mode() !== "markdown" }}
      />
      <Show when={mode() === "preview"}>
        <p
          innerHTML={DOMPurify.sanitize(marked.parse(props.value ?? ""))}
          class={`h-80 py-2 px-4 text-justify break-words bg-black/5 overflow-y-auto ${styles.content}`}
        />
      </Show>
    </div>
  );
}
