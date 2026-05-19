import {fetchSnippets} from '@/app/lib/data';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export default async function CardFlow() {
    const snippets = await fetchSnippets();

    return (
        <div className="columns-1 sm:columns-2 gap-2 w-full bg-blk-md">
            {snippets.map((snippet) => {
                const result = hljs.highlightAuto(snippet.code);
                return (
                    <pre key={snippet.id} 
                    style={{ minWidth: '100%', width: '100%', maxHeight: '400px', overflowY: 'auto' }}    
                    className='
                        card-responsive break-inside-avoid mb-2 rounded-sm p-3 block box-border bg-blk
                        cursor-pointer hover:shadow-blk-gr/80 hover:shadow-md transition-shadow custom-scrollbar
                    '>
                        <code 
                        className='text-xs sm:text-sm whitespace-pre-wrap wrap-break-words w-full'
                        dangerouslySetInnerHTML={{ __html: result.value }} 
                        />
                    </pre>
                )
            })}
        </div>
    )
}