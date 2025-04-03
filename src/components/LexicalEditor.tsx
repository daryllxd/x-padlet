"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { MarkdownPlugin } from "@lexical/markdown";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  EditorState,
} from "lexical";

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  className?: string;
}

const theme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

// Add CodeNode to the list of nodes
const nodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  CodeNode,
  CodeHighlightNode,
];

// Add code block transformer to TRANSFORMERS
const CODE_TRANSFORMERS = [
  ...TRANSFORMERS,
  {
    export: (node: CodeNode) => {
      if (node instanceof CodeNode) {
        return `\`\`\`\n${node.getTextContent()}\n\`\`\``;
      }
      return null;
    },
    regExp: /^```\n([\s\S]*?)\n```$/,
    replace: (textNode: TextNode, match: RegExpMatch) => {
      const [, codeContent] = match;
      const codeNode = $createCodeNode();
      codeNode.append($createTextNode(codeContent));
      textNode.replace(codeNode);
    },
    type: "element",
  },
];

export function LexicalEditor({
  initialContent = "",
  onChange,
  readOnly = false,
  className = "",
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "TodoEditor",
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    // Convert plain text to initial editor state
    editorState: () => {
      const root = $getRoot();
      if (initialContent) {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(initialContent));
        root.append(paragraph);
      }
    },
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      onChange?.(textContent);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`relative ${className}`}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`min-h-[100px] outline-none ${
                readOnly ? "cursor-default" : "cursor-text"
              }`}
              readOnly={readOnly}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={
            <div className="absolute top-4 left-4 text-slate-500 pointer-events-none">
              Enter your todo description...
            </div>
          }
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}
