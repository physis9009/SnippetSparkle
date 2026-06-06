import { Snippet } from '@/app/lib/definitions';
import { fetchStarCountsAll } from '../lib/data';
import {CardFlowClient} from './cardflow-client';
import { fetchTagMap } from '../lib/data';

export default async function CardFlow({ snippets, userName, userId }: { snippets: Snippet[], userName: string | null | undefined, userId: string | undefined}) {
  if (!snippets || snippets.length === 0) {
    return (
      <div className="p-4 text-wht-gr text-sm text-center min-h-[80vh]">
        No snippet found.
      </div>
    );
  }
  
  const snippetIds = snippets.map(s => s.id);
  const [starCountsMap, tagMap] = await Promise.all([fetchStarCountsAll(snippetIds), fetchTagMap()]);

  return <CardFlowClient snippets={snippets} userName={userName} userId={userId} starCountsMap={starCountsMap} tagMap={tagMap}/>;
}