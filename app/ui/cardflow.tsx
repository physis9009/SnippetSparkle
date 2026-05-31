import { Snippet } from '@/app/lib/definitions';
import { fetchStarCountsAll } from '../lib/data';
import {CardFlowClient} from './cardflow-client';

export default async function CardFlow({ snippets, userName }: { snippets: Snippet[], userName: string | null | undefined }) {
  if (!snippets || snippets.length === 0) {
    return (
      <div className="p-4 text-wht-gr text-sm text-center">
        No snippet found.
      </div>
    );
  }
  
  const snippetIds = snippets.map(s => s.id);
  const starCountsMap = await fetchStarCountsAll(snippetIds);

  return <CardFlowClient snippets={snippets} userName={userName} starCountsMap={starCountsMap}/>;
}