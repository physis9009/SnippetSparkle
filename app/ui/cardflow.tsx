import {fetchSnippets} from '@/app/lib/data';

export default async function CardFlow() {
    const snippets = await fetchSnippets();

    return (
        <div className="flex flex-wrap gap-2">
            {snippets.map((snippet) => (
                <pre key={snippet.id} className='card-responsive flex-1 border border-blk-gr rounded p-4'><code className='text-xs sm:text-sm'>
                    {snippet.code}
                </code></pre>
            ))}
        </div>
    )
}