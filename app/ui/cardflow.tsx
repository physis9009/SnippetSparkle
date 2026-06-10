import { SnippetWithHighlight } from '@/app/lib/definitions';
import {CardFlowClient} from './cardflow-client';

export default async function CardFlow({ snippets, userName, userId, tagMap }: { 
  snippets: SnippetWithHighlight[];
  userName: string | null | undefined;
  userId: string | undefined;
  tagMap: Record<string, string>;
}) {
  if (!snippets || snippets.length === 0) {
    return (
      <div className="p-4 text-pnk-gr text-sm text-center min-h-[80vh]">
        No snippet found.
      </div>
    );
  }

  return <CardFlowClient snippets={snippets} userName={userName} userId={userId} tagMap={tagMap}/>;
}