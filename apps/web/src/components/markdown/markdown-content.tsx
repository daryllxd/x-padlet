'use client';

import { cn } from '@/lib/utils';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LexicalEditor } from 'lexical';
import { useEffect, useRef } from 'react';

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
  const editorRef = useRef<LexicalEditor | null>(null);

  const initialConfig = {
    namespace: 'TodoMarkdownViewer',
    nodes,
    editable: false,
    onError: (error: Error) => {
      console.error(error);
    },
    editorState: () => {
      $convertFromMarkdownString(content, TRANSFORMERS);
    },
    theme: {
      code: 'bg-slate-100 rounded py-0.5 font-mono text-sm mt-4 block',
      codeBlock: 'bg-slate-100 rounded-lg p-3 font-mono text-sm my-2',
    },
  };

  useEffect(() => {
    if (content && editorRef.current) {
      editorRef.current.update(() => {
        $convertFromMarkdownString(content, TRANSFORMERS);
      });
    }
  }, [content]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={cn(
              'prose prose-sm max-w-none outline-none',
              'prose-code:before:content-none prose-code:after:content-none',
              className
            )}
            readOnly={true}
          />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <EditorRefPlugin editorRef={editorRef} />
    </LexicalComposer>
  );
}
