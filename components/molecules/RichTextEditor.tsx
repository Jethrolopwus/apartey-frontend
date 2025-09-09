"use client";
import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [url, setUrl] = useState("");

  if (!editor) return null;

  const applyLink = () => {
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setShowLinkInput(false);
    setUrl("");
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 relative">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      {/* Lists & Quote */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("blockquote") ? "bg-gray-200" : ""
        }`}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </button>

      {/* Links */}
      <button
        onClick={() => setShowLinkInput(true)}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("link") ? "bg-gray-200" : ""
        }`}
        title="Insert Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      {/* Inline URL Input for Link */}
      {showLinkInput && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow p-2 flex gap-2 z-50">
          <input
            type="url"
            placeholder="Enter link URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-1 rounded w-48"
          />
          <button
            onClick={applyLink}
            className="px-2 py-1 bg-[#C85212] text-white rounded"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false);
              setUrl("");
            }}
            className="px-2 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Undo / Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-100"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-100"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your content...",
  className = "",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!isMounted) {
    return (
      <div
        className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
      >
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
          <div className="p-2 rounded bg-gray-100">
            <Bold className="w-4 h-4" />
          </div>
          <div className="p-2 rounded bg-gray-100">
            <Italic className="w-4 h-4" />
          </div>
          <div className="p-2 rounded bg-gray-100">
            <Heading1 className="w-4 h-4" />
          </div>
          <div className="p-2 rounded bg-gray-100">
            <List className="w-4 h-4" />
          </div>
        </div>
        <div className="p-4 min-h-[200px] bg-gray-50 rounded">
          <div className="text-gray-400">{placeholder}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none"
      />
    </div>
  );
}
