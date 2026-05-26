import postgres from 'postgres';
import { Snippet } from './definitions';
import { cacheLife, cacheTag } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type SnippetFilters = {
  languages?: string[];
  tags?: string[];
  startDate?: string;
  endDate?: string;
};

export async function fetchSnippets(filters?: SnippetFilters): Promise<Snippet[]> {
  try {
    const conditions = [];

    if (filters?.languages?.length) {
      conditions.push(sql`language = ANY(${filters.languages})`);
    }
    if (filters?.tags?.length) {
      conditions.push(sql`tags && ${filters.tags}::text[]`);
    }
    if (filters?.startDate) {
      conditions.push(sql`created_at >= ${filters.startDate}::timestamp`);
    }
    if (filters?.endDate) {
      conditions.push(sql`created_at < ${filters.endDate}::date + interval '1 day'`);
    }

    let query;
    if (conditions.length > 0) {
      // 手动拼接所有条件为一个 sql 片段，用 AND 连接
      const whereClause = conditions.reduce((prev, curr, idx) => {
        if (idx === 0) return curr;
        return sql`${prev} AND ${curr}`;
      });
      query = sql<Snippet[]>`SELECT * FROM snippets WHERE ${whereClause}`;
    } else {
      query = sql<Snippet[]>`SELECT * FROM snippets`;
    }

    const snippets = await query;
    return snippets;
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return [];
  }
}

export async function fetchLanguages(): Promise<string[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('language');

  const result = await sql`
    SELECT language FROM snippets GROUP BY language ORDER BY COUNT(*) DESC
  `;
  return result.map(r => r.language);
}

export async function fetchTags(): Promise<string[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('tags');

  const result = await sql`
    SELECT tag FROM snippets, unnest(tags) AS t(tag) GROUP BY tag ORDER BY COUNT(*) DESC
  `;
  return result.map(r => r.tag);
}