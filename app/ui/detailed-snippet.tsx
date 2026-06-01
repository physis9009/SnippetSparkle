import { HighlightedSnip } from './cardflow-client';
import { StarButton } from './star-button';
import { checkIfStarred } from '../lib/actions';
import {useState, useEffect} from 'react';

export function DetailedSnippet({snippet, userName, userId, isOpen, doClose, tagMap}: {snippet: HighlightedSnip | null; userName: string; userId: string | undefined; isOpen: boolean; doClose: () => void; tagMap: Record<string, string>;}) {
    const [isStarred, setIsStarred] = useState(false);

    useEffect(() => {
        if (isOpen && snippet && userId) {
            checkIfStarred(snippet.id, userId).then(setIsStarred);
            }
        }, [isOpen, snippet, userId]);
    
    if (!isOpen || !snippet) return null;
    
    return (
        <div className='fixed z-50 bg-blk-gr/50 inset-0 flex items-center justify-center'>
            <div className='bg-blk-md w-[90%] h-[90%] flex flex-col justify-start content-center items-center border border-blk-gr rounded-lg'>
                <div className='w-full flex flex-row justify-around content-center items-center relative pb-1 rounded-s-lg'>
                    <StarButton snippetId={snippet.id} initialStarred={isStarred} />
                    {snippet.title && <span >{snippet.title}</span>}
                    <span>Language: {snippet.language}</span>
                    <button onClick={doClose} className="text-sm absolute right-0 text-pnk-gr font-bold hover:text-pnk bg-wht-gr hover:bg-wht px-1">✕</button>
                </div>

                <pre className='bg-blk w-[98%] max-h-[80%] min-h-[50%] overflow-y-auto border-b-blk-gr px-4 py-2 custom-scrollbar rounded-sm'>
                    <code dangerouslySetInnerHTML={{ __html: snippet.result.value }} className='whitespace-pre-wrap wrap-break-word'/>
                </pre>

                <div className='flex flex-row justify-center items-center content-center my-2'>
                    <span className='mr-4'>shared by: {userName}</span>
                    <span>at: {new Date(snippet.created_at).toLocaleString()}</span>
                </div>

                {(snippet.summary || snippet.tags) && <div className='w-[98%] flex-1 flex flex-row gap-2 border-s-blk-gr mb-2 justify-center'>
                    {snippet.summary && <div className='px-2 bg-blk whitespace-pre-wrap wrap-break-word py-2 rounded-sm max-w-[80%]'>{snippet.summary}</div>}
                    {snippet.tags && <div className='flex flex-row flex-wrap gap-2 items-start content-start'>{snippet.tags.map((tag, i) => (
                        <span key={i} className='bg-[#5a5a5a] rounded-sm grow-0 px-1'>{tagMap[tag]}</span>
                    ))}</div>}    
                </div>}
            </div>
        </div>

    );
}