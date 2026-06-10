import CardFlow from '@/app/ui/cardflow';
import { fetchStarredCount, fetchStarred, fetchTagMap } from '@/app/lib/data';
import Pagination from '@/app/ui/pagination';
import {auth} from '@/auth';
import { Metadata } from 'next';
import { highlightSnippets } from '@/app/lib/utils';

export const metadata: Metadata = {
    title: "My Shares",
};

type SearchParams = Promise<{
  lang?: string | string[];
  tag?: string | string[];
  start?: string;
  end?: string;
  page?: string;
}>;

const ITEMS_PER_PAGE = 10;

export default async function StarredPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams; 

  const languages = params?.lang
    ? (Array.isArray(params.lang) ? params.lang : [params.lang])
    : undefined;
  const tags = params?.tag
    ? (Array.isArray(params.tag) ? params.tag : [params.tag])
    : undefined;

  const filter = {
    languages,
    tags,
    startDate: params?.start,
    endDate: params?.end,
  };

  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.name;

  if (userId) {
    const snippetsCount = await fetchStarredCount(userId, filter);
    const totalPages = Math.ceil(snippetsCount / ITEMS_PER_PAGE);
    const currentPage = Math.min(
      Math.max(1, Number(params?.page) || 1),
      totalPages || 1
    );

    const [snippets, tagMap] = await Promise.all([fetchStarred(currentPage, userId, filter), fetchTagMap()]);

    const highlightedSnippets = highlightSnippets(snippets);
    
    return (
      <>
        <CardFlow snippets={highlightedSnippets} userName={userName} userId={userId} tagMap={tagMap}/>
        <div className="flex justify-center my-4">
          <Pagination totalPages={totalPages}/>
        </div>
      </>
    );
  } else return (
    <>
      <CardFlow snippets={[]} userName={undefined} userId={undefined} tagMap={{}}/>
      <div className="flex justify-center my-4">
        <Pagination totalPages={1}/>
      </div>
    </>
  );
}