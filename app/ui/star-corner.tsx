import { SparklesIcon as SparklesBig } from "@heroicons/react/24/solid";
import { SparklesIcon as SparklesSmall } from "@heroicons/react/16/solid";

export function StarCorner({starCount}: {starCount: number}) {
    
    if (!starCount || starCount < 10) return <div className="absolute right-2 bottom-2 text-wht-gr"><SparklesBig className="w-5 h-5" /></div>;
    else {
        return <div className="absolute right-2 bottom-2 text-wht-gr z-50">
            <span className="bg-blk-md rounded-sm">{starCount}</span>
            <SparklesSmall className="w-4 h-4" />
        </div>
    }
}