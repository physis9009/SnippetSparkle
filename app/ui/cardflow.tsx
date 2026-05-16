import {fetchSnippets} from '@/app/lib/data';

export default async function CardFlow() {
    const snippets = await fetchSnippets();

    return (
        <div className="columns-1 sm:columns-2 gap-2 w-full bg-blk-md">
            {snippets.map((snippet) => (
                <pre key={snippet.id} 
                style={{ minWidth: '100%', width: '100%', maxHeight: '400px', overflowY: 'auto' }}    
                className='
                    card-responsive break-inside-avoid mb-2 rounded-sm p-3 block box-border bg-blk
                    cursor-pointer border-solid border-2 border-blk-gr hover:shadow-md transition-shadow
                '><code className='text-xs sm:text-sm whitespace-pre-wrap wrap-break-words w-full'>
                    {snippet.code}
                </code></pre>
            ))}
        </div>
    )
}