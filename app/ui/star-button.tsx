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
        <button disabled={isPending} onClick={handler} className="text-wht-gr">
            {isStarred ? <StarSolid className="w-6 h-6" /> : <StarOutline className="w-6 h-6" />}
        </button>
    );
}