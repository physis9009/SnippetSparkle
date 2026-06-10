'use client';

import { useState, useTransition } from "react";
import { toggleStar } from "../lib/actions";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/skeleton";
import { ConcentricRing } from "@/components/concentric-ring";

export function StarButton({snippetId, initialStarred, userId}: {
    snippetId: string;
    initialStarred: boolean | null;
    userId: string | undefined;
}) {
    const [isStarred, setIsStarred] = useState(initialStarred);
    const [isPending, startTransition] = useTransition();

    const handler = () => {
        if (!userId) {
            alert("Need to sign in to star a snippet");
            return;
        }
        startTransition(async () => {
            setIsStarred(!isStarred);

            try {
                await toggleStar(userId, snippetId);
            } catch (error) {
                setIsStarred(isStarred);
                console.error("Failed to star a snippet: ", error);
            }
        });
    };

    if (!userId) {
        return (
            <button disabled onClick={handler} className="text-wht-gr hover:text-wht hover:cursor-pointer bg-grn-gr hover:bg-grn rounded-sm py-1 px-3">
                <StarOutline className="w-4 h-4" />
            </button>
        );
    } else if (isStarred === null) {
        return <Skeleton className="w-4 h-4" />;
    } else if (isPending) {
        return <ConcentricRing className="w-4 h-4" />;
    }

    return (
        <button disabled={isPending} onClick={handler} className="text-wht-gr hover:text-wht hover:cursor-pointer bg-grn-gr hover:bg-grn rounded-sm py-1 px-3">
            {isStarred ? <StarSolid className="w-4 h-4 text-wht-md hover:text-wht" /> : <StarOutline className="w-4 h-4" />}
        </button>
    );
}