import CardFlow from '@/app/ui/cardflow';
import { fetchSnippets } from '@/app/lib/data';

type SearchParams = Promise<{
  lang?: string | string[];
  tag?: string | string[];
  start?: string;
  end?: string;
}>;

export default async function CardFlowPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams; 

  const languages = params?.lang
    ? (Array.isArray(params.lang) ? params.lang : [params.lang])
    : undefined;
  const tags = params?.tag
    ? (Array.isArray(params.tag) ? params.tag : [params.tag])
    : undefined;

  const snippets = await fetchSnippets({
    languages,
    tags,
    startDate: params?.start,
    endDate: params?.end,
  });

  return <CardFlow snippets={snippets} />;
}