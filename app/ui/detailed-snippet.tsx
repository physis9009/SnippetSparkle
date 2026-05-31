import { Snippet } from '../lib/definitions';

export function DetailedSnippet({snippet, userName, isOpen, doClose}: {snippet: Snippet | null, userName: string, isOpen: boolean, doClose: () => void}) {
    if (!isOpen || !snippet) return null;
    
    return (
        <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={doClose} // 点击背景关闭
        >
        <div 
            className="w-[90%] h-[90%] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-auto p-6"
            onClick={(e) => e.stopPropagation()} // 防止点击内容区关闭
        >
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{snippet.title || '未命名片段'}</h2>
            <button onClick={doClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
            <code>{snippet.code}</code>
            </pre>
            <div className="mt-4 text-sm text-gray-500">
            语言: {snippet.language} | 创建于: {new Date(snippet.created_at).toLocaleString()}
            </div>
        </div>
        </div>
    );
}