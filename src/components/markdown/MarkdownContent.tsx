"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const nodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  CodeNode,
  CodeHighlightNode,
];

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const initialConfig = {
    namespace: "TodoMarkdownViewer",
    nodes,
    editable: false,
    onError: (error: Error) => {
      console.error(error);
    },
    editorState: () => {
      $convertFromMarkdownString(content, TRANSFORMERS);
    },
    theme: {
      code: "bg-slate-100 rounded px-1.5 py-0.5 font-mono text-sm",
      codeBlock: "bg-slate-100 rounded-lg p-3 font-mono text-sm my-2",
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={cn(
              "outline-none prose prose-sm max-w-none",
              "prose-code:before:content-none prose-code:after:content-none",
              className
            )}
            readOnly={true}
          />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}
