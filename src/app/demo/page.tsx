'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const markdown = `
# Markdown Demo

## Text Formatting
**Bold text** and *italic text* with ~~strikethrough~~.

## Lists
- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item
   2. Another nested ordered item

## Code
Inline \`code\` and code blocks:

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`

## Links and Images
[Link to Google](https://google.com)

![Alt text](https://via.placeholder.com/150)

## Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Blockquotes
> This is a blockquote
> With multiple lines

## Task Lists
- [x] Completed task
- [ ] Incomplete task
`;

export default function DemoPage() {
  return (
    <div className="prose prose-invert max-w-none p-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className?.includes('language-');

            return !isInline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0 }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className}>{children}</code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
