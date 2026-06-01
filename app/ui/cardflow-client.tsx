'use client';

import { Snippet } from '@/app/lib/definitions';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { StarCorner } from './star-corner';
import { useState } from 'react';
import { DetailedSnippet } from './detailed-snippet';
import { AutoHighlightResult } from 'highlight.js';

export interface HighlightedSnip extends Snippet {
    result: AutoHighlightResult;
}

export function CardFlowClient({ snippets, userName, userId, starCountsMap, tagMap }: { 
    snippets: Snippet[];
    userName: string | null | undefined;
    userId: string | undefined;
    starCountsMap: {[k: string]: number};
    tagMap: Record<string, string>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSnippet, setSelected] = useState<HighlightedSnip | null>(null);

  const handleClick = (snippet: Snippet, result: AutoHighlightResult) => {
    setSelected({...snippet, result});
    setIsOpen(true);
  };

  return (
    <>
        <div className="columns-1 sm:columns-2 gap-2 w-full bg-blk-md">
            {snippets.map((snippet) => {
                const result = hljs.highlightAuto(snippet.code);
                return (
                <div key={snippet.id} className='w-full h-full relative' onClick={() => handleClick(snippet, result)}>
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
                    <div className='absolute flex flex-row right-2 bottom-2 text-wht-gr text-xs z-50 bg-blk-md/90 rounded-sm'>
                        <span className='px-2'>{snippet.language}</span>
                        <StarCorner starCount={starCountsMap[snippet.id]}/>
                    </div>
                </div>
                );
            })}
        </div>
        {userName 
        ? <DetailedSnippet snippet={selectedSnippet} userName={userName} userId={userId} isOpen={isOpen} doClose={() => setIsOpen(false)} tagMap={tagMap}/>
        : <div className='fixed text-center text-blk-gr'>Sign in to see details of snippets</div>
        }
    </>
    
  );
}