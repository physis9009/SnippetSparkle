import CardFlow from '@/app/ui/cardflow';
import { fetchSnippetsInPage, fetchTagMap, fetchSnippetsCount } from '@/app/lib/data';
import Pagination from '../ui/pagination';
import {auth} from '@/auth';

type SearchParams = Promise<{
  lang?: string | string[];
  tag?: string | string[];
  start?: string;
  end?: string;
  page?: string;
}>;

const ITEMS_PER_PAGE = 10;

export default async function CardFlowPage({ searchParams }: { searchParams: SearchParams }) {
  // get filter
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

  // get snippets count, totalPages and currentPage
  const snippetsCount = await fetchSnippetsCount(filter);
  const totalPages = Math.ceil(snippetsCount / ITEMS_PER_PAGE);
  const currentPage = Math.min(
    Math.max(1, Number(params?.page) || 1),
    totalPages || 1
  );

  const [snippets, session, tagMap] = await Promise.all([fetchSnippetsInPage(currentPage, filter), auth(), fetchTagMap()]);

  const userName = session?.user?.name;
  const userId = session?.user?.id;

  return (
    <>
      <CardFlow snippets={snippets} userName={userName} userId={userId} tagMap={tagMap}/>
      <div className="flex justify-center my-4">
        <Pagination totalPages={totalPages}/>
      </div>
    </>
  );
}