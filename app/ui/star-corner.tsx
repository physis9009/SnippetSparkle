import { SparklesIcon as SparklesSmall } from "@heroicons/react/16/solid";

export function StarCorner({starCount}: {starCount: number}) {
    
    if (!starCount || starCount < 10) return null;
    else {
        return <div className="px-2 border-l border-blk-gr">
            {starCount}
            <SparklesSmall className="w-4 h-4" />
        </div>
    }
}