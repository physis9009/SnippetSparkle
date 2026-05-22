import { Snippet } from '@/app/lib/definitions';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export default function CardFlow({ snippets }: { snippets: Snippet[] }) {
  // 防御性处理：如果数据不存在或为空数组
  if (!snippets || snippets.length === 0) {
    return (
      <div className="p-4 text-gray-400 text-xs">
        没有找到匹配的代码片段。
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 gap-2 w-full bg-blk-md">
      {snippets.map((snippet) => {
        const result = hljs.highlightAuto(snippet.code);
        return (
          <pre key={snippet.id}
            style={{ minWidth: '100%', width: '100%', maxHeight: '400px', overflowY: 'auto' }}
            className="card-responsive break-inside-avoid mb-2 rounded-sm p-3 block box-border bg-blk
                       cursor-pointer hover:shadow-blk-gr/80 hover:shadow-md transition-shadow custom-scrollbar"
          >
            <code
              className="text-xs sm:text-sm whitespace-pre-wrap wrap-break-words w-full"
              dangerouslySetInnerHTML={{ __html: result.value }}
            />
          </pre>
        );
      })}
    </div>
  );
}