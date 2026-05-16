"use client";

import { useEffect, useId } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import ImageExtension from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Image as ImageIcon, Italic, List, ListOrdered } from "lucide-react";

export function QuestionEditor({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const editorId = useId();
  const editor = useEditor({
    extensions: [StarterKit, ImageExtension],
    content: value,
    editorProps: {
      attributes: {
        "aria-label": label,
        class: "editor textarea rich-editor",
        id: editorId,
        role: "textbox"
      }
    },
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  function addImage() {
    const url = window.prompt("Masukkan URL gambar soal");
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div>
      <label htmlFor={editorId}>{label}</label>
      <span>
        <span className="editor-toolbar">
          <button
            aria-label="Bold"
            aria-pressed={editor?.isActive("bold") ?? false}
            className={`tool-btn ${editor?.isActive("bold") ? "active" : ""}`}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            type="button"
          >
            <Bold size={16} />
          </button>
          <button
            aria-label="Italic"
            aria-pressed={editor?.isActive("italic") ?? false}
            className={`tool-btn ${editor?.isActive("italic") ? "active" : ""}`}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            type="button"
          >
            <Italic size={16} />
          </button>
          <button
            className={`tool-btn ${editor?.isActive("orderedList") ? "active" : ""}`}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            type="button"
            aria-label="Ordered list"
          >
            <ListOrdered size={16} />
          </button>
          <button
            className={`tool-btn ${editor?.isActive("bulletList") ? "active" : ""}`}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            type="button"
            aria-label="Bullet list"
          >
            <List size={16} />
          </button>
          <button className="tool-btn" disabled={!editor} onClick={addImage} type="button" aria-label="Upload gambar">
            <ImageIcon size={16} />
          </button>
        </span>
        <EditorContent editor={editor} />
      </span>
    </div>
  );
}
