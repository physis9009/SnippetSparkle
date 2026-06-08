import {getCachedTags} from '@/app/lib/server-utils';
import { NewSnippetForm } from '@/app/ui/new-snippet';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "New",
};

export default async function Page() {
    const tags = await getCachedTags();

    return (
        <NewSnippetForm tags={tags} />
    );
}