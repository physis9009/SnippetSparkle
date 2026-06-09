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

export async function fetchSnippetsCount(filters?: SnippetFilters): Promise<number> {
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
      const whereClause = conditions.reduce((prev, curr, idx) => {
        if (idx === 0) return curr;
        return sql`${prev} AND ${curr}`;
      });
      query = sql<{count: string}[]>`SELECT COUNT(*) FROM snippets WHERE ${whereClause}`;
    } else {
      query = sql<{count: string}[]>`SELECT COUNT(*) FROM snippets`;
    }

    const result = await query;
    return Number(result[0].count);
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return 0;
  }
}

export async function fetchSnippetsInPage(currentPage: number, filters?: SnippetFilters): Promise<Snippet[]> {
  const limit = 10;
  const offset = (currentPage - 1) * limit;

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
      const whereClause = conditions.reduce((prev, curr, idx) => {
        if (idx === 0) return curr;
        return sql`${prev} AND ${curr}`;
      });
      query = sql<Snippet[]>`SELECT * FROM snippets WHERE ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else {
      query = sql<Snippet[]>`SELECT * FROM snippets ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
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

export async function fetchTagMap(): Promise<Record<string, string>> {
  'use cache';
  cacheLife('days');
  cacheTag('tagMap');

  const result = await sql`
    SELECT name, display_name FROM tags
  `;
  const tagMap = Object.fromEntries(result.map(row => [row.name, row.display_name]));

  return tagMap;
}

async function fetchStarCount(snippetId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`star-count-${snippetId}`);

  const result = await sql`
    SELECT COUNT(*) as count
    FROM user_starred_snippets
    WHERE snippet_id = ${snippetId}
  `;
  return Number(result[0].count);
}

export async function fetchStarCountsAll(snippetsId: string[]) {
  try {
    const counts = await Promise.all(
      snippetsId.map(id => fetchStarCount(id))
    );
    return Object.fromEntries(snippetsId.map((id, i) => [id, counts[i]]));
  } catch (error) {
    console.error("Failed to fetch star counts: ", error);
    throw new Error("Failed to fetch star counts.")
  }
}

export async function fetchStarredCount(userId: string, filters?: SnippetFilters): Promise<number> {
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
      const whereClause = conditions.reduce((prev, curr, idx) => {
        if (idx === 0) return curr;
        return sql`${prev} AND ${curr}`;
      });
      query = sql<{count: string}[]>`
        SELECT COUNT(*) FROM snippets s
        INNER JOIN user_starred_snippets us ON s.id = us.snippet_id
        WHERE us.user_id = ${userId} AND ${whereClause}
      `;
    } else {
      query = sql<{count: string}[]>`
        SELECT COUNT(*) FROM snippets s
        INNER JOIN user_starred_snippets us ON s.id = us.snippet_id
        WHERE us.user_id = ${userId}
      `;
    }

    const result = await query;
    return Number(result[0].count);
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return 0;
  }
}

export async function fetchStarred(currentPage: number, userId: string, filters?: SnippetFilters): Promise<Snippet[]> {
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  try {
    const conditions = [];

    if (filters?.languages?.length) {
      conditions.push(sql`language = ANY(${filters.languages})`);
    }
    if (filters?.tags?.length) {
      conditions.push(sql`tags && ${filters.tags}`);
    }
    if (filters?.startDate) {
      conditions.push(sql`created_at >= ${filters.startDate}::timestamp`);
    }
    if (filters?.endDate) {
      conditions.push(sql`created_at < ${filters.endDate}::timestamptz + interval '1 day'`);
    }

    if (conditions.length > 0) {
      const whereClause = conditions.reduce((prev, curr, idx) => {
        if (idx === 0) return curr;
        return sql`${prev} AND ${curr}`;
      });

      const result = await sql<Snippet[]>`
        SELECT *
        FROM snippets s
        INNER JOIN user_starred_snippets us ON s.id = us.snippet_id
        WHERE us.user_id = ${userId} AND ${whereClause}
        ORDER BY us.starred_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      return result;
    } else {
      const result = await sql<Snippet[]>`
        SELECT *
        FROM snippets s
        INNER JOIN user_starred_snippets us ON s.id = us.snippet_id
        WHERE us.user_id = ${userId}
        ORDER BY us.starred_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      return result;
    }
  } catch (error) {
    console.error("Failed to fetch snippets: ", error);
    throw new Error("Failed to fetch snippets.");
  }
}

export async function fetchMineCount(userId: string, filters?: SnippetFilters): Promise<number> {
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
      const whereClause = conditions.reduce((prev, curr, idx) => {
        if (idx === 0) return curr;
        return sql`${prev} AND ${curr}`;
      });
      query = sql<{count: string}[]>`SELECT COUNT(*) FROM snippets WHERE created_by = ${userId} AND ${whereClause}`;
    } else {
      query = sql<{count: string}[]>`SELECT COUNT(*) FROM snippets WHERE created_by = ${userId}`;
    }

    const result = await query;
    return Number(result[0].count);
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return 0;
  }
}

export async function fetchMine(currentPage: number, userId: string, filters?: SnippetFilters) {
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  try {
    const conditions = [];

    if (filters?.languages?.length) {
      conditions.push(sql`language = ANY(${filters.languages})`);
    }
    if (filters?.tags?.length) {
      conditions.push(sql`tags && ${filters.tags}`);
    }
    if (filters?.startDate) {
      conditions.push(sql`created_at >= ${filters.startDate}::timestamp`);
    }
    if (filters?.endDate) {
      conditions.push(sql`created_at < ${filters.endDate}::timestamptz + interval '1 day'`);
    }

    if (conditions.length > 0) {
      const whereClause = conditions.reduce((prev, curr, idx) => {
        if (idx === 0) return curr;
        return sql`${prev} AND ${curr}`;
      });

      const result = await sql<Snippet[]>`
        SELECT *
        FROM snippets
        WHERE created_by = ${userId} AND ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      return result;
    } else {
      const result = await sql<Snippet[]>`
        SELECT *
        FROM snippets
        WHERE created_by = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      return result;
    }
  } catch (error) {
    console.error("Failed to fetch snippets: ", error);
    throw new Error("Failed to fetch snippets.");
  }
}