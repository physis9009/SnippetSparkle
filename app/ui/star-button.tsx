'use client';

import { useState, useTransition } from "react";
import { toggleStar } from "../lib/actions";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export function StarButton({snippetId, initialStarred}: {
    snippetId: string;
    initialStarred: boolean;
}) {
    const [isStarred, setIsStarred] = useState(initialStarred);
    const [isPending, startTransition] = useTransition();

    const handler = () => {
        startTransition(async () => {
            setIsStarred(!isStarred);

            try {
                await toggleStar(snippetId);
            } catch (error) {
                setIsStarred(isStarred);
                console.error("Failed to star a snippet: ", error);
            }
        });
    };

    return (
        <button disabled={isPending} onClick={handler} className="text-wht-gr hover:text-wht hover:cursor-pointer bg-grn-gr hover:bg-grn rounded-sm py-1 px-3">
            {isStarred ? <StarSolid className="w-4 h-4" /> : <StarOutline className="w-4 h-4" />}
        </button>
    );
}