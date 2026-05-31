import CardFlow from '@/app/ui/cardflow';
import { fetchMine } from '@/app/lib/data';
import Pagination from '@/app/ui/pagination';
import {auth} from '@/auth';

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

  const session = await auth();
  const userId = session?.user?.id;
  const userName = session?.user?.name;

  if (userId) {const snippets = await fetchMine(userId, {
    languages,
    tags,
    startDate: params?.start,
    endDate: params?.end,
  });

  const totalPages = Math.ceil(snippets.length / ITEMS_PER_PAGE);

  const currentPage = Math.min(
    Math.max(1, Number(params?.page) || 1),
    totalPages || 1
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedSnippets = snippets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <CardFlow snippets={pagedSnippets} userName={userName}/>
      <div className="flex justify-center my-4">
        <Pagination totalPages={totalPages}/>
      </div>
    </>
  );} else return (
    <>
      <CardFlow snippets={[]} userName={userName}/>
      <div className="flex justify-center my-4">
        <Pagination totalPages={1}/>
      </div>
    </>
  );
}