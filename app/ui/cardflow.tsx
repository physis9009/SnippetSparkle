import { Snippet } from '@/app/lib/definitions';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { StarCorner } from './star-corner';
import { fetchStarCountsAll } from '../lib/data';

export default async function CardFlow({ snippets }: { snippets: Snippet[] }) {
  if (!snippets || snippets.length === 0) {
    return (
      <div className="p-4 text-gray-400 text-xs">
        没有找到匹配的代码片段。
      </div>
    );
  }

  const snippetIds = snippets.map(s => s.id);
  const starCountsMap = await fetchStarCountsAll(snippetIds);

  return (
    <div className="columns-1 sm:columns-2 gap-2 w-full bg-blk-md">
      {snippets.map((snippet) => {
        const result = hljs.highlightAuto(snippet.code);
        return (
          <div key={snippet.id} className='w-full h-full relative'>
            <pre 
              style={{ minWidth: '100%', width: '100%', maxHeight: '400px', overflowY: 'auto' }}
              className="card-responsive break-inside-avoid mb-2 rounded-sm p-3 block box-border bg-blk relative
                        cursor-pointer hover:shadow-blk-gr/80 hover:shadow-md transition-shadow custom-scrollbar"
            >
              <code
                className="text-xs sm:text-sm whitespace-pre-wrap wrap-break-words w-full"
                dangerouslySetInnerHTML={{ __html: result.value }}
              />
            </pre>
            <StarCorner starCount={starCountsMap[snippet.id]}/>
          </div>
        );
      })}
      
    </div>
  );
}